"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/lib/cart-store";
import productsData from "@/data/products.json";
import type { Product } from "@/lib/types";

const ALL_PRODUCTS = productsData as Product[];

// Hook para montar el script solo en cliente
export function CartInteractions() {
  const [mounted, setMounted] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const add = useCart((s) => s.add);
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);

  useEffect(() => {
    setMounted(true);

    // Enganchar el botón "PEDIR CONTRA REEMBOLSO" del HTML original
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest("button[onclick]");
      if (button && button.textContent?.includes("PEDIR")) {
        e.preventDefault();
        // Buscar el producto en el catálogo por nombre
        const card = button.closest(".group");
        const nameEl = card?.querySelector("h3");
        if (nameEl) {
          const name = nameEl.textContent?.trim() || "";
          const product = ALL_PRODUCTS.find((p) =>
            p.name.toLowerCase().includes(name.toLowerCase().slice(0, 20))
          );
          if (product) {
            add(product);
            // Feedback visual
            const original = button.innerHTML;
            button.innerHTML = `<span class="material-symbols-outlined text-base">check</span> ¡AÑADIDO AL PEDIDO!`;
            button.classList.remove("bg-brand-black");
            button.classList.add("bg-emerald-600");
            setTimeout(() => {
              button.innerHTML = original;
              button.classList.remove("bg-emerald-600");
              button.classList.add("bg-brand-black");
            }, 2000);
          }
        }
      }

      // Enganchar el botón de la cesta en el navbar
      const cartBtn = target.closest('a[href="#"]');
      if (cartBtn && cartBtn.textContent?.includes("Cesta")) {
        e.preventDefault();
        setCartOpen(true);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [add]);

  if (!mounted) return null;

  return (
    <>
      {cartOpen && (
        <CartDrawer
          items={items}
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            setCartOpen(false);
            setCheckoutOpen(true);
          }}
          setQty={setQty}
          remove={remove}
        />
      )}
      {checkoutOpen && (
        <CheckoutModal
          items={items}
          onClose={() => setCheckoutOpen(false)}
          clear={clear}
        />
      )}
    </>
  );
}

// ─── Cart Drawer ────────────────────────────────────────────────────────
function CartDrawer({
  items,
  onClose,
  onCheckout,
  setQty,
  remove,
}: {
  items: any[];
  onClose: () => void;
  onCheckout: () => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
}) {
  const total = items.reduce(
    (acc, i) => acc + parseFloat(i.priceNow.replace(",", ".")) * i.quantity,
    0
  );

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(10,10,10,0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "100%",
          maxWidth: 420,
          background: "#FAF9F5",
          borderLeft: "2.5px solid #0A0A0A",
          boxShadow: "-8px 0 0 #0A0A0A",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Inter, sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            background: "#FF1744",
            color: "white",
            padding: "1rem 1.5rem",
            borderBottom: "2.5px solid #0A0A0A",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontWeight: 900,
              fontSize: 24,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            Tu Cesta ({items.length})
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 40,
              height: 40,
              background: "white",
              color: "#0A0A0A",
              border: "2.5px solid #0A0A0A",
              cursor: "pointer",
              fontWeight: 900,
              fontSize: 18,
            }}
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
            <div>
              <p style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 900, fontSize: 24, textTransform: "uppercase", marginBottom: 8 }}>
                Cesta Vacía
              </p>
              <p style={{ fontFamily: "Space Grotesk, monospace", fontSize: 12, color: "#666", textTransform: "uppercase", marginBottom: 16 }}>
                Añade productos para empezar tu pedido
              </p>
              <button
                onClick={onClose}
                style={{
                  background: "#0A0A0A",
                  color: "white",
                  border: "2.5px solid #0A0A0A",
                  padding: "12px 24px",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: 900,
                  fontSize: 12,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  letterSpacing: "0.05em",
                }}
              >
                EXPLORAR CATÁLOGO
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: 12,
                    background: "white",
                    border: "2.5px solid #0A0A0A",
                    padding: 12,
                    marginBottom: 12,
                    boxShadow: "4px 4px 0 #0A0A0A",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "contain",
                      background: "#FAF9F5",
                      border: "2.5px solid #0A0A0A",
                      padding: 4,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "Space Grotesk, monospace", fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#FF1744", marginBottom: 4 }}>
                      {item.category}
                    </p>
                    <h3 style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 900, fontSize: 12, textTransform: "uppercase", lineHeight: 1.2, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {item.name}
                    </h3>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", border: "2.5px solid #0A0A0A", background: "#FAF9F5" }}>
                        <button onClick={() => setQty(item.id, item.quantity - 1)} style={{ width: 28, height: 28, background: "none", border: "none", cursor: "pointer", fontWeight: 900 }}>−</button>
                        <span style={{ width: 28, textAlign: "center", fontFamily: "Space Grotesk, monospace", fontWeight: 700, fontSize: 14, lineHeight: "28px" }}>{item.quantity}</span>
                        <button onClick={() => setQty(item.id, item.quantity + 1)} style={{ width: 28, height: 28, background: "none", border: "none", cursor: "pointer", fontWeight: 900 }}>+</button>
                      </div>
                      <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 900, fontSize: 16 }}>
                        {(parseFloat(item.priceNow.replace(",", ".")) * item.quantity).toFixed(2).replace(".", ",")}€
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    style={{
                      width: 28,
                      height: 28,
                      background: "#FF1744",
                      color: "white",
                      border: "2.5px solid #0A0A0A",
                      cursor: "pointer",
                      alignSelf: "flex-start",
                      fontWeight: 900,
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div style={{ background: "white", borderTop: "2.5px solid #0A0A0A", padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Space Grotesk, monospace", fontSize: 12, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
                <span>ENVÍO</span>
                <span style={{ color: "#059669" }}>GRATIS</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 900, fontSize: 16, textTransform: "uppercase" }}>TOTAL</span>
                <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 900, fontSize: 32 }}>
                  {total.toFixed(2).replace(".", ",")}€
                </span>
              </div>
              <button
                onClick={onCheckout}
                style={{
                  width: "100%",
                  background: "#FF1744",
                  color: "white",
                  border: "2.5px solid #0A0A0A",
                  padding: "16px",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: 900,
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  boxShadow: "4px 4px 0 #0A0A0A",
                }}
              >
                FINALIZAR PEDIDO →
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

// ─── Checkout Modal ────────────────────────────────────────────────────
function CheckoutModal({
  items,
  onClose,
  clear,
}: {
  items: any[];
  onClose: () => void;
  clear: () => void;
}) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  });

  const total = items.reduce(
    (acc, i) => acc + parseFloat(i.priceNow.replace(",", ".")) * i.quantity,
    0
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const id = `DP-${Date.now().toString(36).toUpperCase().slice(-6)}`;
      setOrderId(id);
      setStep("success");
      clear();
      setLoading(false);
    }, 1200);
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 110,
        background: "rgba(10,10,10,0.7)",
        backdropFilter: "blur(4px)",
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: 600,
          margin: "40px auto",
          background: "#FAF9F5",
          border: "2.5px solid #0A0A0A",
          boxShadow: "12px 12px 0 #0A0A0A",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {step === "form" ? (
          <div style={{ padding: 32 }}>
            <h2 style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 900, fontSize: 36, textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: 8 }}>
              FINALIZAR PEDIDO
            </h2>
            <p style={{ fontFamily: "Space Grotesk, monospace", fontSize: 11, textTransform: "uppercase", color: "#666", marginBottom: 24 }}>
              Introduce tus datos para completar la compra
            </p>

            {items.length > 0 && (
              <div style={{ background: "white", border: "2.5px solid #0A0A0A", padding: 16, marginBottom: 24, boxShadow: "4px 4px 0 #0A0A0A" }}>
                <p style={{ fontFamily: "Space Grotesk, monospace", fontSize: 10, fontWeight: 900, textTransform: "uppercase", marginBottom: 8 }}>RESUMEN</p>
                {items.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontFamily: "Space Grotesk, monospace", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>
                      {item.name.slice(0, 30)}... × {item.quantity}
                    </span>
                    <span style={{ fontWeight: 700 }}>
                      {(parseFloat(item.priceNow.replace(",", ".")) * item.quantity).toFixed(2).replace(".", ",")}€
                    </span>
                  </div>
                ))}
                <div style={{ borderTop: "2.5px solid #0A0A0A", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 900, fontSize: 18 }}>TOTAL</span>
                  <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 900, fontSize: 24 }}>
                    {total.toFixed(2).replace(".", ",")}€
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <input required placeholder="NOMBRE" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} style={inputStyle} />
                <input required placeholder="APELLIDOS" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} style={inputStyle} />
              </div>
              <input required type="email" placeholder="EMAIL" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              <input required type="tel" placeholder="TELÉFONO" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
              <input required placeholder="DIRECCIÓN" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={inputStyle} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 12 }}>
                <input required placeholder="CIUDAD" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} style={inputStyle} />
                <input required placeholder="CP" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} style={inputStyle} />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  background: "#0A0A0A",
                  color: "white",
                  border: "2.5px solid #0A0A0A",
                  padding: 16,
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
                {loading ? "PROCESANDO..." : "CONFIRMAR PEDIDO →"}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ padding: 48, textAlign: "center" }}>
            <div style={{ width: 96, height: 96, background: "#10B981", border: "2.5px solid #0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "6px 6px 0 #0A0A0A" }}>
              <span style={{ fontSize: 48, color: "white", fontWeight: 900 }}>✓</span>
            </div>
            <h2 style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 900, fontSize: 48, textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: 12 }}>
              ¡PEDIDO CONFIRMADO!
            </h2>
            <p style={{ fontFamily: "Space Grotesk, monospace", fontSize: 14, color: "#666", marginBottom: 8 }}>
              Tu pedido <strong style={{ color: "#0A0A0A" }}>#{orderId}</strong> ha sido procesado.
            </p>
            <p style={{ fontFamily: "Space Grotesk, monospace", fontSize: 12, color: "#666", marginBottom: 24 }}>
              Recibirás un email de confirmación en breve. Te contactaremos por WhatsApp en 24-48h.
            </p>
            <button
              onClick={onClose}
              style={{
                background: "#0A0A0A",
                color: "white",
                border: "2.5px solid #0A0A0A",
                padding: "12px 32px",
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontWeight: 900,
                fontSize: 14,
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "4px 4px 0 #0A0A0A",
              }}
            >
              SEGUIR COMPRANDO
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

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
  boxShadow: "4px 4px 0 #0A0A0A",
};
