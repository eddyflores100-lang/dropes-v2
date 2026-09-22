"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const TRUST = [
  { icon: Truck, label: "Envío gratis 24-48h", desc: "Toda España y Portugal península" },
  { icon: ShieldCheck, label: "Pago seguro", desc: "Encriptación SSL 256-bit" },
  { icon: RotateCcw, label: "30 días devolución", desc: "Sin preguntas, sin coste" },
  { icon: Headphones, label: "Soporte humano", desc: "Lun-Sáb 9-21h" },
];

const LINKS = {
  tienda: ["Catálogo", "Categorías", "Novedades", "Super ventas", "Outlet"],
  ayuda: ["Envíos y pago", "Devoluciones", "Garantía", "Contacto", "FAQ"],
  empresa: ["Sobre Dropes", "Diario", "Sostenibilidad", "Trabaja con nosotros"],
};

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-clay-50/40">
      {/* Trust strip */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {TRUST.map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-center gap-3"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-clay-100 text-clay-700">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-b border-border bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:px-8">
          <div>
            <h3 className="font-display text-3xl tracking-tight">
              Únete al <span className="font-display-italic text-clay-300">diario</span>
            </h3>
            <p className="mt-2 text-sm text-background/70">
              Ofertas exclusivas y nuevas piezas, una vez por semana. Sin spam.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-md gap-2"
          >
            <input
              type="email"
              required
              placeholder="tu@email.com"
              className="h-12 flex-1 rounded-full border border-background/20 bg-background/10 px-5 text-sm text-background placeholder:text-background/50 outline-none focus:border-clay-400"
            />
            <button
              type="submit"
              className="h-12 shrink-0 rounded-full bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-clay-100"
            >
              Suscribirme
            </button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2">
            <p className="font-display text-2xl">Dropes</p>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Curaduría de piezas premium para el hogar, la belleza y la tecnología.
              Envío gratis en 24-48h a España y Portugal.
            </p>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Tienda
            </p>
            <ul className="space-y-2.5">
              {LINKS.tienda.map((l) => (
                <li key={l}>
                  <a href="#catalogo" className="link-underline text-sm text-foreground">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Ayuda
            </p>
            <ul className="space-y-2.5">
              {LINKS.ayuda.map((l) => (
                <li key={l}>
                  <a href="#" className="link-underline text-sm text-foreground">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Empresa
            </p>
            <ul className="space-y-2.5">
              {LINKS.empresa.map((l) => (
                <li key={l}>
                  <a href="#" className="link-underline text-sm text-foreground">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Dropes. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="link-underline">Aviso legal</a>
            <a href="#" className="link-underline">Privacidad</a>
            <a href="#" className="link-underline">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
