import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─── GET /api/orders → list orders with items ─────────────────────────
export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const agentCode = url.searchParams.get("agent");
  const limit = Math.min(Number(url.searchParams.get("limit") || 100), 500);
  const offset = Math.max(Number(url.searchParams.get("offset") || 0), 0);

  const where: any = {};
  if (status) where.status = status;
  if (agentCode) where.agentCode = agentCode;

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    db.order.count({ where }),
  ]);

  return NextResponse.json({ ok: true, total, count: orders.length, orders });
}

// ─── PATCH /api/orders → update order status ──────────────────────────
export async function PATCH(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const { id, status } = body ?? {};
  if (!id || !status) {
    return NextResponse.json(
      { ok: false, error: "Missing id or status" },
      { status: 400 }
    );
  }
  const allowed = ["pending", "confirmed", "failed", "synced", "cancelled"];
  if (!allowed.includes(status)) {
    return NextResponse.json(
      { ok: false, error: `Invalid status. Allowed: ${allowed.join(", ")}` },
      { status: 400 }
    );
  }
  const updated = await db.order.update({
    where: { id },
    data: { status },
    include: { items: true },
  });
  return NextResponse.json({ ok: true, order: updated });
}
