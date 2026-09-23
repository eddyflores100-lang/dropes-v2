import { NextResponse } from "next/server";
import productsData from "@/data/products.json";
import type { Product } from "@/lib/types";
import { COMMISSION_RATE, parsePriceNumber } from "@/lib/dropea-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALL_PRODUCTS = productsData as Product[];

// ─── GET /api/opportunity → opportunity card JSON ─────────────────────
export async function GET() {
  // Compute aggregate metrics over catalog
  const totalProfit = ALL_PRODUCTS.reduce(
    (acc, p) => acc + parsePriceNumber(p.profit),
    0
  );
  const avgCommission = totalProfit / ALL_PRODUCTS.length * COMMISSION_RATE;
  const top = [...ALL_PRODUCTS]
    .sort((a, b) => parsePriceNumber(b.profit) - parsePriceNumber(a.profit))
    .slice(0, 5);
  const categories = Array.from(new Set(ALL_PRODUCTS.map((p) => p.category)));

  return NextResponse.json({
    opportunity: {
      id: "dropes-affiliate-v1",
      title: "DROPES Affiliate Program",
      tagline: "Gana dinero compartiendo productos virales",
      description:
        "Comparte productos virales con tu audiencia. Te pagan 10% de comisión por cada venta confirmada. Sin inventario, sin atención al cliente.",
      type: "affiliate-dropshipping",
      currency: "EUR",
      countries: ["ES", "PT"],
    },
    commission: {
      rate: COMMISSION_RATE,
      averagePerSale: Math.round(avgCommission * 100) / 100,
      maxPerSale: parsePriceNumber(top[0]?.profit ?? "0") * COMMISSION_RATE,
      payoutSchedule: "monthly",
      cookieWindowDays: 30,
    },
    catalog: {
      total: ALL_PRODUCTS.length,
      categories,
      topProducts: top.map((p) => ({
        id: p.id,
        name: p.name,
        priceNow: p.priceNow,
        profit: p.profit,
        commission: Math.round(parsePriceNumber(p.profit) * COMMISSION_RATE * 100) / 100,
        image: p.image,
        tag: p.tag,
      })),
    },
    market: {
      audience: "ES/PT — Instagram, TikTok, WhatsApp, Telegram",
      paymentMethods: ["contra reembolso", "tarjeta"],
      shippingWindow: "24-48h",
      averageConversionRate: 0.025,
      trustSignals: ["30 días de prueba", "Contra reembolso", "Garantía europea"],
    },
    connection: {
      protocol: "MCP",
      transport: "JSON-RPC 2.0 over HTTP",
      endpoint: "/api/mcp",
      auth: "agentCode in tool args",
      tools: [
        "discover_opportunity",
        "register_agent",
        "get_catalog",
        "get_product_detail",
        "get_marketing_kit",
        "get_agent_stats",
        "get_agent_leads",
        "track_promotion",
        "create_order",
      ],
    },
    marketplace: {
      brand: "DROPES",
      shopId: process.env.DROPEA_SHOP_ID ?? "demo_shop",
      tier: "dropshipper",
      integrationV1: {
        endpoint: "https://api.dropea.com/api/v1/order",
        auth: "X-API-Key",
        status: "available",
      },
      integrationV2: {
        endpoint: "https://api.dropea.com/graphql/dropshippers",
        auth: "Bearer JWT",
        status: "available",
      },
      localFallback: { engine: "sqlite", status: "active" },
    },
    signup: {
      url: "/agentes/registro",
      loginUrl: "/agentes/login",
      dashboardUrl: "/agentes/dashboard",
      opportunityUrl: "/opportunity",
    },
    generatedAt: new Date().toISOString(),
  });
}
