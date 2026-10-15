import React from 'react';

export const HeroSection = ({ onSelectPlatform }) => {
  const platforms = [
    { id: 'ps5', label: 'PlayStation 5 & PS4', icon: 'videogame_asset' },
    { id: 'xbox', label: 'Xbox Series X|S', icon: 'sports_esports' },
    { id: 'switch', label: 'Nintendo Switch', icon: 'gamepad' },
    { id: 'accessories', label: 'PC & Hardware', icon: 'desktop_windows' },
    { id: 'digital', label: 'Digital ESD Codes', icon: 'key' },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      style={{
        width: '100%',
        backgroundColor: 'var(--surface-lowest)',
        paddingTop: '6rem',
        paddingBottom: '5rem',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative'
      }}
    >
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {/* Trade Only Status Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.35rem 1.1rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--primary-fixed-subtle)',
            border: '1px solid var(--primary-fixed-dim)',
            color: 'var(--primary)',
            fontSize: '0.8125rem',
            fontWeight: '600',
            marginBottom: '1.75rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <span
            className="pulse-dot"
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-container)',
              display: 'inline-block'
            }}
          />
          <span>Leicester, UK · Trade Only</span>
        </div>

        {/* Main Display Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            maxWidth: '920px',
            color: 'var(--on-surface)',
            marginBottom: '1.25rem'
          }}
        >
          Wholesale Gaming Supply for Retailers Worldwide
        </h1>

        {/* Supporting Subtext */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--secondary)',
            maxWidth: '720px',
            lineHeight: 1.6,
            marginBottom: '2.5rem'
          }}
        >
          Boxed games, console accessories and digital game codes for every platform, supplied to trade customers globally.
        </p>

        {/* Action Button Group */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
          <button
            onClick={() => scrollTo('trade-form')}
            className="btn-primary"
            style={{
              height: '52px',
              paddingLeft: '2rem',
              paddingRight: '2rem',
              fontSize: '1rem',
              fontWeight: '700'
            }}
          >
            Open a Trade Account
          </button>

          <a
            href="tel:+441163664044"
            className="btn-secondary"
            style={{
              height: '52px',
              paddingLeft: '1.75rem',
              paddingRight: '1.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--secondary)' }}>call</span>
            <span>Call Sales: +44 116 366 4044</span>
          </a>

          <button
            onClick={() => scrollTo('pricing-matrix')}
            className="btn-secondary"
            style={{
              height: '52px',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              backgroundColor: 'var(--surface-low)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--primary-container)' }}>table_chart</span>
            <span>View Live Stock Matrix</span>
          </button>
        </div>

        {/* Platforms Banner Strip */}
        <div
          style={{
            width: '100%',
            maxWidth: '960px',
            padding: '0.625rem',
            borderRadius: '20px',
            backgroundColor: 'var(--surface-low)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.625rem',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)'
          }}
        >
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                if (onSelectPlatform) onSelectPlatform(p.id);
                scrollTo('pricing-matrix');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.15rem',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--surface-lowest)',
                color: 'var(--on-surface)',
                fontSize: '0.875rem',
                fontWeight: '600',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'var(--primary-container)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <span className="material-symbols-outlined" style={{ color: 'var(--primary-container)', fontSize: '18px' }}>
                {p.icon}
              </span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
