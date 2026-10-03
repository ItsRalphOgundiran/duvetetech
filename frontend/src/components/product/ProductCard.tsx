import Link from "next/link";
import { Eye } from "lucide-react";
import { formatNaira, stripHtml } from "@/lib/format";
import type { WooProduct } from "@/lib/types";
import { ConditionBadge, SaleBadge } from "./Badges";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";
import ProductImage from "./ProductImage";

export default function ProductCard({
  product,
  onQuickView,
}: {
  product: WooProduct;
  onQuickView?: (p: WooProduct) => void;
}) {
  const img = product.images[0];
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200/70 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/5 hover:ring-gray-300/70">
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        <SaleBadge product={product} />
      </div>
      <div className="absolute right-2 top-2 z-10">
        <WishlistButton productId={product.id} />
      </div>

      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gray-50">
        <ProductImage src={img?.src} alt={img?.alt || product.name} seed={product.id} />
        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onQuickView(product);
            }}
            className="absolute inset-x-3 bottom-3 z-10 hidden items-center justify-center gap-1.5 rounded-lg bg-navy/90 py-2 text-xs font-semibold text-white opacity-0 backdrop-blur transition group-hover:opacity-100 md:inline-flex"
          >
            <Eye className="h-3.5 w-3.5" /> Quick View
          </button>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <ConditionBadge product={product} />
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-snug text-ink hover:text-brand"
        >
          {product.name}
        </Link>
        {product.short_description && (
          <p className="line-clamp-1 text-xs text-ink/50">{stripHtml(product.short_description)}</p>
        )}
        <div className="mt-auto pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-brand">{formatNaira(product.price)}</span>
            {product.on_sale && (
              <span className="text-xs text-ink/40 line-through">{formatNaira(product.regular_price)}</span>
            )}
          </div>
          <AddToCartButton product={product} className="mt-2 w-full !px-3 !py-2 text-sm" />
        </div>
      </div>
    </div>
  );
}
