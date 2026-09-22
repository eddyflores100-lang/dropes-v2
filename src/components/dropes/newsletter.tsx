"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setDone(true);
  };

  return (
    <section className="w-full py-16 bg-brand-yellow brutal-border-b overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-brand-black text-brand-purewhite brutal-border p-8 sm:p-12 lg:p-16 shadow-brutal-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-block bg-brand-red text-white font-mono text-xs font-black uppercase px-3 py-1">
                DROPEA VIP CLUB
              </div>
              <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight leading-none">
                ÚNETE Y LLÉVATE <br />
                <span className="text-brand-yellow italic">UN 10% EXTRA.</span>
              </h2>
              <p className="font-body text-base sm:text-lg text-gray-300 font-semibold max-w-xl">
                Acceso anticipado a lanzamientos virales, códigos secretos y liquidaciones flash antes de que salgan en redes sociales.
              </p>
            </div>
            <div className="lg:col-span-5">
              <form onSubmit={submit} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-purewhite text-brand-black brutal-border px-5 py-4 font-headline font-bold text-sm placeholder:text-gray-500 focus:outline-none shadow-brutal"
                  placeholder="Introduce tu correo electrónico..."
                />
                <button
                  type="submit"
                  className="w-full bg-brand-yellow hover:bg-brand-red text-brand-black hover:text-white brutal-border py-4 font-headline font-black text-base uppercase tracking-wider shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <span>QUIERO MI 10% DE DESCUENTO</span>
                  <ArrowRight className="font-black" />
                </button>
              </form>
              {done && (
                <div className="mt-3 p-3 bg-brand-yellow text-brand-black font-mono text-xs font-black uppercase brutal-border">
                  ¡LISTO! Revisa tu correo, acabamos de enviarte tu cupón de bienvenida.
                </div>
              )}
              <div className="flex items-center gap-4 mt-3 font-mono text-[11px] text-gray-400">
                <span>✓ SIN SPAM</span>
                <span>✓ CANCELACIÓN CON 1 CLIC</span>
                <span>✓ DATOS PROTEGIDOS EN ESPAÑA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
