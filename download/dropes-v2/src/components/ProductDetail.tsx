/**
 * ProductDetail.tsx — Full-screen product modal with tabs + related.
 * Refreshed design: dark theme with glassmorphism, gradient accents.
 */
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Heart, ShoppingBag, Star, Shield, Truck, RotateCcw, ArrowLeft,
  Sparkles, Zap, ChevronRight, CheckCircle2, TrendingUp, AlertCircle,
} from 'lucide-react';
import productsData from '@/data/products.json';
import type { Product } from '@/types';

interface ProductDetailProps {
  product: Product;
  isFavorite: boolean;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  onToggleFavorite: (id: string) => void;
}

export default function ProductDetail({
  product,
  isFavorite,
  onClose,
  onAddToCart,
  onToggleFavorite,
}: ProductDetailProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'specs'>('info');
  const [isScrolled, setIsScrolled] = useState(false);

  const related = useMemo(
    () => [...productsData]
      .filter((p) => p.id !== product.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4) as Product[],
    [product]
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-ink-950 text-white overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className={`sticky top-0 z-50 flex items-center justify-between px-5 sm:px-6 h-20 transition-all ${isScrolled ? 'bg-ink-950/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
        <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-colors" aria-label="Volver">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <AnimatePresence>
          {isScrolled && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex-1 px-8 truncate text-center font-bold tracking-tight text-sm"
            >
              {product.name}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(product.id)}
            className={`p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-colors ${isFavorite ? 'text-brand-500' : 'text-white/40'}`}
            aria-label="Favoritos"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-brand-500' : ''}`} />
          </button>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-white/40 hover:text-brand-500 transition-colors" aria-label="Cerrar">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 50)}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 lg:py-16 grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="relative">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="relative aspect-square rounded-[2rem] bg-gradient-to-br from-ink-900/80 to-ink-950 border border-white/5 flex items-center justify-center p-8 sm:p-12 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.12),transparent_70%)] opacity-80" />
              <img src={product.image} alt={product.name} className="w-full h-full object-contain relative z-10 drop-shadow-2xl" referrerPolicy="no-referrer" />
              <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
                <span className="bg-brand-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3" /> Destacado hoy
                </span>
                <span className="bg-white/5 backdrop-blur-md text-ink-300 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider border border-white/5">
                  Stock limitado
                </span>
              </div>
            </motion.div>

            <div className="mt-6 flex gap-3 justify-center">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`w-16 h-16 rounded-2xl border ${i === 1 ? 'border-brand-600' : 'border-white/5'} bg-ink-900/50 p-3 cursor-pointer hover:border-brand-500/50 transition-colors`}>
                  <img src={product.image} alt="" className="w-full h-full object-contain opacity-50 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex text-brand-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-xs font-bold text-ink-400 uppercase tracking-wider">{product.reviews}</span>
                <span className="h-1 w-1 bg-ink-700 rounded-full" />
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> En stock
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                {product.name}
              </h1>

              <div className="flex items-end gap-4 mb-8">
                <div className="bg-ink-900 border border-white/5 rounded-2xl p-4 flex flex-col">
                  <span className="text-[10px] font-bold text-ink-500 uppercase tracking-wider mb-1">Oferta</span>
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>{product.priceNow}€</span>
                </div>
                <div className="flex flex-col mb-1">
                  <span className="text-base text-ink-500 line-through font-bold">{product.priceWas}€</span>
                  <span className="flex items-center gap-1 text-brand-500 font-bold text-[11px] uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 fill-current" /> Ahorras {(parseFloat(product.priceWas) - parseFloat(product.priceNow)).toFixed(2)}€
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 mb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onAddToCart(product)}
                  className="w-full h-14 sm:h-16 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-2xl shadow-brand-900/40 transition-all"
                >
                  <ShoppingBag className="w-6 h-6" />
                  Pedir ahora
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-ink-500 uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5 text-brand-500" />
                  ¡Quedan pocas unidades en oferta!
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-10">
                {[
                  { icon: Truck, label: 'Envío 24H' },
                  { icon: Shield, label: 'Pago seguro' },
                  { icon: RotateCcw, label: 'Devolución 30d' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/5 border border-white/5">
                    <Icon className="w-5 h-5 text-brand-500 mb-1.5" />
                    <span className="text-[10px] font-bold uppercase text-ink-300">{label}</span>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex gap-6 mb-6 border-b border-white/5">
                  {(['info', 'specs'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 text-xs font-bold tracking-wider uppercase relative transition-colors ${activeTab === tab ? 'text-white' : 'text-ink-500 hover:text-ink-300'}`}
                    >
                      {tab === 'info' ? 'Detalles' : 'Ficha técnica'}
                      {activeTab === tab && (
                        <motion.div layoutId="tab-underline" className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand-600" />
                      )}
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-ink-400 text-sm leading-relaxed"
                  >
                    {activeTab === 'info' ? (
                      <div>
                        {product.description ? (
                          <div dangerouslySetInnerHTML={{ __html: product.description }} />
                        ) : (
                          <p>Producto premium de la selección Dropes, con garantía oficial de 2 años. Diseñado para ofrecer la máxima calidad y durabilidad. Incluye todos los accesorios necesarios para un uso inmediato.</p>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Marca', value: product.brand || 'Dropes' },
                          { label: 'Garantía', value: '2 años España' },
                          { label: 'Envío', value: 'Gratis 24-48h' },
                          { label: 'Origen', value: 'UE' },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="text-[10px] text-ink-500 font-bold uppercase mb-1">{label}</div>
                            <div className="text-white font-bold text-sm">{value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>

        <section className="mt-20 px-6 py-20 bg-black/40">
          <h2 className="text-3xl font-black text-white mb-10 tracking-tight flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
            <Zap className="w-7 h-7 text-brand-500 fill-brand-500" />
            También te puede interesar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-ink-900/50 rounded-2xl p-3 border border-white/5 hover:border-brand-500/30 transition-all group cursor-pointer overflow-hidden"
                onClick={() => onAddToCart(p)}
              >
                <div className="aspect-square rounded-xl bg-ink-950/40 overflow-hidden mb-3 p-4">
                  <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <h3 className="font-bold text-white text-xs line-clamp-2 mb-3">{p.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-black text-white text-lg">{p.priceNow}€</span>
                  <button className="p-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors active:scale-90" aria-label="Añadir al carrito">
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Mobile sticky CTA */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="lg:hidden fixed bottom-4 left-4 right-4 p-4 bg-ink-900/90 backdrop-blur-xl border border-white/10 z-50 flex items-center gap-4 rounded-2xl shadow-2xl"
      >
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-ink-400 uppercase tracking-wider">Hoy solo</span>
          <span className="text-xl font-black text-brand-500">{product.priceNow}€</span>
        </div>
        <button
          onClick={() => onAddToCart(product)}
          className="flex-1 h-14 bg-brand-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-5 h-5" />
          Pedir ahora
        </button>
      </motion.div>
    </motion.div>
  );
}
