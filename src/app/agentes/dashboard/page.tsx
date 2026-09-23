"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Dashboard (suspense wrapper) ─────────────────────────────────────
export default function AgentDashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardInner />
    </Suspense>
  );
}

interface AgentStats {
  agent?: {
    id: string;
    agentCode: string;
    name: string;
    email: string;
    phone?: string | null;
    socialMedia?: string | null;
    status: string;
    createdAt: string;
  };
  stats?: {
    clicks: number;
    clicksThisWeek: number;
    conversions: number;
    conversionRate: number;
    orders: number;
    leads: number;
    totalEarned: number;
    pendingPayout: number;
    referralLink: string;
  };
  recentOrders?: any[];
  error?: string;
}

interface Lead {
  id: string;
  email: string;
  phone?: string | null;
  name?: string | null;
  status: string;
  cartValue: number;
  createdAt: string;
}

function DashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlight = searchParams.get("section");

  const [data, setData] = useState<AgentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agents/me", { cache: "no-store" });
      const json = await res.json();
      if (!json.ok) {
        setData({ error: json.error });
        return;
      }
      setData(json);
      const lres = await fetch("/api/agents/leads", { cache: "no-store" });
      const ljson = await lres.json();
      if (ljson.ok) setLeads(ljson.leads);
    } catch (err: any) {
      setData({ error: err?.message ?? "Network error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const logout = async () => {
    await fetch("/api/agents/me", { method: "POST" });
    toast.success("Sesión cerrada");
    router.push("/agentes/login");
  };

  const copyReferral = () => {
    const ref = data?.stats?.referralLink;
    if (!ref) return;
    const full = typeof window !== "undefined" ? window.location.origin + ref : ref;
    navigator.clipboard?.writeText(full);
    setCopied(true);
    toast.success("Enlace copiado");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <DashboardSkeleton />;
  if (data?.error) {
    return (
      <CenteredMessage
        title="Acceso restringido"
        body={data.error}
        cta={{ label: "Ir al login", href: "/agentes/login" }}
      />
    );
  }

  const agent = data?.agent;
  const stats = data?.stats;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        color: "#FAF9F5",
        fontFamily: "Inter, system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "16px 24px",
          borderBottom: "2.5px solid #FF1744",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <Link
            href="/"
            style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontWeight: 900,
              fontSize: 22,
              textTransform: "uppercase",
              color: "#FAF9F5",
              textDecoration: "none",
              letterSpacing: "-0.02em",
            }}
          >
            DROPES<span style={{ color: "#FF1744" }}>.</span>
          </Link>
          <span
            style={{
              marginLeft: 12,
              fontFamily: "Space Grotesk, monospace",
              fontSize: 11,
              color: "#FFDE00",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Panel de agente
          </span>
        </div>
        <button
          onClick={logout}
          style={{
            background: "transparent",
            color: "#FF1744",
            border: "2.5px solid #FF1744",
            padding: "8px 14px",
            fontFamily: "Space Grotesk, monospace",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </button>
      </header>

      {/* Greeting */}
      <section style={{ padding: "32px 24px 0", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <h1
          style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(32px, 6vw, 56px)",
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            margin: 0,
          }}
        >
          Hola, <span style={{ color: "#FF1744" }}>{agent?.name?.split(" ")[0]}</span>
        </h1>
        <p
          style={{
            fontFamily: "Space Grotesk, monospace",
            fontSize: 13,
            color: "#A0A0A0",
            margin: "8px 0 0",
          }}
        >
          Código de agente:{" "}
          <strong style={{ color: "#FFDE00", letterSpacing: "0.05em" }}>
            {agent?.agentCode}
          </strong>
        </p>
      </section>

      {/* Stats grid */}
      <section style={{ padding: "32px 24px 0", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          <StatCard label="CLICKS" value={stats?.clicks ?? 0} sub={`Esta semana: ${stats?.clicksThisWeek ?? 0}`} />
          <StatCard label="CONVERSIONES" value={stats?.conversions ?? 0} />
          <StatCard label="LEADS" value={stats?.leads ?? 0} />
          <StatCard label="TOTAL GANADO" value={`€${(stats?.totalEarned ?? 0).toFixed(2)}`} accent="yellow" />
          <StatCard label="PENDIENTE DE COBRO" value={`€${(stats?.pendingPayout ?? 0).toFixed(2)}`} accent="red" />
          <StatCard
            label="CONVERSIÓN"
            value={`${(((stats?.conversionRate ?? 0) * 100)).toFixed(1)}%`}
          />
        </div>
      </section>

      {/* Referral Link */}
      <section
        ref={(el) => {
          if (highlight === "referral" && el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }}
        style={{ padding: "32px 24px 0", maxWidth: 1200, margin: "0 auto", width: "100%" }}
      >
        <Panel title="TU ENLACE DE REFERIDO" eyebrow="COMPARTE Y GANA">
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "stretch",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 200,
                background: "white",
                border: "2.5px solid #0A0A0A",
                padding: "14px",
                fontFamily: "Space Grotesk, monospace",
                fontSize: 13,
                color: "#0A0A0A",
                wordBreak: "break-all",
              }}
            >
              {typeof window !== "undefined" ? window.location.origin : ""}
              {stats?.referralLink}
            </div>
            <button
              onClick={copyReferral}
              style={{
                background: "#FFDE00",
                color: "#0A0A0A",
                border: "2.5px solid #0A0A0A",
                padding: "0 24px",
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontWeight: 900,
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: "pointer",
                boxShadow: "4px 4px 0 #0A0A0A",
              }}
            >
              {copied ? "✓ COPIADO" : "COPIAR"}
            </button>
          </div>
        </Panel>
      </section>

      {/* Marketing Kit */}
      <section style={{ padding: "32px 24px 0", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <MarketingKit agentCode={agent?.agentCode ?? ""} />
      </section>

      {/* Leads */}
      <section style={{ padding: "32px 24px 0", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <Panel title="LEADS" eyebrow={`${leads.length} REGISTROS`}>
          {leads.length === 0 ? (
            <EmptyState text="Aún no hay leads. Comparte tu enlace para empezar a captar." />
          ) : (
            <div style={{ display: "grid", gap: 8, maxHeight: 360, overflowY: "auto" }}>
              {leads.map((l) => (
                <div
                  key={l.id}
                  style={{
                    background: "white",
                    color: "#0A0A0A",
                    border: "2.5px solid #0A0A0A",
                    padding: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    boxShadow: "3px 3px 0 #0A0A0A",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "Plus Jakarta Sans, sans-serif",
                        fontWeight: 900,
                        fontSize: 14,
                        textTransform: "uppercase",
                      }}
                    >
                      {l.email}
                    </div>
                    <div
                      style={{
                        fontFamily: "Space Grotesk, monospace",
                        fontSize: 11,
                        color: "#666",
                      }}
                    >
                      {new Date(l.createdAt).toLocaleDateString("es-ES")}
                      {l.cartValue ? ` · €${l.cartValue.toFixed(2)}` : ""}
                    </div>
                  </div>
                  <StatusBadge status={l.status} />
                </div>
              ))}
            </div>
          )}
        </Panel>
      </section>

      {/* Orders */}
      <section style={{ padding: "32px 24px 0", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <Panel title="PEDIDOS RECIENTES" eyebrow={`ÚLTIMAS ${data?.recentOrders?.length ?? 0} VENTAS`}>
          {(data?.recentOrders ?? []).length === 0 ? (
            <EmptyState text="Aún no hay pedidos. Tu primera venta aparecerá aquí." />
          ) : (
            <div style={{ display: "grid", gap: 8, maxHeight: 360, overflowY: "auto" }}>
              {(data?.recentOrders ?? []).map((o: any) => (
                <div
                  key={o.id}
                  style={{
                    background: "white",
                    color: "#0A0A0A",
                    border: "2.5px solid #0A0A0A",
                    padding: 12,
                    boxShadow: "3px 3px 0 #0A0A0A",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "Plus Jakarta Sans, sans-serif",
                        fontWeight: 900,
                        fontSize: 13,
                        textTransform: "uppercase",
                      }}
                    >
                      #{o.id.slice(-6).toUpperCase()} · {o.customerEmail}
                    </div>
                    <div
                      style={{
                        fontFamily: "Plus Jakarta Sans, sans-serif",
                        fontWeight: 900,
                        fontSize: 16,
                      }}
                    >
                      €{o.total.toFixed(2)}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      fontFamily: "Space Grotesk, monospace",
                      fontSize: 11,
                      color: "#666",
                      marginTop: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    <span>
                      Comisión:{" "}
                      <strong style={{ color: "#FF1744" }}>
                        €{o.commissionEarned.toFixed(2)}
                      </strong>
                    </span>
                    <span>{o.items?.length ?? 0} items</span>
                    <span>{new Date(o.createdAt).toLocaleDateString("es-ES")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#0A0A0A",
          color: "#A0A0A0",
          padding: "32px 24px",
          textAlign: "center",
          fontFamily: "Space Grotesk, monospace",
          fontSize: 11,
          textTransform: "uppercase",
          borderTop: "2.5px solid #1a1a1a",
          marginTop: "auto",
        }}
      >
        DROPES — Panel de agente · {agent?.agentCode}
      </footer>
    </main>
  );
}

// ─── Stat card ───────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  accent = "white",
}: {
  label: string;
  value: number | string;
  sub?: string;
  accent?: "white" | "yellow" | "red";
}) {
  const accentColor =
    accent === "yellow" ? "#FFDE00" : accent === "red" ? "#FF1744" : "#FAF9F5";
  return (
    <div
      style={{
        background: "#141414",
        border: "2.5px solid #0A0A0A",
        padding: 16,
        boxShadow: "4px 4px 0 #0A0A0A",
      }}
    >
      <div
        style={{
          fontFamily: "Space Grotesk, monospace",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "#A0A0A0",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontWeight: 900,
          fontSize: 28,
          color: accentColor,
          marginTop: 4,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: "Space Grotesk, monospace",
            fontSize: 10,
            color: "#666",
            marginTop: 4,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

// ─── Panel ──────────────────────────────────────────────────────────
function Panel({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#141414",
        border: "2.5px solid #0A0A0A",
        padding: 20,
        boxShadow: "6px 6px 0 #FF1744",
      }}
    >
      {eyebrow && (
        <div
          style={{
            fontFamily: "Space Grotesk, monospace",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "#FFDE00",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          {eyebrow}
        </div>
      )}
      <h2
        style={{
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontWeight: 900,
          fontSize: 22,
          textTransform: "uppercase",
          letterSpacing: "-0.02em",
          margin: "0 0 16px",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

// ─── Marketing Kit (live fetch) ──────────────────────────────────────
function MarketingKit({ agentCode }: { agentCode: string }) {
  const [kit, setKit] = useState<any>(null);

  useEffect(() => {
    if (!agentCode) return;
    fetch("/api/mcp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: { name: "get_marketing_kit", arguments: { agentCode } },
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json?.result) setKit(json.result);
      })
      .catch(() => {});
  }, [agentCode]);

  return (
    <Panel title="KIT DE MARKETING" eyebrow="PLANTILLAS Y COPIES">
      {!kit ? (
        <EmptyState text="Cargando kit de marketing…" />
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {kit.copy &&
            Object.entries(kit.copy).map(([ch, copy]: any) => (
              <div
                key={ch}
                style={{
                  background: "white",
                  color: "#0A0A0A",
                  border: "2.5px solid #0A0A0A",
                  padding: 12,
                  boxShadow: "3px 3px 0 #0A0A0A",
                }}
              >
                <div
                  style={{
                    fontFamily: "Space Grotesk, monospace",
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#FF1744",
                    marginBottom: 4,
                  }}
                >
                  {ch}
                </div>
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  {copy}
                </div>
              </div>
            ))}
          {kit.recommendedProducts && (
            <div
              style={{
                background: "white",
                color: "#0A0A0A",
                border: "2.5px solid #0A0A0A",
                padding: 12,
                boxShadow: "3px 3px 0 #0A0A0A",
              }}
            >
              <div
                style={{
                  fontFamily: "Space Grotesk, monospace",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#FF1744",
                  marginBottom: 8,
                }}
              >
                PRODUCTOS RECOMENDADOS
              </div>
              {kit.recommendedProducts.map((p: any) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "Space Grotesk, monospace",
                    fontSize: 12,
                    padding: "4px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <span style={{ flex: 1, marginRight: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.name}
                  </span>
                  <span style={{ fontWeight: 700 }}>
                    €{p.priceNow} · +€{p.commission}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: "#FFDE00",
    contacted: "#3B82F6",
    reminded: "#A855F7",
    converted: "#10B981",
    lost: "#FF1744",
  };
  const bg = colors[status] ?? "#A0A0A0";
  return (
    <span
      style={{
        background: bg,
        color: "#0A0A0A",
        border: "2.5px solid #0A0A0A",
        padding: "4px 8px",
        fontFamily: "Space Grotesk, monospace",
        fontSize: 10,
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: 24,
        textAlign: "center",
        fontFamily: "Space Grotesk, monospace",
        fontSize: 12,
        color: "#A0A0A0",
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        color: "#FAF9F5",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontWeight: 900,
          fontSize: 32,
          textTransform: "uppercase",
          color: "#FFDE00",
          letterSpacing: "-0.02em",
        }}
      >
        CARGANDO PANEL…
      </div>
    </main>
  );
}

// ─── Centered error message ──────────────────────────────────────────
function CenteredMessage({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta: { label: string; href: string };
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        color: "#FAF9F5",
        fontFamily: "Inter, system-ui, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      <div
        style={{
          background: "#FAF9F5",
          color: "#0A0A0A",
          border: "2.5px solid #0A0A0A",
          padding: 32,
          boxShadow: "8px 8px 0 #FF1744",
          textAlign: "center",
          maxWidth: 400,
        }}
      >
        <h1
          style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 900,
            fontSize: 28,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            margin: "0 0 12px",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontFamily: "Space Grotesk, monospace",
            fontSize: 13,
            color: "#666",
            marginBottom: 24,
          }}
        >
          {body}
        </p>
        <Link
          href={cta.href}
          style={{
            display: "inline-block",
            background: "#FF1744",
            color: "white",
            border: "2.5px solid #0A0A0A",
            padding: "14px 24px",
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 900,
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            textDecoration: "none",
            boxShadow: "4px 4px 0 #0A0A0A",
          }}
        >
          {cta.label}
        </Link>
      </div>
    </main>
  );
}
