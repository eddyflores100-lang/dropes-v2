import { NextResponse } from "next/server";
import { signSession } from "@/lib/auth-token";
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
  if (typeof email !== "string" || typeof password !== "string" || email.length > 254 || password.length > 128 || !email || !password) {
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
  if (agent.status !== "active") {
    return NextResponse.json(
      { ok: false, error: "Account blocked. Contact support." },
      { status: 403 }
    );
  }

  // Signed, expiring session; raw agent IDs are never credentials.
  if ((process.env.SESSION_SECRET || "").length < 32) return NextResponse.json({ok:false,error:"Inicio de sesión temporalmente no disponible"},{status:503});
  const store = await cookies();
  store.set(AGENT_TOKEN_COOKIE, signSession(agent.id, process.env.SESSION_SECRET!), {
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
