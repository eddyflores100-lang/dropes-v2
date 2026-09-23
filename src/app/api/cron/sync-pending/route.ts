import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  dropeaV1CreateOrder,
  dropeaV2CreateOrder,
} from "@/lib/dropea-server";

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

// ─── POST /api/cron/sync-pending → retry syncing local orders ─────────
export async function POST(req: Request) {
  const auth = checkAuth(req);
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status }
    );
  }

  // Find local orders still pending (failed to reach Dropea at first attempt)
  const pending = await db.order.findMany({
    where: {
      status: "pending",
      apiSource: "local",
      syncAttempts: { lt: 5 },
    },
    include: { items: true },
    orderBy: { createdAt: "asc" },
    take: 25,
  });

  const results: Array<{
    orderId: string;
    ok: boolean;
    apiSource?: string;
    partnerOrderId?: string;
    error?: string;
  }> = [];

  for (const order of pending) {
    const lineItems = order.items.map((i) => ({
      productId: i.productId,
      name: i.name,
      quantity: i.quantity,
      price: i.priceNow,
      image: i.image,
    }));
    const customer = {
      firstName: order.customerName?.split(" ")[0] ?? "",
      lastName: order.customerName?.split(" ").slice(1).join(" ") ?? "",
      email: order.customerEmail,
      phone: order.customerPhone,
      address: order.customerAddress,
      city: order.customerCity,
      zip: order.customerZip,
      country: order.customerCountry,
    };

    // Try v1 then v2
    const v1 = await dropeaV1CreateOrder({
      shop: process.env.DROPEA_SHOP_ID,
      customer,
      items: lineItems,
      paymentMethod: order.paymentMethod,
      agentRef: order.agentCode || undefined,
      total: order.total,
    });

    let partnerOrderId: string | undefined;
    let apiSource: string | undefined;
    let error: string | undefined;

    if (v1.ok) {
      partnerOrderId = v1.orderId;
      apiSource = "dropea-v1";
    } else {
      const v2 = await dropeaV2CreateOrder({
        input: {
          shopId: process.env.DROPEA_SHOP_ID,
          customer,
          items: lineItems,
          paymentMethod: order.paymentMethod,
          agentCode: order.agentCode || undefined,
          total: order.total,
        },
      });
      if (v2.ok) {
        partnerOrderId = v2.orderId;
        apiSource = "dropea-v2";
      } else {
        error = `v1: ${v1.error} | v2: ${v2.error}`;
      }
    }

    if (apiSource) {
      await db.order.update({
        where: { id: order.id },
        data: {
          status: "synced",
          apiSource,
          partnerOrderId: partnerOrderId ?? order.partnerOrderId,
          syncAttempts: { increment: 1 },
          lastSyncError: null,
        },
      });
      results.push({ orderId: order.id, ok: true, apiSource, partnerOrderId });
    } else {
      await db.order.update({
        where: { id: order.id },
        data: {
          syncAttempts: { increment: 1 },
          lastSyncError: error ?? "unknown",
        },
      });
      results.push({ orderId: order.id, ok: false, error });
    }
  }

  return NextResponse.json({
    ok: true,
    processed: pending.length,
    results,
    timestamp: new Date().toISOString(),
  });
}
