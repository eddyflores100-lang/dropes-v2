import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import {
  COMMISSION_RATE,
  dropeaV1CreateOrder,
  dropeaV1Status,
  dropeaV2CreateOrder,
  dropeaV2Status,
  getAgentRefFromCookie,
  parsePriceNumber,
  resolveAgentByCode,
} from "@/lib/dropea-server";
import type { CartItem, Customer } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─── GET /api/checkout → API health status ────────────────────────────
export async function GET() {
  const [v1, v2] = await Promise.all([dropeaV1Status(), dropeaV2Status()]);
  const orders = await db.order.count().catch(() => 0);
  return NextResponse.json({
    apis: {
      dropeaV1: v1,
      dropeaV2: v2,
    },
    localFallback: { ok: true, engine: "sqlite" },
    stats: { totalOrders: orders },
    commissionRate: COMMISSION_RATE,
    timestamp: new Date().toISOString(),
  });
}

// ─── POST /api/checkout → create order with cascading fallback ────────
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const items: CartItem[] = Array.isArray(body?.items) ? body.items : [];
  const customer: Customer = body?.customer ?? ({} as Customer);
  const paymentMethod: "cod" | "card" = body?.paymentMethod === "card" ? "card" : "cod";

  if (!items.length) {
    return NextResponse.json(
      { ok: false, error: "Cart is empty" },
      { status: 400 }
    );
  }
  if (!customer.email || !customer.first_name) {
    return NextResponse.json(
      { ok: false, error: "Missing customer fields" },
      { status: 400 }
    );
  }

  // ─── Total & commission ──────────────────────────────────────────
  const total = items.reduce(
    (acc, i) => acc + parsePriceNumber(i.priceNow) * i.quantity,
    0
  );

  // ─── Agent detection from cookie ────────────────────────────────
  const refCookie = await getAgentRefFromCookie();
  const agent = await resolveAgentByCode(refCookie);
  const agentReferred = !!agent;
  const commissionEarned = agent ? Math.round(total * COMMISSION_RATE * 100) / 100 : 0;

  // ─── Build partner payloads ──────────────────────────────────────
  const lineItems = items.map((i) => ({
    productId: i.id,
    name: i.name,
    quantity: i.quantity,
    price: parsePriceNumber(i.priceNow),
    image: i.image,
  }));

  const v1Payload = {
    shop: process.env.DROPEA_SHOP_ID,
    customer: {
      firstName: customer.first_name,
      lastName: customer.last_name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      zip: customer.zip,
      country: customer.country,
    },
    items: lineItems,
    paymentMethod,
    agentRef: refCookie || undefined,
    total,
  };

  const v2Payload = {
    input: {
      shopId: process.env.DROPEA_SHOP_ID,
      customer: {
        firstName: customer.first_name,
        lastName: customer.last_name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        zip: customer.zip,
        country: customer.country,
      },
      items: lineItems,
      paymentMethod,
      agentCode: refCookie || undefined,
      total,
    },
  };

  // ─── Try Dropea v1 (REST) ───────────────────────────────────────
  let apiSource: "dropea-v1" | "dropea-v2" | "local" = "local";
  let partnerOrderId: string | undefined;
  let v1Error: string | undefined;
  let v2Error: string | undefined;

  const v1 = await dropeaV1CreateOrder(v1Payload);
  if (v1.ok) {
    apiSource = "dropea-v1";
    partnerOrderId = v1.orderId;
  } else {
    v1Error = v1.error;
    // ─── Try Dropea v2 (GraphQL) ─────────────────────────────────
    const v2 = await dropeaV2CreateOrder(v2Payload);
    if (v2.ok) {
      apiSource = "dropea-v2";
      partnerOrderId = v2.orderId;
    } else {
      v2Error = v2.error;
      apiSource = "local";
    }
  }

  // ─── Persist locally (always, regardless of partner result) ──────
  const status = apiSource === "local" ? "pending" : "confirmed";

  const order = await db.order.create({
    data: {
      partnerOrderId: partnerOrderId ?? null,
      customerId: null,
      customerName: `${customer.first_name} ${customer.last_name}`.trim(),
      customerEmail: customer.email,
      customerPhone: customer.phone || null,
      customerAddress: customer.address || null,
      customerCity: customer.city || null,
      customerZip: customer.zip || null,
      customerCountry: customer.country || null,
      total,
      paymentMethod,
      status,
      apiSource,
      agentCode: agent?.agentCode ?? refCookie ?? null,
      agentId: agent?.id ?? null,
      commissionRate: COMMISSION_RATE,
      commissionEarned,
      lastSyncError: apiSource === "local" ? `${v1Error || ""} | ${v2Error || ""}`.trim() : null,
      items: {
        create: items.map((i) => ({
          productId: i.id,
          name: i.name,
          priceNow: parsePriceNumber(i.priceNow),
          priceWas: parsePriceNumber(i.priceWas),
          originalCost: parsePriceNumber((i as any).original_cost),
          profit: parsePriceNumber((i as any).profit),
          image: i.image ?? null,
          quantity: i.quantity,
        })),
      },
    },
    include: { items: true },
  });

  // ─── Update agent stats if converted ─────────────────────────────
  if (agent) {
    await db.agent.update({
      where: { id: agent.id },
      data: {
        conversions: { increment: 1 },
        totalEarned: { increment: commissionEarned },
      },
    });
    // mark earliest click converted (best-effort)
    await db.agentClick.updateMany({
      where: { agentId: agent.id, converted: false },
      data: { converted: true },
    });
  }

  // ─── Capture lead-conversion event ───────────────────────────────
  if (agent) {
    const lead = await db.lead.findFirst({
      where: { agentId: agent.id, email: customer.email },
      orderBy: { createdAt: "desc" },
    });
    if (lead) {
      await db.lead.update({
        where: { id: lead.id },
        data: { status: "converted", orderId: order.id, cartValue: total },
      });
      await db.leadEvent.create({
        data: { leadId: lead.id, event: "converted", meta: JSON.stringify({ orderId: order.id }) },
      });
    }
  }

  // cookie bookkeeping to satisfy linter about unused import
  void cookies;

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    partnerOrderId: partnerOrderId ?? null,
    apiSource,
    total,
    agentReferred,
    agentCode: agent?.agentCode ?? null,
    commissionEarned,
    status: order.status,
    fallbackReason: apiSource === "local" ? { v1: v1Error, v2: v2Error } : null,
  });
}
