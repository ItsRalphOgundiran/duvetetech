"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Zap } from "lucide-react";
import type { WooProduct } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import AddToCartButton from "./AddToCartButton";

/** Quantity selector + Add to Cart + Buy Now. */
export default function BuyBox({ product }: { product: WooProduct }) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const router = useRouter();
  const disabled = product.stock_status === "outofstock";

  const toItem = () => ({
    productId: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price) || 0,
    image: product.images[0]?.src,
    imageAlt: product.images[0]?.alt || product.name,
    sku: product.sku,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-ink/60">Qty</span>
        <div className="flex items-center rounded-lg border border-gray-200 bg-white">
          <button
            className="p-2.5 hover:bg-gray-50 disabled:opacity-30"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-bold">{qty}</span>
          <button
            className="p-2.5 hover:bg-gray-50"
            onClick={() => setQty((q) => Math.min(product.stock_quantity ?? 99, q + 1))}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex gap-2">
        <AddToCartButton product={product} quantity={qty} className="flex-1" />
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            addItem(toItem(), qty);
            router.push("/checkout");
          }}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 font-bold text-white transition hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Zap className="h-5 w-5 text-accent" /> Buy Now
        </button>
      </div>
    </div>
  );
}
