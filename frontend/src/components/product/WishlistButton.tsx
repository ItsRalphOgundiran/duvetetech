"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";

export default function WishlistButton({ productId, className = "" }: { productId: number; className?: string }) {
  const { has, toggle } = useWishlist();
  const active = has(productId);
  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      onClick={(e) => {
        e.preventDefault();
        toggle(productId);
      }}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
        active
          ? "border-red-200 bg-red-50 text-red-500"
          : "border-gray-200 bg-white text-ink/60 hover:text-red-500"
      } ${className}`}
    >
      <Heart className="h-4 w-4" fill={active ? "currentColor" : "none"} />
    </button>
  );
}
