/**
 * Navbar.tsx — Sticky glass navbar with cart / favorites / login.
 */
import { useState } from 'react';
import { ShoppingBag, Heart, User, Menu, X, Search } from 'lucide-react';
import type { LocalUser } from '@/types';

interface NavbarProps {
  cartCount: number;
  favoritesCount: number;
  user: LocalUser | null;
  onCartClick: () => void;
  onFavoritesClick: () => void;
  onLoginClick: () => void;
  onSearchClick: () => void;
}

const LINKS: ReadonlyArray<{ href: string; label: string; highlight?: boolean }> = [
  { href: '#', label: 'Inicio' },
  { href: '#products-section', label: 'Catálogo' },
  { href: '#categorias', label: 'Categorías' },
  { href: '#payment-methods', label: 'Envíos y Pago' },
  { href: '#products-section', label: 'Super Ventas', highlight: true },
];

export default function Navbar({
  cartCount,
  favoritesCount,
  user,
  onCartClick,
  onFavoritesClick,
  onLoginClick,
  onSearchClick,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Left: logo + mobile toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-2 text-ink-600 hover:text-ink-900"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menú"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <a href="#" className="flex items-center gap-1 text-2xl font-extrabold tracking-tight text-ink-900">
              <span style={{ fontFamily: 'var(--font-display)' }}>Dropes</span>
              <span className="w-2 h-2 bg-brand-600 rounded-full animate-pulse-ring" />
            </a>
          </div>

          {/* Center: desktop nav */}
          <ul className="hidden lg:flex items-center gap-8">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`text-sm font-bold transition-colors ${
                    link.highlight
                      ? 'text-brand-600 hover:text-brand-700'
                      : 'text-ink-600 hover:text-ink-900'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right: actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={onSearchClick}
              className="p-2 text-ink-600 hover:text-ink-900 transition-colors"
              aria-label="Buscar"
              title="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onFavoritesClick}
              className="p-2 text-ink-600 hover:text-brand-600 transition-colors relative"
              aria-label="Favoritos"
              title="Favoritos"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-brand-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white">
                  {favoritesCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={onLoginClick}
              className="p-2 text-ink-600 hover:text-ink-900 transition-colors flex items-center gap-2"
              aria-label={user ? 'Mi cuenta' : 'Iniciar sesión'}
              title={user ? 'Mi cuenta' : 'Iniciar sesión'}
            >
              {user ? (
                <span className="flex items-center gap-2 text-sm font-bold text-ink-900">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center text-xs font-black uppercase">
                    {user.name.slice(0, 1)}
                  </span>
                  <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                </span>
              ) : (
                <User className="w-5 h-5" />
              )}
            </button>
            <button
              type="button"
              onClick={onCartClick}
              className="p-2 text-ink-900 hover:text-brand-600 transition-colors relative"
              aria-label="Carrito"
              title="Abrir carrito"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 min-w-5 h-5 px-1 bg-brand-600 text-white text-[11px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-ink-200 bg-white">
          <ul className="px-4 py-2">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-3 text-sm font-bold ${
                    link.highlight ? 'text-brand-600' : 'text-ink-700'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
