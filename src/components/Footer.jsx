import React from 'react';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer
      style={{
        paddingTop: '5rem',
        paddingBottom: '4rem',
        backgroundColor: '#ffffff',
        textAlign: 'center',
        borderTop: '1px solid var(--color-border-light)'
      }}
    >
      <div className="container">
        {/* Brand Mark matching Basco Distribution */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            marginBottom: '1.5rem'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(207, 46, 46, 0.25)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
              sports_esports
            </span>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-dark)'
            }}
          >
            TEEJAY GAMES
          </span>
        </div>

        <p
          style={{
            fontSize: '0.95rem',
            fontWeight: 500,
            color: 'var(--color-text-muted)',
            marginBottom: '0.75rem'
          }}
        >
          Wholesale Distribution • Global Sourcing
        </p>

        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            marginBottom: '2.5rem'
          }}
        >
          Trusted by partners since 2014.
        </p>

        <div
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            paddingTop: '2rem',
            borderTop: '1px solid var(--color-border-light)',
            maxWidth: '420px',
            margin: '0 auto'
          }}
        >
          &copy; {CURRENT_YEAR} TEEJAY GAMES Wholesale. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
