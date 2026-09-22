/**
 * FlashSale.tsx — Top 4 "flash sale" products with countdown.
 */
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Zap, ChevronRight } from 'lucide-react';
import productsData from '@/data/products.json';
import type { Product } from '@/types';
import { discountPercent } from '@/lib/format';

interface FlashSaleProps {
  onProductClick: (p: Product) => void;
}

export default function FlashSale({ onProductClick }: FlashSaleProps) {
  const products = productsData.slice(4, 8) as Product[];
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const diff = end.getTime() - now.getTime();
      const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setRemaining(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-ink-950 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-900/30 to-transparent pointer-events-none" />
      <div className="absolute -left-32 top-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-brand-500 fill-brand-500" />
              <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">Flash Sale</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Ofertas que <span className="text-brand-500">terminan hoy</span>
            </h2>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs text-ink-400 uppercase tracking-wider">Termina en</span>
            <span className="font-mono text-2xl font-black text-brand-500 tabular-nums">{remaining}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onProductClick(p)}
              className="group cursor-pointer bg-ink-900/60 border border-white/5 rounded-2xl overflow-hidden hover:border-brand-500/30 transition-colors"
            >
              <div className="relative aspect-square bg-gradient-to-b from-ink-800/50 to-ink-950/50 p-6 overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" loading="lazy" referrerPolicy="no-referrer" />
                <span className="absolute top-3 left-3 px-2 py-1 bg-brand-600 text-white text-[10px] font-black rounded-md uppercase tracking-wider">
                  -{discountPercent(p.priceWas, p.priceNow)}%
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-white line-clamp-2 mb-3 min-h-[2.5rem]">{p.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-white">{p.priceNow}€</span>
                    <span className="text-xs text-ink-500 line-through">{p.priceWas}€</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-brand-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
