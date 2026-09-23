// src/proxy.ts — Next.js proxy (formerly middleware.ts).
// Detects ?ref=DROPES-XXXX referral codes, persists a 30-day cookie,
// and registers an AgentClick row in the DB so we can attribute future
// conversions to the right agent.

import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";

const REF_PATTERN = /^DROPES-[A-Z0-9]{4}$/;
const REF_COOKIE = "dropes_agent_ref";
const TTL_DAYS = 30;

export async function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const refParam = url.searchParams.get("ref");

  // Only handle the homepage and other static store pages.
  // API routes and Next internals are skipped.
  if (url.pathname.startsWith("/_next") || url.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const res = NextResponse.next();

  // ─── Referral detection ───────────────────────────────────────────
  if (refParam && REF_PATTERN.test(refParam)) {
    // Set the cookie on the response (30 days)
    res.cookies.set(REF_COOKIE, refParam, {
      path: "/",
      httpOnly: false, // client-side may need to read it for tracking
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * TTL_DAYS,
    });

    // ─── Register click in DB (best-effort, never blocks) ────────────
    try {
      const agent = await db.agent.findUnique({
        where: { agentCode: refParam },
        select: { id: true },
      });
      if (agent) {
        // Avoid duplicate clicks for the same agent+ip within 1 minute
        const ipRaw =
          req.headers.get("x-forwarded-for") ||
          req.headers.get("x-real-ip") ||
          "unknown";
        const ipHash = String(ipRaw).split(",")[0]?.trim().slice(0, 64) || "unknown";
        await db.agentClick.create({
          data: {
            agentId: agent.id,
            referer: req.headers.get("referer") ?? null,
            userAgent: req.headers.get("user-agent")?.slice(0, 255) ?? null,
            landing: url.pathname + url.search,
            ipHash,
            converted: false,
          },
        });
        // Bump denormalized counter
        await db.agent.update({
          where: { id: agent.id },
          data: { clicks: { increment: 1 } },
        });
      }
    } catch (err) {
      // Never block the request because of a DB error
      console.error("[proxy] click-tracking error:", err);
    }
  }

  return res;
}

export const config = {
  // Run on all paths except Next internals and API.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|logo.svg|googlea).*)"],
};
