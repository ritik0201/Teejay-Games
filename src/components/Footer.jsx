import React from 'react';

export const Footer = () => {
  return (
    <footer
      style={{
        width: '100%',
        backgroundColor: 'var(--surface-lowest)',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: '3rem',
        padding: '3.5rem 0'
      }}
    >
      <div
        className="container-wide"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>sports_esports</span>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '1.25rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              color: 'var(--on-surface)'
            }}
          >
            TEEJAY <span style={{ color: 'var(--primary-container)' }}>GAMES</span>
          </span>
        </div>

        {/* Subtitle */}
        <p style={{ color: 'var(--secondary)', fontSize: '0.9375rem', marginBottom: '2rem' }}>
          UK & Global Video Game Wholesale Supplier · Trade Only
        </p>

        {/* Divider */}
        <div
          style={{
            width: '100%',
            maxWidth: '580px',
            height: '1px',
            backgroundColor: 'var(--border-subtle)',
            marginBottom: '2rem'
          }}
        />

        {/* Copyright & Disclaimer */}
        <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', marginBottom: '0.5rem', fontWeight: '500' }}>
          © {new Date().getFullYear()} Teejay Games Limited. All rights reserved. Registered in England & Wales.
        </p>

        <p
          style={{
            fontSize: '0.75rem',
            color: 'var(--secondary)',
            maxWidth: '640px',
            lineHeight: 1.5
          }}
        >
          All video game titles, publisher marks, hardware names, and associated trademarks are properties of their respective owners. Strictly wholesale distribution to qualified trade accounts only.
        </p>
      </div>
    </footer>
  );
};
