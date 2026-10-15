import React, { useState } from 'react';

export const CartDrawer = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onShowToast
}) => {
  const [includeVAT, setIncludeVAT] = useState(true);

  if (!isOpen) return null;

  // Calculate pricing tier
  const getItemUnitPrice = (item) => {
    const qty = item.allocatedQty || item.moq;
    if (qty >= 100) return item.tier3Price;
    if (qty >= 25) return item.tier2Price;
    return item.tier1Price;
  };

  const totalUnits = cart.reduce((sum, item) => sum + (item.allocatedQty || 0), 0);
  const subtotal = cart.reduce((sum, item) => sum + getItemUnitPrice(item) * (item.allocatedQty || 0), 0);
  const vatAmount = includeVAT ? subtotal * 0.2 : 0;
  const grandTotal = subtotal + vatAmount;

  // Logistics Freight Tier calculation
  const getFreightTier = (units) => {
    if (units === 0) return 'No items staged';
    if (units <= 50) return 'Standard Secure Courier (DPD 24h)';
    if (units <= 250) return 'Quarter / Half Euro-Pallet (Palletways)';
    return 'Full Euro-Pallet LTL Freight (Direct Dispatch)';
  };

  const handleDownloadProForma = () => {
    const headers = ['SKU', 'Title', 'Format', 'Quantity', 'Unit Trade Price (GBP)', 'Line Total (GBP)'];
    const rows = cart.map((item) => {
      const price = getItemUnitPrice(item);
      const lineTotal = (price * item.allocatedQty).toFixed(2);
      return [
        item.sku,
        `"${item.title.replace(/"/g, '""')}"`,
        item.format,
        item.allocatedQty,
        price.toFixed(2),
        lineTotal
      ];
    });

    rows.push(['', '', '', '', 'Subtotal', subtotal.toFixed(2)]);
    if (includeVAT) {
      rows.push(['', '', '', '', 'UK VAT (20%)', vatAmount.toFixed(2)]);
    }
    rows.push(['', '', '', '', 'Total (GBP)', grandTotal.toFixed(2)]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Teejay_ProForma_Quote_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onShowToast) {
      onShowToast('Pro-Forma Trade Quote downloaded', 'success');
    }
  };

  const handleSubmitOrder = () => {
    if (cart.length === 0) return;
    if (onShowToast) {
      onShowToast(`Order of ${totalUnits} units staged. Trade desk reference #TJ-${Date.now().toString().slice(-6)} generated!`, 'success');
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        backgroundColor: 'rgba(20, 22, 26, 0.45)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'flex-end',
        transition: 'opacity 0.25s ease'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          height: '100%',
          backgroundColor: 'var(--surface-lowest)',
          boxShadow: 'var(--shadow-drawer)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-low)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>inventory_2</span>
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.15rem', fontWeight: '700' }}>
                Staged Wholesale Allocations
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>
                {cart.length} SKUs · {totalUnits} Total Units
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--secondary)',
              padding: '0.35rem'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>close</span>
          </button>
        </div>

        {/* Drawer Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--secondary)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '54px', color: 'var(--border-subtle)', marginBottom: '1rem', display: 'block' }}>
                shopping_cart
              </span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--on-surface)', marginBottom: '0.35rem' }}>
                No SKUs staged yet
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                Browse the Pricing Matrix and click <strong>"Stage Lot"</strong> to build a wholesale purchase allocation.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map((item) => {
                const unitPrice = getItemUnitPrice(item);
                const lineTotal = (unitPrice * item.allocatedQty).toFixed(2);
                const activeTier = item.allocatedQty >= 100 ? 3 : item.allocatedQty >= 25 ? 2 : 1;

                return (
                  <div
                    key={item.id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--surface-lowest)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.9375rem', color: 'var(--on-surface)' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginTop: '0.15rem' }}>
                          SKU: <strong>{item.sku}</strong> · {item.platformLabel}
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--secondary)',
                          cursor: 'pointer',
                          padding: '0.2rem'
                        }}
                        title="Remove SKU"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {/* Stepper */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--surface)'
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, item.allocatedQty - item.casePack)}
                          style={{
                            width: '28px',
                            height: '28px',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            color: 'var(--secondary)',
                            fontWeight: '700'
                          }}
                        >
                          -
                        </button>
                        <span
                          className="tabular-nums"
                          style={{
                            minWidth: '40px',
                            textAlign: 'center',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            color: 'var(--on-surface)'
                          }}
                        >
                          {item.allocatedQty}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, item.allocatedQty + item.casePack)}
                          style={{
                            width: '28px',
                            height: '28px',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            color: 'var(--secondary)',
                            fontWeight: '700'
                          }}
                        >
                          +
                        </button>
                      </div>

                      {/* Pricing Tier badge */}
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-pill)',
                          backgroundColor: 'var(--primary-fixed)',
                          color: 'var(--primary-container)',
                          fontWeight: '700'
                        }}
                      >
                        Tier {activeTier} (£{unitPrice.toFixed(2)}/unit)
                      </span>

                      {/* Line Total */}
                      <div className="tabular-nums" style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--on-surface)' }}>
                        £{lineTotal}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer Summary */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--surface-low)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            {/* Logistics Tier Banner */}
            <div
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-lowest)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--secondary)'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary-container)' }}>
                local_shipping
              </span>
              <div>
                <strong>Freight Allocation:</strong> {getFreightTier(totalUnits)}
              </div>
            </div>

            {/* Subtotal, VAT toggle, Total */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary)' }}>
                <span>Trade Net Subtotal:</span>
                <span className="tabular-nums" style={{ fontWeight: '600', color: 'var(--on-surface)' }}>
                  £{subtotal.toFixed(2)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--secondary)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={includeVAT}
                    onChange={(e) => setIncludeVAT(e.target.checked)}
                    style={{ accentColor: 'var(--primary-container)' }}
                  />
                  <span>UK VAT (20%)</span>
                </label>
                <span className="tabular-nums" style={{ fontWeight: '600', color: 'var(--on-surface)' }}>
                  {includeVAT ? `£${vatAmount.toFixed(2)}` : 'Zero-Rated / Export'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-headline)',
                  fontSize: '1.15rem',
                  fontWeight: '800',
                  color: 'var(--on-surface)'
                }}
              >
                <span>Estimated Allocation:</span>
                <span className="tabular-nums" style={{ color: 'var(--primary-container)' }}>
                  £{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={handleDownloadProForma}
                className="btn-secondary btn-sm"
                style={{ flex: 1, padding: '0.65rem' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>description</span>
                <span>Pro-Forma Quote</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitOrder}
                className="btn-primary"
                style={{ flex: 1.3, padding: '0.65rem' }}
              >
                <span>Submit to Desk</span>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClearCart}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--secondary)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textAlign: 'center',
                textDecoration: 'underline'
              }}
            >
              Clear all staged items
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
