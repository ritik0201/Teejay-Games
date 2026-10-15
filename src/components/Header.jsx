import React, { useState, useEffect } from 'react';

export const Header = ({ cartCount, onOpenCart }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.94)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: isScrolled ? '0 4px 16px rgba(20, 22, 26, 0.06)' : '0 1px 4px rgba(20, 22, 26, 0.02)',
        transition: 'all 0.25s ease'
      }}
    >
      <div
        className="container-wide"
        style={{
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => scrollTo('hero')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            cursor: 'pointer',
            flexShrink: 0,
            textDecoration: 'none'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(215, 38, 61, 0.3)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
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

        {/* Right CTA & Cart Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
          {/* Staged Orders Cart Button */}
          <button
            onClick={onOpenCart}
            className="btn-secondary btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-pill)',
              position: 'relative'
            }}
            title="View Staged Allocations"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary-container)' }}>
              inventory_2
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Staged Orders</span>
            {cartCount > 0 && (
              <span
                style={{
                  backgroundColor: 'var(--primary-container)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '0.15rem 0.45rem',
                  borderRadius: 'var(--radius-pill)',
                  marginLeft: '0.2rem'
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Trade Enquiry Button */}
          <button
            onClick={() => scrollTo('trade-form')}
            className="btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <span>Trade Enquiry</span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              arrow_forward
            </span>
          </button>

          {/* Trade Status Avatar */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer'
            }}
            title="B2B Verified Trade Account"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              person
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
