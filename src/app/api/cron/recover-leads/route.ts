import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

// ─── POST /api/cron/recover-leads → mark old leads lost + reminders ────
export async function POST(req: Request) {
  const auth = checkAuth(req);
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status }
    );
  }

  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000); // 48h ago

  // ─── Mark old new/contacted leads as lost ───────────────────────────
  const lost = await db.lead.updateMany({
    where: {
      status: { in: ["new", "contacted", "reminded"] },
      updatedAt: { lt: cutoff },
    },
    data: { status: "lost" },
  });

  // ─── Find leads that are 24h+ old and still 'new' → mark reminded ──
  const remindCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const toRemind = await db.lead.findMany({
    where: { status: "new", updatedAt: { lt: remindCutoff } },
    take: 100,
  });

  let reminded = 0;
  for (const lead of toRemind) {
    await db.lead.update({
      where: { id: lead.id },
      data: { status: "reminded", updatedAt: new Date() },
    });
    await db.leadEvent.create({
      data: {
        leadId: lead.id,
        event: "reminded",
        meta: JSON.stringify({ channel: "email", template: "abandoned_cart_v1" }),
      },
    });
    reminded++;
  }

  // ─── Reminder stats summary ────────────────────────────────────────
  const pending = await db.lead.count({
    where: { status: { in: ["new", "reminded", "contacted"] } },
  });

  return NextResponse.json({
    ok: true,
    markedLost: lost.count,
    reminded,
    pendingActive: pending,
    cutoff: cutoff.toISOString(),
    timestamp: new Date().toISOString(),
  });
}
