import React, { useState } from 'react';

export const ContactSection = ({ onShowToast }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    volume: '5k-25k',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      if (onShowToast) {
        onShowToast('Trade enquiry submitted. Desk officer will call within 2 business hours.', 'success');
      }
    }, 700);
  };

  const handleReset = () => {
    setFormData({
      businessName: '',
      contactName: '',
      email: '',
      phone: '',
      volume: '5k-25k',
      message: ''
    });
    setSubmitted(false);
  };

  return (
    <section id="trade-form" style={{ width: '100%', backgroundColor: 'var(--surface-lowest)', padding: '5.5rem 0' }}>
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
            Trade Desk
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
            Contact Our Wholesale Desk
          </h2>
          <p style={{ color: 'var(--secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
            Speak directly with our commercial team in Leicester or request an opening stock manifest.
          </p>
        </div>

        {/* Two-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Contact Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Phone Card */}
            <div
              className="card-b2b"
              style={{
                backgroundColor: 'var(--surface-lowest)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.25rem'
              }}
            >
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
                  flexShrink: 0
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>call</span>
              </div>
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'var(--secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    display: 'block',
                    marginBottom: '0.25rem'
                  }}
                >
                  Telephone
                </span>
                <a
                  href="tel:+441163664044"
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: 'var(--on-surface)',
                    textDecoration: 'none',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-container)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--on-surface)')}
                >
                  +44 (0) 116 366 4044
                </a>
                <p style={{ fontSize: '0.8125rem', color: 'var(--secondary)', marginTop: '0.35rem' }}>
                  Monday to Friday, 08:30 – 17:30 GMT
                </p>
              </div>
            </div>

            {/* Email Card */}
            <div
              className="card-b2b"
              style={{
                backgroundColor: 'var(--surface-lowest)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.25rem'
              }}
            >
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
                  flexShrink: 0
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>mail</span>
              </div>
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'var(--secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    display: 'block',
                    marginBottom: '0.25rem'
                  }}
                >
                  Email Trade Enquiries
                </span>
                <a
                  href="mailto:sales@teejaygames.co.uk"
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: 'var(--on-surface)',
                    textDecoration: 'none',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-container)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--on-surface)')}
                >
                  sales@teejaygames.co.uk
                </a>
                <p style={{ fontSize: '0.8125rem', color: 'var(--secondary)', marginTop: '0.35rem' }}>
                  Trade inquiries answered within 2 business hours
                </p>
              </div>
            </div>

            {/* Address Card */}
            <div
              className="card-b2b"
              style={{
                backgroundColor: 'var(--surface-lowest)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.25rem'
              }}
            >
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
                  flexShrink: 0
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>location_on</span>
              </div>
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'var(--secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    display: 'block',
                    marginBottom: '0.25rem'
                  }}
                >
                  Office & Logistics Hub
                </span>
                <p style={{ fontFamily: 'var(--font-headline)', fontSize: '1.05rem', fontWeight: '700', color: 'var(--on-surface)', lineHeight: 1.4 }}>
                  Unit 2, Church View, Dragon Lane, Newbold Verdon, Leicester LE9 9NG
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--secondary)', marginTop: '0.35rem' }}>
                  UK Logistics & Distribution Hub
                </p>
              </div>
            </div>

            {/* Security Notice Banner */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-low)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem'
              }}
            >
              <span className="material-symbols-outlined" style={{ color: 'var(--primary-container)', fontSize: '24px', flexShrink: 0 }}>
                shield
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--secondary)', lineHeight: 1.5 }}>
                Strictly Trade-Only. We verify all company numbers and VAT registrations prior to releasing stock manifests.
              </span>
            </div>
          </div>

          {/* Right Column: Enquiry Form Card */}
          <div
            className="card-b2b"
            style={{
              backgroundColor: 'var(--surface-lowest)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '1.45rem',
                fontWeight: '700',
                color: 'var(--on-surface)',
                marginBottom: '0.35rem'
              }}
            >
              Request Wholesale Access
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--secondary)', marginBottom: '2rem' }}>
              Complete the form below. Our commercial desk will review your details and issue current allocation sheets.
            </p>

            {submitted ? (
              <div
                style={{
                  padding: '2rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--stock-green-bg)',
                  border: '1px solid rgba(30, 130, 76, 0.2)',
                  color: 'var(--stock-green)',
                  textAlign: 'center'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '48px', marginBottom: '0.75rem', display: 'block' }}>
                  check_circle
                </span>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--stock-green)' }}>
                  Trade Request Received
                </h4>
                <p style={{ fontSize: '0.9375rem', lineHeight: 1.5, marginBottom: '1.5rem', color: '#14532d' }}>
                  Thank you, <strong>{formData.contactName || 'Retail Partner'}</strong>. Your application for{' '}
                  <strong>{formData.businessName || 'your business'}</strong> has been registered with our Leicester trade desk.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-secondary btn-sm"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label
                      htmlFor="businessName"
                      style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '0.35rem' }}
                    >
                      Business / Store Name *
                    </label>
                    <input
                      id="businessName"
                      required
                      type="text"
                      placeholder="e.g. PixelVault Games Ltd"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      style={{
                        width: '100%',
                        height: '44px',
                        padding: '0 0.875rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--surface)',
                        color: 'var(--on-surface)',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--primary-container)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contactName"
                      style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '0.35rem' }}
                    >
                      Contact Person *
                    </label>
                    <input
                      id="contactName"
                      required
                      type="text"
                      placeholder="Full Name"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      style={{
                        width: '100%',
                        height: '44px',
                        padding: '0 0.875rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--surface)',
                        color: 'var(--on-surface)',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--primary-container)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label
                      htmlFor="email"
                      style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '0.35rem' }}
                    >
                      Business Email *
                    </label>
                    <input
                      id="email"
                      required
                      type="email"
                      placeholder="purchasing@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        height: '44px',
                        padding: '0 0.875rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--surface)',
                        color: 'var(--on-surface)',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--primary-container)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '0.35rem' }}
                    >
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      required
                      type="tel"
                      placeholder="+44 7123 456789"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        height: '44px',
                        padding: '0 0.875rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--surface)',
                        color: 'var(--on-surface)',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--primary-container)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="volume"
                    style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '0.35rem' }}
                  >
                    Target Monthly Wholesale Volume
                  </label>
                  <select
                    id="volume"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    style={{
                      width: '100%',
                      height: '44px',
                      padding: '0 0.875rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--surface)',
                      color: 'var(--on-surface)',
                      fontSize: '0.875rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="under-5k">£1,000 – £5,000 / month (Starter Allocation)</option>
                    <option value="5k-25k">£5,000 – £25,000 / month (Established Retailer)</option>
                    <option value="25k-100k">£25,000 – £100,000 / month (High-Velocity / E-commerce)</option>
                    <option value="100k+">£100,000+ / month (Enterprise Distributor / Chain)</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '0.35rem' }}
                  >
                    Order Scope / Target Platforms
                  </label>
                  <textarea
                    id="message"
                    rows="3"
                    placeholder="Tell us about your target platforms, volume, or specific SKU needs..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.875rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--surface)',
                      color: 'var(--on-surface)',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--primary-container)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    height: '48px',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    marginTop: '0.5rem',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  <span>{isSubmitting ? 'Sending Request...' : 'Send Trade Enquiry'}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
