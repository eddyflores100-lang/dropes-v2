// Shared server-side helpers for DROPES agent platform.

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export const DROPEA_V1_URL = "https://api.dropea.com/api/v1/order";
export const DROPEA_V1_PRODUCTS_URL =
  "https://api.dropea.com/api/v1/products/product";
export const DROPEA_V2_GRAPHQL_URL = "https://api.dropea.com/graphql/dropshippers";

export const COMMISSION_RATE = 0.10; // 10% default
export const AGENT_COOKIE = "dropes_agent_ref";
export const AGENT_TOKEN_COOKIE = "dropes_agent_token";
export const AGENT_TOKEN_TTL_DAYS = 30;

// 85% margin formula: sell price = cost / (1 - 0.85) = cost * 6.667
export const MARGIN_FACTOR = 0.85;

export interface DropeaProduct {
  id: string | number;
  name?: string;
  price?: number | string;
  cost?: number | string;
  image?: string;
  stock?: number;
  description?: string;
  [k: string]: unknown;
}

// ─── Auth helpers ────────────────────────────────────────────────────

export function generateAgentCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 4; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return `DROPES-${out}`;
}

export async function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, 10);
}

export async function verifyPassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash);
}

/**
 * Returns the agent document for the currently authenticated agent
 * (cookie dropes_agent_token = agentId). Returns null when not logged-in.
 */
export async function getCurrentAgent() {
  const token = (await cookies()).get(AGENT_TOKEN_COOKIE)?.value;
  if (!token) return null;
  try {
    const agent = await db.agent.findUnique({ where: { id: token } });
    return agent;
  } catch {
    return null;
  }
}

/** Returns the agentCode from the long-lived ref cookie, or null. */
export async function getAgentRefFromCookie(): Promise<string | null> {
  const ref = (await cookies()).get(AGENT_COOKIE)?.value;
  return ref || null;
}

export async function resolveAgentByCode(code: string | null) {
  if (!code) return null;
  return db.agent.findUnique({ where: { agentCode: code } });
}

// ─── Dropea v1 (REST, X-API-Key) ──────────────────────────────────────

export async function dropeaV1Status(): Promise<{
  ok: boolean;
  latency?: number;
  error?: string;
}> {
  const start = Date.now();
  const key = process.env.DROPEA_V1_API_KEY;
  if (!key) return { ok: false, error: "DROPEA_V1_API_KEY not configured" };
  try {
    const res = await fetch(DROPEA_V1_PRODUCTS_URL, {
      method: "GET",
      headers: {
        "X-API-Key": key,
        "Content-Type": "application/json",
      },
      // signal: AbortSignal.timeout(5000),
    });
    return { ok: res.ok, latency: Date.now() - start };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? "fetch failed" };
  }
}

export async function dropeaV1CreateOrder(payload: unknown): Promise<{
  ok: boolean;
  orderId?: string;
  raw?: unknown;
  error?: string;
}> {
  const key = process.env.DROPEA_V1_API_KEY;
  const shopId = process.env.DROPEA_SHOP_ID;
  if (!key || !shopId) {
    return { ok: false, error: "DROPEA_V1_API_KEY or DROPEA_SHOP_ID missing" };
  }
  try {
    const res = await fetch(DROPEA_V1_URL, {
      method: "POST",
      headers: {
        "X-API-Key": key,
        "Content-Type": "application/json",
        "X-Shop-Id": shopId,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return { ok: false, error: `HTTP ${res.status} ${txt.slice(0, 200)}` };
    }
    const json: any = await res.json();
    const orderId = json?.id ?? json?.orderId ?? json?.data?.id;
    return { ok: true, orderId: orderId ? String(orderId) : undefined, raw: json };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? "fetch failed" };
  }
}

// ─── Dropea v2 (GraphQL, Bearer JWT) ─────────────────────────────────

export async function dropeaV2Status(): Promise<{
  ok: boolean;
  latency?: number;
  error?: string;
}> {
  const jwt = process.env.DROPEA_V2_JWT;
  if (!jwt) return { ok: false, error: "DROPEA_V2_JWT not configured" };
  const start = Date.now();
  try {
    const res = await fetch(DROPEA_V2_GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query Health { __typename }`,
      }),
    });
    return { ok: res.ok, latency: Date.now() - start };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? "fetch failed" };
  }
}

export async function dropeaV2CreateOrder(payload: unknown): Promise<{
  ok: boolean;
  orderId?: string;
  raw?: unknown;
  error?: string;
}> {
  const jwt = process.env.DROPEA_V2_JWT;
  if (!jwt) return { ok: false, error: "DROPEA_V2_JWT missing" };
  const mutation = `
    mutation CreateOrder($input: CreateOrderInput!) {
      createOrder(input: $input) {
        id
        reference
        status
      }
    }`;
  try {
    const res = await fetch(DROPEA_V2_GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: mutation, variables: { input: payload } }),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return { ok: false, error: `HTTP ${res.status} ${txt.slice(0, 200)}` };
    }
    const json: any = await res.json();
    if (json?.errors?.length) {
      return {
        ok: false,
        error: json.errors.map((e: any) => e.message).join("; "),
      };
    }
    const data = json?.data?.createOrder;
    const orderId = data?.id ?? data?.reference;
    return { ok: true, orderId: orderId ? String(orderId) : undefined, raw: json };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? "fetch failed" };
  }
}

// ─── Pricing ──────────────────────────────────────────────────────────

/**
 * 85% margin pricing formula.
 * sellPrice = round2( cost / (1 - margin) )
 */
export function calculateMarginPrice(cost: number, margin = MARGIN_FACTOR): number {
  if (!isFinite(cost) || cost <= 0) return 0;
  const raw = cost / (1 - margin);
  return Math.round(raw * 100) / 100;
}

export function parsePriceNumber(value: string | number | undefined | null): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (!value) return 0;
  const n = parseFloat(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}
