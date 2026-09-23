"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface BrutalCardProps {
  title: string;
  desc: string;
  num: string;
  bg?: string;
}

const STATS = [
  { num: "10%", label: "COMISIÓN POR VENTA" },
  { num: "€18", label: "COMISIÓN MEDIA" },
  { num: "200+", label: "PRODUCTOS DISPONIBLES" },
  { num: "30 días", label: "COOKIE DE ATRIBUCIÓN" },
];

const STEPS = [
  {
    num: "01",
    title: "REGÍSTRATE",
    desc: "Crea tu cuenta de agente en menos de 2 minutos. Recibirás tu código DROPES-XXXX único.",
  },
  {
    num: "02",
    title: "COMPARTE",
    desc: "Difunde tus productos favoritos en Instagram, TikTok, WhatsApp o tu blog con tu enlace de referido.",
  },
  {
    num: "03",
    title: "GANA",
    desc: "Cada venta confirmada desde tu enlace acumula comisión en tu panel. Cobro mensual garantizado.",
  },
];

const BENEFITS = [
  {
    title: "SIN INVENTARIO",
    desc: "Nosotros almacenamos y enviamos. Tú solo compartes y cobras.",
  },
  {
    title: "SIN INVERSIÓN",
    desc: "Arranca hoy mismo sin gastar un euro. Sin cuotas, sin mínimos.",
  },
  {
    title: "PAGO CONTRA REEMBOLSO",
    desc: "El cliente paga al recibir. Más conversión, menos fricción.",
  },
  {
    title: "ENVÍO 24-48H",
    desc: "España y Portugal. Tus seguidores reciben al instante.",
  },
  {
    title: "KIT DE MARKETING",
    desc: "Copys, plantillas y productos top listos para publicar.",
  },
  {
    title: "PANEL EN TIEMPO REAL",
    desc: "Clicks, leads, ventas y comisiones actualizadas al instante.",
  },
];

export default function AgentesLandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
      <Hero />
      <Stats />
      <Steps />
      <Benefits />
      <CommissionBlock />
      <FinalCTA />
      <Footer />
      {mounted && <CookieHint />}
    </main>
  );
}

// ─── Hero ───────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      style={{
        position: "relative",
        padding: "120px 24px 80px",
        borderBottom: "2.5px solid #FF1744",
        background:
          "radial-gradient(circle at top right, rgba(255,23,68,0.18) 0%, transparent 60%), #0A0A0A",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <span
          style={{
            display: "inline-block",
            background: "#FFDE00",
            color: "#0A0A0A",
            border: "2.5px solid #0A0A0A",
            padding: "6px 14px",
            fontFamily: "Space Grotesk, monospace",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            boxShadow: "4px 4px 0 #FAF9F5",
            marginBottom: 28,
          }}
        >
          ◆ PROGRAMA DE AGENTES DROPES
        </span>
        <h1
          style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(40px, 8vw, 96px)",
            lineHeight: 0.95,
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          GANA DINERO
          <br />
          <span style={{ color: "#FF1744" }}>COMPARTIENDO</span>
          <br />
          PRODUCTOS <span style={{ color: "#FFDE00" }}>VIRALES</span>
        </h1>
        <p
          style={{
            fontFamily: "Space Grotesk, monospace",
            fontSize: "clamp(14px, 2vw, 18px)",
            color: "#A0A0A0",
            margin: "32px auto 40px",
            maxWidth: 640,
            lineHeight: 1.5,
          }}
        >
          Únete al programa de agentes DROPES. Comparte productos top, gana
          comisión por cada venta confirmada. Sin inventario, sin inversión,
          sin límites.
        </p>
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
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
              boxShadow: "6px 6px 0 #FAF9F5",
              transition: "transform .1s ease, box-shadow .1s ease",
            }}
          >
            EMPEZAR AHORA →
          </Link>
          <Link
            href="/agentes/login"
            style={{
              display: "inline-block",
              background: "transparent",
              color: "#FAF9F5",
              border: "2.5px solid #FAF9F5",
              padding: "18px 36px",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontWeight: 900,
              fontSize: 16,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              textDecoration: "none",
            }}
          >
            YA TENGO CUENTA
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Stats ──────────────────────────────────────────────────────────
function Stats() {
  return (
    <section
      style={{
        background: "#FAF9F5",
        color: "#0A0A0A",
        padding: "48px 24px",
        borderBottom: "2.5px solid #0A0A0A",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            style={{
              background: "white",
              border: "2.5px solid #0A0A0A",
              padding: 24,
              boxShadow: "4px 4px 0 #0A0A0A",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(32px, 6vw, 56px)",
                lineHeight: 1,
                color: "#FF1744",
              }}
            >
              {s.num}
            </div>
            <div
              style={{
                fontFamily: "Space Grotesk, monospace",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.1em",
                marginTop: 8,
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Steps ──────────────────────────────────────────────────────────
function Steps() {
  return (
    <section style={{ padding: "80px 24px" }}>
      <SectionHeader eyebrow="CÓMO FUNCIONA" title="TRES PASOS. UN INGRESO." />
      <div
        style={{
          maxWidth: 1200,
          margin: "40px auto 0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}
      >
        {STEPS.map((s) => (
          <div
            key={s.num}
            style={{
              background: "#141414",
              border: "2.5px solid #FFDE00",
              padding: 32,
              boxShadow: "6px 6px 0 #FFDE00",
            }}
          >
            <div
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontWeight: 900,
                fontSize: 64,
                lineHeight: 1,
                color: "#FFDE00",
                marginBottom: 16,
              }}
            >
              {s.num}
            </div>
            <h3
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontWeight: 900,
                fontSize: 24,
                textTransform: "uppercase",
                margin: "0 0 12px",
                letterSpacing: "-0.02em",
              }}
            >
              {s.title}
            </h3>
            <p
              style={{
                fontFamily: "Space Grotesk, monospace",
                fontSize: 14,
                color: "#A0A0A0",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Benefits ─────────────────────────────────────────────────────────
function Benefits() {
  return (
    <section
      style={{
        background: "#FAF9F5",
        color: "#0A0A0A",
        padding: "80px 24px",
      }}
    >
      <SectionHeader
        eyebrow="BENEFICIOS"
        title="TODO LO QUE NECESITAS PARA EMPEZAR"
        onLight
      />
      <div
        style={{
          maxWidth: 1200,
          margin: "40px auto 0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {BENEFITS.map((b, i) => (
          <BrutalCard
            key={b.title}
            num={String(i + 1).padStart(2, "0")}
            title={b.title}
            desc={b.desc}
            bg={i % 2 === 0 ? "white" : "#FFDE00"}
          />
        ))}
      </div>
    </section>
  );
}

function BrutalCard({ num, title, desc, bg = "white" }: BrutalCardProps) {
  return (
    <div
      style={{
        background: bg,
        border: "2.5px solid #0A0A0A",
        padding: 24,
        boxShadow: "4px 4px 0 #0A0A0A",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontFamily: "Space Grotesk, monospace",
          fontWeight: 900,
          fontSize: 12,
          color: "#FF1744",
          marginBottom: 12,
        }}
      >
        {num}
      </div>
      <h3
        style={{
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontWeight: 900,
          fontSize: 20,
          textTransform: "uppercase",
          letterSpacing: "-0.02em",
          margin: "0 0 8px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "Space Grotesk, monospace",
          fontSize: 13,
          color: "#444",
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

// ─── Commission block ───────────────────────────────────────────────
function CommissionBlock() {
  return (
    <section style={{ padding: "80px 24px" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          background: "#FF1744",
          color: "white",
          border: "2.5px solid #0A0A0A",
          padding: 48,
          boxShadow: "8px 8px 0 #FFDE00",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "Space Grotesk, monospace",
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          FÓRMULA DE COMISIÓN
        </span>
        <h2
          style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(36px, 6vw, 72px)",
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
            margin: "16px 0",
          }}
        >
          10% DE CADA VENTA
        </h2>
        <p
          style={{
            fontFamily: "Space Grotesk, monospace",
            fontSize: 16,
            margin: "0 auto 24px",
            maxWidth: 640,
            lineHeight: 1.6,
            opacity: 0.9,
          }}
        >
          Producto vendido a 99€ → <strong>9.90€</strong> de comisión para ti.
          Producto premium a 399€ → <strong>39.90€</strong>. Sin techos, sin
          límites. Las comisiones se acreditan al confirmarse la entrega y se
          pagan mensualmente.
        </p>
        <Link
          href="/agentes/registro"
          style={{
            display: "inline-block",
            background: "#0A0A0A",
            color: "white",
            border: "2.5px solid #0A0A0A",
            padding: "18px 36px",
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 900,
            fontSize: 16,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            textDecoration: "none",
            boxShadow: "4px 4px 0 white",
          }}
        >
          RECLAMAR MI CÓDIGO →
        </Link>
      </div>
    </section>
  );
}

// ─── Final CTA ──────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section
      style={{
        padding: "80px 24px",
        borderTop: "2.5px solid #0A0A0A",
        background:
          "linear-gradient(135deg, #FFDE00 0%, #FF1744 100%)",
        color: "#0A0A0A",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(36px, 6vw, 64px)",
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
            margin: 0,
            lineHeight: 1,
          }}
        >
          ¿LIST@ PARA EMPEZAR?
        </h2>
        <p
          style={{
            fontFamily: "Space Grotesk, monospace",
            fontSize: 16,
            margin: "16px 0 32px",
          }}
        >
          Tu audiencia te espera. Tu primer pago a 30 días.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/agentes/registro"
            style={{
              display: "inline-block",
              background: "#0A0A0A",
              color: "white",
              border: "2.5px solid #0A0A0A",
              padding: "18px 36px",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontWeight: 900,
              fontSize: 16,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              textDecoration: "none",
              boxShadow: "4px 4px 0 #FAF9F5",
            }}
          >
            CREAR CUENTA
          </Link>
          <Link
            href="/opportunity"
            style={{
              display: "inline-block",
              background: "transparent",
              color: "#0A0A0A",
              border: "2.5px solid #0A0A0A",
              padding: "18px 36px",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontWeight: 900,
              fontSize: 16,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              textDecoration: "none",
            }}
          >
            VER OPORTUNIDAD MCP
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Section Header ──────────────────────────────────────────────────
function SectionHeader({
  eyebrow,
  title,
  onLight,
}: {
  eyebrow: string;
  title: string;
  onLight?: boolean;
}) {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
      <span
        style={{
          display: "inline-block",
          background: onLight ? "#0A0A0A" : "#FFDE00",
          color: onLight ? "#FFDE00" : "#0A0A0A",
          border: "2.5px solid #0A0A0A",
          padding: "6px 14px",
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
          fontSize: "clamp(28px, 5vw, 56px)",
          textTransform: "uppercase",
          letterSpacing: "-0.03em",
          margin: "20px 0 0",
          lineHeight: 1,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

// ─── Footer (sticky bottom) ───────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        background: "#0A0A0A",
        color: "#FAF9F5",
        padding: "32px 24px",
        borderTop: "2.5px solid #FF1744",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontWeight: 900,
              fontSize: 24,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            DROPES<span style={{ color: "#FF1744" }}>.</span>
          </div>
          <p
            style={{
              fontFamily: "Space Grotesk, monospace",
              fontSize: 11,
              color: "#A0A0A0",
              margin: "4px 0 0",
              textTransform: "uppercase",
            }}
          >
            PROGRAMA DE AGENTES · 2025
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            fontFamily: "Space Grotesk, monospace",
            fontSize: 12,
            textTransform: "uppercase",
          }}
        >
          <Link href="/" style={{ color: "#FAF9F5", textDecoration: "none" }}>
            Tienda
          </Link>
          <Link href="/agentes/login" style={{ color: "#FAF9F5", textDecoration: "none" }}>
            Login
          </Link>
          <Link href="/opportunity" style={{ color: "#FAF9F5", textDecoration: "none" }}>
            MCP
          </Link>
        </div>
      </div>
    </footer>
  );
}

// ─── Cookie hint ──────────────────────────────────────────────────────
function CookieHint() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        right: 16,
        background: "#FFDE00",
        color: "#0A0A0A",
        border: "2.5px solid #0A0A0A",
        padding: 16,
        fontFamily: "Space Grotesk, monospace",
        fontSize: 11,
        textTransform: "uppercase",
        boxShadow: "4px 4px 0 #0A0A0A",
        maxWidth: 400,
        margin: "0 auto",
      }}
    >
      ⚡ Si llegaste con un enlace de referido (ref=DROPES-XXXX), tu cookie de
      atribución ya está activa por 30 días.
    </div>
  );
}
