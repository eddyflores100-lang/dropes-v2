import { NextResponse } from "next/server";
import { createCheckout, commissionBalance } from "@/lib/order-service";
import { db } from "@/lib/db";
import productsData from "@/data/products.json";
import type { Product } from "@/lib/types";
import {
  COMMISSION_RATE,
  generateAgentCode,
  hashPassword,
  getCurrentAgent,
} from "@/lib/dropea-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALL_PRODUCTS = productsData as Product[];

// ─── Tool registry ───────────────────────────────────────────────────
interface ToolDef {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

const TOOLS: ToolDef[] = [
  {
    name: "discover_opportunity",
    description:
      "Discover the affiliate/reseller opportunity with DROPES: commission rate, marketplace metadata, and connection info.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "register_agent",
    description: "Register a new DROPES agent. Returns a unique agent code DROPES-XXXX.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        password: { type: "string" },
        socialMedia: { type: "string" },
      },
      required: ["name", "email", "password"],
    },
  },
  {
    name: "get_catalog",
    description:
      "Return the catalog of products available for promotion. Filterable by category.",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string" },
        limit: { type: "number" },
      },
    },
  },
  {
    name: "get_product_detail",
    description: "Return detailed info for a single product by numeric or string id.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
  {
    name: "get_marketing_kit",
    description:
      "Return the marketing kit (referral link, copy snippets, social templates) for the given agent code.",
    inputSchema: {
      type: "object",
      properties: { agentCode: { type: "string" } },
      required: ["agentCode"],
    },
  },
  {
    name: "get_agent_stats",
    description: "Return clicks, conversions, total earned, and payout summary for an agent.",
    inputSchema: {
      type: "object",
      properties: { agentCode: { type: "string" } },
      required: ["agentCode"],
    },
  },
  {
    name: "get_agent_leads",
    description: "Return leads captured for the given agent, optionally filtered by status.",
    inputSchema: {
      type: "object",
      properties: {
        agentCode: { type: "string" },
        status: { type: "string" },
      },
      required: ["agentCode"],
    },
  },
  {
    name: "track_promotion",
    description:
      "Track a promotion action (channel, URL, post count) for an agent. Returns the created promotion record.",
    inputSchema: {
      type: "object",
      properties: {
        agentCode: { type: "string" },
        channel: { type: "string" },
        url: { type: "string" },
        posts: { type: "number" },
        cost: { type: "number" },
      },
      required: ["agentCode", "channel"],
    },
  },
  {
    name: "create_order",
    description:
      "Create an order from the agent's referral. Returns a pending orderId; commission remains zero until verified delivery.",
    inputSchema: {
      type: "object",
      properties: {
        agentCode: { type: "string" },
        customer: { type: "object" },
        items: { type: "array" },
        paymentMethod: { type: "string", enum: ["cod"] },
        idempotencyKey: { type: "string" },
      },
      required: ["agentCode", "customer", "items", "idempotencyKey", "paymentMethod"],
    },
  },
];

// ─── Tool implementations ─────────────────────────────────────────────
async function discoverOpportunity() {
  return {
    opportunity: {
      name: "Programa de Agentes DROPES",
      tagline: "Comparte productos virales. Gana comisiones. Sin inventario.",
      commissionRate: COMMISSION_RATE,
      currency: "EUR",
      countries: ["ES", "PT"],
      paymentSchedule: "monthly",
      cookieWindowDays: 30,
      catalogSize: ALL_PRODUCTS.length,
      commissionEligibility: "verified_delivery_only",
      commissionBasis: "delivered_product_value",
      connection: {
        protocol: "MCP (JSON-RPC 2.0)",
        endpoint: "/api/mcp",
        transport: "http",
        auth: "Signed session cookie; agentCode is not a credential",
      },
      marketplace: {
        brand: "DROPES",
        shopId: process.env.DROPEA_SHOP_ID ?? "demo_shop",
        paymentMethods: ["contra reembolso"],
        shippingWindow: "Se confirma antes del envío",
      },
    },
  };
}

async function registerAgent() {
  return {signupUrl:"/agentes/registro",message:"Regístrate en la web para aceptar las condiciones y crear tu acceso."};
}

async function getCatalog(args: any) {
  const { category, limit = 50 } = args ?? {};
  let list = ALL_PRODUCTS;
  if (category) list = list.filter((p) => p.category === category);
  const sliced = list.slice(0, Math.min(Number(limit) || 50, 200));
  return {
    count: sliced.length,
    total: list.length,
    products: sliced.map((p) => ({
      id: p.id,
      numeric_id: p.numeric_id,
      name: p.name,
      priceNow: p.priceNow,
      profit: p.profit,
      original_cost: p.original_cost,
      image: p.image,
      category: p.category,
      commission: Math.round(parseFloat(p.priceNow.replace(",", ".")) * COMMISSION_RATE * 100) / 100,
    })),
  };
}

async function getProductDetail(args: any) {
  const { id } = args ?? {};
  if (!id) return { error: "id required" };
  const product = ALL_PRODUCTS.find(
    (p) => p.id === String(id) || p.numeric_id === Number(id)
  );
  if (!product) return { error: "Product not found" };
  return {
    product: {
      id:product.id, name:product.name, priceNow:product.priceNow, image:product.image, category:product.category,
      commission: Math.round(parseFloat(product.priceNow.replace(",", ".")) * COMMISSION_RATE * 100) / 100,
    },
    marketingCopy: {
      short: `${product.name} — ${product.priceNow}€`,
      hook: `${product.name}: consulta disponibilidad y condiciones.`,
      cta: "Solicita tu pedido contra reembolso. Disponibilidad y entrega sujetas a confirmación.",
    },
  };
}

async function getMarketingKit(args: any) {
  const { agentCode } = args ?? {};
  if (!agentCode) return { error: "agentCode required" };
  const agent = await db.agent.findUnique({ where: { agentCode } });
  if (!agent) return { error: "Agent not found" };
  const top = ALL_PRODUCTS.slice(0, 5);
  return {
    agentCode: agent.agentCode,
    referralLink: `/?ref=${agent.agentCode}`,
    copy: {
      instagram: `🛒 ¡Encuentro de la semana! ${top[0]?.name} por solo ${top[0]?.priceNow}€. Link en bio 🚀`,
      tiktok: `Descubre este producto: ${top[0]?.priceNow}€ contra reembolso. Comenta "YO" si lo quieres.`,
      email: `Hola, te recomiendo ${top[0]?.name} a ${top[0]?.priceNow}€ contra reembolso; consulta disponibilidad y condiciones de entrega.`,
    },
    recommendedProducts: top.map((p) => ({
      id: p.id,
      name: p.name,
      priceNow: p.priceNow,
      commission: Math.round(parseFloat(p.priceNow.replace(",", ".")) * COMMISSION_RATE * 100) / 100,
    })),
  };
}

async function getAgentStats(args: any) {
  const { agentCode } = args ?? {};
  if (!agentCode) return { error: "agentCode required" };
  const agent = await db.agent.findUnique({
    where: { agentCode },
    include: { _count: { select: { clicksRel: true, leadsRel: true, payoutsRel: true } } },
  });
  if (!agent) return { error: "Agent not found" };
  const pendingPayouts = await db.agentPayout.aggregate({
    where: { agentId: agent.id, status: "pending" },
    _sum: { amount: true },
  });
  return {
    agentCode: agent.agentCode,
    name: agent.name,
    clicks: agent.clicks,
    conversions: agent.conversions,
    conversionRate: agent.clicks > 0 ? agent.conversions / agent.clicks : 0,
    ...(await commissionBalance(db, agent.id)),
    pendingPayout: pendingPayouts._sum.amount ?? 0,
    leadsCount: agent._count.leadsRel,
  };
}

async function getAgentLeads(args: any) {
  const { agentCode, status } = args ?? {};
  if (!agentCode) return { error: "agentCode required" };
  const agent = await db.agent.findUnique({ where: { agentCode } });
  if (!agent) return { error: "Agent not found" };
  const where: any = { agentId: agent.id };
  if (status) where.status = status;
  const leads = await db.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return {
    count: leads.length,
    leads: leads.map((l) => ({
      id: l.id,
      email: l.email,
      phone: l.phone,
      name: l.name,
      status: l.status,
      cartValue: l.cartValue,
      createdAt: l.createdAt,
    })),
  };
}

async function trackPromotion(args: any) {
  const { agentCode, channel, url, posts = 1, cost = 0 } = args ?? {};
  if (!agentCode || !channel) return { error: "agentCode and channel required" };
  const agent = await db.agent.findUnique({ where: { agentCode } });
  if (!agent) return { error: "Agent not found" };
  const promo = await db.agentPromotion.create({
    data: {
      agentId: agent.id,
      channel,
      url: url ?? null,
      posts: Number(posts),
      cost: Number(cost),
    },
  });
  return { ok: true, promotion: promo };
}

async function createOrder(args: any) {
  if (process.env.CHECKOUT_ENABLED !== "true") throw new Error("Checkout unavailable");
  const agent = await getCurrentAgent();
  if (!agent || agent.agentCode !== args?.agentCode) throw new Error("Authentication required");
  return createCheckout(db, args, args.idempotencyKey, agent.id, ALL_PRODUCTS);
}

const DISPATCH: Record<string, (args: any) => Promise<unknown>> = {
  discover_opportunity: discoverOpportunity,
  register_agent: registerAgent,
  get_catalog: getCatalog,
  get_product_detail: getProductDetail,
  get_marketing_kit: getMarketingKit,
  get_agent_stats: getAgentStats,
  get_agent_leads: getAgentLeads,
  track_promotion: trackPromotion,
  create_order: createOrder,
};

// ─── JSON-RPC 2.0 server ─────────────────────────────────────────────
export async function POST(req: Request) {
  let json: any;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } },
      { status: 400 }
    );
  }

  // Support batch
  if (Array.isArray(json)) {
    if (json.length > 20) return NextResponse.json({error:"Batch limit exceeded"},{status:413});
    const results = await Promise.all(json.map((r) => handleSingle(r)));
    return NextResponse.json(results);
  }
  const result = await handleSingle(json);
  return NextResponse.json(result);
}

async function handleSingle(req: any) {
  const { jsonrpc, id, method, params } = req ?? {};
  if (jsonrpc !== "2.0") {
    return {
      jsonrpc: "2.0",
      id: id ?? null,
      error: { code: -32600, message: "Invalid Request: jsonrpc must be '2.0'" },
    };
  }

  // ─── RPC method dispatch ────────────────────────────────────────────
  if (method === "rpc.discover" || method === "tools/list") {
    return { jsonrpc: "2.0", id, result: { tools: TOOLS } };
  }
  if (method === "tools/call" || method === "invoke") {
    const name = params?.name || params?.tool;
    const args = params?.arguments || params?.args || {};
    const tool = TOOLS.find((t) => t.name === name);
    if (!tool) {
      return {
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: `Method not found: ${name}` },
      };
    }
    try {
      if (["get_agent_stats", "get_agent_leads", "track_promotion", "create_order", "get_marketing_kit"].includes(name)) {
        const agent = await getCurrentAgent();
        if (!agent || agent.agentCode !== args.agentCode) throw new Error("Authentication required");
      }
      const result = await DISPATCH[name](args);
      return { jsonrpc: "2.0", id, result };
    } catch (err: any) {
      return {
        jsonrpc: "2.0",
        id,
        error: { code: -32603, message: "Solicitud no autorizada o inválida" },
      };
    }
  }

  return {
    jsonrpc: "2.0",
    id,
    error: {
      code: -32601,
      message: `Method not found: ${method}. Use 'tools/list' or 'tools/call'.`,
    },
  };
}

// ─── GET /api/mcp → server info ───────────────────────────────────────
export async function GET() {
  return NextResponse.json({
    server: "dropes-mcp",
    version: "1.0.0",
    protocol: "JSON-RPC 2.0",
    endpoint: "/api/mcp",
    methods: ["tools/list", "tools/call", "rpc.discover"],
    tools: TOOLS.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    })),
    usage: {
      example: {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: { name: "discover_opportunity", arguments: {} },
      },
    },
  });
}
