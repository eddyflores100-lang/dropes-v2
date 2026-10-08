import { NextResponse } from "next/server";
import { authorizedAdmin } from "@/lib/auth-token";
import { validateReconciliation } from "@/lib/commerce";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─── GET /api/orders → list orders with items ─────────────────────────
export async function GET(req: Request) {
  if (!authorizedAdmin(req)) return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const agentCode = url.searchParams.get("agent");
  const limit = Number(url.searchParams.get("limit") || 100);
  const offset = Number(url.searchParams.get("offset") || 0);
  if(!Number.isInteger(limit)||limit<1||limit>500||!Number.isInteger(offset)||offset<0) return NextResponse.json({ok:false,error:"Invalid pagination"},{status:400});

  const where: any = {};
  if (status) where.status = status;
  const id=url.searchParams.get("id"); if(id) where.id=id;
  const q=url.searchParams.get("q")?.slice(0,200);
  if(q) where.OR=["id","customerName","customerEmail","agentCode"].map(field=>({[field]:{contains:q,mode:"insensitive"}}));
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
  if (!authorizedAdmin(req)) return NextResponse.json({ok:false,error:"Unauthorized"},{status:401});
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
  const allowed = ["confirmed", "cancelled"];
  if (!allowed.includes(status)) {
    return NextResponse.json(
      { ok: false, error: `Invalid status. Allowed: ${allowed.join(", ")}` },
      { status: 400 }
    );
  }
  // Delivery is exclusively handled by the evidence endpoint, never a status selector.
  const current = await db.order.findUnique({where:{id},include:{items:true}});
  if (!current) return NextResponse.json({ok:false,error:"Not found"},{status:404});
  if (current.items.some(i=>i.deliveredQuantity>0)) return NextResponse.json({ok:false,error:"Usa el registro de entregas/devoluciones o reconcilia el envío en curso"},{status:409});
  let reconciliation:string|undefined;
  if(current.status==='syncing') {
    try {reconciliation=validateReconciliation(current.updatedAt,body.reconciliationEvidence);}
    catch(e) {return NextResponse.json({ok:false,error:(e as Error).message},{status:409});}
  }
  if (["confirmed","synced"].includes(status) && (typeof body.partnerOrderId !== "string" || !body.partnerOrderId.trim())) return NextResponse.json({ok:false,error:"Referencia del proveedor obligatoria tras reconciliar"},{status:400});
  const updated = await db.order.updateMany({where:{id,version:current.version},data:{status,version:{increment:1},...(["confirmed","synced"].includes(status)?{partnerOrderId:body.partnerOrderId.trim()}:{}),commissionEarned:0,...(reconciliation?{lastSyncError:`Reconciliado manualmente: ${reconciliation}`}:{})}});
  return NextResponse.json({ok:updated.count===1},{status:updated.count===1?200:409});
}
