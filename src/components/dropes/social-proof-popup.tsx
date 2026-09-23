"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const NOTIFICATIONS = [
  { name: "Ana S.", location: "Bilbao", product: "Almohada Cervical", time: "hace 14 min" },
  { name: "Pedro J.", location: "Málaga", product: "Freidora de Aire", time: "hace 8 min" },
  { name: "Carmen R.", location: "Valencia", product: "Auriculares Wireless", time: "hace 3 min" },
  { name: "Diego M.", location: "Sevilla", product: "Compostador Eléctrico", time: "hace 22 min" },
];

export function SocialProofPopup() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (closed) return;
    const show = setTimeout(() => setVisible(true), 4000);
    const rot = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((p) => (p + 1) % NOTIFICATIONS.length);
        setVisible(true);
      }, 600);
    }, 10000);
    return () => {
      clearTimeout(show);
      clearInterval(rot);
    };
  }, [closed]);

  if (closed) return null;
  const n = NOTIFICATIONS[index];

  return (
    <aside
      className={`fixed bottom-6 left-6 z-40 hidden md:flex items-center gap-3 bg-brand-purewhite brutal-border p-3 shadow-brutal max-w-xs transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
      }`}
    >
      <button
        onClick={() => setClosed(true)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-brand-red text-white brutal-border flex items-center justify-center"
        aria-label="Cerrar"
      >
        <X className="text-xs" />
      </button>
      <div className="w-10 h-10 bg-emerald-500 text-white brutal-border flex items-center justify-center shrink-0">
        <span className="font-display font-black text-lg">✓</span>
      </div>
      <div className="min-w-0 pr-2">
        <p className="font-headline font-black text-xs uppercase text-brand-black truncate">
          {n.name} en {n.location}
        </p>
        <p className="font-mono text-[10px] text-gray-600 font-bold truncate">
          Compró {n.product} • {n.time}
        </p>
      </div>
    </aside>
  );
}
