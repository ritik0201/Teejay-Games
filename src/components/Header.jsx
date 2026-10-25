import React, { useState } from 'react';

export const Header = ({ cartCount = 0, onOpenCart, currentView = 'home', onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (targetId, isView = false) => {
    setIsOpen(false);
    if (isView) {
      if (onNavigate) onNavigate(targetId);
      return;
    }

    if (currentView !== 'home') {
      if (onNavigate) onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = el.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
          });
        }
      }, 100);
      return;
    }

    const el = document.getElementById(targetId);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav
      style={{
        height: '70px',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid var(--color-border-light)'
      }}
    >
      <div
        className="container-wide"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}
      >
        {/* Brand Logo matching Basco layout */}
        <div
          onClick={() => handleNavClick('about')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(207, 46, 46, 0.25)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              sports_esports
            </span>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '1.25rem',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              color: 'var(--color-text-dark)'
            }}
          >
            TEEJAY GAMES
          </span>
        </div>

        {/* Desktop Menu matching Basco Distribution */}
        <ul
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}
          className="desktop-nav-menu"
        >
          <li>
            <a
              href="#why-choose"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('why-choose');
              }}
              style={{
                color: 'var(--color-text-dark)',
                fontWeight: 500,
                fontSize: '0.95rem'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-dark)')}
            >
              Why Teejay
            </a>
          </li>
          <li>
            <a
              href="#categories"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('categories');
              }}
              style={{
                color: 'var(--color-text-dark)',
                fontWeight: 500,
                fontSize: '0.95rem'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-dark)')}
            >
              Categories
            </a>
          </li>
          <li>
            <a
              href="#pricing-matrix"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('pricing-matrix');
              }}
              style={{
                color: 'var(--color-text-dark)',
                fontWeight: 500,
                fontSize: '0.95rem'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-dark)')}
            >
              Pricing Matrix
            </a>
          </li>
          <li>
            <a
              href="#wholesale"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('wholesale');
              }}
              style={{
                color: 'var(--color-text-dark)',
                fontWeight: 500,
                fontSize: '0.95rem'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-dark)')}
            >
              Wholesale
            </a>
          </li>
          <li>
            <span
              onClick={() => handleNavClick('inventory', true)}
              style={{
                color: currentView === 'inventory' ? 'var(--color-primary)' : 'var(--color-text-dark)',
                fontWeight: currentView === 'inventory' ? 700 : 500,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseLeave={(e) => {
                if (currentView !== 'inventory') e.currentTarget.style.color = 'var(--color-text-dark)';
              }}
            >
              Live Inventory
            </span>
          </li>
        </ul>

        {/* Right CTA Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Staged Order Cart Button */}
          {onOpenCart && (
            <button
              onClick={onOpenCart}
              title="View Staged Allocations"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                border: '1px solid var(--color-primary-light-border)'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                shopping_cart
              </span>
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    minWidth: '18px',
                    height: '18px',
                    borderRadius: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* New Accounts CTA */}
          <a
            href="#apply"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('apply');
            }}
            className="btn-solid desktop-cta"
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            New Accounts
          </a>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mobile-hamburger"
            style={{
              display: 'none',
              flexDirection: 'column',
              gap: '5px',
              padding: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
            aria-label="Toggle navigation menu"
          >
            <span
              style={{
                width: '24px',
                height: '2px',
                backgroundColor: 'var(--color-text-dark)',
                transition: 'all 0.3s ease',
                transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
              }}
            />
            <span
              style={{
                width: '24px',
                height: '2px',
                backgroundColor: 'var(--color-text-dark)',
                transition: 'all 0.3s ease',
                opacity: isOpen ? 0 : 1
              }}
            />
            <span
              style={{
                width: '24px',
                height: '2px',
                backgroundColor: 'var(--color-text-dark)',
                transition: 'all 0.3s ease',
                transform: isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Menu */}
      <div
        style={{
          position: 'fixed',
          top: '70px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#ffffff',
          zIndex: 999,
          padding: '2rem',
          display: isOpen ? 'flex' : 'none',
          flexDirection: 'column',
          gap: '1.5rem',
          borderTop: '1px solid var(--color-border-light)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
        }}
      >
        <a
          href="#why-choose"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('why-choose');
          }}
          style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-dark)' }}
        >
          Why Teejay
        </a>
        <a
          href="#categories"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('categories');
          }}
          style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-dark)' }}
        >
          Categories
        </a>
        <a
          href="#pricing-matrix"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('pricing-matrix');
          }}
          style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-dark)' }}
        >
          Pricing Matrix
        </a>
        <a
          href="#wholesale"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('wholesale');
          }}
          style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-dark)' }}
        >
          Wholesale
        </a>
        <span
          onClick={() => handleNavClick('inventory', true)}
          style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-primary)', cursor: 'pointer' }}
        >
          Live Inventory
        </span>
        <div style={{ paddingTop: '1rem' }}>
          <a
            href="#apply"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('apply');
            }}
            className="btn-solid"
            style={{ width: '100%', textAlign: 'center' }}
          >
            New Accounts
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .desktop-nav-menu {
            display: none !important;
          }
          .desktop-cta {
            display: none !important;
          }
          .mobile-hamburger {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Header;
