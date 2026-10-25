import React from 'react';

export const HeroSection = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
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

  const stats = [
    { label: "Established", value: "2014" },
    { label: "Sourcing Network", value: "Global" },
    { label: "Distribution Focus", value: "UK & Int'l" },
    { label: "Retail Partnerships", value: "B2B Trade" }
  ];

  return (
    <section
      id="about"
      style={{
        paddingTop: '3.5rem',
        paddingBottom: '4.5rem',
        background: 'linear-gradient(180deg, var(--color-bg-light) 0%, #ffffff 100%)',
        borderBottom: '1px solid var(--color-border-light)'
      }}
    >
      {/* 2-Column Hero Grid matching Basco Distribution */}
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
            marginBottom: '4rem'
          }}
          className="hero-grid"
        >
          {/* Left Column: Heading & Value Proposition */}
          <div>
            <span
              style={{
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '1.2px',
                border: '1px solid var(--color-primary-light-border)',
                padding: '0.35rem 0.95rem',
                borderRadius: '9999px',
                backgroundColor: 'var(--color-primary-light)',
                display: 'inline-block',
                textTransform: 'uppercase'
              }}
            >
              ESTABLISHED SINCE 2014
            </span>

            <p
              style={{
                marginTop: '1.25rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}
            >
              GLOBAL SOURCING • WHOLESALE DISTRIBUTION
            </p>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                margin: '1rem 0 1.25rem 0',
                color: 'var(--color-text-heading)',
                fontFamily: 'var(--font-headline)'
              }}
            >
              Global Distribution of Video Games, Consoles & Entertainment Products
            </h1>

            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--color-text-muted)',
                marginBottom: '2rem',
                maxWidth: '600px',
                lineHeight: 1.6
              }}
            >
              Trusted wholesale partner for boxed video games, trading card games, consoles, accessories, and globally sourced entertainment products.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <a
                href="#apply"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('apply');
                }}
                className="btn-solid"
                style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
              >
                Apply for Wholesale Account
              </a>
              <a
                href="#pricing-matrix"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('pricing-matrix');
                }}
                className="btn-outline"
                style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
              >
                Browse Pricing Matrix
              </a>
            </div>
          </div>

          {/* Right Column: Why Choose Card matching Basco Distribution */}
          <div
            id="why-choose"
            className="card-shadow"
            style={{
              padding: '2.5rem',
              backgroundColor: '#ffffff'
            }}
          >
            <h3
              style={{
                marginBottom: '1.5rem',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-text-heading)',
                fontFamily: 'var(--font-headline)'
              }}
            >
              Why Choose TEEJAY GAMES
            </h3>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: '50%',
                    flexShrink: 0,
                    marginTop: '6px'
                  }}
                />
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--color-text-dark)' }}>Global</strong> supplier network across UK, Europe, US and Japan
                </p>
              </li>

              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: '50%',
                    flexShrink: 0,
                    marginTop: '6px'
                  }}
                />
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--color-text-dark)' }}>Fast dispatch & fulfillment</strong> with competitive wholesale volume pricing
                </p>
              </li>

              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: '50%',
                    flexShrink: 0,
                    marginTop: '6px'
                  }}
                />
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--color-text-dark)' }}>Exclusive</strong> import access for high-demand AAA titles and releases
                </p>
              </li>

              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: '50%',
                    flexShrink: 0,
                    marginTop: '6px'
                  }}
                />
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--color-text-dark)' }}>Dedicated account support</strong> built for long-term retail partners
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats Row matching Basco Distribution */}
        <div
          id="stats"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="card-shadow"
              style={{
                padding: '1.75rem 1.25rem',
                textAlign: 'center',
                backgroundColor: '#ffffff'
              }}
            >
              <h2
                style={{
                  fontSize: '2rem',
                  marginBottom: '0.35rem',
                  fontWeight: 800,
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--font-headline)'
                }}
              >
                {stat.value}
              </h2>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-muted)',
                  fontWeight: 500,
                  margin: 0
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .hero-grid {
            grid-template-columns: 1.2fr 0.8fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
