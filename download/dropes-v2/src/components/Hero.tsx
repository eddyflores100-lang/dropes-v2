/**
 * Hero.tsx — Carousel of top 3 products with floating price tag.
 * Refreshed design: soft mesh background, glass buttons, gradient accents.
 */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import productsData from '@/data/products.json';
import type { Product } from '@/types';
import { discountPercent } from '@/lib/format';

interface HeroProps {
  onProductClick: (p: Product) => void;
}

export default function Hero({ onProductClick }: HeroProps) {
  const slides = productsData.slice(0, 3) as Product[];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  const next = () => setCurrent((p) => (p + 1) % slides.length);
  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);
  const active = slides[current];

  return (
    <section className="relative overflow-hidden mesh-bg bg-white py-10 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Text */}
        <div className="relative z-10 order-2 lg:order-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-[11px] font-bold tracking-wider uppercase mb-6 border border-brand-100">
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-brand-600 rounded-full"
                />
                Líder en ventas {new Date().getFullYear()}
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-ink-900 leading-[0.95] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                {active.name.split(' ').slice(0, 3).join(' ')}
                <br />
                <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 bg-clip-text text-transparent">
                  Premium.
                </span>
              </h1>

              <p className="text-lg text-ink-500 mb-10 max-w-md leading-relaxed">
                Calidad premium con <strong className="text-ink-900">envío gratis</strong> en 24-48h a toda la península. Garantía total de 2 años.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onProductClick(active)}
                  className="w-full sm:w-auto px-8 py-4 bg-ink-900 text-white rounded-2xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-ink-900/30 hover:bg-ink-800 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Comprar ahora
                  <ChevronRight className="w-4 h-4" />
                </motion.button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={prev}
                    aria-label="Anterior"
                    className="w-12 h-12 flex items-center justify-center rounded-2xl glass text-ink-600 hover:text-ink-900 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Siguiente"
                    className="w-12 h-12 flex items-center justify-center rounded-2xl glass text-ink-600 hover:text-ink-900 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 border-t border-ink-100 pt-8">
                {[
                  { icon: ShieldCheck, label: 'Garantía', value: '2 años' },
                  { icon: Truck, label: 'Envío', value: '24-48h gratis' },
                  { icon: Sparkles, label: 'Calidad', value: 'IA verificada' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl text-white">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-ink-400 tracking-wider">{label}</div>
                      <div className="text-sm font-bold text-ink-900">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Image */}
        <div className="relative order-1 lg:order-2">
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 w-full aspect-square max-w-[520px] mx-auto group cursor-pointer"
            onClick={() => onProductClick(active)}
          >
            {/* Glass card */}
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-ink-100 to-white shadow-2xl shadow-ink-900/10 border border-white/40 overflow-hidden p-12">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  initial={{ scale: 0.85, opacity: 0, rotate: -8 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 1.15, opacity: 0, rotate: 8 }}
                  transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                  src={active.image}
                  alt={active.name}
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
              </AnimatePresence>
            </div>

            {/* Floating price tag */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: -10 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="absolute -bottom-4 -right-2 sm:-right-6 bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-ink-100 group-hover:scale-105 transition-transform"
            >
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-ink-400 line-through">{active.priceWas}€</span>
                <span className="text-3xl sm:text-4xl font-black text-ink-900 tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
                  {active.priceNow}€
                </span>
                <span className="mt-1 px-2 py-0.5 bg-brand-600 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                  -{discountPercent(active.priceWas, active.priceNow)}%
                </span>
              </div>
            </motion.div>
          </motion.div>

          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-100/40 rounded-full blur-[120px] scale-150 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
