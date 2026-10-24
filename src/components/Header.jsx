import React, { useState, useEffect } from 'react';

export const Header = ({ cartCount, onOpenCart, currentView = 'home', onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    if (currentView !== 'home' && onNavigate) {
      onNavigate('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Overview', id: 'hero', isRoute: false },
    { label: 'Pricing Matrix', id: 'pricing-matrix', isRoute: false },
    { label: 'Live Inventory', view: 'inventory', isRoute: true },
    { label: 'Range', id: 'product-range', isRoute: false },
    { label: 'Why Teejay', id: 'why-teejay', isRoute: false },
    { label: 'Contact', id: 'trade-form', isRoute: false }
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: '74px',
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: isScrolled ? '0 4px 16px rgba(20, 22, 26, 0.05)' : 'none',
        transition: 'all 0.25s ease'
      }}
    >
      <div
        className="container-wide"
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}
      >
        {/* Brand Logo & B2B Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <div
            onClick={() => scrollTo('hero')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(215, 38, 61, 0.25)'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                sports_esports
              </span>
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  color: 'var(--on-surface)'
                }}
              >
                TEEJAY <span style={{ color: 'var(--primary-container)' }}>GAMES</span>
              </span>
            </div>
          </div>

          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: '700',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--primary-container)',
              backgroundColor: 'rgba(215, 38, 61, 0.08)',
              padding: '2px 7px',
              borderRadius: '4px'
            }}
          >
            B2B
          </span>
        </div>

        {/* Center: Clean Desktop Navigation */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'var(--surface-low)',
            padding: '4px 6px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border-subtle)'
          }}
          className="desktop-menu"
        >
          {navLinks.map((item) => {
            const isActive = item.isRoute
              ? currentView === item.view
              : false;

            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.isRoute) {
                    if (onNavigate) onNavigate(item.view);
                    else window.location.hash = `#/${item.view}`;
                  } else {
                    scrollTo(item.id);
                  }
                }}
                style={{
                  background: isActive ? '#ffffff' : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-pill)',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? '700' : '600',
                  color: isActive ? 'var(--primary-container)' : 'var(--secondary)',
                  boxShadow: isActive ? '0 1px 4px rgba(20, 22, 26, 0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--on-surface)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--secondary)';
                }}
              >
                {item.label === 'Live Inventory' && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-container)',
                      display: 'inline-block'
                    }}
                  />
                )}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA & Cart Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {/* Staged Orders Cart Button */}
          <button
            onClick={onOpenCart}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              color: 'var(--on-surface)',
              fontSize: '0.8125rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 3px rgba(20, 22, 26, 0.04)'
            }}
            title="View Staged Allocations"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary-container)' }}>
              shopping_bag
            </span>
            <span className="cart-label">Staged</span>
            {cartCount > 0 && (
              <span
                style={{
                  backgroundColor: 'var(--primary-container)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  padding: '1px 6px',
                  borderRadius: '10px'
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Trade Enquiry Button */}
          <button
            onClick={() => scrollTo('trade-form')}
            className="desktop-cta"
            style={{
              display: 'none',
              padding: '0.5rem 1.1rem',
              backgroundColor: 'var(--primary-container)',
              color: '#ffffff',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(215, 38, 61, 0.25)',
              transition: 'all 0.15s ease',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>Trade Enquiry</span>
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
              arrow_forward
            </span>
          </button>

          {/* Compact Trade Status Avatar */}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--surface-container)',
              color: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="B2B Verified Account"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>
              person
            </span>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-btn"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--on-surface)',
              padding: '0.25rem'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--surface-lowest)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setMobileMenuOpen(false);
                if (item.isRoute) {
                  if (onNavigate) onNavigate(item.view);
                  else window.location.hash = `#/${item.view}`;
                } else {
                  scrollTo(item.id);
                }
              }}
              style={{
                textAlign: 'left',
                padding: '0.65rem 0.75rem',
                borderRadius: '8px',
                background: item.isRoute && currentView === item.view ? 'var(--surface-low)' : 'none',
                border: 'none',
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: item.isRoute && currentView === item.view ? 'var(--primary-container)' : 'var(--on-surface)',
                cursor: 'pointer'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-menu {
            display: flex !important;
          }
          .desktop-cta {
            display: inline-flex !important;
          }
          .mobile-btn {
            display: none !important;
          }
        }
        @media (max-width: 899px) {
          .mobile-btn {
            display: block !important;
          }
          .cart-label {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
