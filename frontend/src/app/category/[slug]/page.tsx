import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/catalog";
import { collectBrands, filterByBrand, shopParamsToQuery, type ShopParams } from "@/lib/shop";
import { stripHtml } from "@/lib/format";
import ProductGrid from "@/components/shop/ProductGrid";
import { ShopSidebar, SortBar } from "@/components/shop/ShopControls";

export const revalidate = 60;

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return { title: "Category" };
  return {
    title: cat.name,
    description: cat.description
      ? stripHtml(cat.description)
      : `Shop ${cat.name} at Duvete Technologies — genuine products, fast Nigerian delivery.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ShopParams>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();

  const { query, brand } = shopParamsToQuery({ ...sp, category: slug });
  const [products, brandSource, categories] = await Promise.all([
    getProducts(query),
    getProducts({ category: slug, perPage: 100 }),
    getCategories(),
  ]);
  const filtered = filterByBrand(products, brand);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="mb-2 text-xs text-ink/50">
        <Link href="/" className="hover:text-brand">Home</Link> / <span className="text-ink">{cat.name}</span>
      </nav>
      <h1 className="mb-1 text-2xl font-extrabold text-navy">{cat.name}</h1>
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
