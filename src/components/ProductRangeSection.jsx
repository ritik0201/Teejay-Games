import React from 'react';

export const ProductRangeSection = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'boxed',
      filterKey: 'ps5',
      icon: 'album',
      title: 'Boxed Games',
      badge: 'Physical Disc/Cartridge',
      description: 'New releases, deep back-catalogue, and regional PEGI/ESRB stock across PS5, PS4, Xbox Series, and Nintendo Switch.',
      skus: '480+ Active Titles',
      dispatch: 'Same-day UK dispatch'
    },
    {
      id: 'accessories',
      filterKey: 'accessories',
      icon: 'headset_mic',
      title: 'First-Party Accessories',
      badge: 'Official Hardware',
      description: 'Official DualSense controllers, Xbox Wireless pads, Joy-Cons, headsets, charging docks, and OEM peripherals.',
      skus: '240+ Hardware SKUs',
      dispatch: 'Master Carton Lots'
    },
    {
      id: 'digital',
      filterKey: 'digital',
      icon: 'qr_code_2',
      title: 'Digital Game Codes',
      badge: 'Instant ESD',
      description: 'Direct ESD codes, PlayStation Network and Xbox gift cards, Nintendo eShop vouchers, and Steam digital activations.',
      skus: 'Instant API / Portal Delivery',
      dispatch: 'Zero Freight Cost'
    }
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="products" style={{ width: '100%', backgroundColor: 'var(--surface-low)', padding: '5.5rem 0' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 4rem auto' }}>
          <span
            style={{
              color: 'var(--primary-container)',
              fontSize: '0.8125rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              display: 'block',
              marginBottom: '0.625rem'
            }}
          >
            Inventory Categories
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: 'clamp(1.85rem, 3.5vw, 2.35rem)',
              fontWeight: '700',
              letterSpacing: '-0.025em',
              color: 'var(--on-surface)',
              marginBottom: '0.75rem'
            }}
          >
            Wholesale Product Range
          </h2>
          <p style={{ color: 'var(--secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
            Guaranteed physical liquidity and digital codes directly from verified UK distribution networks.
          </p>
        </div>

        {/* 3 Horizontal Range Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="card-b2b"
              style={{
                backgroundColor: 'var(--surface-lowest)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem 2.25rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem',
                border: '1px solid var(--border-subtle)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', maxWidth: '780px' }}>
                {/* Category Icon Container */}
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '14px',
                    backgroundColor: 'var(--primary-fixed)',
                    color: 'var(--primary-container)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                    {cat.icon}
                  </span>
                </div>

                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-headline)',
                        fontSize: '1.35rem',
                        fontWeight: '700',
                        color: 'var(--on-surface)'
                      }}
                    >
                      {cat.title}
                    </h3>
                    <span
                      style={{
                        padding: '0.2rem 0.65rem',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: 'var(--surface-container)',
                        color: 'var(--secondary)'
                      }}
                    >
                      {cat.badge}
                    </span>
                    <span
                      style={{
                        padding: '0.2rem 0.65rem',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: 'var(--surface-low)',
                        color: 'var(--primary-container)'
                      }}
                    >
                      {cat.skus}
                    </span>
                  </div>
                  <p style={{ color: 'var(--secondary)', fontSize: '0.9375rem', lineHeight: 1.55 }}>
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Action Links */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                <button
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory(cat.filterKey);
                    scrollTo('pricing-matrix');
                  }}
                  className="btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>list_alt</span>
                  <span>View SKUs</span>
                </button>

                <button
                  onClick={() => scrollTo('trade-form')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.9375rem',
                    fontWeight: '700',
                    color: 'var(--primary-container)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-pill)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--primary-container)')}
                >
                  <span>Enquire</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
