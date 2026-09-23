import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { AGENT_TOKEN_COOKIE, getCurrentAgent } from "@/lib/dropea-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─── GET /api/agents/me → profile + aggregated stats ──────────────────
export async function GET() {
  const agent = await getCurrentAgent();
  if (!agent) {
    return NextResponse.json(
      { ok: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  const [clicks, conversions, orders, leads, pendingPayouts, recentClicks] =
    await Promise.all([
      db.agentClick.count({ where: { agentId: agent.id } }),
      db.order.count({ where: { agentId: agent.id, status: { in: ["confirmed", "synced"] } } }),
      db.order.findMany({
        where: { agentId: agent.id },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { items: true },
      }),
      db.lead.count({ where: { agentId: agent.id } }),
      db.agentPayout.aggregate({
        where: { agentId: agent.id, status: "pending" },
        _sum: { amount: true },
      }),
      db.agentClick.count({
        where: {
          agentId: agent.id,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

  return NextResponse.json({
    ok: true,
    agent: {
      id: agent.id,
      agentCode: agent.agentCode,
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      socialMedia: agent.socialMedia,
      status: agent.status,
      createdAt: agent.createdAt,
    },
    stats: {
      clicks,
      clicksThisWeek: recentClicks,
      conversions,
      conversionRate: clicks > 0 ? Number((conversions / clicks).toFixed(4)) : 0,
      orders: orders.length,
      leads,
      totalEarned: agent.totalEarned,
      pendingPayout: pendingPayouts._sum.amount ?? 0,
      referralLink: `/?ref=${agent.agentCode}`,
    },
    recentOrders: orders,
  });
}

// ─── POST /api/agents/me → logout (delete cookie) ──────────────────────
export async function POST() {
  const store = await cookies();
  store.delete(AGENT_TOKEN_COOKIE);
  return NextResponse.json({ ok: true, message: "Logged out" });
}
