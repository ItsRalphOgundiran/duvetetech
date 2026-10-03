import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Lock, Truck } from "lucide-react";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/catalog";
import { formatNaira, stripHtml } from "@/lib/format";
import { whatsappLink } from "@/lib/site";
import ProductGallery from "@/components/product/ProductGallery";
import BuyBox from "@/components/product/BuyBox";
import StickyBuyBar from "@/components/product/StickyBuyBar";
import WishlistButton from "@/components/product/WishlistButton";
import { ConditionBadge, SaleBadge, StockBadge } from "@/components/product/Badges";
import ProductCarousel from "@/components/home/ProductCarousel";
import { MessageCircle } from "lucide-react";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts({ perPage: 100 });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product" };
  const description = stripHtml(product.short_description || product.description).slice(0, 160);
  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.images[0]?.src ? [{ url: product.images[0].src }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const category = product.categories[0];

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <nav className="mb-4 text-xs text-ink/50">
          <Link href="/" className="hover:text-brand">Home</Link> /{" "}
          {category && (
            <>
              <Link href={`/category/${category.slug}`} className="hover:text-brand">{category.name}</Link> /{" "}
            </>
          )}
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-2">
          <ProductGallery images={product.images} name={product.name} seed={product.id} />

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <SaleBadge product={product} />
              <ConditionBadge product={product} />
              <WishlistButton productId={product.id} className="ml-auto" />
            </div>
            <h1 className="text-xl font-extrabold leading-tight text-navy sm:text-2xl">
              {product.name}
            </h1>
            {product.rating_count ? (
              <p className="text-xs text-ink/50">
                ★ {Number(product.average_rating || 0).toFixed(1)} · {product.rating_count} reviews
              </p>
            ) : null}
            {product.short_description && (
              <p className="text-sm leading-relaxed text-ink/65">{stripHtml(product.short_description)}</p>
            )}

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-brand">{formatNaira(product.price)}</span>
              {product.on_sale && (
                <span className="text-base text-ink/40 line-through">{formatNaira(product.regular_price)}</span>
              )}
            </div>

            <StockBadge product={product} />

            <BuyBox product={product} />

            {/* trust badges near buy button */}
            <div className="grid grid-cols-3 gap-2 rounded-xl border border-trust/20 bg-trust/5 p-3">
              {[
                { Icon: BadgeCheck, text: "Genuine product" },
                { Icon: Truck, text: "Fast delivery" },
                { Icon: Lock, text: "Secure payment" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1 text-center">
                  <Icon className="h-5 w-5 text-trust" />
                  <span className="text-[11px] font-semibold text-ink/70">{text}</span>
                </div>
              ))}
            </div>

            <a
              href={whatsappLink(`Hi! I'm interested in the ${product.name} (${formatNaira(product.price)}).`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-trust hover:underline"
            >
              <MessageCircle className="h-4 w-4" /> Ask about this product on WhatsApp
            </a>
          </div>
        </div>

        {/* Specs + description */}
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {product.attributes.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-extrabold text-navy">Specifications</h2>
              <table className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white text-sm">
                <tbody>
                  {product.attributes.map((a) => (
                    <tr key={a.name} className="border-b border-gray-100 last:border-0">
                      <th className="w-2/5 bg-bg px-4 py-2.5 text-left font-semibold text-ink/70">{a.name}</th>
                      <td className="px-4 py-2.5 text-ink">{a.options.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
          {product.description && (
            <section>
              <h2 className="mb-3 text-lg font-extrabold text-navy">Description</h2>
              <div
                className="prose prose-sm max-w-none rounded-xl border border-gray-200 bg-white p-4 text-ink/80"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </section>
          )}
        </div>
      </div>

      <div className="pb-8">
        <ProductCarousel
          title="You may also like"
          products={related}
          href={category ? `/category/${category.slug}` : "/shop"}
        />
      </div>

      {/* sticky mobile add-to-cart, sits above bottom nav */}
      <StickyBuyBar product={product} />
    </>
  );
}
