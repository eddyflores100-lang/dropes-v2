/**
 * BestSellers.tsx — Catalog grid with filters, search, sort, pagination.
 * Refreshed design: light theme with soft cards and gradient accents.
 */
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart, ShoppingCart, Search, Filter, ChevronLeft, ChevronRight,
  Smartphone, Home, Sparkles, Trophy, Utensils, Baby, Grid, Star,
} from 'lucide-react';
import productsData from '@/data/products.json';
import type { Product, SortOption, Category } from '@/types';
import { discountPercent } from '@/lib/format';

interface BestSellersProps {
  onBuy: (p: Product) => void;
  onProductClick: (p: Product) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  selectedCategory?: string | null;
  showAll?: boolean;
  onShowAll?: () => void;
  searchQuery?: string;
}

const APP_CATEGORIES: Array<{ id: number; name: Category; icon: typeof Grid }> = [
  { id: 1, name: 'Todas', icon: Grid },
  { id: 2, name: 'Tecnología', icon: Smartphone },
  { id: 3, name: 'Hogar', icon: Home },
  { id: 4, name: 'Belleza', icon: Sparkles },
  { id: 5, name: 'Deporte', icon: Trophy },
  { id: 6, name: 'Cocina', icon: Utensils },
  { id: 7, name: 'Niños', icon: Baby },
];

const ITEMS_PER_PAGE = 20;

function ProductCard({
  product,
  index,
  onBuy,
  onProductClick,
  isFavorite,
  onToggleFavorite,
}: {
  product: Product;
  index: number;
  onBuy: (p: Product) => void;
  onProductClick: (p: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 20) * 0.04, duration: 0.4 }}
      className="group bg-white rounded-2xl border border-ink-100 hover:border-brand-300 hover:shadow-2xl hover:shadow-brand-500/10 transition-all overflow-hidden flex flex-col"
      onClick={() => onProductClick(product)}
    >
      <div className="relative aspect-square bg-gradient-to-b from-ink-50 to-white p-6 overflow-hidden">
        {product.tag && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-ink-900 text-white text-[9px] font-black rounded-md uppercase tracking-wider z-10">
            {product.tag}
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(product.id); }}
          className={`absolute top-3 right-3 p-2 rounded-full glass transition-all z-10 ${isFavorite ? 'text-brand-600' : 'text-ink-400 hover:text-brand-600'}`}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-brand-600' : ''}`} />
        </button>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-xl"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {discountPercent(product.priceWas, product.priceNow) > 0 && (
          <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-brand-600 text-white text-[10px] font-black rounded-md">
            -{discountPercent(product.priceWas, product.priceNow)}%
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-2 text-brand-500">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span className="text-[11px] font-bold text-ink-400 uppercase tracking-tight">{product.reviews}</span>
        </div>
        <h3 className="font-bold text-ink-900 text-sm mb-3 line-clamp-2 leading-snug flex-1">{product.name}</h3>
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-ink-100">
          <div>
            <div className="text-lg font-black text-ink-900">{product.priceNow}€</div>
            <div className="text-[11px] text-ink-400 line-through">{product.priceWas}€</div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onBuy(product); }}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            Pedir
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function BestSellers({
  onBuy,
  onProductClick,
  favorites,
  onToggleFavorite,
  selectedCategory,
  showAll,
  onShowAll,
  searchQuery: externalSearch,
}: BestSellersProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(externalSearch ?? '');
  const [sortOption, setSortOption] = useState<SortOption>('relevant');
  const [localCategory, setLocalCategory] = useState<string | null>(selectedCategory ?? null);

  useEffect(() => {
    if (externalSearch !== undefined) setSearchQuery(externalSearch);
  }, [externalSearch]);

  useEffect(() => {
    setLocalCategory(selectedCategory ?? null);
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, sortOption, localCategory]);

  const filtered = useMemo(() => {
    let result = [...productsData] as Product[];
    if (localCategory && localCategory !== 'Todas') {
      result = result.filter((p) => p.category?.toLowerCase() === localCategory.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (sortOption === 'a-z') result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortOption === 'z-a') result.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortOption === 'price-asc') result.sort((a, b) => parseFloat(a.priceNow) - parseFloat(b.priceNow));
    else if (sortOption === 'price-desc') result.sort((a, b) => parseFloat(b.priceNow) - parseFloat(a.priceNow));
    return result;
  }, [localCategory, searchQuery, sortOption]);

  const isFullCatalogView = showAll || selectedCategory || localCategory || searchQuery;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const displayed = isFullCatalogView
    ? filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : filtered.slice(0, 8);

  return (
    <section className="py-16 sm:py-24 bg-ink-50" id="products-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col mb-12 gap-4">
          <div className="flex items-center gap-2">
            <div className="h-[2px] w-8 bg-brand-600" />
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">Exclusive selection</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {isFullCatalogView ? 'Catálogo digital' : <>Los más <span className="text-brand-600">vendidos</span></>}
          </h2>
        </div>

        {isFullCatalogView && (
          <div className="flex flex-col gap-6 mb-10">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {APP_CATEGORIES.map((cat) => {
                const isActive = localCategory === cat.name || (cat.name === 'Todas' && !localCategory);
                return (
                  <button
                    key={cat.id}
                    onClick={() => setLocalCategory(cat.name === 'Todas' ? null : cat.name)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-500/20'
                        : 'bg-white border-ink-200 text-ink-600 hover:border-ink-300 hover:text-ink-900'
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.name}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col md:flex-row gap-3 bg-white border border-ink-100 p-2 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 px-4 flex-1">
                <Search className="w-4 h-4 text-ink-400" />
                <input
                  type="text"
                  placeholder="Buscar por producto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-ink-900 w-full text-sm placeholder:text-ink-400"
                />
              </div>
              <div className="flex items-center gap-2 px-4 border-t md:border-t-0 md:border-l border-ink-100 pt-2 md:pt-0 md:pl-4">
                <Filter className="w-4 h-4 text-ink-400" />
                <select
                  title="Ordenar por"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="bg-ink-50 text-ink-900 border-none rounded-lg px-3 py-2 text-sm font-bold outline-none cursor-pointer appearance-none"
                >
                  <option value="relevant">Relevancia</option>
                  <option value="a-z">A → Z</option>
                  <option value="z-a">Z → A</option>
                  <option value="price-asc">Precio ↑</option>
                  <option value="price-desc">Precio ↓</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayed.length > 0 ? (
            displayed.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onBuy={onBuy}
                onProductClick={onProductClick}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-ink-300" />
              </div>
              <h3 className="text-xl font-bold text-ink-700 mb-2">No se encontraron productos</h3>
              <p className="text-ink-500">Prueba ajustando tu búsqueda o selecciona otra categoría.</p>
            </div>
          )}
        </div>

        {isFullCatalogView && totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-11 h-11 rounded-full border border-ink-200 bg-white flex items-center justify-center text-ink-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ink-50 transition-colors"
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                    currentPage === i + 1
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                      : 'bg-white text-ink-600 border border-ink-200 hover:text-ink-900'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-11 h-11 rounded-full border border-ink-200 bg-white flex items-center justify-center text-ink-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ink-50 transition-colors"
              aria-label="Página siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {!isFullCatalogView && onShowAll && (
          <div className="mt-16 text-center">
            <button
              onClick={() => onShowAll()}
              className="inline-flex items-center gap-3 px-10 py-5 bg-ink-900 text-white rounded-2xl font-bold text-sm uppercase tracking-wider hover:bg-ink-800 transition-colors shadow-xl shadow-ink-900/20 active:scale-95"
            >
              Explorar todo el catálogo
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
