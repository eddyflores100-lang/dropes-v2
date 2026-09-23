"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Clock, Flame, Zap } from "lucide-react";
import type { Product } from "@/lib/types";
import { parsePrice, formatEuro, discountPercent } from "@/lib/format";

interface FlashSaleProps {
  product: Product;
  onBuy: (p: Product) => void;
}

function useCountdown() {
  const [time, setTime] = useState({ h: 8, m: 46, s: 49 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else {
          s = 59;
          if (m > 0) m--;
          else {
            m = 59;
            if (h > 0) h--;
          }
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

const Unit = ({ value, label }: { value: number; label: string }) => (
  <div className="bg-brand-black text-brand-yellow brutal-border p-3 sm:p-4 text-center min-w-[70px] sm:min-w-[85px] shadow-brutal">
    <div className="font-display font-black text-3xl sm:text-4xl leading-none">
      {String(value).padStart(2, "0")}
    </div>
    <div className="text-[10px] font-bold uppercase mt-1">{label}</div>
  </div>
);

export function FlashSale({ product, onBuy }: FlashSaleProps) {
  const { h, m, s } = useCountdown();
  const price = parsePrice(product.priceNow);
  const was = parsePrice(product.priceWas);
  const discount = discountPercent(product.priceWas, product.priceNow);

  return (
    <section className="w-full py-12 lg:py-16 bg-brand-cream brutal-border-b" id="flash-deal">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-purewhite brutal-border p-6 sm:p-10 shadow-brutal-xl relative overflow-hidden">
          {/* Wild Neon Badge Floating */}
          <div className="absolute -top-3 right-6 sm:right-12 bg-brand-yellow text-brand-black font-display font-black text-sm sm:text-base px-5 py-2 uppercase brutal-border shadow-brutal rotate-2">
            ⚡ OFERTA SALVAJE DE HOY
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-2">
            {/* Left Info & Countdown */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-brand-red text-brand-purewhite px-3 py-1 font-mono text-xs font-black uppercase">
                <Clock className="text-base" />
                <span>OFERTA EXPIRA AL AGOTAR STOCK</span>
              </div>

              <h2 className="font-display font-black text-4xl sm:text-6xl text-brand-black uppercase tracking-tight leading-none">
                LIQUIDACIÓN FLASH: <br />
                <span className="text-brand-red underline decoration-brand-yellow decoration-8">
                  HASTA {discount}% DE DESCUENTO
                </span>
              </h2>

              <p className="font-body text-base sm:text-lg text-gray-700 font-semibold max-w-xl">
                Unidades reservadas para compras directas con entrega en 24h. Añade al carrito y paga al recibir en tu domicilio.
              </p>

              {/* Countdown */}
              <div className="flex items-center gap-3 font-mono">
                <Unit value={h} label="Horas" />
                <span className="font-display font-black text-3xl text-brand-red">:</span>
                <Unit value={m} label="Minutos" />
                <span className="font-display font-black text-3xl text-brand-red">:</span>
                <Unit value={s} label="Segundos" />
              </div>

              {/* Stock bar */}
              <div className="max-w-md pt-2">
                <div className="flex justify-between font-mono text-xs font-black uppercase mb-1">
                  <span className="text-brand-red flex items-center gap-1">
                    <Flame className="text-sm" />
                    ¡SÓLO QUEDAN 7 UNIDADES!
                  </span>
                  <span>88% VENDIDO</span>
                </div>
                <div className="w-full h-4 bg-brand-cream brutal-border overflow-hidden p-0.5">
                  <div className="bg-brand-red h-full w-[88%]"></div>
                </div>
              </div>
            </div>

            {/* Right Featured Deal Card */}
            <div className="lg:col-span-5">
              <div className="bg-brand-cream brutal-border p-5 shadow-brutal-lg">
                <div className="relative aspect-video w-full brutal-border bg-white overflow-hidden mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    unoptimized
                    referrerPolicy="no-referrer"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-brand-red text-white font-mono font-black text-xs px-2 py-1 brutal-border">
                    -{discount}% DTO
                  </span>
                  <span className="absolute top-2 right-2 bg-brand-yellow text-black font-mono font-black text-xs px-2 py-1 brutal-border">
                    TOP SALUD
                  </span>
                </div>
                <h3 className="font-headline font-black text-lg text-brand-black leading-snug uppercase mb-2">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-display font-black text-3xl text-brand-red">
                    {formatEuro(price)}€
                  </span>
                  <span className="font-mono text-sm font-bold text-gray-500 line-through">
                    {formatEuro(was)}€
                  </span>
                  <span className="text-xs font-mono font-black bg-brand-black text-white px-2 py-0.5">
                    ENVÍO GRATIS
                  </span>
                </div>
                <button
                  onClick={() => onBuy(product)}
                  className="w-full bg-brand-black hover:bg-brand-red text-brand-purewhite brutal-border py-4 font-headline font-black text-sm uppercase tracking-wider shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="text-lg" />
                  <span>PEDIR AHORA — PAGAR AL RECIBIR</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
