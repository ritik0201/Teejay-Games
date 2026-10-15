import React, { useState, useEffect } from 'react';

export const Header = ({ cartCount, onOpenCart }) => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const sections = ['hero', 'products', 'pricing-matrix', 'why-teejay', 'how-it-works', 'trade-form'];
      const scrollPos = window.scrollY + 100;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'About', target: 'hero' },
    { label: 'Products', target: 'products' },
    { label: 'Pricing Matrix', target: 'pricing-matrix' },
    { label: 'Why Teejay', target: 'why-teejay' },
    { label: 'How It Works', target: 'how-it-works' },
    { label: 'Contact', target: 'trade-form' },
  ];

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
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
      <div className="container-wide" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
        {/* Brand Logo */}
        <div 
          onClick={() => scrollTo('hero')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', flexShrink: 0, textDecoration: 'none' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary-container)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 6px rgba(215, 38, 61, 0.3)'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>sports_esports</span>
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '1.25rem',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--on-surface)'
            }}>
              TEEJAY <span style={{ color: 'var(--primary-container)' }}>GAMES</span>
            </span>
          </div>
        </div>

        {/* Center Desktop Navigation */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '0.35rem',
          backgroundColor: 'var(--surface-lowest)',
          padding: '0.3rem 0.5rem',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--border-subtle)'
        }} className="desktop-nav">
          {navItems.map((item) => {
            const isActive = activeSection === item.target;
            return (
              <button
                key={item.target}
                onClick={() => scrollTo(item.target)}
                style={{
                  padding: '0.45rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? 'var(--primary-container)' : 'var(--secondary)',
                  backgroundColor: isActive ? 'var(--surface-low)' : 'transparent',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA & Cart Action */}
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
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary-container)' }}>inventory_2</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Staged Orders</span>
            {cartCount > 0 && (
              <span style={{
                backgroundColor: 'var(--primary-container)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.15rem 0.45rem',
                borderRadius: 'var(--radius-pill)',
                marginLeft: '0.2rem'
              }}>
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
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
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
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
          </div>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              padding: '0.4rem',
              cursor: 'pointer',
              color: 'var(--on-surface)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--surface-lowest)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {navItems.map((item) => (
            <button
              key={item.target}
              onClick={() => scrollTo(item.target)}
              style={{
                textAlign: 'left',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: activeSection === item.target ? 'var(--surface-low)' : 'transparent',
                color: activeSection === item.target ? 'var(--primary-container)' : 'var(--on-surface)',
                fontWeight: activeSection === item.target ? '700' : '500',
                border: 'none',
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
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
        @media (max-width: 899px) {
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};
