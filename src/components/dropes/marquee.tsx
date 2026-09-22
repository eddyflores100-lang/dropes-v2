"use client";

import { motion } from "motion/react";

const ITEMS = [
  "Envío gratis 24-48h",
  "Contra reembolso disponible",
  "30 días de devolución",
  "Garantía oficial 2 años",
  "Curaduría premium",
  "Pago seguro SSL",
  "Soporte humano lun-sáb",
  "Bizum disponible",
];

export function Marquee() {
  return (
    <div className="border-y border-border bg-foreground py-3.5 text-background">
      <div className="flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee items-center gap-12 pr-12">
          {[...ITEMS, ...ITEMS].map((item, i) => (
            <motion.span
              key={i}
              className="whitespace-nowrap text-xs uppercase tracking-[0.25em]"
            >
              {item}
              <span className="ml-12 inline-block text-clay-400">✦</span>
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
