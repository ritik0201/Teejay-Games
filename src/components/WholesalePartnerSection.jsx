import React, { useState } from 'react';
import { Modal } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const ThankYouModal = ({ onClose, onNavigate }) => {
  return (
    <Modal
      open={true}
      centered
      onCancel={onClose}
      onOk={onNavigate}
      footer={
        <button
          onClick={onNavigate}
          className="btn-solid"
          style={{ width: '100%', fontSize: '1rem', marginTop: '1rem' }}
        >
          Got it, thanks!
        </button>
      }
      cancelButtonProps={{ style: { display: 'none' } }}
      styles={{
        mask: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)'
        },
        content: {
          padding: '2.5rem',
          borderRadius: '1rem',
          textAlign: 'center'
        }
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          margin: '0 auto 1.5rem auto',
          borderRadius: '50%',
          backgroundColor: '#dcfce7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CheckCircleOutlined style={{ fontSize: '2.5rem', color: '#16a34a' }} />
      </div>

      <h3
        style={{
          marginBottom: '0.75rem',
          fontSize: '1.75rem',
          fontWeight: 800,
          color: 'var(--color-text-heading)',
          fontFamily: 'var(--font-headline)'
        }}
      >
        Application Received!
      </h3>

      <p
        style={{
          margin: 0,
          fontSize: '1rem',
          lineHeight: 1.6,
          color: 'var(--color-text-muted)'
        }}
      >
        Thank you for applying to our wholesale program.
        <br />
        Our team will review your details and get back to you within{' '}
        <strong style={{ color: 'var(--color-text-dark)' }}>24–48 hours</strong>.
      </p>
    </Modal>
  );
};

export const WholesalePartnerSection = ({ onShowToast }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    website: '',
    taxId: '',
    email: '',
    description: ''
  });

  const [errors, setErrors] = useState({
    website: '',
    email: ''
  });

  const validateWebsite = (value) => {
    if (!value) return '';
    const regex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/.*)?$/i;
    return regex.test(value) ? '' : 'Please enter a valid website URL';
  };

  const validateEmail = (value) => {
    if (!value) return '';
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) ? '' : 'Please enter a valid email address';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      const lowerValue = value.toLowerCase();
      setFormData((prev) => ({ ...prev, email: lowerValue }));
      setErrors((prev) => ({ ...prev, email: validateEmail(lowerValue) }));
      return;
    }
    if (name === 'website') {
      setFormData((prev) => ({ ...prev, website: value }));
      setErrors((prev) => ({ ...prev, website: validateWebsite(value) }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const websiteError = validateWebsite(formData.website);
    const emailError = validateEmail(formData.email);

    if (websiteError || emailError) {
      setErrors({ website: websiteError, email: emailError });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        storeName: '',
        website: '',
        taxId: '',
        email: '',
        description: ''
      });
      setErrors({ website: '', email: '' });
      if (onShowToast) {
        onShowToast('Wholesale application submitted successfully!', 'success');
      }
    }, 600);
  };

  return (
    <section
      id="wholesale"
      style={{
        paddingTop: '4.5rem',
        paddingBottom: '5.5rem',
        backgroundColor: 'var(--color-bg-light)',
        borderTop: '1px solid var(--color-border-light)'
      }}
    >
      {submitted && (
        <ThankYouModal
          onClose={() => setSubmitted(false)}
          onNavigate={() => setSubmitted(false)}
        />
      )}

      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'start'
          }}
          className="wholesale-grid"
        >
          {/* Left Column: Wholesale Partner Program Perks matching Basco Distribution */}
          <div>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                marginTop: 0,
                marginBottom: '1rem',
                fontWeight: 800,
                lineHeight: 1.2,
                color: 'var(--color-text-heading)',
                fontFamily: 'var(--font-headline)'
              }}
            >
              Wholesale Partner Program
            </h2>
            <p
              style={{
                color: 'var(--color-text-muted)',
                marginBottom: '2.5rem',
                fontSize: '1.05rem',
                lineHeight: 1.6
              }}
            >
              Access wholesale pricing, preorder opportunities and inventory updates.
            </p>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <li
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  padding: '1rem 1.25rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border-light)'
                }}
              >
                <span
                  style={{
                    color: '#ffffff',
                    backgroundColor: 'var(--color-primary)',
                    width: '24px',
                    height: '24px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  ✓
                </span>
                Dealer pricing access
              </li>

              <li
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  padding: '1rem 1.25rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border-light)'
                }}
              >
                <span
                  style={{
                    color: '#ffffff',
                    backgroundColor: 'var(--color-primary)',
                    width: '24px',
                    height: '24px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  ✓
                </span>
                MOQ visibility
              </li>

              <li
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  padding: '1rem 1.25rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border-light)'
                }}
              >
                <span
                  style={{
                    color: '#ffffff',
                    backgroundColor: 'var(--color-primary)',
                    width: '24px',
                    height: '24px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  ✓
                </span>
                Import release schedules
              </li>

              <li
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  padding: '1rem 1.25rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border-light)'
                }}
              >
                <span
                  style={{
                    color: '#ffffff',
                    backgroundColor: 'var(--color-primary)',
                    width: '24px',
                    height: '24px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  ✓
                </span>
                Dedicated account support
              </li>
            </ul>
          </div>

          {/* Right Column: Apply Today Form matching Basco Distribution */}
          <div
            id="apply"
            className="card-shadow"
            style={{
              padding: '2.5rem',
              backgroundColor: '#ffffff'
            }}
          >
            <h3
              style={{
                fontSize: '1.45rem',
                marginTop: 0,
                marginBottom: '1.75rem',
                fontWeight: 700,
                color: 'var(--color-text-heading)',
                fontFamily: 'var(--font-headline)'
              }}
            >
              Apply Today
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  required
                  placeholder="Store / Business Name"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-body)',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-border-light)')}
                />
              </div>

              <div>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  required
                  placeholder="Website (e.g. yourstore.com)"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: `1px solid ${errors.website ? '#ef4444' : 'var(--color-border-light)'}`,
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-body)',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.website && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem', margin: '4px 0 0 0' }}>
                    {errors.website}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                  required
                  placeholder="Reseller Certificate / Company Registration / Tax ID"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-body)',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-border-light)')}
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Business Email"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: `1px solid ${errors.email ? '#ef4444' : 'var(--color-border-light)'}`,
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-body)',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.email && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem', margin: '4px 0 0 0' }}>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about your business, sales channels, or anticipated purchasing volume (Optional)"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-body)',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-border-light)')}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-solid"
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  fontSize: '1rem',
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .wholesale-grid {
            grid-template-columns: 1.1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default WholesalePartnerSection;
