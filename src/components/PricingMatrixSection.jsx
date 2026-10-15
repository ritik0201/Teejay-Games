import React, { useState, useMemo } from 'react';
import { PLATFORMS, INVENTORY_ITEMS } from '../data/inventory';

export const PricingMatrixSection = ({
  selectedPlatform,
  setSelectedPlatform,
  onStageProduct,
  onShowToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState(() => {
    const init = {};
    INVENTORY_ITEMS.forEach((item) => {
      init[item.id] = item.moq; // defaults to MOQ
    });
    return init;
  });

  // Filter products by platform and search query
  const filteredProducts = useMemo(() => {
    return INVENTORY_ITEMS.filter((item) => {
      const matchesPlatform = selectedPlatform === 'all' || item.platform === selectedPlatform;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ean.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPlatform && matchesSearch;
    });
  }, [selectedPlatform, searchQuery]);

  const handleQtyChange = (id, delta, moq) => {
    setQuantities((prev) => {
      const current = prev[id] || moq;
      const next = Math.max(moq, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleDirectQtyChange = (id, value, moq) => {
    const parsed = parseInt(value, 10);
    setQuantities((prev) => ({
      ...prev,
      [id]: isNaN(parsed) ? moq : Math.max(moq, parsed)
    }));
  };

  // Determine active tier based on selected quantity
  const getActiveTier = (qty) => {
    if (qty >= 100) return 3;
    if (qty >= 25) return 2;
    return 1;
  };

  const getEffectiveUnitPrice = (item, qty) => {
    const tier = getActiveTier(qty);
    if (tier === 3) return item.tier3Price;
    if (tier === 2) return item.tier2Price;
    return item.tier1Price;
  };

  // CSV Manifest Export function
  const handleExportCSV = () => {
    const headers = ['SKU', 'Title', 'Platform', 'Category', 'Format', 'EAN', 'Stock Units', 'MOQ', 'Case Pack', 'RRP (GBP)', 'Tier 1 (1-24)', 'Tier 2 (25-99)', 'Tier 3 (100+)'];
    const rows = INVENTORY_ITEMS.map((item) => [
      item.sku,
      `"${item.title.replace(/"/g, '""')}"`,
      item.platformLabel,
      item.category,
      item.format,
      item.ean,
      item.stockUnits,
      item.moq,
      item.casePack,
      item.rrp.toFixed(2),
      item.tier1Price.toFixed(2),
      item.tier2Price.toFixed(2),
      item.tier3Price.toFixed(2)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Teejay_Games_Wholesale_Manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onShowToast) {
      onShowToast('Wholesale Manifest CSV downloaded successfully', 'success');
    }
  };

  return (
    <section id="pricing-matrix" style={{ width: '100%', backgroundColor: 'var(--surface)', padding: '5.5rem 0' }}>
      <div className="container-wide">
        {/* Section Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div>
            <span
              style={{
                color: 'var(--primary-container)',
                fontSize: '0.8125rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                display: 'block',
                marginBottom: '0.5rem'
              }}
            >
              Wholesale Pricing Matrix
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
                fontWeight: '700',
                letterSpacing: '-0.025em',
                color: 'var(--on-surface)'
              }}
            >
              Live Stock Manifest & Tiered Rates
            </h2>
            <p style={{ color: 'var(--secondary)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
              Volume-tiered commercial pricing with active discount bracket calculation and instant lot staging.
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleExportCSV}
              className="btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.6rem 1.15rem' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary-container)' }}>download</span>
              <span>Export CSV Manifest</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div
          style={{
            backgroundColor: 'var(--surface-lowest)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          {/* Platform Category Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
            {PLATFORMS.map((platform) => {
              const isActive = selectedPlatform === platform.id;
              return (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.8125rem',
                    fontWeight: isActive ? '700' : '500',
                    backgroundColor: isActive ? 'var(--primary-container)' : 'var(--surface-low)',
                    color: isActive ? '#ffffff' : 'var(--on-surface)',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--primary-container)' : 'var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {platform.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <span
              className="material-symbols-outlined"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--secondary)',
                fontSize: '20px'
              }}
            >
              search
            </span>
            <input
              type="text"
              placeholder="Search title, SKU or EAN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                paddingLeft: '2.5rem',
                paddingRight: '1rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--surface)',
                color: 'var(--on-surface)',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary-container)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
            />
          </div>
        </div>

        {/* Pricing Matrix Table */}
        <div
          className="custom-scroll"
          style={{
            backgroundColor: 'var(--surface-lowest)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)',
            overflowX: 'auto',
            width: '100%'
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              minWidth: '1050px'
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--surface-low)',
                  borderBottom: '1px solid var(--border-subtle)',
                  color: 'var(--secondary)',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                <th style={{ padding: '1rem 1.25rem' }}>SKU & Product</th>
                <th style={{ padding: '1rem 1rem' }}>Stock Status</th>
                <th style={{ padding: '1rem 1rem' }}>MOQ / Case</th>
                <th style={{ padding: '1rem 1rem' }}>RRP</th>
                <th style={{ padding: '1rem 1rem', backgroundColor: 'rgba(215, 38, 61, 0.03)' }}>
                  Tier 1 <span style={{ fontWeight: '400', fontSize: '0.7rem' }}>(1-24)</span>
                </th>
                <th style={{ padding: '1rem 1rem', backgroundColor: 'rgba(215, 38, 61, 0.05)' }}>
                  Tier 2 <span style={{ fontWeight: '400', fontSize: '0.7rem' }}>(25-99, -6%)</span>
                </th>
                <th style={{ padding: '1rem 1rem', backgroundColor: 'rgba(215, 38, 61, 0.08)' }}>
                  Tier 3 <span style={{ fontWeight: '400', fontSize: '0.7rem' }}>(100+, -12%)</span>
                </th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>Allocate Qty</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ padding: '3rem', textAlign: 'center', color: 'var(--secondary)' }}>
                    No gaming SKUs found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item, index) => {
                  const qty = quantities[item.id] || item.moq;
                  const activeTier = getActiveTier(qty);
                  const effectivePrice = getEffectiveUnitPrice(item, qty);
                  const totalLinePrice = (effectivePrice * qty).toFixed(2);
                  const isEven = index % 2 === 0;

                  return (
                    <tr
                      key={item.id}
                      style={{
                        backgroundColor: isEven ? '#ffffff' : 'var(--surface-low)',
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fff9f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isEven ? '#ffffff' : 'var(--surface-low)')}
                    >
                      {/* Product & SKU */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontWeight: '700', color: 'var(--on-surface)', fontSize: '0.9375rem' }}>
                                {item.title}
                              </span>
                              {item.badge && (
                                <span
                                  style={{
                                    fontSize: '0.6875rem',
                                    fontWeight: '700',
                                    padding: '0.1rem 0.45rem',
                                    borderRadius: 'var(--radius-pill)',
                                    backgroundColor: 'var(--primary-fixed)',
                                    color: 'var(--primary-container)'
                                  }}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.2rem', fontSize: '0.75rem', color: 'var(--secondary)' }}>
                              <span>SKU: <strong style={{ color: 'var(--on-surface)' }}>{item.sku}</strong></span>
                              <span>•</span>
                              <span>{item.platformLabel}</span>
                              <span>•</span>
                              <span>{item.format}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Stock Level */}
                      <td style={{ padding: '1rem 1rem' }}>
                        {item.stockStatus === 'in_stock' && (
                          <span className="badge-pill badge-instock">
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--stock-green)' }} />
                            <span>In Stock ({item.stockUnits})</span>
                          </span>
                        )}
                        {item.stockStatus === 'low_allocation' && (
                          <span className="badge-pill badge-lowalloc">
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--alloc-amber)' }} />
                            <span>Low Alloc ({item.stockUnits})</span>
                          </span>
                        )}
                        {item.stockStatus === 'instant_esd' && (
                          <span className="badge-pill badge-digital">
                            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>bolt</span>
                            <span>Instant ESD</span>
                          </span>
                        )}
                      </td>

                      {/* MOQ / Case */}
                      <td style={{ padding: '1rem 1rem', fontSize: '0.85rem', color: 'var(--secondary)' }}>
                        <span style={{ fontWeight: '600', color: 'var(--on-surface)' }}>{item.moq}</span> MOQ / <span style={{ fontWeight: '600' }}>{item.casePack}</span>pk
                      </td>

                      {/* RRP */}
                      <td style={{ padding: '1rem 1rem', fontSize: '0.875rem', color: 'var(--secondary)' }} className="tabular-nums">
                        £{item.rrp.toFixed(2)}
                      </td>

                      {/* Tier 1 Price */}
                      <td
                        className="tabular-nums"
                        style={{
                          padding: '1rem 1rem',
                          fontSize: '0.9375rem',
                          fontWeight: activeTier === 1 ? '700' : '500',
                          color: activeTier === 1 ? 'var(--primary-container)' : 'var(--on-surface)',
                          backgroundColor: activeTier === 1 ? 'rgba(215, 38, 61, 0.08)' : 'transparent',
                          borderLeft: activeTier === 1 ? '3px solid var(--primary-container)' : 'none'
                        }}
                      >
                        £{item.tier1Price.toFixed(2)}
                      </td>

                      {/* Tier 2 Price */}
                      <td
                        className="tabular-nums"
                        style={{
                          padding: '1rem 1rem',
                          fontSize: '0.9375rem',
                          fontWeight: activeTier === 2 ? '700' : '500',
                          color: activeTier === 2 ? 'var(--primary-container)' : 'var(--on-surface)',
                          backgroundColor: activeTier === 2 ? 'rgba(215, 38, 61, 0.08)' : 'transparent',
                          borderLeft: activeTier === 2 ? '3px solid var(--primary-container)' : 'none'
                        }}
                      >
                        £{item.tier2Price.toFixed(2)}
                      </td>

                      {/* Tier 3 Price */}
                      <td
                        className="tabular-nums"
                        style={{
                          padding: '1rem 1rem',
                          fontSize: '0.9375rem',
                          fontWeight: activeTier === 3 ? '700' : '500',
                          color: activeTier === 3 ? 'var(--primary-container)' : 'var(--on-surface)',
                          backgroundColor: activeTier === 3 ? 'rgba(215, 38, 61, 0.08)' : 'transparent',
                          borderLeft: activeTier === 3 ? '3px solid var(--primary-container)' : 'none'
                        }}
                      >
                        £{item.tier3Price.toFixed(2)}
                      </td>

                      {/* Quantity Stepper */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: '#ffffff',
                            overflow: 'hidden'
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleQtyChange(item.id, -item.casePack, item.moq)}
                            style={{
                              width: '28px',
                              height: '32px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              cursor: 'pointer',
                              color: 'var(--secondary)',
                              fontWeight: '700'
                            }}
                            title={`Decrease by ${item.casePack}`}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={item.moq}
                            step={item.moq}
                            value={qty}
                            onChange={(e) => handleDirectQtyChange(item.id, e.target.value, item.moq)}
                            className="tabular-nums"
                            style={{
                              width: '54px',
                              height: '32px',
                              textAlign: 'center',
                              border: 'none',
                              outline: 'none',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: 'var(--on-surface)'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleQtyChange(item.id, item.casePack, item.moq)}
                            style={{
                              width: '28px',
                              height: '32px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              cursor: 'pointer',
                              color: 'var(--secondary)',
                              fontWeight: '700'
                            }}
                            title={`Increase by ${item.casePack}`}
                          >
                            +
                          </button>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--secondary)', marginTop: '0.2rem' }}>
                          Tot: £{totalLinePrice}
                        </div>
                      </td>

                      {/* Action Stage Button */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => {
                            if (onStageProduct) {
                              onStageProduct(item, qty);
                            }
                            if (onShowToast) {
                              onShowToast(`Staged ${qty} units of ${item.sku} (£${totalLinePrice})`, 'success');
                            }
                          }}
                          className="btn-primary btn-sm"
                          style={{
                            padding: '0.45rem 1rem',
                            fontSize: '0.8125rem'
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>add</span>
                          <span>Stage Lot</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Matrix Explanatory Footer note */}
        <div
          style={{
            marginTop: '1.25rem',
            padding: '1rem 1.5rem',
            backgroundColor: 'var(--surface-lowest)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: 'var(--secondary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary-container)', fontSize: '18px' }}>
              info
            </span>
            <span>
              Prices shown in GBP (£) ex-VAT. Volume tiers automatically calculate at checkout or in pro-forma manifests.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span><strong style={{ color: 'var(--on-surface)' }}>Tier 1:</strong> Standard Lot</span>
            <span><strong style={{ color: 'var(--on-surface)' }}>Tier 2:</strong> 25-99 units (-6%)</span>
            <span><strong style={{ color: 'var(--primary-container)' }}>Tier 3:</strong> 100+ units (-12%)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
