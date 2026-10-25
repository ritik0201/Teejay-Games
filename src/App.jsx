import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductRangeSection } from './components/ProductRangeSection';
import { PricingMatrixSection } from './components/PricingMatrixSection';
import { WholesalePartnerSection } from './components/WholesalePartnerSection';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import Inventory from './components/Inventory';
import { INVENTORY_ITEMS } from './data/inventory';

export function App() {
  const [currentView, setCurrentView] = useState(() => {
    return window.location.hash.toLowerCase().includes('inventory') ? 'inventory' : 'home';
  });
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('inventory')) {
        setCurrentView('inventory');
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Pre-staged demo allocations
  const [cart, setCart] = useState(() => [
    {
      ...INVENTORY_ITEMS[0],
      allocatedQty: 25
    },
    {
      ...INVENTORY_ITEMS[1],
      allocatedQty: 20
    },
    {
      ...INVENTORY_ITEMS[7],
      allocatedQty: 12
    }
  ]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3800);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleStageProduct = (product, qty) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === product.id);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          allocatedQty: (next[existingIdx].allocatedQty || 0) + qty
        };
        return next;
      } else {
        return [...prev, { ...product, allocatedQty: qty }];
      }
    });
  };

  const handleUpdateCartQty = (productId, newQty) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          return { ...item, allocatedQty: Math.max(item.moq, newQty) };
        }
        return item;
      })
    );
  };

  const handleRemoveCartItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showToast('Item removed from staged order', 'info');
  };

  const handleClearCart = () => {
    setCart([]);
    showToast('Staged allocations cleared', 'info');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-light)' }}>
      {/* Basco Styled Sticky Header */}
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.allocatedQty, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.location.hash = view === 'inventory' ? '#/inventory' : '';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Sections or Dedicated Inventory View */}
      <main style={{ flex: 1 }}>
        {currentView === 'inventory' ? (
          <Inventory
            onBack={() => {
              setCurrentView('home');
              window.location.hash = '';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <>
            <HeroSection />

            <ProductRangeSection
              onSelectCategory={(platformId) => setSelectedPlatform(platformId)}
            />

            <PricingMatrixSection
              selectedPlatform={selectedPlatform}
              setSelectedPlatform={setSelectedPlatform}
              onStageProduct={handleStageProduct}
              onShowToast={showToast}
            />

            <WholesalePartnerSection onShowToast={showToast} />
          </>
        )}
      </main>

      {/* Basco Centered Footer */}
      <Footer />

      {/* Staged Order Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onShowToast={showToast}
      />

      {/* Toast Notification Container */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1100,
            backgroundColor: '#111827',
            color: '#ffffff',
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'slideUpToast 0.25s ease'
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: '20px',
              color: toast.type === 'success' ? '#4ade80' : 'var(--color-primary)'
            }}
          >
            {toast.type === 'success' ? 'check_circle' : 'info'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      <style>{`
        @keyframes slideUpToast {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default App;
