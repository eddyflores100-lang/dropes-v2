import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAgent } from "@/lib/dropea-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = ["new", "contacted", "converted", "lost", "reminded"];

// ─── GET /api/agents/leads → leads for logged-in agent ────────────────
export async function GET(req: Request) {
  const agent = await getCurrentAgent();
  if (!agent) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const limit = Math.min(Number(url.searchParams.get("limit") || 100), 500);

  const where: any = { agentId: agent.id };
  if (status && ALLOWED_STATUSES.includes(status)) where.status = status;

  const [leads, total] = await Promise.all([
    db.lead.findMany({
      where,
      include: { events: { orderBy: { createdAt: "desc" }, take: 5 } },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    db.lead.count({ where }),
  ]);

  return NextResponse.json({
    ok: true,
    total,
    count: leads.length,
    leads: leads.map((l) => ({
      id: l.id,
      email: l.email,
      phone: l.phone,
      name: l.name,
      status: l.status,
      cartValue: l.cartValue,
      orderId: l.orderId,
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
      events: l.events,
    })),
  });
}

// ─── PATCH /api/agents/leads → update lead status ─────────────────────
export async function PATCH(req: Request) {
  const agent = await getCurrentAgent();
  if (!agent) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const { id, status } = body ?? {};
  if (!id || !status) {
    return NextResponse.json(
      { ok: false, error: "id and status required" },
      { status: 400 }
    );
  }
  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json(
      { ok: false, error: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }
  // Ensure lead belongs to agent
  const lead = await db.lead.findFirst({ where: { id, agentId: agent.id } });
  if (!lead) {
    return NextResponse.json({ ok: false, error: "Lead not found" }, { status: 404 });
  }
  const updated = await db.lead.update({
    where: { id },
    data: { status },
  });
  await db.leadEvent.create({
    data: { leadId: lead.id, event: "status_change", meta: status },
  });
  return NextResponse.json({ ok: true, lead: updated });
}
