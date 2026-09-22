"use client";

import { useState } from "react";
import { Navbar } from "@/components/dropes/navbar";
import { Hero } from "@/components/dropes/hero";
import { Marquee } from "@/components/dropes/marquee";
import { Categories } from "@/components/dropes/categories";
import { FeatureSection } from "@/components/dropes/feature-section";
import { Catalog } from "@/components/dropes/catalog";
import { Footer } from "@/components/dropes/footer";
import { ProductModal } from "@/components/dropes/product-modal";
import { CartDrawer } from "@/components/dropes/cart-drawer";
import { CheckoutModal } from "@/components/dropes/checkout-modal";
import { SearchOverlay } from "@/components/dropes/search-overlay";
import { FavoritesDrawer } from "@/components/dropes/favorites-drawer";
import { topProducts } from "@/lib/format";
import type { Product, Category } from "@/lib/types";
import productsData from "@/data/products.json";

const ALL_PRODUCTS = productsData as Product[];
const FEATURED = topProducts(ALL_PRODUCTS, 3);

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);

  const handleCategory = (c: Category) => {
    setCategory(c);
    setTimeout(() => {
      document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <main className="min-h-screen">
      <Navbar
        onCartOpen={() => setCartOpen(true)}
        onFavoritesOpen={() => setFavoritesOpen(true)}
        onSearchOpen={() => setSearchOpen(true)}
      />

      <Hero products={FEATURED} onProductClick={setSelectedProduct} />

      <Marquee />

      <Categories onSelect={handleCategory} />

      <FeatureSection products={FEATURED} onOpen={setSelectedProduct} />

      <Catalog
        products={ALL_PRODUCTS}
        onOpen={setSelectedProduct}
        selectedCategory={category}
      />

      <Footer />

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
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
      <FavoritesDrawer
        isOpen={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        onOpenProduct={setSelectedProduct}
      />
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpenProduct={setSelectedProduct}
        products={ALL_PRODUCTS}
      />
    </main>
  );
}
