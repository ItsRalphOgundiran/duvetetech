"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";
import type { WooProduct } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";
import QuickView from "@/components/product/QuickView";

export default function WishlistGrid() {
  const { ids } = useWishlist();
  const [fetched, setFetched] = useState<WooProduct[] | null>(null);
  const [quickView, setQuickView] = useState<WooProduct | null>(null);

  useEffect(() => {
    if (!ids.length) return;
    let cancelled = false;
    Promise.all(ids.map((id) => fetch(`/api/products/${id}`).then((r) => (r.ok ? r.json() : null))))
      .then((res) => {
        if (!cancelled) setFetched(res.map((r) => r?.product).filter(Boolean));
      })
      .catch(() => {
        if (!cancelled) setFetched([]);
      });
    return () => {
      cancelled = true;
    };
  }, [ids]);

  const products = (fetched ?? []).filter((p) => ids.includes(p.id));

  if (ids.length > 0 && fetched === null) {
    return <p className="py-10 text-center text-sm text-ink/50">Loading your wishlist…</p>;
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <Heart className="h-12 w-12 text-ink/20" />
        <p className="font-semibold text-ink/70">Your wishlist is empty</p>
        <Link href="/shop" className="rounded-xl bg-accent px-6 py-2.5 font-bold text-navy transition hover:bg-accent-dark hover:text-white">
          Find something you love
        </Link>
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
