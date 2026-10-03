"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { formatNaira, stripHtml } from "@/lib/format";
import type { WooProduct } from "@/lib/types";
import { ConditionBadge, SaleBadge, StockBadge } from "./Badges";
import AddToCartButton from "./AddToCartButton";
import ProductImage from "./ProductImage";

export default function QuickView({
  product,
  onClose,
}: {
  product: WooProduct | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!product) return null;
  const img = product.images[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/60 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-t-2xl bg-white sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="text-sm font-bold text-navy">Quick View</span>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
            <ProductImage src={img?.src} alt={img?.alt || product.name} seed={product.id} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-1.5">
              <SaleBadge product={product} />
              <ConditionBadge product={product} />
            </div>
            <h3 className="text-sm font-bold leading-snug">{product.name}</h3>
            <StockBadge product={product} />
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-brand">{formatNaira(product.price)}</span>
              {product.on_sale && (
                <span className="text-sm text-ink/40 line-through">{formatNaira(product.regular_price)}</span>
              )}
            </div>
          </div>
        </div>
        {product.short_description && (
          <p className="px-4 text-sm text-ink/60">{stripHtml(product.short_description)}</p>
        )}
        <div className="flex gap-2 p-4">
          <AddToCartButton product={product} className="flex-1" />
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex items-center justify-center rounded-lg border border-brand px-4 py-3 text-sm font-bold text-brand hover:bg-brand/5"
          >
            Full Details
          </Link>
        </div>
      </div>
    </div>
  );
}
