// src/services/shopify.js
// Fetches all products from the Shopify Storefront API (with pagination)
// and converts them into the shape used by Inventory.jsx.

const STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const SHOPIFY_ENDPOINT = `https://${STORE_DOMAIN}/api/2024-10/graphql.json`;

// Lower these if Shopify ever throttles or rejects the query
const PRODUCTS_PER_PAGE = 100;
const VARIANTS_PER_PRODUCT = 100;

// True when the SKU starts with "UK", e.g. "UK-12345", "UK_ABC", "UKABC"
export const isUkSku = (sku) => /^UK/i.test(String(sku || "").trim());

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          title
          vendor
          variants(first: ${VARIANTS_PER_PRODUCT}) {
            nodes {
              sku
              barcode
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
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

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
  if (!json.data?.products) {
    throw new Error("Shopify returned invalid product data.");
  }

  return json.data.products;
}

function normalizeProduct({ node }) {
  const variants = node?.variants?.nodes || [];

  const barcode = variants.find((v) => v?.barcode)?.barcode || "";

  // If a product has several variants, prefer the one with a UK SKU
  const skus = variants.map((v) => v?.sku).filter(Boolean);
  const sku = skus.find(isUkSku) || skus[0] || "";

  const quantity = variants.reduce(
    (sum, v) => sum + (v?.quantityAvailable || 0),
    0,
  );

  const listOnWebsiteRaw = String(node?.listOnWebsiteMeta?.value || "")
    .trim()
    .toLowerCase();

  return {
    id: node?.id || "",
    title: node?.title || "",
    vendor: node?.vendor || "",
    barcode,
    sku,
    image: node?.featuredImage?.url || null,
    imageAlt: node?.featuredImage?.altText || node?.title || "Product",
    price: Number(node?.priceRange?.minVariantPrice?.amount) || 0,
    currency: node?.priceRange?.minVariantPrice?.currencyCode || "USD",
    quantity,
    listOnWebsite: ["true", "yes"].includes(listOnWebsiteRaw),
    platform: node?.platformMeta?.value || "",
  };
}

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

  const edges = [];
  let cursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const page = await fetchProductsPage(cursor);
    edges.push(...page.edges);

    const lastEdge = page.edges[page.edges.length - 1];
    cursor = lastEdge?.cursor ?? null;
    hasNextPage = page.pageInfo.hasNextPage && Boolean(lastEdge);
  }

  return edges.map(normalizeProduct);
}