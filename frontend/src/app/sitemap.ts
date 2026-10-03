import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getProducts({ perPage: 100 }), getCategories()]);
  const staticPages = ["", "/shop", "/corporate", "/about", "/contact", "/faq", "/track-order"].map((p) => ({
    url: `${SITE.url}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.6,
  }));
  return [
    ...staticPages,
    ...categories.map((c) => ({
      url: `${SITE.url}/category/${c.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${SITE.url}/product/${p.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];
}
