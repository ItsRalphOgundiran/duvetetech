import "server-only";
import type { ProductQuery } from "./catalog";
import type { WooProduct } from "./types";

export interface ShopParams {
  search?: string;
  category?: string;
  sort?: string;
  min?: string;
  max?: string;
  sale?: string;
  brand?: string;
}

/** Translate URL search params into a ProductQuery + a brand post-filter. */
export function shopParamsToQuery(sp: ShopParams): { query: ProductQuery; brand?: string } {
  const query: ProductQuery = { perPage: 48 };
  if (sp.search) query.search = sp.search;
  if (sp.category) query.category = sp.category;
  if (sp.sale === "1") query.onSale = true;
  if (sp.min && !isNaN(Number(sp.min))) query.minPrice = Number(sp.min);
  if (sp.max && !isNaN(Number(sp.max))) query.maxPrice = Number(sp.max);
  switch (sp.sort) {
    case "price-asc":
      query.orderby = "price";
      query.order = "asc";
      break;
    case "price-desc":
      query.orderby = "price";
      query.order = "desc";
      break;
    case "name":
      query.orderby = "title";
      query.order = "asc";
      break;
    case "newest":
      query.orderby = "date";
      query.order = "desc";
      break;
    default:
      query.orderby = "popularity";
  }
  return { query, brand: sp.brand };
}

/** Brand post-filter — Store API attribute filtering needs attribute ids, so we filter in JS. */
export function filterByBrand(products: WooProduct[], brand?: string): WooProduct[] {
  if (!brand) return products;
  return products.filter((p) =>
    p.attributes.some((a) => a.name.toLowerCase() === "brand" && a.options.includes(brand))
  );
}

/** Collect unique brand attribute values for the filter UI. */
export function collectBrands(products: WooProduct[]): string[] {
  const set = new Set<string>();
  for (const p of products)
    for (const a of p.attributes)
      if (a.name.toLowerCase() === "brand") for (const o of a.options) set.add(o);
  return [...set].sort();
}
