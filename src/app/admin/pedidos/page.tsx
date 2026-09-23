"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface Order {
  id: string;
  partnerOrderId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  customerCity: string | null;
  customerCountry: string | null;
  total: number;
  paymentMethod: string;
  status: string;
  apiSource: string | null;
  agentCode: string | null;
  commissionEarned: number;
  createdAt: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    priceNow: number;
  }>;
}

const STATUSES = ["pending", "confirmed", "failed", "synced", "cancelled"];

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/orders", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setOrders(json.orders);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter && o.status !== statusFilter) return false;
      if (!filter) return true;
      const q = filter.toLowerCase();
      return (
        o.customerName?.toLowerCase().includes(q) ||
        o.customerEmail?.toLowerCase().includes(q) ||
        o.agentCode?.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
      );
    });
  }, [orders, filter, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json();
      if (json.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status } : o))
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const exportData = (format: "json" | "csv") => {
    const blob = new Blob([format === "csv" ? toCSV(filtered) : JSON.stringify(filtered, null, 2)], {
      type: format === "csv" ? "text/csv" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedidos-dropes-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totals = useMemo(() => {
    return {
      count: filtered.length,
      revenue: filtered.reduce((acc, o) => acc + o.total, 0),
      commission: filtered.reduce((acc, o) => acc + o.commissionEarned, 0),
    };
  }, [filtered]);

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
              ◆ ADMIN · PEDIDOS
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
              GESTIÓN DE PEDIDOS
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() => exportData("csv")}
              style={exportBtnStyle}
            >
              ↓ CSV
            </button>
            <button
              onClick={() => exportData("json")}
              style={exportBtnStyle}
            >
              ↓ JSON
            </button>
            <button
              onClick={load}
              style={exportBtnStyle}
            >
              ↻ RECARGAR
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            marginTop: 24,
          }}
        >
          <StatBox label="PEDIDOS" value={String(totals.count)} />
          <StatBox label="INGRESOS" value={`€${totals.revenue.toFixed(2)}`} />
          <StatBox label="COMISIONES" value={`€${totals.commission.toFixed(2)}`} accent="yellow" />
          <StatBox label="PENDIENTES" value={String(filtered.filter((o) => o.status === "pending").length)} accent="red" />
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 24,
            flexWrap: "wrap",
          }}
        >
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="BUSCAR POR CLIENTE, EMAIL, AGENTE, ID…"
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
            <option value="">TODOS LOS ESTADOS</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Table */}
      <section style={{ padding: "32px 24px", maxWidth: 1400, margin: "0 auto", width: "100%" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 64, color: "#FFDE00", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 900, textTransform: "uppercase" }}>
            Cargando pedidos…
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              background: "#141414",
              border: "2.5px solid #FF1744",
              padding: 48,
              textAlign: "center",
              fontFamily: "Space Grotesk, monospace",
              color: "#A0A0A0",
              textTransform: "uppercase",
            }}
          >
            No hay pedidos que coincidan con el filtro.
          </div>
        ) : (
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
                  {["ID", "CLIENTE", "TOTAL", "ESTADO", "API", "AGENTE", "COMISIÓN", "FECHA", "ACCIONES"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px",
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
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr
                    key={o.id}
                    style={{ borderBottom: "1px solid #2a2a2a", color: "#FAF9F5" }}
                  >
                    <td style={{ padding: "10px 12px", fontFamily: "Space Grotesk, monospace", fontSize: 11 }}>
                      #{o.id.slice(-6).toUpperCase()}
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 12 }}>
                      <div style={{ fontWeight: 700 }}>{o.customerName}</div>
                      <div style={{ fontSize: 10, color: "#A0A0A0", fontFamily: "Space Grotesk, monospace" }}>
                        {o.customerEmail}
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 900, fontSize: 14 }}>
                      €{o.total.toFixed(2)}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <StatusBadge status={o.status} />
                    </td>
                    <td style={{ padding: "10px 12px", fontFamily: "Space Grotesk, monospace", fontSize: 11, color: "#FFDE00" }}>
                      {o.apiSource ?? "—"}
                    </td>
                    <td style={{ padding: "10px 12px", fontFamily: "Space Grotesk, monospace", fontSize: 11 }}>
                      {o.agentCode ?? "—"}
                    </td>
                    <td style={{ padding: "10px 12px", fontFamily: "Space Grotesk, monospace", fontSize: 12, fontWeight: 700, color: "#FF1744" }}>
                      €{o.commissionEarned.toFixed(2)}
                    </td>
                    <td style={{ padding: "10px 12px", fontFamily: "Space Grotesk, monospace", fontSize: 11, color: "#A0A0A0" }}>
                      {new Date(o.createdAt).toLocaleDateString("es-ES")}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <select
                        value={o.status}
                        disabled={updatingId === o.id}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        style={{
                          background: "#0A0A0A",
                          color: "#FFDE00",
                          border: "2.5px solid #FFDE00",
                          padding: "6px 8px",
                          fontFamily: "Space Grotesk, monospace",
                          fontSize: 10,
                          textTransform: "uppercase",
                          outline: "none",
                          cursor: "pointer",
                        }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
        DROPES · Admin panel · {filtered.length} pedidos
      </footer>
    </main>
  );
}

const exportBtnStyle: React.CSSProperties = {
  background: "#FF1744",
  color: "white",
  border: "2.5px solid #0A0A0A",
  padding: "10px 16px",
  fontFamily: "Plus Jakarta Sans, sans-serif",
  fontWeight: 900,
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  cursor: "pointer",
  boxShadow: "3px 3px 0 #FFDE00",
};

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
          fontSize: 24,
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

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "#FFDE00",
    confirmed: "#10B981",
    failed: "#FF1744",
    synced: "#3B82F6",
    cancelled: "#A0A0A0",
  };
  const bg = colors[status] ?? "#A0A0A0";
  return (
    <span
      style={{
        background: bg,
        color: "#0A0A0A",
        border: "2.5px solid #0A0A0A",
        padding: "3px 6px",
        fontFamily: "Space Grotesk, monospace",
        fontSize: 10,
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {status}
    </span>
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
            color: "#FFDE00",
            textDecoration: "none",
            border: "2.5px solid #FFDE00",
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
            color: "#FAF9F5",
            textDecoration: "none",
            border: "2.5px solid #FAF9F5",
            padding: "8px 12px",
          }}
        >
          Productos
        </Link>
      </div>
    </header>
  );
}

// ─── CSV helper ──────────────────────────────────────────────────────
function toCSV(orders: Order[]): string {
  const headers = [
    "id",
    "createdAt",
    "customerName",
    "customerEmail",
    "customerPhone",
    "customerCity",
    "customerCountry",
    "total",
    "paymentMethod",
    "status",
    "apiSource",
    "agentCode",
    "commissionEarned",
    "itemsCount",
  ];
  const rows = orders.map((o) =>
    [
      o.id,
      new Date(o.createdAt).toISOString(),
      o.customerName,
      o.customerEmail,
      o.customerPhone ?? "",
      o.customerCity ?? "",
      o.customerCountry ?? "",
      o.total.toFixed(2),
      o.paymentMethod,
      o.status,
      o.apiSource ?? "",
      o.agentCode ?? "",
      o.commissionEarned.toFixed(2),
      o.items.length,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}
