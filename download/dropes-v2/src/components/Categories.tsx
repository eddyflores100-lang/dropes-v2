/**
 * Categories.tsx — Category cards grid (anchor navigation).
 */
import { Smartphone, Home, Sparkles, Trophy, Utensils, Baby, ArrowRight } from 'lucide-react';

interface CategoriesProps {
  onSelectCategory: (cat: string) => void;
}

const CATS = [
  { name: 'Tecnología', icon: Smartphone, color: 'from-blue-500 to-cyan-500', count: '28 productos' },
  { name: 'Hogar', icon: Home, color: 'from-amber-500 to-orange-500', count: '109 productos' },
  { name: 'Belleza', icon: Sparkles, color: 'from-pink-500 to-rose-500', count: '35 productos' },
  { name: 'Deporte', icon: Trophy, color: 'from-emerald-500 to-teal-500', count: '12 productos' },
  { name: 'Cocina', icon: Utensils, color: 'from-orange-500 to-red-500', count: '13 productos' },
  { name: 'Niños', icon: Baby, color: 'from-violet-500 to-purple-500', count: '3 productos' },
] as const;

export default function Categories({ onSelectCategory }: CategoriesProps) {
  return (
    <section id="categorias" className="py-16 sm:py-24 bg-ink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-[2px] w-8 bg-brand-600" />
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">Explora</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Compra por <span className="text-brand-600">categoría</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATS.map(({ name, icon: Icon, color, count }) => (
            <button
              key={name}
              onClick={() => onSelectCategory(name)}
              className="group relative bg-white rounded-2xl p-5 border border-ink-100 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10 transition-all overflow-hidden text-left"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-ink-900 text-sm mb-1">{name}</h3>
              <p className="text-[11px] text-ink-400">{count}</p>
              <ArrowRight className="w-4 h-4 text-ink-300 group-hover:text-brand-600 group-hover:translate-x-1 transition-all absolute top-5 right-5" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
