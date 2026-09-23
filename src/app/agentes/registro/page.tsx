"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "white",
  border: "2.5px solid #0A0A0A",
  padding: "14px",
  fontFamily: "Plus Jakarta Sans, sans-serif",
  fontWeight: 700,
  fontSize: 14,
  textTransform: "uppercase",
  outline: "none",
  boxShadow: "4px 4px 0 #0A0A0A",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "Space Grotesk, monospace",
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  marginBottom: 6,
  color: "#A0A0A0",
};

export default function RegistroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    instagram: "",
    tiktok: "",
    other: "",
  });
  const [result, setResult] = useState<null | {
    agentCode: string;
    referralLink: string;
  }>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const socialMedia = [
        form.instagram && `instagram:${form.instagram}`,
        form.tiktok && `tiktok:${form.tiktok}`,
        form.other,
      ]
        .filter(Boolean)
        .join("|");

      const res = await fetch("/api/agents/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          socialMedia: socialMedia || undefined,
        }),
      });
      const json = await res.json();
      if (!json.ok) {
        toast.error(json.error || "Error al registrar");
        return;
      }
      toast.success("¡Cuenta creada! Tu código es " + json.agentCode);
      setResult({
        agentCode: json.agentCode,
        referralLink: json.referralLink,
      });
      // Auto-redirect after short delay
      setTimeout(() => router.push("/agentes/login"), 3000);
    } catch (err: any) {
      toast.error("Error de red: " + err?.message);
    } finally {
      setLoading(false);
    }
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
        minHeight: "100vh",
      }}
    >
      <TopBar />

      <section
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 560,
            background: "#FAF9F5",
            color: "#0A0A0A",
            border: "2.5px solid #0A0A0A",
            boxShadow: "12px 12px 0 #FFDE00",
          }}
        >
          <div style={{ padding: "32px 32px 0" }}>
            <span
              style={{
                display: "inline-block",
                background: "#FF1744",
                color: "white",
                border: "2.5px solid #0A0A0A",
                padding: "6px 12px",
                fontFamily: "Space Grotesk, monospace",
                fontWeight: 700,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              ◆ Registro de agente
            </span>
            <h1
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontWeight: 900,
                fontSize: 40,
                textTransform: "uppercase",
                letterSpacing: "-0.03em",
                margin: "16px 0 8px",
                lineHeight: 1,
              }}
            >
              CREA TU CUENTA
            </h1>
            <p
              style={{
                fontFamily: "Space Grotesk, monospace",
                fontSize: 13,
                color: "#666",
                margin: 0,
              }}
            >
              Recibe tu código DROPES-XXXX único al instante.
            </p>
          </div>

          {result ? (
            <div style={{ padding: 32 }}>
              <div
                style={{
                  background: "#10B981",
                  color: "white",
                  border: "2.5px solid #0A0A0A",
                  padding: 24,
                  textAlign: "center",
                  boxShadow: "4px 4px 0 #0A0A0A",
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontWeight: 900,
                    fontSize: 24,
                    textTransform: "uppercase",
                  }}
                >
                  ✓ CUENTA CREADA
                </div>
              </div>
              <div
                style={{
                  background: "white",
                  border: "2.5px solid #0A0A0A",
                  padding: 20,
                  marginBottom: 16,
                  boxShadow: "4px 4px 0 #0A0A0A",
                }}
              >
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
                  TU CÓDIGO DE AGENTE
                </div>
                <div
                  style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontWeight: 900,
                    fontSize: 36,
                    letterSpacing: "0.02em",
                  }}
                >
                  {result.agentCode}
                </div>
              </div>
              <div
                style={{
                  background: "white",
                  border: "2.5px solid #0A0A0A",
                  padding: 20,
                  marginBottom: 24,
                  boxShadow: "4px 4px 0 #0A0A0A",
                  fontFamily: "Space Grotesk, monospace",
                  fontSize: 13,
                  wordBreak: "break-all",
                }}
                >
                <strong>Enlace de referido:</strong>
                <br />
                {typeof window !== "undefined" ? window.location.origin : ""}
                {result.referralLink}
                </div>
              <p
                style={{
                  fontFamily: "Space Grotesk, monospace",
                  fontSize: 12,
                  color: "#666",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                Redirigiéndote al login en 3 segundos…
              </p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ padding: 32, display: "grid", gap: 16 }}>
              <div>
                <label style={labelStyle}>Nombre completo *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                  placeholder="Ej. MARÍA LÓPEZ"
                />
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                  placeholder="TU@EMAIL.COM"
                />
              </div>
              <div>
                <label style={labelStyle}>Teléfono</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={inputStyle}
                  placeholder="+34 6XX XXX XXX"
                />
              </div>
              <div>
                <label style={labelStyle}>Contraseña * (mín 6 chars)</label>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={inputStyle}
                  placeholder="••••••••"
                />
              </div>
              <div
                style={{
                  borderTop: "2.5px solid #0A0A0A",
                  marginTop: 8,
                  paddingTop: 16,
                }}
              >
                <div
                  style={{
                    fontFamily: "Space Grotesk, monospace",
                    fontWeight: 900,
                    fontSize: 11,
                    textTransform: "uppercase",
                    marginBottom: 12,
                    color: "#FF1744",
                  }}
                >
                  Redes sociales (opcional)
                </div>
                <div style={{ display: "grid", gap: 12 }}>
                  <input
                    value={form.instagram}
                    onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                    style={inputStyle}
                    placeholder="@INSTAGRAM"
                  />
                  <input
                    value={form.tiktok}
                    onChange={(e) => setForm({ ...form, tiktok: e.target.value })}
                    style={inputStyle}
                    placeholder="@TIKTOK"
                  />
                  <input
                    value={form.other}
                    onChange={(e) => setForm({ ...form, other: e.target.value })}
                    style={inputStyle}
                    placeholder="BLOG / YOUTUBE / OTRO"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 8,
                  width: "100%",
                  background: "#FF1744",
                  color: "white",
                  border: "2.5px solid #0A0A0A",
                  padding: "18px",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: 900,
                  fontSize: 16,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  cursor: loading ? "wait" : "pointer",
                  boxShadow: "4px 4px 0 #0A0A0A",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "CREANDO…" : "CREAR MI CUENTA →"}
              </button>
              <p
                style={{
                  fontFamily: "Space Grotesk, monospace",
                  fontSize: 11,
                  color: "#666",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                ¿Ya tienes cuenta?{" "}
                <Link
                  href="/agentes/login"
                  style={{
                    color: "#FF1744",
                    fontWeight: 900,
                    textDecoration: "none",
                  }}
                >
                  Inicia sesión
                </Link>
              </p>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function TopBar() {
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
      <Link
        href="/agentes"
        style={{
          fontFamily: "Space Grotesk, monospace",
          fontSize: 12,
          textTransform: "uppercase",
          color: "#FFDE00",
          textDecoration: "none",
          border: "2.5px solid #FFDE00",
          padding: "8px 14px",
        }}
      >
        ← Volver
      </Link>
    </header>
  );
}

function Footer() {
  return (
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
      © 2025 DROPES — Programa de agentes
    </footer>
  );
}
