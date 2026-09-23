"use client";

import Image from "next/image";
import { CreditCard as Payments, Zap as Bolt } from "lucide-react";
import type { Product } from "@/lib/types";
import { parsePrice, formatEuro, discountPercent } from "@/lib/format";

interface HeroProps {
  product: Product;
  onProductClick: (p: Product) => void;
}

export function Hero({ product, onProductClick }: HeroProps) {
  const price = parsePrice(product.priceNow);
  const was = parsePrice(product.priceWas);
  const discount = discountPercent(product.priceWas, product.priceNow);

  return (
    <section className="relative w-full brutal-border-b bg-brand-purewhite overflow-hidden pt-28">
      {/* Background Graphic Accents */}
      <div className="absolute right-0 top-0 w-1/3 h-full bg-brand-yellow/15 hidden lg:block brutal-border-l pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT: Monumental Typography */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6 z-10">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
              <span className="bg-brand-black text-brand-yellow px-3 py-1 brutal-border shadow-brutal">
                #1 VIRAL TIKTOK & ESPAÑA
              </span>
              <span className="bg-brand-red text-brand-purewhite px-3 py-1 font-black">
                ENTREGA 24 HORAS
              </span>
              <span className="bg-brand-cream px-3 py-1 brutal-border flex items-center gap-1 font-bold text-brand-black">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                18 EN STOCK
              </span>
            </div>

            {/* Monumental Display Title */}
            <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] leading-[0.9] tracking-tighter text-brand-black uppercase">
              {product.name.split(" ").slice(0, 2).join(" ")} <br />
              <span className="inline-block bg-brand-red text-brand-purewhite px-3 sm:px-4 py-1 rotate-[-1.5deg] shadow-brutal-xl">
                {product.tag || "PREMIUM"}
              </span>{" "}
              <br />
              <span className="italic font-serif font-black tracking-normal text-brand-cobalt drop-shadow-sm">
                AIR.
              </span>
            </h1>

            <p className="font-body text-lg sm:text-xl text-gray-800 font-semibold max-w-xl leading-relaxed">
              Ingeniería acústica antigravedad. Cero cables, cancelación de ruido brutal y pago seguro en mano cuando el repartidor llegue a tu puerta.
            </p>

            {/* ACABADOS SELECTOR */}
            <div className="w-full max-w-md bg-brand-cream brutal-border p-3 shadow-brutal flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black uppercase text-brand-black">
                  Color Seleccionado:
                </span>
                <span className="text-xs font-bold uppercase bg-brand-cobalt text-white px-2 py-0.5">
                  Azul Royal
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-6 h-6 bg-blue-700 brutal-border hover:scale-110 active:scale-95 transition-transform ring-2 ring-brand-black" title="Cobalto" />
                <button className="w-6 h-6 bg-brand-black brutal-border hover:scale-110 active:scale-95 transition-transform" title="Negro" />
                <button className="w-6 h-6 bg-brand-purewhite brutal-border hover:scale-110 active:scale-95 transition-transform" title="Blanco" />
              </div>
            </div>

            {/* MEGA ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full pt-2">
              <button
                onClick={() => onProductClick(product)}
                className="flex-1 text-center bg-brand-red hover:bg-brand-black text-brand-purewhite brutal-border px-8 py-5 font-headline font-black text-lg sm:text-xl uppercase tracking-tight shadow-brutal-lg hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                <Payments className="text-2xl font-black" />
                <span>¡PAGAR AL RECIBIR — {formatEuro(price)}€!</span>
              </button>
              <a
                href="#flash-deal"
                className="bg-brand-yellow hover:bg-brand-purewhite text-brand-black brutal-border px-6 py-5 font-headline font-black text-base uppercase shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <span>OFERTA FLASH</span>
                <Bolt className="text-xl" />
              </a>
            </div>

            {/* TRUST STICKERS */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-bold pt-2">
              <div className="flex items-center gap-1.5 text-brand-black bg-brand-cream px-2.5 py-1 brutal-border">
                <span className="text-emerald-600">✓</span>
                <span>SIN ADELANTAR DINERO</span>
              </div>
              <div className="flex items-center gap-1.5 text-brand-black bg-brand-cream px-2.5 py-1 brutal-border">
                <span className="text-brand-red">✓</span>
                <span>GARANTÍA 3 AÑOS ESPAÑA</span>
              </div>
              <div className="flex items-center gap-1.5 text-brand-black bg-brand-cream px-2.5 py-1 brutal-border">
                <span className="text-brand-cobalt">✓</span>
                <span>ATENCIÓN WHATSAPP 24/7</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Star Product Showcase */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-lg aspect-square bg-brand-yellow/30 brutal-border p-6 shadow-brutal-xl flex items-center justify-center">
              {/* Dotted pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#0a0a0a_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none"></div>

              <Image
                src={product.image}
                alt={product.name}
                width={500}
                height={500}
                unoptimized
                referrerPolicy="no-referrer"
                className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.35)] transition-transform duration-500 hover:scale-105 hover:-rotate-1 cursor-pointer"
                onClick={() => onProductClick(product)}
              />

              {/* FLOATING PRICE STAMP */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 z-20 bg-brand-red text-brand-purewhite brutal-border p-4 shadow-brutal-lg rotate-3 hover:rotate-0 transition-transform">
                <div className="text-[11px] font-mono font-black line-through text-brand-cream/80">
                  ANTES: {formatEuro(was)}€
                </div>
                <div className="font-display font-black text-4xl sm:text-5xl tracking-tight leading-none">
                  {formatEuro(price)}€
                </div>
                <div className="bg-brand-yellow text-brand-black font-mono font-black text-xs px-2 py-0.5 mt-1 inline-block uppercase brutal-border">
                  AHORRO -{discount}%
                </div>
              </div>

              {/* FLOATING FEATURE STICKER TOP-LEFT */}
              <div className="absolute -top-4 -left-4 z-20 bg-brand-black text-brand-yellow brutal-border px-3 py-1.5 shadow-brutal -rotate-3 font-mono font-black text-xs uppercase flex items-center gap-1.5">
                <span className="text-brand-red">🔥</span>
                <span>EDICIÓN LIMITADA 2026</span>
              </div>

              {/* FLOATING SOUND QUALITY PILL */}
              <div className="absolute top-1/2 -left-6 z-20 hidden sm:flex items-center gap-2 bg-brand-purewhite brutal-border px-3 py-1 shadow-brutal font-mono text-xs font-bold">
                <span className="text-brand-cobalt">♪</span>
                <span>HI-RES BASS BOOST</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
