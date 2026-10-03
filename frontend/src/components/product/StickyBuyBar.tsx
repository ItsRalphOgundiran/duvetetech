"use client";

import type { WooProduct } from "@/lib/types";
import { formatNaira } from "@/lib/format";
import AddToCartButton from "./AddToCartButton";

/** Sticky mobile buy bar — sits above the bottom nav. */
export default function StickyBuyBar({ product }: { product: WooProduct }) {
  return (
    <div className="pb-safe fixed inset-x-0 bottom-14 z-30 flex items-center gap-3 border-t border-gray-200 bg-white px-4 py-2.5 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] md:hidden">
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-ink/60">{product.name}</p>
        <p className="text-base font-extrabold text-brand">{formatNaira(product.price)}</p>
      </div>
      <AddToCartButton product={product} className="shrink-0 !px-5 !py-2.5 text-sm" />
    </div>
  );
}
