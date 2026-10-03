"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { WooProduct } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";
import QuickView from "@/components/product/QuickView";

/** Horizontal-scroll product rail (bestsellers / deals) with quick-view. */
export default function ProductCarousel({
  title,
  products,
  href = "/shop",
}: {
  title: string;
  products: WooProduct[];
  href?: string;
}) {
  const [quickView, setQuickView] = useState<WooProduct | null>(null);
  if (!products.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-navy sm:text-2xl">{title}</h2>
        <Link href={href} className="inline-flex items-center gap-1 text-sm font-bold text-brand hover:underline">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
        {products.map((p) => (
          <div key={p.id} className="w-[46vw] shrink-0 snap-start sm:w-[30vw] lg:w-[23%]">
            <ProductCard product={p} onQuickView={setQuickView} />
          </div>
        ))}
      </div>
      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
}
