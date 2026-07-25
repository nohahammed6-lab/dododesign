import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BentoGrid } from './components/BentoGrid';
import { HighlightGallery } from './components/HighlightGallery';
import { ProductDetail } from './components/ProductDetail';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SizeGuideModal } from './components/SizeGuideModal';
import { FloatingInstagram } from './components/FloatingInstagram';
import { Toast } from './components/Toast';
import { AdminLayout } from './components/admin/AdminLayout';

const MainAppContent: React.FC = () => {
  const { viewMode, activeCategory } = useApp();

  if (viewMode === 'admin') {
    return (
      <>
        <AdminLayout />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-[#f2efe9] font-['Cairo','Plus_Jakarta_Sans',sans-serif] selection:bg-[#d4af37] selection:text-black flex flex-col">
      <Header />

      <main className="flex-1">
        {viewMode === 'product_detail' ? (
          <ProductDetail />
        ) : (
          <>
            {activeCategory === 'all' && (
              <>
                <Hero />
                <BentoGrid />
              </>
            )}
            <HighlightGallery />
          </>
        )}
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <SearchModal />
      <WishlistDrawer />
      <SizeGuideModal />
      <FloatingInstagram />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
