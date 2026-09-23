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

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/agents/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.ok) {
        toast.error(json.error || "Credenciales inválidas");
        return;
      }
      toast.success("Bienvenid@ " + json.agent.name);
      router.push("/agentes/dashboard");
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
      }}
    >
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
            maxWidth: 480,
            background: "#FAF9F5",
            color: "#0A0A0A",
            border: "2.5px solid #0A0A0A",
            boxShadow: "12px 12px 0 #FF1744",
          }}
        >
          <div style={{ padding: "32px 32px 0" }}>
            <span
              style={{
                display: "inline-block",
                background: "#FFDE00",
                color: "#0A0A0A",
                border: "2.5px solid #0A0A0A",
                padding: "6px 12px",
                fontFamily: "Space Grotesk, monospace",
                fontWeight: 700,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              ◆ Acceso agentes
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
              INICIAR SESIÓN
            </h1>
            <p
              style={{
                fontFamily: "Space Grotesk, monospace",
                fontSize: 13,
                color: "#666",
                margin: 0,
              }}
            >
              Accede a tu panel de agente.
            </p>
          </div>

          <form onSubmit={submit} style={{ padding: 32, display: "grid", gap: 16 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
                placeholder="TU@EMAIL.COM"
                autoComplete="email"
              />
            </div>
            <div>
              <label style={labelStyle}>Contraseña</label>
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={inputStyle}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8,
                width: "100%",
                background: "#0A0A0A",
                color: "white",
                border: "2.5px solid #0A0A0A",
                padding: "18px",
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontWeight: 900,
                fontSize: 16,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: loading ? "wait" : "pointer",
                boxShadow: "4px 4px 0 #FF1744",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "ENTRANDO…" : "ENTRAR →"}
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
              ¿Aún no eres agente?{" "}
              <Link
                href="/agentes/registro"
                style={{
                  color: "#FF1744",
                  fontWeight: 900,
                  textDecoration: "none",
                }}
              >
                Regístrate aquí
              </Link>
            </p>
          </form>
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
        }}
      >
        © 2025 DROPES — Programa de agentes
      </footer>
    </main>
  );
}
