import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AGENT_TOKEN_COOKIE, verifyPassword } from "@/lib/dropea-server";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─── POST /api/agents/login ────────────────────────────────────────────
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const { email, password } = body ?? {};
  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: "Email and password required" },
      { status: 400 }
    );
  }

  const agent = await db.agent.findUnique({ where: { email: String(email).toLowerCase() } });
  if (!agent || !agent.passwordHash) {
    return NextResponse.json(
      { ok: false, error: "Invalid credentials" },
      { status: 401 }
    );
  }
  const ok = await verifyPassword(String(password), agent.passwordHash);
  if (!ok) {
    return NextResponse.json(
      { ok: false, error: "Invalid credentials" },
      { status: 401 }
    );
  }
  if (agent.status === "blocked") {
    return NextResponse.json(
      { ok: false, error: "Account blocked. Contact support." },
      { status: 403 }
    );
  }

  // Set httpOnly cookie storing the agent id (stateless token)
  const store = await cookies();
  store.set(AGENT_TOKEN_COOKIE, agent.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return NextResponse.json({
    ok: true,
    agent: {
      id: agent.id,
      agentCode: agent.agentCode,
      name: agent.name,
      email: agent.email,
      referralLink: `/?ref=${agent.agentCode}`,
    },
  });
}
