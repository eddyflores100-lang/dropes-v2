"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import productsData from "@/data/products.json";
import type { Product } from "@/lib/types";

const ALL_PRODUCTS = productsData as Product[];

function parsePrice(value: string | number | undefined | null): number {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const n = parseFloat(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export default function AdminProductosPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [tick, setTick] = useState(0); // force re-render after catalog changes

  useEffect(() => {
    fetch("/api/products/sync", { cache: "no-store" })
      .then((r) => r.json())
      .then(setSyncStatus)
      .catch(() => {});
  }, [tick]);

  const categories = useMemo(
    () => Array.from(new Set(ALL_PRODUCTS.map((p) => p.category))).sort(),
    [tick]
  );

  const filtered = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => {
      if (category && p.category !== category) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.tag?.toLowerCase().includes(q)
      );
    });
  }, [search, category, tick]);

  const totals = useMemo(() => {
    const revenue = filtered.reduce((acc, p) => acc + parsePrice(p.priceNow), 0);
    const cost = filtered.reduce((acc, p) => acc + parsePrice(p.original_cost), 0);
    const profit = filtered.reduce((acc, p) => acc + parsePrice(p.profit), 0);
    const commission = profit * 0.1;
    const avgMargin =
      revenue > 0 ? (profit / revenue) * 100 : 0;
    return { revenue, cost, profit, commission, avgMargin };
  }, [filtered]);

  const triggerSync = async () => {
    setSyncing(true);
    try {
      const secret = process.env.NEXT_PUBLIC_CRON_SECRET || "dropes_cron_secret_0000";
      const res = await fetch("/api/products/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secret}`,
        },
      });
      const json = await res.json();
      if (json.ok) {
        alert(`Catálogo sincronizado: ${json.synced} productos`);
        // Force reload of the JSON module (best-effort via reload)
        window.location.reload();
      } else {
        alert("Error: " + json.error);
      }
    } catch (err: any) {
      alert("Error: " + err?.message);
    } finally {
      setSyncing(false);
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
      <Header />

      <section style={{ padding: "32px 24px 0", maxWidth: 1400, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
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
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              ◆ ADMIN · CATÁLOGO
            </span>
            <h1
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(32px, 5vw, 56px)",
                textTransform: "uppercase",
                letterSpacing: "-0.03em",
                margin: "12px 0 0",
                lineHeight: 1,
              }}
            >
              GESTIÓN DE PRODUCTOS
            </h1>
          </div>
          <button
            onClick={triggerSync}
            disabled={syncing}
            style={{
              background: "#FF1744",
              color: "white",
              border: "2.5px solid #0A0A0A",
              padding: "12px 18px",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontWeight: 900,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              cursor: syncing ? "wait" : "pointer",
              boxShadow: "4px 4px 0 #FFDE00",
              opacity: syncing ? 0.6 : 1,
            }}
          >
            {syncing ? "SINCRONIZANDO…" : "↻ SYNC DESDE DROPEA V1"}
          </button>
        </div>

        {/* Sync status */}
        {syncStatus && (
          <div
            style={{
              background: "#141414",
              border: "2.5px solid #FFDE00",
              padding: 16,
              marginTop: 24,
              fontFamily: "Space Grotesk, monospace",
              fontSize: 12,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 10, color: "#A0A0A0", textTransform: "uppercase" }}>SOURCE</div>
              <div style={{ color: "#FFDE00", fontWeight: 700 }}>{syncStatus.source}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#A0A0A0", textTransform: "uppercase" }}>PRODUCTOS</div>
              <div style={{ color: "#FFDE00", fontWeight: 700 }}>{syncStatus.catalog?.count ?? 0}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#A0A0A0", textTransform: "uppercase" }}>LAST MOD</div>
              <div style={{ color: "#FFDE00", fontWeight: 700 }}>
                {syncStatus.catalog?.lastModified
                  ? new Date(syncStatus.catalog.lastModified).toLocaleString("es-ES")
                  : "—"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#A0A0A0", textTransform: "uppercase" }}>FORMULA</div>
              <div style={{ color: "#FFDE00", fontWeight: 700, fontSize: 10 }}>
                {syncStatus.pricing?.formula}
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            marginTop: 24,
          }}
        >
          <StatBox label="PRODUCTOS" value={String(filtered.length)} />
          <StatBox label="INGRESO TOTAL" value={`€${totals.revenue.toFixed(2)}`} />
          <StatBox label="COSTE TOTAL" value={`€${totals.cost.toFixed(2)}`} />
          <StatBox label="BENEFICIO TOTAL" value={`€${totals.profit.toFixed(2)}`} accent="yellow" />
          <StatBox label="MARGEN MEDIO" value={`${totals.avgMargin.toFixed(1)}%`} accent="yellow" />
          <StatBox label="COMISIÓN AGENTES" value={`€${totals.commission.toFixed(2)}`} accent="red" />
        </div>

        {/* Formula explanation */}
        <div
          style={{
            background: "#FAF9F5",
            color: "#0A0A0A",
            border: "2.5px solid #0A0A0A",
            padding: 16,
            marginTop: 24,
            boxShadow: "4px 4px 0 #FFDE00",
            fontFamily: "Space Grotesk, monospace",
            fontSize: 12,
          }}
        >
          <strong style={{ textTransform: "uppercase", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            📐 Fórmula de precio (85% margen):
          </strong>{" "}
          sellPrice = round2(cost / (1 - 0.85)) = cost × 6.667 · profit = sellPrice - cost ·
          commission10% = profit × 0.10
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="BUSCAR PRODUCTO POR NOMBRE, ID, TAG…"
            style={{
              flex: 1,
              minWidth: 200,
              background: "#141414",
              color: "#FAF9F5",
              border: "2.5px solid #FFDE00",
              padding: "12px",
              fontFamily: "Space Grotesk, monospace",
              fontSize: 12,
              textTransform: "uppercase",
              outline: "none",
            }}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              background: "#141414",
              color: "#FAF9F5",
              border: "2.5px solid #FFDE00",
              padding: "12px",
              fontFamily: "Space Grotesk, monospace",
              fontSize: 12,
              textTransform: "uppercase",
              outline: "none",
            }}
          >
            <option value="">TODAS CATEGORÍAS</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Product table */}
      <section style={{ padding: "32px 24px", maxWidth: 1400, margin: "0 auto", width: "100%" }}>
        <div
          style={{
            background: "#141414",
            border: "2.5px solid #0A0A0A",
            boxShadow: "6px 6px 0 #FF1744",
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ background: "#FFDE00", color: "#0A0A0A" }}>
                {["ID", "PRODUCTO", "CATEGORÍA", "COSTE", "PRECIO", "MARGEN", "BENEFICIO", "COMISIÓN 10%", "TAG"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      fontFamily: "Space Grotesk, monospace",
                      fontSize: 10,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      borderRight: "2.5px solid #0A0A0A",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 200).map((p) => {
                const cost = parsePrice(p.original_cost);
                const sell = parsePrice(p.priceNow);
                const profit = parsePrice(p.profit);
                const margin = sell > 0 ? (profit / sell) * 100 : 0;
                const commission = profit * 0.1;
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #2a2a2a" }}>
                    <td style={{ padding: "8px 10px", fontFamily: "Space Grotesk, monospace", fontSize: 11, color: "#FFDE00" }}>
                      {p.id}
                    </td>
                    <td style={{ padding: "8px 10px", fontSize: 11, maxWidth: 240 }}>
                      <div style={{ fontWeight: 700, lineHeight: 1.3 }}>
                        {p.name.slice(0, 60)}
                        {p.name.length > 60 ? "…" : ""}
                      </div>
                      <div style={{ fontSize: 10, color: "#A0A0A0", fontFamily: "Space Grotesk, monospace" }}>
                        {p.stars}★ · {p.reviews}
                      </div>
                    </td>
                    <td style={{ padding: "8px 10px", fontFamily: "Space Grotesk, monospace", fontSize: 11, color: "#A0A0A0" }}>
                      {p.category}
                    </td>
                    <td style={{ padding: "8px 10px", fontFamily: "Space Grotesk, monospace", fontSize: 11, color: "#A0A0A0" }}>
                      €{cost.toFixed(2)}
                    </td>
                    <td style={{ padding: "8px 10px", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 900, fontSize: 13 }}>
                      €{sell.toFixed(2)}
                    </td>
                    <td style={{ padding: "8px 10px", fontFamily: "Space Grotesk, monospace", fontSize: 11, color: "#FFDE00" }}>
                      {margin.toFixed(1)}%
                    </td>
                    <td style={{ padding: "8px 10px", fontFamily: "Space Grotesk, monospace", fontSize: 11, color: "#10B981", fontWeight: 700 }}>
                      €{profit.toFixed(2)}
                    </td>
                    <td style={{ padding: "8px 10px", fontFamily: "Space Grotesk, monospace", fontSize: 11, color: "#FF1744", fontWeight: 700 }}>
                      €{commission.toFixed(2)}
                    </td>
                    <td style={{ padding: "8px 10px" }}>
                      {p.tag && (
                        <span
                          style={{
                            background: "#FF1744",
                            color: "white",
                            border: "2.5px solid #0A0A0A",
                            padding: "2px 6px",
                            fontFamily: "Space Grotesk, monospace",
                            fontSize: 9,
                            fontWeight: 900,
                            textTransform: "uppercase",
                          }}
                        >
                          {p.tag}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length > 200 && (
            <div
              style={{
                padding: 12,
                textAlign: "center",
                fontFamily: "Space Grotesk, monospace",
                fontSize: 11,
                color: "#A0A0A0",
                textTransform: "uppercase",
                borderTop: "1px solid #2a2a2a",
              }}
            >
              Mostrando 200 de {filtered.length}. Aplica filtros para reducir la lista.
            </div>
          )}
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
        DROPES · Admin panel · Catálogo {ALL_PRODUCTS.length} productos
      </footer>
    </main>
  );
}

function StatBox({
  label,
  value,
  accent = "white",
}: {
  label: string;
  value: string;
  accent?: "white" | "yellow" | "red";
}) {
  const color =
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
          fontSize: 22,
          color,
          marginTop: 4,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Header() {
  return (
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
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Link
          href="/admin/pedidos"
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
          Pedidos
        </Link>
        <Link
          href="/admin/productos"
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
          Productos
        </Link>
      </div>
    </header>
  );
}
