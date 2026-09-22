"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-store";

interface NavbarProps {
  onCartOpen: () => void;
  onFavoritesOpen: () => void;
  onSearchOpen: () => void;
}

const NAV_LINKS = [
  { label: "Tienda", href: "#catalogo" },
  { label: "Categorías", href: "#categorias" },
  { label: "Novedades", href: "#novedades" },
  { label: "Envíos", href: "#envios" },
  { label: "Diario", href: "#diario" },
];

export function Navbar({ onCartOpen, onFavoritesOpen, onSearchOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const favCount = useCart((s) => s.favorites.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: menu mobile + logo */}
          <div className="flex items-center gap-3">
            <button
              className="grid h-10 w-10 place-items-center rounded-full text-foreground md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link
              href="/"
              className="font-display text-2xl tracking-tight text-foreground"
            >
              Dropes
            </Link>
          </div>

          {/* Center: nav links */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="link-underline text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={onSearchOpen}
              className="grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:bg-clay-50"
              aria-label="Buscar"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <button
              onClick={onFavoritesOpen}
              className="relative grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:bg-clay-50"
              aria-label="Favoritos"
            >
              <Heart className="h-[18px] w-[18px]" />
              {favCount > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-clay-600 px-1 text-[10px] font-medium text-white">
                  {favCount}
                </span>
              )}
            </button>
            <button
              onClick={onCartOpen}
              className="relative grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:bg-clay-50"
              aria-label="Carrito"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-foreground px-1 text-[10px] font-medium text-background">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-background p-6 shadow-2xl md:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-display text-2xl">Dropes</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full hover:bg-clay-50"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-clay-50"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 border-t border-border pt-6">
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    onCartOpen();
                  }}
                  className="w-full justify-center"
                >
                  Ver carrito ({cartCount})
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
