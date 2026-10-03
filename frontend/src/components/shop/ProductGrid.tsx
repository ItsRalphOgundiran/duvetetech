"use client";

import { useState } from "react";
import type { WooProduct } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";
import QuickView from "@/components/product/QuickView";

export default function ProductGrid({ products }: { products: WooProduct[] }) {
  const [quickView, setQuickView] = useState<WooProduct | null>(null);

  if (!products.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="font-semibold text-ink/70">No products found.</p>
        <p className="mt-1 text-sm text-ink/50">Try adjusting your filters or search term.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onQuickView={setQuickView} />
        ))}
      </div>
      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}
