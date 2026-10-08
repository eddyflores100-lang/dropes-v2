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
    (acc, p) => acc + parsePriceNumber(p.priceNow),
    0
  );
  const avgCommission = totalProfit / ALL_PRODUCTS.length * COMMISSION_RATE;
  const top = [...ALL_PRODUCTS]
    .sort((a, b) => parsePriceNumber(b.priceNow) - parsePriceNumber(a.priceNow))
    .slice(0, 5);
  const categories = Array.from(new Set(ALL_PRODUCTS.map((p) => p.category)));

  return NextResponse.json({
    opportunity: {
      id: "dropes-affiliate-v1",
      title: "DROPES Affiliate Program",
      tagline: "Gana dinero compartiendo productos virales",
      description:
        "Comparte productos virales con tu audiencia. Te pagan 10% de comisión por cada entrega verificada. Sin inventario, sin atención al cliente.",
      type: "affiliate-dropshipping",
      currency: "EUR",
      countries: ["ES", "PT"],
    },
    commission: {
      rate: COMMISSION_RATE,
      averagePerSale: Math.round(avgCommission * 100) / 100,
      maxPerSale: parsePriceNumber(top[0]?.priceNow ?? "0") * COMMISSION_RATE,
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
        commission: Math.round(parsePriceNumber(p.priceNow) * COMMISSION_RATE * 100) / 100,
        image: p.image,
        tag: p.tag,
      })),
    },
    market: {
      audience: "ES/PT — Instagram, TikTok, WhatsApp, Telegram",
      paymentMethods: ["contra reembolso"],
      shippingWindow: "Se confirma antes del envío",
      commissionEligibility: "verified_delivery_only",
      trustSignals: ["Contra reembolso", "Referencia de pedido"],
    },
    connection: {
      protocol: "MCP",
      transport: "JSON-RPC 2.0 over HTTP",
      endpoint: "/api/mcp",
      auth: "signed_session_cookie",
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
        status: "requires_configuration",
      },
      integrationV2: {
        endpoint: "https://api.dropea.com/graphql/dropshippers",
        auth: "Bearer JWT",
        status: "requires_configuration",
      },
      orderStorage: { engine: "postgresql", status: "requires_configuration" },
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
