import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateAgentCode, hashPassword } from "@/lib/dropea-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─── POST /api/agents/register ─────────────────────────────────────────
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const { name, email, phone, password, socialMedia } = body ?? {};

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json(
      { ok: false, error: "Name is required (min 2 chars)" },
      { status: 400 }
    );
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Valid email is required" },
      { status: 400 }
    );
  }
  if (!password || password.length < 6) {
    return NextResponse.json(
      { ok: false, error: "Password must be at least 6 chars" },
      { status: 400 }
    );
  }

  const existing = await db.agent.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { ok: false, error: "Email already registered" },
      { status: 409 }
    );
  }

  // Generate unique agent code (retry on collision)
  let agentCode = generateAgentCode();
  for (let i = 0; i < 5; i++) {
    const collision = await db.agent.findUnique({ where: { agentCode } });
    if (!collision) break;
    agentCode = generateAgentCode();
  }

  const passwordHash = await hashPassword(password);
  const agent = await db.agent.create({
    data: {
      agentCode,
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone ?? null,
      passwordHash,
      socialMedia: socialMedia ?? null,
    },
  });

  return NextResponse.json(
    {
      ok: true,
      agentCode: agent.agentCode,
      agentId: agent.id,
      name: agent.name,
      email: agent.email,
      referralLink: `/?ref=${agent.agentCode}`,
      createdAt: agent.createdAt,
    },
    { status: 201 }
  );
}
