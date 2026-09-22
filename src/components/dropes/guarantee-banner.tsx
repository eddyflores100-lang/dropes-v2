"use client";

import { Truck, BadgeEuro, Lock, RefreshCw } from "lucide-react";

const ITEMS = [
  {
    icon: Truck,
    iconBg: "bg-brand-yellow text-brand-black",
    label: "ESPAÑA & PORTUGAL",
    title: "ENVÍO 24 / 48H",
    desc: "Salida prioritaria desde almacén",
    rotate: "group-hover:rotate-6",
    bg: "",
  },
  {
    icon: BadgeEuro,
    iconBg: "bg-brand-red text-brand-purewhite",
    label: "CERO RIESGOS",
    title: "CONTRA REEMBOLSO",
    desc: "Paga en efectivo al mensajero",
    rotate: "group-hover:-rotate-6",
    bg: "bg-brand-red/10",
  },
  {
    icon: Lock,
    iconBg: "bg-brand-cobalt text-brand-purewhite",
    label: "ENCRIPTACIÓN 256-BIT",
    title: "COMPRA 100% SEGURA",
    desc: "Bizum, Tarjeta o Contrareembolso",
    rotate: "group-hover:rotate-6",
    bg: "",
  },
  {
    icon: RefreshCw,
    iconBg: "bg-brand-purewhite text-brand-black",
    label: "TOTAL SATISFACCIÓN",
    title: "30 DÍAS PRUEBA",
    desc: "Devolución fácil y sin preguntas",
    rotate: "group-hover:-rotate-6",
    bg: "",
  },
];

export function GuaranteeBanner() {
  return (
    <section className="w-full bg-brand-black text-brand-purewhite brutal-border-b">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-brand-purewhite/20">
        {ITEMS.map((item, i) => (
          <div
            key={i}
            className={`p-6 lg:p-8 flex items-center gap-5 hover:bg-white/5 transition-colors group ${item.bg}`}
          >
            <div className={`w-14 h-14 shrink-0 ${item.iconBg} brutal-border flex items-center justify-center shadow-brutal ${item.rotate} transition-transform`}>
              <item.icon className="text-3xl font-black" />
            </div>
            <div>
              <div className="font-mono text-xs font-bold text-brand-yellow uppercase tracking-widest">
                {item.label}
              </div>
              <h3 className="font-display font-black text-xl uppercase tracking-tight">
                {item.title}
              </h3>
              <p className="font-body text-xs text-gray-300 mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
