import React from 'react';
import { ONBOARDING_STEPS } from '../data/inventory';

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" style={{ width: '100%', backgroundColor: 'var(--surface-low)', padding: '5.5rem 0' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 4rem auto' }}>
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
            Onboarding Flow
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
            How It Works
          </h2>
          <p style={{ color: 'var(--secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
            Open your trade facility and begin ordering inventory in three simple steps.
          </p>
        </div>

        {/* 3-Step Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            position: 'relative'
          }}
        >
          {ONBOARDING_STEPS.map((s) => (
            <div
              key={s.step}
              className="card-b2b"
              style={{
                backgroundColor: 'var(--surface-lowest)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                border: '1px solid var(--border-subtle)',
                position: 'relative'
              }}
            >
              {/* Step Number Circle */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-container)',
                  color: 'var(--on-primary)',
                  fontFamily: 'var(--font-headline)',
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  boxShadow: '0 2px 6px rgba(215, 38, 61, 0.3)'
                }}
              >
                {s.step}
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
                {s.title}
              </h3>

              <p style={{ color: 'var(--secondary)', fontSize: '0.9375rem', lineHeight: 1.6, flexGrow: 1 }}>
                {s.description}
              </p>

              <div
                style={{
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  width: '100%',
                  borderTop: '1px solid var(--border-subtle)',
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
                  {s.icon}
                </span>
                <span>{s.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
