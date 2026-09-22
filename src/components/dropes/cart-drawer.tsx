"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { X, Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { parsePrice, formatEuro, subtotal } from "@/lib/format";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const total = subtotal(items);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-foreground/30 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-[95] flex w-full max-w-md flex-col bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-display text-xl text-foreground">
                Tu carrito
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({items.length})
                </span>
              </h2>
              <button
                onClick={onClose}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-clay-50"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-clay-50">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="mt-6 font-display text-xl">El carrito está vacío</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Añade piezas desde el catálogo para empezar.
                </p>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="mt-6 rounded-full"
                >
                  Explorar catálogo
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <ul className="space-y-4">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex gap-4 border-b border-border/60 pb-4"
                      >
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-clay-50">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            unoptimized
                            referrerPolicy="no-referrer"
                            sizes="100px"
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                            {item.category}
                          </p>
                          <h3 className="mt-0.5 line-clamp-2 text-sm font-medium text-foreground">
                            {item.name}
                          </h3>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-border">
                              <button
                                onClick={() => setQty(item.id, item.quantity - 1)}
                                className="grid h-8 w-8 place-items-center text-foreground hover:bg-clay-50"
                                aria-label="Restar"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-medium tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => setQty(item.id, item.quantity + 1)}
                                className="grid h-8 w-8 place-items-center text-foreground hover:bg-clay-50"
                                aria-label="Sumar"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <span className="font-medium text-foreground">
                              {formatEuro(parsePrice(item.priceNow) * item.quantity)}€
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => remove(item.id)}
                          className="grid h-8 w-8 place-items-center self-start text-muted-foreground hover:text-clay-600"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                <div className="border-t border-border bg-clay-50/40 px-6 py-5">
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="font-medium text-emerald-700">Gratis</span>
                  </div>
                  <div className="mb-4 flex items-baseline justify-between">
                    <span className="text-base font-medium">Total</span>
                    <span className="font-display text-2xl text-foreground">
                      {formatEuro(total)}€
                    </span>
                  </div>
                  <Button
                    onClick={onCheckout}
                    className="w-full justify-center rounded-full bg-foreground text-background hover:bg-clay-700"
                    size="lg"
                  >
                    Finalizar pedido
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <button
                    onClick={onClose}
                    className="mt-3 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
                  >
                    Seguir comprando
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
