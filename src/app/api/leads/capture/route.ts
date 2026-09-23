import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAgentRefFromCookie, resolveAgentByCode } from "@/lib/dropea-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_EVENTS = [
  "checkout_started",
  "email_entered",
  "checkout_abandoned",
  "page_view",
  "add_to_cart",
];

// ─── POST /api/leads/capture ───────────────────────────────────────────
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const {
    event,
    email,
    phone,
    name,
    cartValue = 0,
    ref: explicitRef,
    meta,
  } = body ?? {};

  if (!event || !VALID_EVENTS.includes(event)) {
    return NextResponse.json(
      { ok: false, error: `event must be one of: ${VALID_EVENTS.join(", ")}` },
      { status: 400 }
    );
  }

  // ─── Detect agent (cookie first, then explicit ?ref) ───────────────
  const refCookie = await getAgentRefFromCookie();
  const ref = explicitRef || refCookie;
  const agent = await resolveAgentByCode(ref);

  if (!agent) {
    // Still acknowledge event, but no lead is recorded
    return NextResponse.json({
      ok: true,
      captured: false,
      reason: "no_agent_ref",
      event,
    });
  }

  // Require an email for "checkout_started" / "email_entered" events
  if (
    (event === "checkout_started" || event === "email_entered") &&
    !email
  ) {
    return NextResponse.json(
      { ok: false, error: "email required for this event" },
      { status: 400 }
    );
  }

  // Find or create lead row
  let lead;
  if (email) {
    lead = await db.lead.findFirst({
      where: { agentId: agent.id, email },
      orderBy: { createdAt: "desc" },
    });
    if (!lead) {
      lead = await db.lead.create({
        data: {
          agentId: agent.id,
          email,
          phone: phone ?? null,
          name: name ?? null,
          status: "new",
          cartValue: Number(cartValue) || 0,
        },
      });
    } else {
      lead = await db.lead.update({
        where: { id: lead.id },
        data: {
          phone: phone ?? lead.phone,
          name: name ?? lead.name,
          cartValue: Number(cartValue) || lead.cartValue,
          updatedAt: new Date(),
        },
      });
    }
  } else {
    // For events without email, attach to most-recent lead in last 24h if any
    lead = await db.lead.findFirst({
      where: {
        agentId: agent.id,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  if (!lead) {
    return NextResponse.json({
      ok: true,
      captured: false,
      reason: "no_lead_for_event",
      event,
    });
  }

  // If checkout_abandoned → mark lead status lost (best-effort, not overwriting converted)
  if (event === "checkout_abandoned" && lead.status !== "converted") {
    await db.lead.update({
      where: { id: lead.id },
      data: { status: "lost" },
    });
  }

  await db.leadEvent.create({
    data: {
      leadId: lead.id,
      event,
      meta: meta ? JSON.stringify(meta) : null,
    },
  });

  return NextResponse.json({
    ok: true,
    captured: true,
    leadId: lead.id,
    agentCode: agent.agentCode,
    event,
  });
}
