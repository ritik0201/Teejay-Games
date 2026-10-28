import React, { useState, useEffect, useMemo, useRef } from "react";
import { ConfigProvider, Table } from "antd";
import * as XLSX from "xlsx";
import { decryptText } from "../utils/crypto";
import { fetchProducts, isUkSku } from "../services/shopify";
import "./Inventory.css";

const ENCRYPTED_URL = import.meta.env.VITE_ENCRYPTED_INVENTORY_URL;
const SESSION_KEY = "inventory_password";

// How often the table silently re-checks Shopify for changes
const REFRESH_INTERVAL_MS = 60 * 1000;

/* ----------------------------- helpers ----------------------------- */

// Returns true when the password successfully decrypts the inventory URL
const verifyPassword = async (password) => {
  const decrypted = await decryptText(ENCRYPTED_URL, password);
  return decrypted.startsWith("http");
};

const sortByText = (key) => (a, b) =>
  String(a?.[key] || "").localeCompare(String(b?.[key] || ""));

const sortByNumber = (key) => (a, b) =>
  Number(a?.[key] || 0) - Number(b?.[key] || 0);

const formatPrice = (price, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);

/* ----------------------------- component ----------------------------- */

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [columnFilters, setColumnFilters] = useState({});
  const lastSignature = useRef(null);

  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [decrypting, setDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState(null);

  /* ---- restore saved session ---- */
  useEffect(() => {
    const checkSession = async () => {
      const savedPassword = sessionStorage.getItem(SESSION_KEY);
      if (savedPassword && ENCRYPTED_URL) {
        try {
          if (await verifyPassword(savedPassword)) {
            setIsAuthenticated(true);
          } else {
            sessionStorage.removeItem(SESSION_KEY);
          }
        } catch {
          sessionStorage.removeItem(SESSION_KEY);
        }
      }
      setCheckingSession(false);
    };
    checkSession();
  }, []);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;

    setDecrypting(true);
    setDecryptError(null);

    try {
      if (!(await verifyPassword(passwordInput))) {
        throw new Error("Invalid password");
      }
      sessionStorage.setItem(SESSION_KEY, passwordInput);
      setIsAuthenticated(true);
    } catch {
      setDecryptError("Incorrect password. Access denied.");
    } finally {
      setDecrypting(false);
    }
  };

  /* ---- load from Shopify, then refresh in the background ---- */
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

        // Only update state when something changed, so polling doesn't re-render the table
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

    const onVisible = () => {
      if (document.visibilityState === "visible") load(true);
    };

    load(false);
    const intervalId = setInterval(() => load(true), REFRESH_INTERVAL_MS);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [isAuthenticated, retryCount]);

  /* ---- derived data ---- */

  // Only listed, in-stock products whose SKU starts with "UK"
  const visibleInventory = useMemo(
    () =>
      inventory.filter(
        (item) =>
          item.listOnWebsite && Number(item.quantity) > 0 && isUkSku(item.sku),
      ),
    [inventory],
  );

  // Search by title, barcode, SKU or vendor
  const filteredData = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return visibleInventory;

    return visibleInventory.filter((item) =>
      [item.title, item.barcode, item.sku, item.vendor].some((field) =>
        String(field || "").toLowerCase().includes(search),
      ),
    );
  }, [visibleInventory, searchTerm]);

  // Search + column filters = exactly what the table shows (before pagination)
  const exportData = useMemo(
    () =>
      filteredData.filter((item) =>
        Object.entries(columnFilters).every(
          ([key, values]) => !values?.length || values.includes(item[key]),
        ),
      ),
    [filteredData, columnFilters],
  );

  const platformFilters = useMemo(
    () =>
      [...new Set(visibleInventory.map((i) => i.platform).filter(Boolean))].map(
        (platform) => ({ text: platform, value: platform }),
      ),
    [visibleInventory],
  );

  /* ---- table columns ---- */
  const columns = [
    {
      title: "Barcode",
      key: "barcode",
      width: 160,
      sorter: sortByText("barcode"),
      render: (_, record) => (
        <span className="inv-barcode">{record.barcode || "NO BARCODE"}</span>
      ),
    },
    {
      title: "Product Name",
      key: "title",
      width: 360,
      sorter: sortByText("title"),
      render: (_, record) => (
        <div className="inv-product-cell">
          {record.image ? (
            <img
              className="inv-product-img"
              src={record.image}
              alt={record.imageAlt || record.title || "Product"}
              loading="lazy"
            />
          ) : (
            <div className="inv-product-img inv-product-img--empty">📦</div>
          )}
          <div className="inv-product-title">{record.title || "NO TITLE"}</div>
        </div>
      ),
    },
    {
      title: "Platform",
      key: "platform",
      width: 170,
      filters: platformFilters,
      filteredValue: columnFilters.platform || null,
      onFilter: (value, record) => record.platform === value,
      filterSearch: true,
      render: (_, record) => (
        <span className="inv-text-muted">{record.platform || "-"}</span>
      ),
    },
    {
      title: "Qty",
      key: "quantity",
      width: 90,
      sorter: sortByNumber("quantity"),
      render: (_, record) => (
        <span className="inv-text-dark inv-bold">
          {Number(record.quantity || 0)}
        </span>
      ),
    },
    {
      title: "Price",
      key: "price",
      width: 120,
      sorter: sortByNumber("price"),
      render: (_, record) => {
        const price = Number(record.price);
        return Number.isFinite(price) ? (
          <span className="inv-text-dark inv-bold">
            {formatPrice(price, record.currency)}
          </span>
        ) : (
          <span className="inv-bold">-</span>
        );
      },
    },
  ];

  /* ---- export ---- */
  const handleExport = () => {
    const rows = exportData.map((item) => ({
      Barcode: item.barcode || "",
      Title: item.title || "",
      Platform: item.platform || "",
      Quantity: Number(item.quantity || 0),
      Price: Number(item.price || 0),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 16 },
      { wch: 50 },
      { wch: 20 },
      { wch: 10 },
      { wch: 10 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, "inventory.xlsx");
  };

  /* ----------------------------- render ----------------------------- */

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
                  onClick={() => setShowPassword((show) => !show)}
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
            Authorized distributors only. Need access? <br />
            Contact your Teejay account manager.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-portal inv-page">
      <div className="inv-container">
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
              onClick={() => setRetryCount((count) => count + 1)}
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
            pagination={{ pageSize: 15, showSizeChanger: false, responsive: true }}
            scroll={{ x: "max-content" }}
            onChange={(_, filters) => setColumnFilters(filters || {})}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default Inventory;