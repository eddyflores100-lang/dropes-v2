"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, Truck, CreditCard, CheckCircle2, ArrowRight, ArrowLeft, Loader2, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Customer, CountryCode, PaymentMethod } from "@/lib/types";
import { useCart } from "@/lib/cart-store";
import { parsePrice, formatEuro, subtotal } from "@/lib/format";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ES_PROVINCES = [
  "Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Málaga",
  "Murcia", "Palma de Mallorca", "Las Palmas", "Bilbao", "Alicante",
  "Córdoba", "Valladolid", "Vigo", "Gijón", "Granada", "Elche", "Otra",
];

const PT_DISTRICTS = [
  "Lisboa", "Porto", "Braga", "Setúbal", "Aveiro", "Leiria", "Santarém",
  "Coimbra", "Faro", "Viseu", "Otra",
];

type Step = "details" | "success";

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const [step, setStep] = useState<Step>("details");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [orderId, setOrderId] = useState("");
  const [savedTotal, setSavedTotal] = useState(0);
  const [form, setForm] = useState<Customer>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "ES",
  });

  const total = subtotal(items);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate API call (Dropea API is in maintenance)
    await new Promise((r) => setTimeout(r, 1500));

    try {
      // Validate email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        throw new Error("Email inválido");
      }
      if (!/^[679]\d{8}$/.test(form.phone.replace(/\s/g, ""))) {
        throw new Error("Teléfono español inválido (debe empezar por 6, 7 o 9)");
      }

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

  const provinces = form.country === "ES" ? ES_PROVINCES : PT_DISTRICTS;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] overflow-y-auto bg-foreground/40 backdrop-blur-md"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto my-4 max-w-2xl rounded-3xl border border-border bg-background shadow-2xl sm:my-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full hover:bg-clay-50"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>

            {step === "details" && (
              <div className="p-6 sm:p-10">
                <h2 className="font-display text-3xl tracking-tight">Finalizar pedido</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Introduce tus datos para completar la compra. Recibirás confirmación por email.
                </p>

                {/* Payment method */}
                <div className="mt-8">
                  <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Método de pago
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPayment("cod")}
                      className={cn(
                        "rounded-2xl border-2 p-4 text-left transition-all",
                        payment === "cod"
                          ? "border-foreground bg-clay-50"
                          : "border-border hover:bg-clay-50/50"
                      )}
                    >
                      <Truck className={cn("h-5 w-5", payment === "cod" && "text-clay-600")} />
                      <p className="mt-2 text-sm font-medium">Contra reembolso</p>
                      <p className="text-xs text-muted-foreground">Paga al recibir</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayment("card")}
                      className={cn(
                        "rounded-2xl border-2 p-4 text-left transition-all",
                        payment === "card"
                          ? "border-foreground bg-clay-50"
                          : "border-border hover:bg-clay-50/50"
                      )}
                    >
                      <CreditCard className={cn("h-5 w-5", payment === "card" && "text-clay-600")} />
                      <p className="mt-2 text-sm font-medium">Tarjeta / Bizum</p>
                      <p className="text-xs text-muted-foreground">Pago online seguro</p>
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="first_name" className="text-xs uppercase tracking-wider text-muted-foreground">
                        Nombre
                      </Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="last_name" className="text-xs uppercase tracking-wider text-muted-foreground">
                        Apellidos
                      </Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        required
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="tu@email.com"
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs uppercase tracking-wider text-muted-foreground">
                      Teléfono
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="600 000 000"
                      className="rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="country" className="text-xs uppercase tracking-wider text-muted-foreground">
                        País
                      </Label>
                      <select
                        id="country"
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                      >
                        <option value="ES">España 🇪🇸</option>
                        <option value="PT">Portugal 🇵🇹</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="city" className="text-xs uppercase tracking-wider text-muted-foreground">
                        Ciudad / Provincia
                      </Label>
                      <select
                        id="city"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                        className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                      >
                        <option value="">Selecciona...</option>
                        {provinces.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_120px] gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="address" className="text-xs uppercase tracking-wider text-muted-foreground">
                        Dirección
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        placeholder="Calle, número, piso"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="zip" className="text-xs uppercase tracking-wider text-muted-foreground">
                        CP
                      </Label>
                      <Input
                        id="zip"
                        name="zip"
                        value={form.zip}
                        onChange={handleChange}
                        required
                        placeholder="28001"
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-xl border border-clay-200 bg-clay-50 p-4 text-sm text-clay-700">
                      {error}
                    </div>
                  )}

                  {/* Order summary */}
                  <div className="rounded-2xl border border-border bg-clay-50/40 p-4">
                    <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      Resumen
                    </p>
                    <div className="space-y-2 text-sm">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span className="text-muted-foreground">
                            {item.name.slice(0, 30)}{item.name.length > 30 ? "..." : ""} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            {formatEuro(parsePrice(item.priceNow) * item.quantity)}€
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-border pt-2 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Envío</span>
                          <span className="font-medium text-emerald-700">Gratis</span>
                        </div>
                      </div>
                      <div className="border-t border-border pt-2">
                        <div className="flex items-baseline justify-between">
                          <span className="font-medium">Total</span>
                          <span className="font-display text-xl">{formatEuro(total)}€</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full justify-center rounded-full bg-foreground text-background hover:bg-clay-700"
                    size="lg"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        {payment === "cod" ? "Confirmar pedido" : "Ir al pago seguro"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Conexión SSL encriptada
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
                  className="grid h-24 w-24 place-items-center rounded-full bg-emerald-50"
                >
                  <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                </motion.div>

                <h2 className="mt-8 font-display text-4xl tracking-tight">
                  ¡Pedido confirmado!
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Tu pedido <span className="font-medium text-foreground">#{orderId}</span> ha sido procesado.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Recibirás un email de confirmación en breve. Te contactaremos por WhatsApp en 24-48h.
                </p>

                {payment === "cod" && savedTotal > 0 && (
                  <div className="mt-8 rounded-2xl border-2 border-clay-200 bg-clay-50 px-6 py-4">
                    <p className="text-[11px] uppercase tracking-wider text-clay-700">
                      Prepárate para pagar
                    </p>
                    <p className="mt-1 font-display text-3xl text-foreground">
                      {formatEuro(savedTotal)}€
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      al recibir el paquete (contra reembolso)
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleClose}
                  className="mt-8 rounded-full bg-foreground text-background hover:bg-clay-700"
                  size="lg"
                >
                  Seguir explorando
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
