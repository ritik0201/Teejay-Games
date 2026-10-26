import React, { useState, useEffect, useMemo } from "react";
import { ConfigProvider, Table } from "antd";
import { fetchProducts } from "../services/shopify";
import * as XLSX from 'xlsx';
import './Inventory.css';

const Inventory = ({ onBack }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching Teejay Games inventory products from Google Sheets...");
        const products = await fetchProducts();
        if (cancelled) return;
        setInventory(products || []);
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching products:", err);
        setError(err?.message || "Failed to load inventory from Google Sheets.");
        setInventory([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  // EU SKU Filter: Only show products whose SKU starts with 'eu', ends with '_eu'/'-eu', or is an EU SKU
  const isSkuEu = (sku) => {
    const s = String(sku || "").trim().toLowerCase();
    if (!s) return false;
    return (
      s.startsWith("eu") ||
      s.endsWith("_eu") ||
      s.endsWith("-eu") ||
      s === "eu" ||
      s.split(/[-_\s/]+/).includes("eu")
    );
  };

  const visibleInventory = useMemo(() => {
    return inventory.filter((item) => {
      const isListed = item?.listOnWebsite !== false;
      return isListed && isSkuEu(item?.sku);
    });
  }, [inventory]);

  const filteredData = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return visibleInventory;

    const result = visibleInventory.filter((item) => {
      const title = String(item?.title || "").toLowerCase();
      const barcode = String(item?.barcode || "").toLowerCase();
      const vendor = String(item?.vendor || "").toLowerCase();
      const sku = String(item?.sku || "").toLowerCase();

      return (
        title.includes(search) ||
        barcode.includes(search) ||
        vendor.includes(search) ||
        sku.includes(search)
      );
    });
    return result;
  }, [visibleInventory, searchTerm]);

  const brandFilters = useMemo(() => {
    const unique = [
      ...new Set(visibleInventory.map((i) => i["vendor"]).filter(Boolean)),
    ];
    return unique.map((b) => ({ text: b, value: b }));
  }, [visibleInventory]);

  const platformFilters = useMemo(() => {
    const unique = [
      ...new Set(visibleInventory.map((i) => i["platform"]).filter(Boolean)),
    ];
    return unique.map((p) => ({ text: p, value: p }));
  }, [visibleInventory]);

  const ratingFilters = useMemo(() => {
    const unique = [
      ...new Set(visibleInventory.map((i) => i["rating"]).filter(Boolean)),
    ];
    return unique.map((r) => ({ text: `Rating: ${r}`, value: r }));
  }, [visibleInventory]);

  const columns = [
    {
      title: "Barcode",
      key: "barcode",
      width: 160,
      sorter: (a, b) =>
        String(a?.barcode || "").localeCompare(String(b?.barcode || "")),
      render: (_, record) => (
        <span
          style={{
            color: "var(--color-primary, #cf2e2e)",
            fontWeight: "bold",
            fontFamily: "monospace",
          }}
        >
          {String(record?.barcode || "NO BARCODE")}
        </span>
      ),
    },
    {
      title: "SKU",
      key: "sku",
      width: 150,
      sorter: (a, b) => String(a?.sku || "").localeCompare(String(b?.sku || "")),
      render: (_, record) => (
        <span
          style={{
            display: "inline-block",
            padding: "2px 8px",
            fontSize: "12px",
            fontWeight: "700",
            borderRadius: "4px",
            backgroundColor: "var(--color-primary-light, #fef2f2)",
            color: "var(--color-primary, #cf2e2e)",
            border: "1px solid var(--color-primary-light-border, #fee2e2)",
            fontFamily: "monospace",
          }}
        >
          {String(record?.sku || "EU").toUpperCase()}
        </span>
      ),
    },
    {
      title: "Product Name",
      key: "title",
      width: 340,
      sorter: (a, b) =>
        String(a?.title || "").localeCompare(String(b?.title || "")),
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {record?.image ? (
            <img
              src={record.image}
              alt={record?.imageAlt || record?.title || "Product"}
              style={{
                width: "48px",
                height: "48px",
                objectFit: "cover",
                borderRadius: "8px",
                backgroundColor: "#f3f4f6",
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                backgroundColor: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "20px",
              }}
            >
              📦
            </div>
          )}
          <div
            style={{
              color: "#111827",
              fontWeight: "bold",
            }}
          >
            {String(record?.title || "NO TITLE")}
          </div>
        </div>
      ),
    },
    {
      title: "Brand",
      key: "vendor",
      width: 180,
      filters: brandFilters,
      onFilter: (value, record) => record?.vendor === value,
      filterSearch: true,
      sorter: (a, b) =>
        String(a?.vendor || "").localeCompare(String(b?.vendor || "")),
      render: (_, record) => (
        <span style={{ color: "#111827" }}>
          {String(record?.vendor || "NO BRAND")}
        </span>
      ),
    },
    {
      title: "Platform",
      key: "platform",
      width: 150,
      filters: platformFilters,
      onFilter: (value, record) => record?.platform === value,
      filterSearch: true,
      render: (_, record) => (
        <span style={{ color: "#6b7280" }}>
          {String(record?.platform || "-")}
        </span>
      ),
    },
    {
      title: "Rating",
      key: "rating",
      width: 120,
      filters: ratingFilters,
      onFilter: (value, record) => record?.rating === value,
      filterSearch: true,
      render: (_, record) => (
        <span style={{ color: "#6b7280" }}>
          {String(record?.rating || "-")}
        </span>
      ),
    },
    {
      title: "Qty",
      key: "quantity",
      width: 90,
      sorter: (a, b) => Number(a?.quantity || 0) - Number(b?.quantity || 0),
      render: (_, record) => (
        <span style={{ color: "#111827", fontWeight: "bold" }}>
          {Number(record?.quantity || 0)}
        </span>
      ),
    },
    {
      title: "SRP",
      key: "price",
      width: 120,
      sorter: (a, b) => Number(a?.price || 0) - Number(b?.price || 0),
      render: (_, record) => {
        const price = Number(record?.price);
        if (!Number.isFinite(price)) {
          return <span style={{ fontWeight: "bold" }}>-</span>;
        }
        return (
          <span
            style={{
              color: "#111827",
              fontWeight: "bold",
            }}
          >
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: record?.currency || "USD",
            }).format(price)}
          </span>
        );
      },
    },
  ];

  const handleExport = () => {
    const exportRows = filteredData.map((item) => ({
      Barcode: item?.barcode || "",
      SKU: item?.sku || "",
      Title: item?.title || "",
      Brand: item?.vendor || "",
      Platform: item?.platform || "",
      Rating: item?.rating || "",
      Quantity: item?.quantity || 0,
      Price: item?.price || 0,
      Currency: item?.currency || "USD",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "EU_Inventory");
    XLSX.writeFile(workbook, `Teejay_EU_Inventory_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleSyncSheet = async () => {
    try {
      setLoading(true);
      setError(null);
      const products = await fetchProducts(true);
      setInventory(products || []);
    } catch (err) {
      setError(err?.message || "Failed to re-sync data from Google Sheets.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inventory-portal p-6 md:p-8 bg-bg-light min-h-screen" style={{ minHeight: '90vh', padding: '2rem 1.5rem', backgroundColor: '#f8fafc' }}>
      <div className="max-w-7xl mx-auto space-y-6" style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Navigation / Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <p className="text-text-muted text-sm" style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
              Live availability and verified European distributor stock levels
            </p>
          </div>

          <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by title, barcode, vendor, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2.5 border border-border-light rounded-lg text-sm w-full md:w-80 outline-none focus:ring-2 focus:ring-red-500/20"
              style={{
                padding: '10px 14px',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                fontSize: '0.875rem',
                minWidth: '260px',
                outline: 'none',
                backgroundColor: '#ffffff',
                boxShadow: 'var(--shadow-sm)'
              }}
            />

            {/* Sync Live Sheet Button */}
            <button
              onClick={handleSyncSheet}
              disabled={loading}
              title="Re-sync latest data from Google Sheet"
              style={{
                padding: '10px 14px',
                backgroundColor: '#ffffff',
                color: 'var(--color-text-dark, #111827)',
                fontWeight: 600,
                fontSize: '0.875rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.borderColor = 'var(--color-primary, #cf2e2e)';
                  e.currentTarget.style.color = 'var(--color-primary, #cf2e2e)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.color = 'var(--color-text-dark, #111827)';
                }
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '18px',
                  animation: loading ? 'spin 1s linear infinite' : 'none'
                }}
              >
                sync
              </span>
              <span>Sync Sheet</span>
            </button>

            {/* Export Button matching Website Theme */}
            <button
              onClick={handleExport}
              className="btn-solid"
              style={{
                padding: '10px 18px',
                background: 'linear-gradient(135deg, var(--color-primary, #cf2e2e) 0%, var(--color-primary-hover, #b32020) 100%)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.875rem',
                borderRadius: '10px',
                border: '1px solid rgba(207, 46, 46, 0.2)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(207, 46, 46, 0.25)',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-body)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(207, 46, 46, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(207, 46, 46, 0.25)';
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                download
              </span>
              <span>Export Manifest ({filteredData.length})</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between" style={{ padding: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{error}</span>
            <button
              onClick={() => setRetryCount((c) => c + 1)}
              className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-md hover:bg-red-700"
              style={{ padding: '6px 12px', backgroundColor: 'var(--color-primary, #cf2e2e)', color: '#ffffff', fontSize: '0.75rem', fontWeight: 700, borderRadius: '6px', border: 'none', cursor: 'pointer' }}
            >
              Retry
            </button>
          </div>
        )}

        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#cf2e2e',
            },
          }}
        >
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            rowKey={(record) => record.barcode || record.sku || record.title}
            pagination={{ pageSize: 15 }}
            scroll={{ x: 'max-content' }}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default Inventory;
