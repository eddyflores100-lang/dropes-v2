/**
 * SearchOverlay.tsx — Full-screen search overlay.
 */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight } from 'lucide-react';
import productsData from '@/data/products.json';
import type { Product } from '@/types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (p: Product) => void;
  onSearch: (query: string) => void;
}

export default function SearchOverlay({ isOpen, onClose, onProductClick, onSearch }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const results = query.trim()
    ? (productsData as Product[])
        .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6)
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-ink-950/80 backdrop-blur-md p-4 sm:p-12"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 p-4 border-b border-ink-100">
              <Search className="w-5 h-5 text-ink-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query.trim()) {
                    onSearch(query);
                    onClose();
                  }
                }}
                placeholder="Buscar productos..."
                className="flex-1 bg-transparent border-none outline-none text-ink-900 text-lg font-medium"
              />
              <button onClick={onClose} className="p-2 rounded-full bg-ink-100 hover:bg-ink-200 transition-colors" aria-label="Cerrar">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {query.trim() === '' ? (
                <div className="p-8 text-center text-ink-400">
                  <Search className="w-12 h-12 mx-auto mb-3 text-ink-200" />
                  <p className="font-medium">Busca en todo el catálogo de Dropes</p>
                  <p className="text-sm mt-1">Prueba con "freidora", "auriculares" o "masajeador"</p>
                </div>
              ) : results.length === 0 ? (
                <div className="p-8 text-center text-ink-400">
                  <p className="font-medium">Sin resultados para "{query}"</p>
                </div>
              ) : (
                <ul className="py-2">
                  {results.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => { onProductClick(p); onClose(); }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-ink-50 transition-colors text-left"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-ink-50 border border-ink-100 p-1 shrink-0">
                          <img src={p.image} alt={p.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-ink-900 text-sm truncate">{p.name}</div>
                          <div className="text-brand-600 font-bold text-sm">{p.priceNow}€</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-ink-300" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {results.length > 0 && (
              <div className="border-t border-ink-100 p-3">
                <button
                  onClick={() => { onSearch(query); onClose(); }}
                  className="w-full py-2.5 bg-ink-900 text-white rounded-xl font-bold text-sm hover:bg-ink-800 transition-colors"
                >
                  Ver todos los resultados ({results.length}+)
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
