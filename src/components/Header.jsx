import React, { useState } from 'react';

const NAV_OFFSET = 80;

const SECTION_LINKS = [
  { id: 'why-choose', label: 'Why Teejay' },
  { id: 'categories', label: 'Categories' },
  { id: 'wholesale', label: 'New Accounts' },
];

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top, behavior: 'smooth' });
};

export const Header = ({ currentView = 'home', onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isInventory = currentView === 'inventory';

  const goToView = (view) => {
    setIsOpen(false);
    onNavigate?.(view);
  };

  const goToSection = (id) => {
    setIsOpen(false);
    if (currentView === 'home') {
      scrollToSection(id);
      return;
    }
    // Switch to the home view first, then scroll once it has rendered.
    onNavigate?.('home');
    setTimeout(() => scrollToSection(id), 100);
  };

  const handleLogoClick = () => {
    if (currentView === 'home') goToSection('about');
    else goToView('home');
  };

  const SectionLink = ({ id, label, className }) => (
    <a
      href={`#${id}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        goToSection(id);
      }}
    >
      {label}
    </a>
  );

  return (
    <nav className="site-nav">
      <div className="container-wide site-nav__inner">
        {/* Brand */}
        <div className="site-nav__brand" onClick={handleLogoClick}>
          <div className="site-nav__logo">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              sports_esports
            </span>
          </div>
          <span className="site-nav__title">TEEJAY GAMES</span>
        </div>

        {/* Desktop menu */}
        <ul className="site-nav__menu desktop-nav-menu">
          {SECTION_LINKS.map(({ id, label }) => (
            <li key={id}>
              <SectionLink id={id} label={label} className="site-nav__link" />
            </li>
          ))}
          <li>
            <button
              onClick={() => goToView('inventory')}
              className={`site-nav__inventory ${isInventory ? 'is-active' : ''}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                inventory_2
              </span>
              <span>Inventory</span>
            </button>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen((open) => !open)}
          className={`mobile-hamburger ${isOpen ? 'is-open' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`site-nav__mobile ${isOpen ? 'is-open' : ''}`}>
        {SECTION_LINKS.map(({ id, label }) => (
          <SectionLink
            key={id}
            id={id}
            label={label}
            className="site-nav__mobile-link"
          />
        ))}
        <button
          onClick={() => goToView('inventory')}
          className={`site-nav__mobile-inventory ${isInventory ? 'is-active' : ''}`}
        >
          <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>
            inventory_2
          </span>
          <span>Inventory</span>
        </button>
      </div>

      <style>{`
        .site-nav {
          height: 70px;
          background: #fff;
          display: flex;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid var(--color-border-light);
        }
        .site-nav__inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        /* Brand */
        .site-nav__brand {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          cursor: pointer;
        }
        .site-nav__logo {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: var(--color-primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(207, 46, 46, 0.25);
        }
        .site-nav__title {
          font-family: var(--font-headline);
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--color-text-dark);
        }

        /* Desktop menu */
        .site-nav__menu {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .site-nav__link {
          color: var(--color-text-dark);
          font-weight: 500;
          font-size: 0.95rem;
        }
        .site-nav__link:hover {
          color: var(--color-primary);
        }
        .site-nav__inventory {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 8px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--color-text-dark);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .site-nav__inventory:hover,
        .site-nav__inventory.is-active {
          background: var(--color-primary-light, #fef2f2);
          color: var(--color-primary, #cf2e2e);
        }
        .site-nav__inventory.is-active {
          font-weight: 700;
          border-color: var(--color-primary-light-border, #fee2e2);
        }

        /* Hamburger */
        .mobile-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          padding: 8px;
          background: none;
          border: none;
          cursor: pointer;
        }
        .mobile-hamburger span {
          width: 24px;
          height: 2px;
          background: var(--color-text-dark);
          transition: all 0.3s ease;
        }
        .mobile-hamburger.is-open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .mobile-hamburger.is-open span:nth-child(2) {
          opacity: 0;
        }
        .mobile-hamburger.is-open span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        /* Mobile menu */
        .site-nav__mobile {
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 999;
          display: none;
          flex-direction: column;
          gap: 1.5rem;
          padding: 2rem;
          background: #fff;
          border-top: 1px solid var(--color-border-light);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
        }
        .site-nav__mobile.is-open {
          display: flex;
        }
        .site-nav__mobile-link {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--color-text-dark);
        }
        .site-nav__mobile-inventory {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid var(--color-border-light);
          background: transparent;
          color: var(--color-text-dark);
          font-size: 1.05rem;
          font-weight: 700;
          text-align: left;
          cursor: pointer;
        }
        .site-nav__mobile-inventory.is-active {
          color: var(--color-primary);
          background: var(--color-primary-light, #fef2f2);
          border-color: var(--color-primary-light-border);
        }

        @media (max-width: 991px) {
          .desktop-nav-menu { display: none; }
          .mobile-hamburger { display: flex; }
        }
      `}</style>
    </nav>
  );
};

export default Header;