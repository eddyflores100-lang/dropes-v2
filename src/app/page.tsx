"use client";

import { useState } from "react";
import { Marquee } from "@/components/dropes/marquee";
import { Navbar } from "@/components/dropes/navbar";
import { Hero } from "@/components/dropes/hero";
import { GuaranteeBanner } from "@/components/dropes/guarantee-banner";
import { FlashSale } from "@/components/dropes/flash-sale";
import { Catalog } from "@/components/dropes/catalog";
import { Categories } from "@/components/dropes/categories";
import { Testimonials } from "@/components/dropes/testimonials";
import { Newsletter } from "@/components/dropes/newsletter";
import { Footer } from "@/components/dropes/footer";
import { SocialProofPopup } from "@/components/dropes/social-proof-popup";
import { ProductModal } from "@/components/dropes/product-modal";
import { CartDrawer, CheckoutModal, SearchOverlay, FavoritesDrawer } from "@/components/dropes/overlays";
import { useCart } from "@/lib/cart-store";
import type { Product, Category } from "@/lib/types";
import productsData from "@/data/products.json";

const ALL_PRODUCTS = productsData as Product[];
const HERO_PRODUCT = ALL_PRODUCTS.find((p) => p.id === "64") ?? ALL_PRODUCTS[2]; // Auriculares
const FLASH_PRODUCT = ALL_PRODUCTS.find((p) => p.name.toLowerCase().includes("masajeador")) ?? ALL_PRODUCTS[8];

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const add = useCart((s) => s.add);

  const handleCategory = (c: Category) => {
    setCategory(c);
    setTimeout(() => {
      document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <main className="min-h-screen">
      <Marquee />
      <Navbar
        onCartOpen={() => setCartOpen(true)}
        onFavoritesOpen={() => setFavoritesOpen(true)}
        onSearchOpen={() => setSearchOpen(true)}
      />

      <div className="pt-9">
        <Hero product={HERO_PRODUCT} onProductClick={setSelectedProduct} />
        <GuaranteeBanner />
        <FlashSale product={FLASH_PRODUCT} onBuy={add} />
        <Catalog products={ALL_PRODUCTS} onOpen={setSelectedProduct} selectedCategory={category} />
        <Categories onSelect={handleCategory} />
        <Testimonials />
        <Newsletter />
        <Footer />
      </div>

      <SocialProofPopup />

      {/* Back to top */}
      <a
        href="#"
        aria-label="Volver arriba"
        className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-brand-yellow hover:bg-brand-red text-brand-black hover:text-white brutal-border flex items-center justify-center shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
      >
        <span className="font-display font-black text-2xl">↑</span>
      </a>

      {/* Overlays */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenProduct={setSelectedProduct}
      />
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />
      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      <FavoritesDrawer
        isOpen={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        onOpenProduct={setSelectedProduct}
      />
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpenProduct={setSelectedProduct}
      />
    </main>
  );
}
