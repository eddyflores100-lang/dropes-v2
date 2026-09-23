/**
 * UpsellModal.tsx — Time-limited upsell offer shown after first checkout close.
 */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ShoppingBag, ArrowRight, ShieldCheck, Timer } from 'lucide-react';
import type { Product } from '@/types';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (p: Product) => void;
  baseProduct: Product | null;
}

const UPSELL_PRODUCT: Product = {
  id: 'upsell-premium-kit',
  numeric_id: 11619,
  name: 'Kit Premium de Limpieza & Cuidado',
  priceNow: '12.99',
  priceWas: '29.99',
  profit: '6.99',
  original_cost: '6.00',
  image: 'https://api.dropea.com/11619/product-file',
  stars: '4.8',
  reviews: '156 opiniones',
  category: 'Hogar',
  tag: '',
  description: 'Protege y mantén tus productos como nuevos con nuestro kit profesional. ¡Oferta única solo por hoy!',
};

export default function UpsellModal({ isOpen, onClose, onAccept, baseProduct }: UpsellModalProps) {
  const [seconds, setSeconds] = useState(600);

  useEffect(() => {
    if (!isOpen) return;
    setSeconds(600);
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [isOpen]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full relative"
          >
            <div className="bg-gradient-to-r from-brand-600 to-brand-500 p-5 text-white text-center relative overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-10 -right-10 w-28 h-28 border-4 border-white/10 rounded-full"
              />
              <h2 className="text-xs font-bold tracking-wider mb-1 uppercase">Oferta exclusiva</h2>
              <p className="text-xl font-black tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>¡Espera! No te vayas sin esto</p>
            </div>

            <div className="p-6">
              <div className="flex gap-4 mb-6">
                <div className="w-24 h-24 rounded-2xl bg-ink-50 overflow-hidden shrink-0">
                  <img src={UPSELL_PRODUCT.image} alt={UPSELL_PRODUCT.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-ink-900 mb-2 leading-tight">{UPSELL_PRODUCT.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-black text-brand-600">{UPSELL_PRODUCT.priceNow}€</span>
                    <span className="text-sm text-ink-400 line-through">{UPSELL_PRODUCT.priceWas}€</span>
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">-60%</span>
                  </div>
                  <p className="text-xs text-ink-500 leading-relaxed">
                    Añádelo a tu pedido de <strong className="text-ink-700">{baseProduct?.name ?? 'productos'}</strong> y protégelos.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-ink-50 rounded-xl p-3 mb-6">
                <div className="flex items-center gap-2 text-ink-600">
                  <Timer className="w-4 h-4 text-brand-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">Expira en</span>
                </div>
                <span className="font-mono text-lg font-black text-brand-600 tabular-nums">{fmt(seconds)}</span>
              </div>

              <div className="space-y-2 mb-6 text-xs font-medium text-ink-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Garantía extendida de por vida</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Compatible con tus pedidos actuales</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onAccept(UPSELL_PRODUCT)}
                  className="w-full bg-ink-900 text-white py-3.5 rounded-xl text-base font-bold flex items-center justify-center gap-2 hover:bg-ink-800 transition-colors active:scale-[0.98]"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Sí, lo quiero por {UPSELL_PRODUCT.priceNow}€
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2 text-ink-400 text-sm font-semibold hover:text-ink-600 transition-colors"
                >
                  No gracias, prefiero pagar el precio completo luego
                </button>
              </div>
            </div>

            <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-black/10 hover:bg-black/20 rounded-full text-white transition-colors" aria-label="Cerrar">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
