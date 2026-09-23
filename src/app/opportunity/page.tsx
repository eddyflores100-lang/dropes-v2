"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function OpportunityPage() {
  const [opp, setOpp] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [tool, setTool] = useState("discover_opportunity");
  const [args, setArgs] = useState("{}");

  useEffect(() => {
    fetch("/api/opportunity", { cache: "no-store" })
      .then((r) => r.json())
      .then(setOpp)
      .catch(() => {});
  }, []);

  const invoke = async () => {
    let parsed: any = {};
    try {
      parsed = JSON.parse(args || "{}");
    } catch {
      parsed = {};
    }
    const res = await fetch("/api/mcp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/call",
        params: { name: tool, arguments: parsed },
      }),
    });
    const json = await res.json();
    setResult(json);
  };

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
      <Header />

      {/* Hero */}
      <section
        style={{
          padding: "80px 24px 48px",
          borderBottom: "2.5px solid #FFDE00",
          background:
            "radial-gradient(circle at top left, rgba(255,222,0,0.15) 0%, transparent 50%), #0A0A0A",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <span
            style={{
              display: "inline-block",
              background: "#FF1744",
              color: "white",
              border: "2.5px solid #0A0A0A",
              padding: "6px 14px",
              fontFamily: "Space Grotesk, monospace",
              fontWeight: 700,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              boxShadow: "4px 4px 0 #FFDE00",
            }}
          >
            ◆ Model Context Protocol (MCP)
          </span>
          <h1
            style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(40px, 8vw, 88px)",
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
              margin: "20px 0 16px",
            }}
          >
            CONECTA TU AI
            <br />
            <span style={{ color: "#FFDE00" }}>A DROPES</span>
          </h1>
          <p
            style={{
              fontFamily: "Space Grotesk, monospace",
              fontSize: 16,
              color: "#A0A0A0",
              maxWidth: 640,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Una API basada en JSON-RPC 2.0. Diseñada para que cualquier LLM,
            agente o automatización pueda descubrir la oportunidad, registrar
            agentes, leer el catálogo y crear pedidos sin fricción.
          </p>
        </div>
      </section>

      {/* Opportunity card */}
      <section style={{ padding: "48px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <SectionHeader eyebrow="OPORTUNIDAD" title="TARJETA DE OPORTUNIDAD" />
          {!opp ? (
            <Skeleton />
          ) : (
            <div
              style={{
                background: "#FAF9F5",
                color: "#0A0A0A",
                border: "2.5px solid #0A0A0A",
                boxShadow: "8px 8px 0 #FF1744",
                marginTop: 24,
              }}
            >
              <div
                style={{
                  background: "#FFDE00",
                  borderBottom: "2.5px solid #0A0A0A",
                  padding: "16px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <strong
                  style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontWeight: 900,
                    fontSize: 18,
                    textTransform: "uppercase",
                  }}
                >
                  {opp.opportunity.title}
                </strong>
                <span
                  style={{
                    fontFamily: "Space Grotesk, monospace",
                    fontSize: 11,
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  {opp.commission.rate * 100}% COMISIÓN
                </span>
              </div>
              <div style={{ padding: 24 }}>
                <p
                  style={{
                    fontFamily: "Space Grotesk, monospace",
                    fontSize: 13,
                    color: "#444",
                    margin: "0 0 16px",
                  }}
                >
                  {opp.opportunity.description}
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: 12,
                  }}
                >
                  <Meta label="COMISIÓN MEDIA" value={`€${opp.commission.averagePerSale}`} />
                  <Meta label="COMISIÓN MÁX" value={`€${opp.commission.maxPerSale.toFixed(2)}`} />
                  <Meta label="CATÁLOGO" value={`${opp.catalog.total} productos`} />
                  <Meta label="COOKIE" value={`${opp.commission.cookieWindowDays} días`} />
                  <Meta label="PAGO" value={opp.commission.payoutSchedule} />
                  <Meta label="PAÍSES" value={opp.opportunity.countries.join(" / ")} />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Connection block */}
      <section style={{ padding: "0 24px 48px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <SectionHeader eyebrow="CONECTA" title="ENDPOINT MCP" />
          <div
            style={{
              background: "#141414",
              border: "2.5px solid #FFDE00",
              padding: 24,
              boxShadow: "6px 6px 0 #FFDE00",
              marginTop: 24,
            }}
          >
            <Row label="Protocolo" value={opp?.connection?.protocol} />
            <Row label="Transporte" value={opp?.connection?.transport} />
            <Row label="Endpoint" value={opp?.connection?.endpoint} mono />
            <Row label="Auth" value={opp?.connection?.auth} />
            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  fontFamily: "Space Grotesk, monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#FF1744",
                  marginBottom: 8,
                }}
              >
                HERRAMIENTAS DISPONIBLES
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {(opp?.connection?.tools ?? []).map((t: string) => (
                  <span
                    key={t}
                    style={{
                      background: "#0A0A0A",
                      color: "#FFDE00",
                      border: "2.5px solid #FFDE00",
                      padding: "4px 8px",
                      fontFamily: "Space Grotesk, monospace",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live tester */}
      <section style={{ padding: "0 24px 48px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <SectionHeader eyebrow="PROBAR" title="PROBAR HERRAMIENTA MCP" />
          <div
            style={{
              background: "#FAF9F5",
              color: "#0A0A0A",
              border: "2.5px solid #0A0A0A",
              boxShadow: "6px 6px 0 #FF1744",
              padding: 24,
              marginTop: 24,
            }}
          >
            <div style={{ display: "grid", gap: 12 }}>
              <label style={labelStyle}>
                HERRAMIENTA
                <select
                  value={tool}
                  onChange={(e) => setTool(e.target.value)}
                  style={inputStyle}
                >
                  {(opp?.connection?.tools ?? [
                    "discover_opportunity",
                    "register_agent",
                    "get_catalog",
                    "get_product_detail",
                    "get_marketing_kit",
                    "get_agent_stats",
                    "get_agent_leads",
                    "track_promotion",
                    "create_order",
                  ]).map((t: string) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label style={labelStyle}>
                ARGUMENTOS (JSON)
                <textarea
                  value={args}
                  onChange={(e) => setArgs(e.target.value)}
                  style={{ ...inputStyle, height: 100, resize: "vertical", fontFamily: "Space Grotesk, monospace" }}
                />
              </label>
              <button
                onClick={invoke}
                style={{
                  background: "#0A0A0A",
                  color: "white",
                  border: "2.5px solid #0A0A0A",
                  padding: "14px 24px",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: 900,
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  boxShadow: "4px 4px 0 #FF1744",
                }}
              >
                INVOCCAR TOOL →
              </button>
              {result && (
                <pre
                  style={{
                    background: "#0A0A0A",
                    color: "#FFDE00",
                    border: "2.5px solid #0A0A0A",
                    padding: 16,
                    fontFamily: "Space Grotesk, monospace",
                    fontSize: 12,
                    overflowX: "auto",
                    maxHeight: 320,
                  }}
                >
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Example payload */}
      <section style={{ padding: "0 24px 48px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <SectionHeader eyebrow="EJEMPLO" title="PETICIÓN JSON-RPC 2.0" />
          <pre
            style={{
              background: "#141414",
              color: "#FFDE00",
              border: "2.5px solid #FF1744",
              padding: 24,
              fontFamily: "Space Grotesk, monospace",
              fontSize: 13,
              lineHeight: 1.6,
              marginTop: 24,
              overflowX: "auto",
            }}
          >
{`POST /api/mcp
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "discover_opportunity",
    "arguments": {}
  }
}`}
          </pre>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: "0 24px 64px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <Link
            href="/agentes/registro"
            style={{
              display: "inline-block",
              background: "#FF1744",
              color: "white",
              border: "2.5px solid #0A0A0A",
              padding: "18px 36px",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontWeight: 900,
              fontSize: 16,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              textDecoration: "none",
              boxShadow: "6px 6px 0 #FFDE00",
            }}
          >
            REGÍSTRATE COMO AGENTE →
          </Link>
        </div>
      </section>

      <footer
        style={{
          background: "#0A0A0A",
          color: "#A0A0A0",
          padding: "24px",
          textAlign: "center",
          fontFamily: "Space Grotesk, monospace",
          fontSize: 11,
          textTransform: "uppercase",
          borderTop: "2.5px solid #1a1a1a",
          marginTop: "auto",
        }}
      >
        DROPES · MCP Server v1.0.0 · JSON-RPC 2.0
      </footer>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "Space Grotesk, monospace",
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  marginBottom: 6,
  color: "#666",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "white",
  border: "2.5px solid #0A0A0A",
  padding: "12px",
  fontFamily: "Plus Jakarta Sans, sans-serif",
  fontWeight: 700,
  fontSize: 14,
  textTransform: "uppercase",
  outline: "none",
};

function Header() {
  return (
    <header
      style={{
        padding: "16px 24px",
        borderBottom: "2.5px solid #FF1744",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
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
      <div style={{ display: "flex", gap: 8 }}>
        <Link
          href="/agentes"
          style={{
            fontFamily: "Space Grotesk, monospace",
            fontSize: 11,
            textTransform: "uppercase",
            color: "#FAF9F5",
            textDecoration: "none",
            border: "2.5px solid #FAF9F5",
            padding: "8px 12px",
          }}
        >
          Agentes
        </Link>
        <Link
          href="/agentes/registro"
          style={{
            fontFamily: "Space Grotesk, monospace",
            fontSize: 11,
            textTransform: "uppercase",
            color: "#FFDE00",
            textDecoration: "none",
            border: "2.5px solid #FFDE00",
            padding: "8px 12px",
          }}
        >
          Registro
        </Link>
      </div>
    </header>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <span
        style={{
          display: "inline-block",
          background: "#FFDE00",
          color: "#0A0A0A",
          border: "2.5px solid #0A0A0A",
          padding: "4px 10px",
          fontFamily: "Space Grotesk, monospace",
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        ◆ {eyebrow}
      </span>
      <h2
        style={{
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontWeight: 900,
          fontSize: "clamp(24px, 4vw, 40px)",
          textTransform: "uppercase",
          letterSpacing: "-0.03em",
          margin: "12px 0 0",
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "white",
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
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontWeight: 900,
          fontSize: 18,
          marginTop: 4,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px dashed #333",
        fontFamily: mono ? "Space Grotesk, monospace" : "Inter, sans-serif",
      }}
    >
      <span
        style={{
          fontFamily: "Space Grotesk, monospace",
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          color: "#A0A0A0",
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#FFDE00" }}>
        {value ?? "—"}
      </span>
    </div>
  );
}

function Skeleton() {
  return (
    <div
      style={{
        background: "#141414",
        border: "2.5px solid #FFDE00",
        padding: 24,
        marginTop: 24,
        fontFamily: "Space Grotesk, monospace",
        color: "#FFDE00",
        fontSize: 13,
        textTransform: "uppercase",
      }}
    >
      Cargando oportunidad…
    </div>
  );
}
