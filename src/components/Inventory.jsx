import React, { useState, useEffect, useMemo, useRef } from "react";
import { ConfigProvider, Table } from "antd";
import { decryptText } from "../utils/crypto";
import { fetchProducts, isUkSku } from "../services/shopify";
import * as XLSX from "xlsx";
import "./Inventory.css";

// How often the table silently re-checks Shopify for changes
const REFRESH_INTERVAL_MS = 60 * 1000;

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  // Column filters currently applied in the table (vendor / platform / rating)
  const [columnFilters, setColumnFilters] = useState({});
  const lastSignature = useRef(null);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [decrypting, setDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const ENCRYPTED_URL = import.meta.env.VITE_ENCRYPTED_INVENTORY_URL;

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const savedPassword = sessionStorage.getItem("inventory_password");
      if (savedPassword && ENCRYPTED_URL) {
        try {
          const decrypted = await decryptText(ENCRYPTED_URL, savedPassword);
          if (decrypted.startsWith("http")) {
            setIsAuthenticated(true);
          } else {
            sessionStorage.removeItem("inventory_password");
          }
        } catch (e) {
          sessionStorage.removeItem("inventory_password");
        }
      }
      setCheckingSession(false);
    };
    checkSession();
  }, [ENCRYPTED_URL]);

  const handleUnlock = async (e) => {
    if (e) e.preventDefault();
    if (!passwordInput.trim()) return;

    setDecrypting(true);
    setDecryptError(null);

    try {
      if (!ENCRYPTED_URL) {
        throw new Error("No encrypted inventory URL configured.");
      }
      const decrypted = await decryptText(ENCRYPTED_URL, passwordInput);
      if (decrypted.startsWith("http")) {
        sessionStorage.setItem("inventory_password", passwordInput);
        setIsAuthenticated(true);
      } else {
        throw new Error("Invalid password");
      }
    } catch (err) {
      setDecryptError("Incorrect password. Access denied.");
    } finally {
      setDecrypting(false);
    }
  };

  // Load from Shopify, then keep refreshing in the background
  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;
    let inFlight = false;

    const load = async (silent) => {
      if (inFlight) return;
      inFlight = true;
      try {
        if (!silent) {
          setLoading(true);
          setError(null);
        }
        const products = await fetchProducts();
        if (cancelled) return;

        // Only update state when something actually changed,
        // so the table doesn't re-render on every poll
        const signature = JSON.stringify(products);
        if (signature !== lastSignature.current) {
          lastSignature.current = signature;
          setInventory(products);
        }
        setError(null);
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching products:", err);
        // Background refresh failures keep the current data on screen
        if (!silent) {
          setError(err?.message || "Failed to load inventory from Shopify.");
          setInventory([]);
          lastSignature.current = null;
        }
      } finally {
        inFlight = false;
        if (!cancelled && !silent) setLoading(false);
      }
    };

    load(false);

    const intervalId = setInterval(() => load(true), REFRESH_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") load(true);
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [isAuthenticated, retryCount]);

  // Only listed, in-stock products whose SKU starts with "UK"
  const visibleInventory = useMemo(() => {
    return inventory.filter(
      (item) =>
        item?.listOnWebsite === true &&
        Number(item?.quantity) > 0 &&
        isUkSku(item?.sku),
    );
  }, [inventory]);

  // Search filter
  const filteredData = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return visibleInventory;

    return visibleInventory.filter((item) => {
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
  }, [visibleInventory, searchTerm]);

  // Search + column filters = exactly what the table is showing (before pagination)
  const exportData = useMemo(() => {
    return filteredData.filter((item) =>
      Object.entries(columnFilters).every(([key, values]) => {
        if (!values || values.length === 0) return true;
        return values.includes(item?.[key]);
      }),
    );
  }, [filteredData, columnFilters]);

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
        <span className="inv-barcode">
          {String(record?.barcode || "NO BARCODE")}
        </span>
      ),
    },
    {
      title: "Product Name",
      key: "title",
      width: 360,
      sorter: (a, b) =>
        String(a?.title || "").localeCompare(String(b?.title || "")),
      render: (_, record) => (
        <div className="inv-product-cell">
          {record?.image ? (
            <img
              className="inv-product-img"
              src={record.image}
              alt={record?.imageAlt || record?.title || "Product"}
              loading="lazy"
            />
          ) : (
            <div className="inv-product-img inv-product-img--empty">📦</div>
          )}
          <div className="inv-product-title">
            {String(record?.title || "NO TITLE")}
          </div>
        </div>
      ),
    },
    {
      title: "SKU",
      key: "sku",
      width: 220,
      sorter: (a, b) =>
        String(a?.sku || "").localeCompare(String(b?.sku || "")),
      render: (_, record) => (
        <span className="inv-sku-badge">{String(record?.sku || "-")}</span>
      ),
    },
    {
      title: "Brand",
      key: "vendor",
      width: 180,
      filters: brandFilters,
      filteredValue: columnFilters.vendor || null,
      onFilter: (value, record) => record?.vendor === value,
      filterSearch: true,
      sorter: (a, b) =>
        String(a?.vendor || "").localeCompare(String(b?.vendor || "")),
      render: (_, record) => (
        <span className="inv-text-dark">
          {String(record?.vendor || "NO BRAND")}
        </span>
      ),
    },
    {
      title: "Platform",
      key: "platform",
      width: 170,
      filters: platformFilters,
      filteredValue: columnFilters.platform || null,
      onFilter: (value, record) => record?.platform === value,
      filterSearch: true,
      render: (_, record) => (
        <span className="inv-text-muted">
          {String(record?.platform || "-")}
        </span>
      ),
    },
    {
      title: "Rating",
      key: "rating",
      width: 120,
      filters: ratingFilters,
      filteredValue: columnFilters.rating || null,
      onFilter: (value, record) => record?.rating === value,
      filterSearch: true,
      render: (_, record) => (
        <span className="inv-text-muted">{String(record?.rating || "-")}</span>
      ),
    },
    {
      title: "Qty",
      key: "quantity",
      width: 90,
      sorter: (a, b) => Number(a?.quantity || 0) - Number(b?.quantity || 0),
      render: (_, record) => (
        <span className="inv-text-dark inv-bold">
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
          return <span className="inv-bold">-</span>;
        }
        return (
          <span className="inv-text-dark inv-bold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: record?.currency || "USD",
            }).format(price)}
          </span>
        );
      },
    },
  ];

  // Exports whatever the table currently shows (search + column filters applied)
  const handleExport = () => {
    const exportRows = exportData.map((item) => ({
      Barcode: item?.barcode || "",
      Title: item?.title || "",
      SKU: item?.sku || "",
      Brand: item?.vendor || "",
      Platform: item?.platform || "",
      Rating: item?.rating || "",
      Quantity: Number(item?.quantity || 0),
      Price: Number(item?.price || 0),
      Currency: item?.currency || "USD",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    worksheet["!cols"] = [
      { wch: 16 },
      { wch: 50 },
      { wch: 26 },
      { wch: 24 },
      { wch: 20 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, "inventory.xlsx");
  };

  if (checkingSession) {
    return (
      <div className="inv-auth-page">
        <div className="inv-checking">
          <div className="inv-spinner" />
          <p>Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="inv-auth-page">
        <div className="inv-auth-card">
          <div className="inv-auth-accent" />

          <div className="inv-auth-head">
            <div className="inv-auth-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                width="30"
                height="30"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
            <h2 className="inv-auth-title">Inventory Portal</h2>
            <p className="inv-auth-text">
              This page is password protected. Enter your access password to
              view the live UK inventory.
            </p>
          </div>

          {!ENCRYPTED_URL ? (
            <div className="inv-auth-config-error">
              <strong>Error loading Inventory!</strong>
            </div>
          ) : (
            <form onSubmit={handleUnlock} className="inv-auth-form">
              <label className="inv-auth-label" htmlFor="inv-password">
                Access Password
              </label>

              <div className="inv-auth-field">
                <input
                  id="inv-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter access password"
                  className={`inv-auth-input ${decryptError ? "inv-auth-input--error" : ""}`}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  disabled={decrypting}
                  autoComplete="current-password"
                  autoFocus
                />
                <button
                  type="button"
                  className="inv-auth-toggle"
                  onClick={() => setShowPassword((s) => !s)}
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {decryptError && (
                <p className="inv-auth-error animate-shake">{decryptError}</p>
              )}

              <button
                type="submit"
                disabled={decrypting || !passwordInput}
                className="inv-auth-submit"
              >
                {decrypting ? "Decrypting..." : "Unlock Inventory"}
              </button>
            </form>
          )}

          <p className="inv-auth-foot">
            Authorized distributors only. Need access? <br />Contact your Teejay
            account manager.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-portal inv-page">
      <div className="inv-container">
        {/* Header */}
        <div className="inv-header">
          <div className="inv-heading-block">
            <h1 className="inv-title">Product Inventory</h1>
            <p className="inv-subtitle">
              Live availability and verified UK distributor stock levels
            </p>
          </div>

          <div className="inv-actions">
            <input
              type="text"
              placeholder="Search by title, barcode, SKU, vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="inv-search"
            />

            <button
              onClick={handleExport}
              className="inv-export-btn"
              disabled={exportData.length === 0}
            >
              <span className="material-symbols-outlined inv-btn-icon">
                download
              </span>
              <span>Export ({exportData.length})</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="inv-error">
            <span>{error}</span>
            <button
              onClick={() => setRetryCount((c) => c + 1)}
              className="inv-retry-btn"
            >
              Retry
            </button>
          </div>
        )}

        <ConfigProvider theme={{ token: { colorPrimary: "#cf2e2e" } }}>
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            rowKey={(record) => record.id || record.barcode || record.title}
            pagination={{
              pageSize: 15,
              showSizeChanger: false,
              responsive: true,
            }}
            scroll={{ x: "max-content" }}
            onChange={(pagination, filters) => setColumnFilters(filters || {})}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default Inventory;