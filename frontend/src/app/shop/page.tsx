import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/catalog";
import { collectBrands, filterByBrand, shopParamsToQuery, type ShopParams } from "@/lib/shop";
import ProductGrid from "@/components/shop/ProductGrid";
import { ShopSidebar, SortBar } from "@/components/shop/ShopControls";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse genuine smartphones, laptops, accessories, gadgets and networking gear — delivered across Nigeria.",
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<ShopParams> }) {
  const sp = await searchParams;
  const { query, brand } = shopParamsToQuery(sp);
  const [products, brandSource, categories] = await Promise.all([
    getProducts(query),
    // a second unfiltered fetch keeps the brand list complete while filtering
    getProducts({ category: query.category, perPage: 100 }),
    getCategories(),
  ]);
  const filtered = filterByBrand(products, brand);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="mb-2 text-xs text-ink/50">
        <Link href="/" className="hover:text-brand">Home</Link> / <span className="text-ink">Shop</span>
      </nav>
      <h1 className="mb-1 text-2xl font-extrabold text-navy">
        {sp.search ? `Results for “${sp.search}”` : "Shop All Products"}
      </h1>
      <p className="mb-4 text-sm text-ink/55">{filtered.length} products</p>

      <SortBar categories={categories} brands={collectBrands(brandSource)} />
      <div className="flex gap-6">
        <ShopSidebar categories={categories} brands={collectBrands(brandSource)} />
        <div className="min-w-0 flex-1">
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}
