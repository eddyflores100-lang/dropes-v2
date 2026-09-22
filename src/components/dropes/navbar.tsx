"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";

interface NavbarProps {
  onCartOpen: () => void;
  onFavoritesOpen: () => void;
  onSearchOpen: () => void;
}

const NAV_LINKS = [
  { label: "Top Ventas", href: "#catalogo", highlight: true },
  { label: "Catálogo", href: "#catalogo" },
  { label: "Categorías", href: "#categorias" },
  { label: "Flash Sale", href: "#flash-deal", promo: true },
  { label: "Opiniones", href: "#testimonios" },
];

export function Navbar({ onCartOpen, onFavoritesOpen, onSearchOpen }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const cartTotal = useCart((s) =>
    s.items.reduce((acc, i) => acc + parseFloat(i.priceNow.replace(",", ".")) * i.quantity, 0)
  );
  const favCount = useCart((s) => s.favorites.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-9 left-0 right-0 z-40 bg-brand-cream/95 backdrop-blur-md brutal-border-b transition-all ${
          scrolled ? "py-0" : ""
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* LOGO */}
          <Link href="#" className="flex items-center gap-2 group shrink-0">
            <span className="font-display font-black text-3xl sm:text-4xl tracking-tighter text-brand-black uppercase">
              DROPEA<span className="text-brand-red font-black text-4xl leading-none">.</span>
            </span>
            <span className="hidden sm:inline-block bg-brand-black text-brand-purewhite text-[10px] font-mono font-black uppercase px-2 py-0.5 tracking-widest border border-brand-black">
              EDICIÓN 2026
            </span>
          </Link>

          {/* SEARCH BAR */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-6">
            <div className="relative w-full flex items-center">
              <input
                className="w-full bg-brand-purewhite brutal-border px-4 py-2.5 font-body text-sm font-semibold placeholder:text-gray-400 focus:outline-none shadow-brutal transition-all focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none"
                placeholder="Buscar gadgets virales, hogar, audio..."
                type="text"
                onFocus={onSearchOpen}
                readOnly
              />
              <button
                onClick={onSearchOpen}
                className="absolute right-1.5 bg-brand-black text-brand-purewhite p-1.5 hover:bg-brand-red transition-colors"
              >
                <Search className="text-xl leading-none block" />
              </button>
            </div>
          </div>

          {/* NAV LINKS */}
          <nav className="hidden md:flex items-center gap-6 font-headline font-bold text-sm tracking-tight uppercase">
            {NAV_LINKS.map((link) =>
              link.promo ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="bg-brand-red text-brand-purewhite px-2.5 py-1 text-xs font-black tracking-wider uppercase rotate-[-2deg] hover:rotate-0 transition-transform"
                >
                  {link.label}
                </a>
              ) : link.highlight ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-brand-red underline decoration-4 underline-offset-4 font-extrabold"
                >
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-brand-red transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* USER ACTIONS */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onFavoritesOpen}
              className="relative w-10 h-10 brutal-border bg-brand-purewhite hover:bg-brand-yellow flex items-center justify-center shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              aria-label="Favoritos"
            >
              <Heart className="text-xl" />
              {favCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-red text-brand-purewhite font-mono font-black text-xs w-5 h-5 flex items-center justify-center brutal-border">
                  {favCount}
                </span>
              )}
            </button>
            <button
              onClick={onCartOpen}
              className="relative flex items-center gap-2 bg-brand-red text-brand-purewhite brutal-border px-4 py-2 font-headline font-black text-sm uppercase shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline">Cesta</span>
              {cartCount > 0 && (
                <span className="bg-brand-yellow text-brand-black font-mono font-black text-xs px-1.5 py-0.2 border border-brand-black">
                  {cartCount}
                </span>
              )}
              {cartCount > 0 && (
                <span className="hidden lg:inline text-xs font-mono font-bold pl-1 border-l border-brand-purewhite/30">
                  {cartTotal.toFixed(2).replace(".", ",")}€
                </span>
              )}
            </button>
            <button
              className="md:hidden w-10 h-10 brutal-border bg-brand-purewhite flex items-center justify-center shadow-brutal"
              onClick={() => setMobileOpen(true)}
              aria-label="Menú"
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-brand-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-brand-cream brutal-border-l p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display font-black text-2xl uppercase">DROPEA.</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 brutal-border bg-brand-purewhite flex items-center justify-center shadow-brutal"
              >
                <X />
              </button>
            </div>
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`brutal-border bg-brand-purewhite px-4 py-3 font-headline font-black text-sm uppercase shadow-brutal ${
                    link.highlight ? "text-brand-red" : "text-brand-black"
                  } ${link.promo ? "bg-brand-red text-brand-purewhite" : ""}`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <button
              onClick={() => {
                setMobileOpen(false);
                onSearchOpen();
              }}
              className="w-full mt-6 brutal-border bg-brand-yellow text-brand-black py-3 font-headline font-black text-sm uppercase shadow-brutal flex items-center justify-center gap-2"
            >
              <Search /> Buscar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
