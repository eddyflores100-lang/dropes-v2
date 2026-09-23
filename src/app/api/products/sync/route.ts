import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "node:fs";
import path from "node:path";
import {
  DROPEA_V1_PRODUCTS_URL,
  calculateMarginPrice,
  parsePriceNumber,
} from "@/lib/dropea-server";
import type { Product } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRODUCTS_PATH = path.join(process.cwd(), "src", "data", "products.json");

function checkAuth(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET) {
    return { ok: false, error: "CRON_SECRET not configured", status: 500 };
  }
  if (auth !== expected) {
    return { ok: false, error: "Unauthorized", status: 401 };
  }
  return { ok: true };
}

// ─── GET /api/products/sync → sync status ──────────────────────────────
export async function GET() {
  let catalogCount = 0;
  let lastModified: string | null = null;
  try {
    const stat = fs.statSync(PRODUCTS_PATH);
    lastModified = stat.mtime.toISOString();
    const data = JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf8"));
    catalogCount = Array.isArray(data) ? data.length : 0;
  } catch {}

  return NextResponse.json({
    ok: true,
    source: "dropea-v1",
    endpoint: DROPEA_V1_PRODUCTS_URL,
    apiKeyConfigured: !!process.env.DROPEA_V1_API_KEY,
    shopId: process.env.DROPEA_SHOP_ID ?? null,
    catalog: {
      path: "src/data/products.json",
      count: catalogCount,
      lastModified,
    },
    pricing: {
      marginFactor: 0.85,
      formula: "sellPrice = round2(cost / (1 - margin))",
      example:
        "cost=10 → sellPrice = 10 / 0.15 = 66.67€ | profit = 66.67 - 10 = 56.67€",
    },
  });
}

// ─── POST /api/products/sync → sync catalog from Dropea v1 API ─────────
export async function POST(req: Request) {
  const auth = checkAuth(req);
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status }
    );
  }

  const key = process.env.DROPEA_V1_API_KEY;
  const shopId = process.env.DROPEA_SHOP_ID;
  if (!key || !shopId) {
    return NextResponse.json(
      {
        ok: false,
        error: "DROPEA_V1_API_KEY and DROPEA_SHOP_ID required",
      },
      { status: 500 }
    );
  }

  // Fetch product list
  let upstream: any[] = [];
  try {
    const res = await fetch(DROPEA_V1_PRODUCTS_URL, {
      method: "GET",
      headers: {
        "X-API-Key": key,
        "X-Shop-Id": shopId,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `Dropea v1 returned HTTP ${res.status}`,
        },
        { status: 502 }
      );
    }
    const json = await res.json();
    upstream = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json?.products)
      ? json.products
      : [];
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: `Fetch failed: ${err?.message}` },
      { status: 502 }
    );
  }

  if (!upstream.length) {
    return NextResponse.json({
      ok: true,
      message: "Upstream returned empty catalog — nothing to sync",
      synced: 0,
    });
  }

  // Map upstream products → DROPES catalog format with 85% margin pricing
  const mapped: Product[] = upstream.map((p: any, idx: number) => {
    const cost = parsePriceNumber(p.cost ?? p.price ?? p.original_cost);
    const sellPrice = calculateMarginPrice(cost);
    const was = sellPrice * 1.35; // pretend "was" price 35% higher
    const profit = sellPrice - cost;
    return {
      id: String(p.id ?? p._id ?? idx),
      numeric_id: Number(p.numeric_id ?? p.id ?? idx),
      name: String(p.name ?? p.title ?? "Producto"),
      priceNow: sellPrice.toFixed(2),
      priceWas: was.toFixed(2),
      profit: profit.toFixed(2),
      original_cost: cost.toFixed(2),
      image: String(
        p.image ?? p.imageUrl ?? p.image_url ?? "https://api.dropea.com/placeholder/product-file"
      ),
      stars: String(p.stars ?? p.rating ?? "4.7"),
      reviews: String(p.reviews ?? `${Math.floor(Math.random() * 500) + 50} opiniones`),
      category: (p.category ?? "Tecnología") as Product["category"],
      tag: (p.tag ?? "") as Product["tag"],
      tag2: p.tag2,
      description: p.description,
      brand: p.brand,
    };
  });

  // Backup current catalog
  try {
    if (fs.existsSync(PRODUCTS_PATH)) {
      fs.copyFileSync(PRODUCTS_PATH, `${PRODUCTS_PATH}.bak`);
    }
  } catch {}

  // Write the new catalog
  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(mapped, null, 2), "utf8");

  // Persist a snapshot in DB so the admin panel can show last sync (best-effort)
  // (There's no Catalog model; we return the data directly.)
  return NextResponse.json({
    ok: true,
    synced: mapped.length,
    pricing: {
      marginFactor: 0.85,
      formula: "sellPrice = round2(cost / (1 - margin))",
      samples: mapped.slice(0, 3).map((p) => ({
        name: p.name,
        cost: p.original_cost,
        sell: p.priceNow,
        profit: p.profit,
      })),
    },
    backupPath: `${PRODUCTS_PATH}.bak`,
    timestamp: new Date().toISOString(),
  });
}
