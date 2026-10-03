"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { WooProduct } from "@/lib/types";

/** Accent CTA — the one color reserved for conversion actions. */
export default function AddToCartButton({
  product,
  quantity = 1,
  className = "",
  label = "Add to Cart",
}: {
  product: WooProduct;
  quantity?: number;
  className?: string;
  label?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const disabled = product.stock_status === "outofstock";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        addItem(
          {
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: Number(product.price) || 0,
            image: product.images[0]?.src,
            imageAlt: product.images[0]?.alt || product.name,
            sku: product.sku,
          },
          quantity
        );
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-bold text-navy transition hover:bg-accent-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
      {disabled ? "Out of Stock" : added ? "Added" : label}
    </button>
  );
}
