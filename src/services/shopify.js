// =========================================================
// src/services/shopify.js
// =========================================================
//
// Connects to Shopify Storefront API, fetches products,
// handles pagination, and converts data for Inventory.jsx
// =========================================================

const STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

const SHOPIFY_ENDPOINT = `https://${STORE_DOMAIN}/api/2024-10/graphql.json`;

// Lower these if Shopify ever throttles or rejects the query
const PRODUCTS_PER_PAGE = 100;
const VARIANTS_PER_PRODUCT = 100;

// True only when "EU" is its own segment of the SKU, e.g. "ABC_EU", "ABC-EU", "EU-123".
// "XB360ARCADEUNPLUG-001", "PSVCRIMGIRLSINVITE-EUR" and "NSWDUN_OF_NAHLBEUK" do NOT match.
export const isEuSku = (sku) =>
  /(^|[^A-Za-z0-9])EU($|[^A-Za-z0-9])/i.test(String(sku || ""));

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          title
          description
          vendor
          variants(first: ${VARIANTS_PER_PRODUCT}) {
            nodes {
              id
              sku
              barcode
              title
              quantityAvailable
            }
          }
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          listOnWebsiteMeta: metafield(namespace: "custom", key: "list_on_website") {
            value
          }
          platformMeta: metafield(namespace: "custom", key: "video_game_platform") {
            value
          }
          ageRatingMeta: metafield(namespace: "custom", key: "age_rating") {
            value
          }
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

// Fetch a single page of products
async function fetchProductsPage(after = null) {
  const response = await fetch(SHOPIFY_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({
      query: PRODUCTS_QUERY,
      variables: { first: PRODUCTS_PER_PAGE, after },
    }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`);
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors.map((error) => error.message).join(", "));
  }

  if (!json.data || !json.data.products) {
    throw new Error("Shopify returned invalid product data.");
  }

  return json.data.products;
}

// Fetch all products, handling pagination
export async function fetchProducts() {
  if (!STORE_DOMAIN) {
    throw new Error(
      "Shopify store domain is missing. Check VITE_SHOPIFY_STORE_DOMAIN.",
    );
  }
  if (!STOREFRONT_TOKEN) {
    throw new Error(
      "Shopify Storefront token is missing. Check VITE_SHOPIFY_STOREFRONT_TOKEN.",
    );
  }

  let allProducts = [];
  let cursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const page = await fetchProductsPage(cursor);
    allProducts = allProducts.concat(page.edges);
    hasNextPage = page.pageInfo.hasNextPage;

    if (page.edges.length > 0) {
      cursor = page.edges[page.edges.length - 1].cursor;
    } else {
      cursor = null;
      hasNextPage = false;
    }
  }

  return allProducts.map(({ node }) => {
    const variants = node?.variants?.nodes || [];

    const barcode = variants.find((variant) => variant?.barcode)?.barcode || "";

    // If a product has several variants, prefer the one with an EU SKU
    const skus = variants.map((v) => v?.sku).filter(Boolean);
    const sku = skus.find(isEuSku) || skus[0] || "";

    const totalQuantity = variants.reduce(
      (sum, variant) => sum + (variant?.quantityAvailable || 0),
      0,
    );

    const price = Number(node?.priceRange?.minVariantPrice?.amount) || 0;
    const currency = node?.priceRange?.minVariantPrice?.currencyCode || "USD";

    const listOnWebsiteRaw = String(node?.listOnWebsiteMeta?.value || "")
      .trim()
      .toLowerCase();
    const listOnWebsite =
      listOnWebsiteRaw === "true" || listOnWebsiteRaw === "yes";

    return {
      id: node?.id || "",
      title: node?.title || "",
      description: node?.description || "",
      vendor: node?.vendor || "",
      barcode,
      sku,
      image: node?.featuredImage?.url || null,
      imageAlt: node?.featuredImage?.altText || node?.title || "Product",
      price,
      currency,
      brand: node?.vendor || "",
      quantity: totalQuantity,
      listOnWebsite,
      platform: node?.platformMeta?.value || "",
      rating: node?.ageRatingMeta?.value || "",
    };
  });
}