/**
 * App.tsx — Root component for Dropes v2.
 * Wires up cart, favorites, auth, search, checkout, and SEO.
 */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustRibbon from '@/components/TrustRibbon';
import FlashSale from '@/components/FlashSale';
import BestSellers from '@/components/BestSellers';
import Categories from '@/components/Categories';
import Testimonials from '@/components/Testimonials';
import WhyUs from '@/components/WhyUs';
import PaymentMethods from '@/components/PaymentMethods';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import SocialProofPopup from '@/components/SocialProofPopup';
import CheckoutModal from '@/components/CheckoutModal';
import ProductDetail from '@/components/ProductDetail';
import UpsellModal from '@/components/UpsellModal';
import PromoBanner from '@/components/PromoBanner';
import LoginModal from '@/components/LoginModal';
import FavoritesDrawer from '@/components/FavoritesDrawer';
import SearchOverlay from '@/components/SearchOverlay';

import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';

import { hasSeenUpsell, markUpsellSeen } from '@/lib/storage';
import { applySeo } from '@/lib/seo';
import type { Product } from '@/types';

export default function App() {
  const cart = useCart();
  const favorites = useFavorites();
  const auth = useAuth();
  const orders = useOrders();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showUpsell, setShowUpsell] = useState(false);
  const [showDownsell, setShowDownsell] = useState(false);
  const [showAllCatalog, setShowAllCatalog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [externalSearch, setExternalSearch] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<Product | null>(null);

  // Default SEO
  useEffect(() => {
    applySeo({
      title: 'Dropes — Tienda Online Premium | Envío 24h España y Portugal',
      description: 'Catálogo premium con envío gratis en 24-48h. Contra reembolso o tarjeta/Bizum.',
      canonical: 'https://dropes.example.com/',
    });
  }, []);

  const handleAddToCart = (product: Product) => {
    cart.addItem(product);
    setLastAdded(product);
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
    // Show upsell once per session when cart has items
    if (cart.cart.length > 0 && !hasSeenUpsell() && !cart.cart.find((i) => i.id === 'upsell-premium-kit')) {
      setShowUpsell(true);
      markUpsellSeen();
    }
  };

  const handleSearch = (q: string) => {
    setExternalSearch(q);
    setShowAllCatalog(true);
    setTimeout(() => {
      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SocialProofPopup />

      {/* Scroll-to-top FAB */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-11 h-11 bg-brand-600 hover:bg-brand-700 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-xl shadow-brand-600/30 transition-all hover:scale-110 z-40"
        aria-label="Volver arriba"
      >
        ↑
      </button>

      <AnnouncementBar />
      <PromoBanner />
      <Navbar
        cartCount={cart.count}
        favoritesCount={favorites.count}
        user={auth.user}
        onCartClick={() => setIsCartOpen(true)}
        onFavoritesClick={() => setIsFavoritesOpen(true)}
        onLoginClick={() => setIsLoginOpen(true)}
        onSearchClick={() => setIsSearchOpen(true)}
      />

      <AnimatePresence>
        {showDownsell && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-amber-400 text-ink-900 py-2 px-4 text-center text-xs font-bold tracking-wider relative z-50 overflow-hidden"
          >
            <motion.div
              animate={{ x: [-1000, 1000] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-40"
            />
            🎁 ¡Oferta relámpago activada! Recibe un regalo sorpresa con tu pedido
            <button onClick={() => setShowDownsell(false)} className="ml-4 underline hover:text-ink-700">Cerrar</button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        <Hero onProductClick={setSelectedProduct} />
        <TrustRibbon />
        <FlashSale onProductClick={setSelectedProduct} />
        <BestSellers
          onBuy={handleAddToCart}
          onProductClick={setSelectedProduct}
          favorites={favorites.favorites}
          onToggleFavorite={favorites.toggle}
          selectedCategory={selectedCategory}
          showAll={showAllCatalog}
          onShowAll={() => setShowAllCatalog(true)}
          searchQuery={externalSearch}
        />
        <Categories
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setShowAllCatalog(true);
            document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
        <Testimonials />
        <WhyUs />
        <PaymentMethods />
        <Newsletter />
      </main>

      <Footer />

      {/* Modals & overlays */}
      {isCartOpen && (
        <CheckoutModal
          cart={cart.cart}
          onClose={handleCloseCart}
          onUpdateQuantity={cart.updateQuantity}
          onClearCart={cart.clear}
          onOrderConfirmed={orders.addOrder}
          userEmail={auth.user?.email}
        />
      )}

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          isFavorite={favorites.isFavorite(selectedProduct.id)}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p) => {
            handleAddToCart(p);
            setSelectedProduct(null);
          }}
          onToggleFavorite={favorites.toggle}
        />
      )}

      <UpsellModal
        isOpen={showUpsell}
        onClose={() => {
          setShowUpsell(false);
          setShowDownsell(true);
        }}
        onAccept={(p) => {
          handleAddToCart(p);
          setShowUpsell(false);
          setIsCartOpen(true);
        }}
        baseProduct={lastAdded}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        user={auth.user}
        onSignIn={auth.signIn}
        onSignOut={auth.signOut}
        orders={orders.orders}
      />

      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites.favorites}
        onToggleFavorite={favorites.toggle}
        onBuy={handleAddToCart}
        onProductClick={setSelectedProduct}
      />

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onProductClick={setSelectedProduct}
        onSearch={handleSearch}
      />
    </div>
  );
}
