import React from 'react';
import { WHOLESALE_BENEFITS } from '../data/inventory';

export const WhyTeejaySection = () => {
  return (
    <section
      id="why-teejay"
      style={{
        width: '100%',
        backgroundColor: 'rgba(255, 218, 217, 0.22)',
        padding: '5.5rem 0',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)'
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 4rem auto' }}>
          <span
            style={{
              color: 'var(--primary)',
              fontSize: '0.8125rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              display: 'block',
              marginBottom: '0.625rem'
            }}
          >
            Trade Advantages
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
            Why Retailers Choose Teejay
          </h2>
          <p style={{ color: 'var(--secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
            Tailored specifically for independent video game retailers, commercial e-commerce, and global importers.
          </p>
        </div>

        {/* 2x2 Grid of White Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {WHOLESALE_BENEFITS.map((item, index) => (
            <div
              key={index}
              className="card-b2b"
              style={{
                backgroundColor: 'var(--surface-lowest)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                {/* Icon */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 218, 217, 0.45)',
                    color: 'var(--primary-container)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>
                    {item.icon}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: 'var(--on-surface)',
                    marginBottom: '0.625rem'
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ color: 'var(--secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                  {item.description}
                </p>
              </div>

              {/* Bottom Badge Verification Note */}
              <div
                style={{
                  marginTop: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.8125rem',
                  fontWeight: '600',
                  color: 'var(--secondary)'
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '17px', color: 'var(--primary-container)', marginRight: '0.45rem' }}
                >
                  {item.badgeIcon}
                </span>
                <span>{item.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
