"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  X, Trash2, Minus, Plus, ShoppingBag, ArrowRight, Truck, CreditCard,
  CheckCircle2, Loader2, ShieldCheck, Search, ArrowUpRight,
} from "lucide-react";
import type { Product, Customer, PaymentMethod } from "@/lib/types";
import { useCart } from "@/lib/cart-store";
import { parsePrice, formatEuro, subtotal } from "@/lib/format";
import productsData from "@/data/products.json";

const ALL_PRODUCTS = productsData as Product[];

const ES_PROVINCES = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Málaga", "Murcia", "Palma de Mallorca", "Las Palmas", "Bilbao", "Alicante", "Córdoba", "Valladolid", "Vigo", "Gijón", "Granada", "Elche", "Otra"];
const PT_DISTRICTS = ["Lisboa", "Porto", "Braga", "Setúbal", "Aveiro", "Leiria", "Santarém", "Coimbra", "Faro", "Viseu", "Otra"];

// ─── CART DRAWER ──────────────────────────────────────────────────────────
export function CartDrawer({
  isOpen,
  onClose,
  onCheckout,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}) {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const total = subtotal(items);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-brand-black/40"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-[95] flex w-full max-w-md flex-col bg-brand-cream brutal-border-l shadow-brutal-xl"
          >
            <div className="flex items-center justify-between brutal-border-b bg-brand-purewhite px-6 py-4">
              <h2 className="font-display font-black text-2xl uppercase tracking-tight">
                Tu Cesta ({items.length})
              </h2>
              <button
                onClick={onClose}
                className="w-10 h-10 brutal-border bg-brand-purewhite flex items-center justify-center shadow-brutal hover:bg-brand-yellow"
              >
                <X />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="w-20 h-20 bg-brand-purewhite brutal-border flex items-center justify-center shadow-brutal mb-6">
                  <ShoppingBag className="text-4xl text-gray-400" />
                </div>
                <p className="font-display font-black text-2xl uppercase">Cesta Vacía</p>
                <p className="font-mono text-xs text-gray-600 mt-2">
                  Añade productos para empezar tu pedido
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 bg-brand-black text-white brutal-border px-6 py-3 font-headline font-black text-sm uppercase shadow-brutal hover:bg-brand-red transition-colors"
                >
                  EXPLORAR CATÁLOGO
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4">
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li key={item.id} className="flex gap-3 bg-brand-purewhite brutal-border p-3 shadow-brutal">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden brutal-border bg-brand-cream">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            unoptimized
                            referrerPolicy="no-referrer"
                            sizes="80px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-[10px] font-bold uppercase text-brand-red">
                            {item.category}
                          </p>
                          <h3 className="font-headline font-black text-xs uppercase line-clamp-2 text-brand-black mt-0.5">
                            {item.name}
                          </h3>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center brutal-border bg-brand-cream">
                              <button
                                onClick={() => setQty(item.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-brand-yellow"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center font-mono font-black text-sm">{item.quantity}</span>
                              <button
                                onClick={() => setQty(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-brand-yellow"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="font-display font-black text-lg">
                              {formatEuro(parsePrice(item.priceNow) * item.quantity)}€
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => remove(item.id)}
                          className="self-start w-7 h-7 brutal-border bg-brand-red text-white flex items-center justify-center hover:bg-brand-black"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="brutal-border-t bg-brand-purewhite p-4">
                  <div className="flex justify-between font-mono text-xs font-bold uppercase mb-2">
                    <span>ENVÍO</span>
                    <span className="text-emerald-600">GRATIS</span>
                  </div>
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-headline font-black text-base uppercase">TOTAL</span>
                    <span className="font-display font-black text-3xl">{formatEuro(total)}€</span>
                  </div>
                  <button
                    onClick={onCheckout}
                    className="w-full bg-brand-red hover:bg-brand-black text-brand-purewhite brutal-border py-4 font-headline font-black text-sm uppercase tracking-wider shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
                  >
                    FINALIZAR PEDIDO
                    <ArrowRight />
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── CHECKOUT MODAL ────────────────────────────────────────────────────────
export function CheckoutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const [step, setStep] = useState<"details" | "success">("details");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [orderId, setOrderId] = useState("");
  const [savedTotal, setSavedTotal] = useState(0);
  const [form, setForm] = useState<Customer>({
    first_name: "", last_name: "", email: "", phone: "",
    address: "", city: "", zip: "", country: "ES",
  });

  const total = subtotal(items);
  const provinces = form.country === "ES" ? ES_PROVINCES : PT_DISTRICTS;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    try {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) throw new Error("Email inválido");
      if (!/^[679]\d{8}$/.test(form.phone.replace(/\s/g, ""))) throw new Error("Teléfono español inválido");
      const id = `DP-${Date.now().toString(36).toUpperCase().slice(-6)}`;
      setOrderId(id);
      setSavedTotal(total);
      setStep("success");
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("details");
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] overflow-y-auto bg-brand-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative mx-auto my-4 max-w-2xl bg-brand-cream brutal-border shadow-brutal-xl sm:my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 z-10 w-10 h-10 bg-brand-purewhite brutal-border flex items-center justify-center shadow-brutal hover:bg-brand-yellow"
            >
              <X />
            </button>

            {step === "details" && (
              <div className="p-6 sm:p-10">
                <h2 className="font-display font-black text-4xl uppercase tracking-tight">FINALIZAR PEDIDO</h2>
                <p className="font-mono text-xs text-gray-600 mt-2 uppercase">
                  Introduce tus datos para completar la compra
                </p>

                {/* Payment method */}
                <div className="mt-8">
                  <p className="font-mono text-xs font-black uppercase mb-3">MÉTODO DE PAGO</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPayment("cod")}
                      className={`brutal-border p-4 text-left shadow-brutal hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all ${
                        payment === "cod" ? "bg-brand-red text-white" : "bg-brand-purewhite"
                      }`}
                    >
                      <Truck className="text-2xl" />
                      <p className="font-headline font-black text-sm uppercase mt-2">Contra Reembolso</p>
                      <p className="font-mono text-[10px] uppercase opacity-70">Paga al recibir</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayment("card")}
                      className={`brutal-border p-4 text-left shadow-brutal hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all ${
                        payment === "card" ? "bg-brand-black text-white" : "bg-brand-purewhite"
                      }`}
                    >
                      <CreditCard className="text-2xl" />
                      <p className="font-headline font-black text-sm uppercase mt-2">Tarjeta / Bizum</p>
                      <p className="font-mono text-[10px] uppercase opacity-70">Pago online seguro</p>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Nombre" name="first_name" value={form.first_name} onChange={handleChange} required />
                    <FormField label="Apellidos" name="last_name" value={form.last_name} onChange={handleChange} required />
                  </div>
                  <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                  <FormField label="Teléfono" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-mono text-[10px] font-black uppercase block mb-1">País</label>
                      <select
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        className="w-full bg-brand-purewhite brutal-border px-3 py-3 font-headline font-bold text-sm shadow-brutal focus:outline-none"
                      >
                        <option value="ES">España 🇪🇸</option>
                        <option value="PT">Portugal 🇵🇹</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-mono text-[10px] font-black uppercase block mb-1">Ciudad / Provincia</label>
                      <select
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                        className="w-full bg-brand-purewhite brutal-border px-3 py-3 font-headline font-bold text-sm shadow-brutal focus:outline-none"
                      >
                        <option value="">Selecciona...</option>
                        {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-[1fr_120px] gap-3">
                    <FormField label="Dirección" name="address" value={form.address} onChange={handleChange} required />
                    <FormField label="CP" name="zip" value={form.zip} onChange={handleChange} required />
                  </div>

                  {error && (
                    <div className="brutal-border bg-brand-red text-white p-3 font-mono text-xs font-bold uppercase">
                      {error}
                    </div>
                  )}

                  {/* Summary */}
                  <div className="brutal-border bg-brand-purewhite p-4 shadow-brutal">
                    <p className="font-mono text-[10px] font-black uppercase mb-2">RESUMEN</p>
                    <div className="space-y-1 font-mono text-xs">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span className="truncate pr-2">{item.name.slice(0, 30)}... × {item.quantity}</span>
                          <span className="font-bold">{formatEuro(parsePrice(item.priceNow) * item.quantity)}€</span>
                        </div>
                      ))}
                      <div className="brutal-border-t pt-1 mt-1 flex justify-between">
                        <span>ENVÍO</span>
                        <span className="text-emerald-600 font-bold">GRATIS</span>
                      </div>
                      <div className="flex justify-between font-display font-black text-base">
                        <span>TOTAL</span>
                        <span>{formatEuro(total)}€</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-black hover:bg-brand-red text-brand-purewhite brutal-border py-4 font-headline font-black text-base uppercase tracking-wider shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        {payment === "cod" ? "CONFIRMAR PEDIDO" : "IR AL PAGO SEGURO"}
                        <ArrowRight />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 font-mono text-[10px] uppercase text-gray-500">
                    <ShieldCheck className="text-emerald-600" />
                    CONEXIÓN SSL ENCRIPTADA
                  </div>
                </form>
              </div>
            )}

            {step === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center p-10 text-center sm:p-16"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                  className="w-24 h-24 bg-emerald-500 brutal-border flex items-center justify-center shadow-brutal"
                >
                  <CheckCircle2 className="text-6xl text-white" />
                </motion.div>

                <h2 className="mt-8 font-display font-black text-5xl uppercase tracking-tight">
                  ¡PEDIDO CONFIRMADO!
                </h2>
                <p className="font-mono text-sm text-gray-700 mt-3">
                  Tu pedido <strong className="text-brand-black">#{orderId}</strong> ha sido procesado.
                </p>
                <p className="font-mono text-xs text-gray-600 mt-1">
                  Recibirás un email de confirmación. Te contactaremos por WhatsApp en 24-48h.
                </p>

                {payment === "cod" && savedTotal > 0 && (
                  <div className="mt-8 brutal-border bg-brand-red text-white p-4 shadow-brutal rotate-1">
                    <p className="font-mono text-[10px] uppercase opacity-80">PREPÁRATE PARA PAGAR</p>
                    <p className="font-display font-black text-4xl">{formatEuro(savedTotal)}€</p>
                    <p className="font-mono text-[10px] uppercase opacity-80">al recibir el paquete</p>
                  </div>
                )}

                <button
                  onClick={handleClose}
                  className="mt-8 bg-brand-black hover:bg-brand-red text-brand-purewhite brutal-border px-8 py-3 font-headline font-black text-sm uppercase shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  SEGUIR COMPRANDO
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FormField({
  label, name, value, onChange, type = "text", required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="font-mono text-[10px] font-black uppercase block mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-brand-purewhite brutal-border px-3 py-3 font-headline font-bold text-sm shadow-brutal focus:outline-none focus:shadow-none focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
      />
    </div>
  );
}

// ─── SEARCH OVERLAY ──────────────────────────────────────────────────────
export function SearchOverlay({
  isOpen,
  onClose,
  onOpenProduct,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenProduct: (p: Product) => void;
}) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  const results = query.trim()
    ? ALL_PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-brand-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            className="mx-auto mt-20 max-w-2xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-brand-cream brutal-border shadow-brutal-xl">
              <div className="flex items-center gap-3 brutal-border-b bg-brand-purewhite px-4 py-3">
                <Search className="text-brand-black" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="BUSCAR GADGETS VIRALES..."
                  className="flex-1 bg-transparent font-headline font-bold text-sm uppercase placeholder:text-gray-400 focus:outline-none"
                />
                <button
                  onClick={onClose}
                  className="w-9 h-9 brutal-border bg-brand-purewhite flex items-center justify-center hover:bg-brand-yellow"
                >
                  <X />
                </button>
              </div>

              {query.trim() === "" ? (
                <div className="px-6 py-12 text-center">
                  <p className="font-mono text-xs uppercase text-gray-500">
                    Escribe para buscar en el catálogo
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="font-display font-black text-xl uppercase">Sin resultados</p>
                  <p className="font-mono text-xs text-gray-600 mt-1">para "{query}"</p>
                </div>
              ) : (
                <ul className="max-h-96 overflow-y-auto p-2">
                  {results.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => {
                          onOpenProduct(p);
                          onClose();
                        }}
                        className="flex w-full items-center gap-3 brutal-border bg-brand-purewhite p-2 mb-2 text-left hover:bg-brand-yellow transition-colors"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden brutal-border bg-brand-cream">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            unoptimized
                            referrerPolicy="no-referrer"
                            sizes="56px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-headline font-black text-xs uppercase line-clamp-1">{p.name}</p>
                          <p className="font-mono text-[10px] text-gray-600">
                            {p.category} · {formatEuro(parsePrice(p.priceNow))}€
                          </p>
                        </div>
                        <ArrowUpRight />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── FAVORITES DRAWER ──────────────────────────────────────────────────────
export function FavoritesDrawer({
  isOpen,
  onClose,
  onOpenProduct,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenProduct: (p: Product) => void;
}) {
  const favorites = useCart((s) => s.favorites);
  const toggleFav = useCart((s) => s.toggleFavorite);
  const add = useCart((s) => s.add);
  const items = ALL_PRODUCTS.filter((p) => favorites.includes(p.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-brand-black/40"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-[95] flex w-full max-w-md flex-col bg-brand-cream brutal-border-l shadow-brutal-xl"
          >
            <div className="flex items-center justify-between brutal-border-b bg-brand-purewhite px-6 py-4">
              <h2 className="font-display font-black text-2xl uppercase tracking-tight">
                Favoritos ({items.length})
              </h2>
              <button
                onClick={onClose}
                className="w-10 h-10 brutal-border bg-brand-purewhite flex items-center justify-center shadow-brutal hover:bg-brand-yellow"
              >
                <X />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="w-20 h-20 bg-brand-purewhite brutal-border flex items-center justify-center shadow-brutal mb-6">
                  <ShoppingBag className="text-4xl text-gray-400" />
                </div>
                <p className="font-display font-black text-2xl uppercase">Sin Favoritos</p>
                <p className="font-mono text-xs text-gray-600 mt-2">
                  Toca el corazón en cualquier pieza para guardarla
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 bg-brand-black text-white brutal-border px-6 py-3 font-headline font-black text-sm uppercase shadow-brutal hover:bg-brand-red"
                >
                  EXPLORAR CATÁLOGO
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-3">
                  {items.map((p) => (
                    <li key={p.id} className="flex gap-3 bg-brand-purewhite brutal-border p-3 shadow-brutal">
                      <button
                        onClick={() => {
                          onOpenProduct(p);
                          onClose();
                        }}
                        className="relative h-20 w-20 shrink-0 overflow-hidden brutal-border bg-brand-cream"
                      >
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          unoptimized
                          referrerPolicy="no-referrer"
                          sizes="80px"
                          className="object-contain p-1"
                        />
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[10px] font-bold uppercase text-brand-red">{p.category}</p>
                        <h3 className="font-headline font-black text-xs uppercase line-clamp-2 mt-0.5">{p.name}</h3>
                        <p className="font-display font-black text-base mt-1">{formatEuro(parsePrice(p.priceNow))}€</p>
                        <div className="flex gap-1 mt-2">
                          <button
                            onClick={() => add(p)}
                            className="flex-1 bg-brand-black hover:bg-brand-red text-white brutal-border py-1.5 font-headline font-black text-[10px] uppercase"
                          >
                            AÑADIR
                          </button>
                          <button
                            onClick={() => toggleFav(p.id)}
                            className="w-8 brutal-border bg-brand-red text-white flex items-center justify-center"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
