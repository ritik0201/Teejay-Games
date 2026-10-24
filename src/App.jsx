import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductRangeSection } from './components/ProductRangeSection';
import { PricingMatrixSection } from './components/PricingMatrixSection';
import { WhyTeejaySection } from './components/WhyTeejaySection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { ContactSection } from './components/ContactSection';
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
      if (window.location.hash.toLowerCase().includes('inventory')) {
        setCurrentView('inventory');
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Pre-staged demo allocations so the order drawer and matrix look populated immediately
  const [cart, setCart] = useState(() => [
    {
      ...INVENTORY_ITEMS[0], // EA SPORTS FC 25
      allocatedQty: 25
    },
    {
      ...INVENTORY_ITEMS[1], // Astro Bot
      allocatedQty: 20
    },
    {
      ...INVENTORY_ITEMS[7], // DualSense Controller
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

  // Cart operations
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--surface)' }}>
      {/* Fixed Sticky Header */}
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

      {/* Main Content Sections or Inventory View */}
      <main style={{ flex: 1, paddingTop: '80px' }}>
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
            <HeroSection
              onSelectPlatform={(platformId) => setSelectedPlatform(platformId)}
            />

            <ProductRangeSection
              onSelectCategory={(platformId) => setSelectedPlatform(platformId)}
            />

            <PricingMatrixSection
              selectedPlatform={selectedPlatform}
              setSelectedPlatform={setSelectedPlatform}
              onStageProduct={handleStageProduct}
              onShowToast={showToast}
            />

            <WhyTeejaySection />

            <HowItWorksSection />

            <ContactSection onShowToast={showToast} />
          </>
        )}
      </main>

      {/* Footer */}
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
            zIndex: 300,
            backgroundColor: toast.type === 'success' ? '#14161A' : '#14161A',
            color: '#ffffff',
            padding: '0.875rem 1.25rem',
            borderRadius: 'var(--radius-pill)',
            boxShadow: '0 8px 24px rgba(20, 22, 26, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'slideUp 0.25s ease'
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: '20px',
              color: toast.type === 'success' ? '#4ade80' : 'var(--primary-container)'
            }}
          >
            {toast.type === 'success' ? 'check_circle' : 'info'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
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
