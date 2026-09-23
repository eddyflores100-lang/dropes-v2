"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  { icon: "bolt", text: "ULTRA AHORRO: 3X2 EN TODO EL CATÁLOGO" },
  { icon: "local_shipping", text: "ENVÍO GRATIS A PARTIR DE 35€ EN 24/48H" },
  { highlight: true, text: "PAGO CONTRA REEMBOLSO DISPONIBLE" },
  { icon: "verified", text: "30 DÍAS DE PRUEBA 100% GARANTIZADO" },
  { text: "STOCK LIMITADO HUB MADRID & BARCELONA", red: true },
];

export function Marquee() {
  const [items] = useState(MESSAGES);
  const Group = () => (
    <div className="flex items-center gap-6 px-4 shrink-0 uppercase">
      {items.map((m, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {m.icon && (
            <span className="material-symbols-outlined text-base">{m.icon}</span>
          )}
          {m.highlight ? (
            <span className="bg-brand-black text-brand-yellow px-2 py-0.5 font-black">
              {m.text}
            </span>
          ) : m.red ? (
            <span className="text-brand-red font-black">{m.text}</span>
          ) : (
            <span>{m.text}</span>
          )}
          <span>•</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-brand-yellow text-brand-black brutal-border-b overflow-hidden font-mono text-xs sm:text-sm font-bold tracking-wider py-2">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        <Group />
        <Group />
      </div>
    </div>
  );
}
