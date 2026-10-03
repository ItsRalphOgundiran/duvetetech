import "server-only";
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from "./demo-data";
import type { WooCategory, WooProduct } from "./types";

/**
 * Server-side catalog access.
 *
 * Live mode: reads from the WooCommerce **Store API** (`/wp-json/wc/store/v1`),
 * which is the public, unauthenticated endpoint designed for headless
 * storefronts — no secrets ever reach the browser.
 *
 * Demo mode: if WOOCOMMERCE_API_URL is not set, the bundled demo catalog in
 * `demo-data.ts` is used so the site runs before WordPress is deployed.
 */

const WC_URL = (process.env.WOOCOMMERCE_API_URL ?? "").replace(/\/$/, "");
export const isLiveBackend = () => WC_URL.length > 0;

const REVALIDATE = 60; // seconds — keep product data fresh without hammering WP

/* eslint-disable @typescript-eslint/no-explicit-any */

function storePrice(p: any, key: string): string {
  // Store API returns prices in the currency's minor unit (kobo for NGN).
  const minor = p?.prices?.currency_minor_unit ?? 2;
  const raw = p?.prices?.[key];
  if (raw === null || raw === undefined || raw === "") return "";
  return String(Number(raw) / 10 ** minor);
}

function mapStoreProduct(p: any): WooProduct {
  const regular = storePrice(p, "regular_price");
  const sale = storePrice(p, "sale_price");
  const price = storePrice(p, "price") || regular;
  const onSale = !!sale && Number(sale) > 0 && Number(sale) < Number(regular);
  const meta = (p?.extensions ?? {}) as Record<string, any>;
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    type: p.type ?? "simple",
    price,
    regular_price: regular || price,
    sale_price: onSale ? sale : "",
    on_sale: onSale,
    stock_status: p.is_in_stock === false ? "outofstock" : "instock",
    stock_quantity: p.stock_quantity ?? null,
    description: p.description ?? "",
    short_description: p.short_description ?? "",
    images: (p.images ?? []).map((i: any) => ({
      id: i.id ?? 0,
      src: i.src ?? i.thumbnail ?? "",
      name: i.name ?? "",
      alt: i.alt ?? i.name ?? p.name,
    })),
    categories: (p.categories ?? []).map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    })),
    attributes: (p.attributes ?? []).map((a: any) => ({
      id: a.id ?? 0,
      name: a.name ?? "",
      options: (a.terms ?? []).map((t: any) => t.name ?? String(t)),
    })),
    related_ids: [],
    condition: meta.duvete?.condition ?? "genuine",
    grade: meta.duvete?.grade,
    featured: !!p.featured || !!meta.featured,
    average_rating: p.average_rating,
    rating_count: p.review_count ?? 0,
  };
}

async function storeApi(path: string): Promise<any> {
  const res = await fetch(`${WC_URL}/wp-json/wc/store/v1${path}`, {
    next: { revalidate: REVALIDATE },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Store API ${path} → ${res.status}`);
  return res.json();
}

/* ------------------------------ Public API ------------------------------ */

export interface ProductQuery {
  category?: string; // slug or id
  search?: string;
  orderby?: "date" | "price" | "popularity" | "rating" | "title";
  order?: "asc" | "desc";
  perPage?: number;
  onSale?: boolean;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export async function getCategories(): Promise<WooCategory[]> {
  if (!isLiveBackend()) return DEMO_CATEGORIES;
  try {
    const data = await storeApi("/products/categories?per_page=50");
    const cats: WooCategory[] = (data ?? [])
      .filter((c: any) => c.slug !== "uncategorized")
      .map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: c.image
          ? { id: c.image.id ?? 0, src: c.image.src, name: c.image.name ?? "", alt: c.image.alt ?? c.name }
          : null,
        count: c.count,
      }));
    return cats.length ? cats : DEMO_CATEGORIES;
  } catch {
    return DEMO_CATEGORIES;
  }
}

export async function getCategoryBySlug(slug: string): Promise<WooCategory | undefined> {
  const cats = await getCategories();
  return cats.find((c) => c.slug === slug);
}

export async function getProducts(q: ProductQuery = {}): Promise<WooProduct[]> {
  if (!isLiveBackend()) return filterDemo(q);
  try {
    const params = new URLSearchParams();
    params.set("per_page", String(q.perPage ?? 24));
    if (q.search) params.set("search", q.search);
    if (q.orderby) params.set("orderby", q.orderby);
    if (q.order) params.set("order", q.order);
    if (q.onSale) params.set("on_sale", "true");
    if (q.minPrice != null) params.set("min_price", String(Math.round(q.minPrice * 100)));
    if (q.maxPrice != null) params.set("max_price", String(Math.round(q.maxPrice * 100)));
    if (q.category) {
      const cat = /^\d+$/.test(q.category)
        ? { id: Number(q.category) }
        : await getCategoryBySlug(q.category);
      if (cat) params.set("category", String(cat.id));
    }
    const data = await storeApi(`/products?${params.toString()}`);
    let products: WooProduct[] = (data ?? []).map(mapStoreProduct);
    if (q.featured) products = products.filter((p) => p.featured);
    return products;
  } catch {
    return filterDemo(q);
  }
}

export async function getProductBySlug(slug: string): Promise<WooProduct | undefined> {
  if (!isLiveBackend()) return DEMO_PRODUCTS.find((p) => p.slug === slug);
  try {
    const data = await storeApi(`/products?slug=${encodeURIComponent(slug)}`);
    if (Array.isArray(data) && data.length) return mapStoreProduct(data[0]);
  } catch {
    /* fall through */
  }
  return DEMO_PRODUCTS.find((p) => p.slug === slug);
}

export async function getProductById(id: number): Promise<WooProduct | undefined> {
  if (!isLiveBackend()) return DEMO_PRODUCTS.find((p) => p.id === id);
  try {
    const data = await storeApi(`/products/${id}`);
    if (data?.id) return mapStoreProduct(data);
  } catch {
    /* fall through */
  }
  return DEMO_PRODUCTS.find((p) => p.id === id);
}

/** Same-category products, excluding the given one — used for related/upsell rows. */
export async function getRelatedProducts(product: WooProduct, limit = 4): Promise<WooProduct[]> {
  const results: WooProduct[] = [];
  if (product.related_ids?.length) {
    for (const id of product.related_ids) {
      const p = await getProductById(id);
      if (p) results.push(p);
    }
  }
  if (results.length < limit && product.categories[0]) {
    const siblings = await getProducts({ category: product.categories[0].slug, perPage: 8 });
    for (const s of siblings) {
      if (s.id !== product.id && !results.some((r) => r.id === s.id)) results.push(s);
      if (results.length >= limit) break;
    }
  }
  return results.slice(0, limit);
}

export async function searchProducts(term: string, limit = 6): Promise<WooProduct[]> {
  if (!term.trim()) return [];
  return getProducts({ search: term, perPage: limit });
}

/* ------------------------------ Demo filter ------------------------------ */

function filterDemo(q: ProductQuery): WooProduct[] {
  let out = [...DEMO_PRODUCTS];
  if (q.category) out = out.filter((p) => p.categories.some((c) => c.slug === q.category || String(c.id) === q.category));
  if (q.search) {
    const t = q.search.toLowerCase();
    out = out.filter((p) =>
      p.name.toLowerCase().includes(t) ||
      p.short_description.toLowerCase().includes(t) ||
      p.categories.some((c) => c.name.toLowerCase().includes(t)) ||
      p.attributes.some((a) => a.options.some((o) => o.toLowerCase().includes(t)))
    );
  }
  if (q.onSale) out = out.filter((p) => p.on_sale);
  if (q.featured) out = out.filter((p) => p.featured);
  if (q.minPrice != null) out = out.filter((p) => Number(p.price) >= q.minPrice!);
  if (q.maxPrice != null) out = out.filter((p) => Number(p.price) <= q.maxPrice!);
  if (q.orderby === "price") out.sort((a, b) => (q.order === "desc" ? Number(b.price) - Number(a.price) : Number(a.price) - Number(b.price)));
  else if (q.orderby === "title") out.sort((a, b) => a.name.localeCompare(b.name));
  else if (q.orderby === "popularity") out.sort((a, b) => (b.rating_count ?? 0) - (a.rating_count ?? 0));
  return out.slice(0, q.perPage ?? 24);
}
