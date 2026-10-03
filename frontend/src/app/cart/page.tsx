"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/format";
import ProductImage from "@/components/product/ProductImage";

export default function CartPage() {
  const { items, subtotal, setQuantity, removeItem } = useCart();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-extrabold text-navy">Your Cart</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <ShoppingBag className="h-12 w-12 text-ink/20" />
          <p className="font-semibold text-ink/70">Your cart is empty</p>
          <Link href="/shop" className="rounded-xl bg-accent px-6 py-2.5 font-bold text-navy transition hover:bg-accent-dark hover:text-white">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[1fr_320px]">
          <ul className="divide-y rounded-xl border border-gray-100 bg-white px-4">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-3 py-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white">
                  <ProductImage src={item.image} alt={item.imageAlt || item.name} seed={item.productId} sizes="96px" />
                </div>
                <div className="flex flex-1 flex-col">
                  <Link href={`/product/${item.slug}`} className="line-clamp-2 text-sm font-semibold hover:text-brand">
                    {item.name}
                  </Link>
                  <span className="mt-1 text-sm font-bold text-brand">{formatNaira(item.price)}</span>
                  <div className="mt-auto flex items-center gap-3">
                    <div className="flex items-center rounded-lg border border-gray-200">
                      <button
                        className="p-2 hover:bg-gray-50"
                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        className="p-2 hover:bg-gray-50"
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-ink/40 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                    <span className="ml-auto text-sm font-bold text-navy">
                      {formatNaira(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-xl border border-gray-100 bg-white p-4">
            <h2 className="mb-3 font-bold text-navy">Order Summary</h2>
            <div className="flex justify-between border-b border-dashed pb-3 text-sm">
              <span className="text-ink/60">Subtotal</span>
              <span className="font-bold">{formatNaira(subtotal)}</span>
            </div>
            <p className="py-3 text-xs text-ink/50">Delivery fee calculated at checkout based on your zone.</p>
            <Link
              href="/checkout"
              className="block rounded-xl bg-accent py-3 text-center font-bold text-navy transition hover:bg-accent-dark hover:text-white"
            >
              Proceed to Checkout
            </Link>
            <Link href="/shop" className="mt-2 block text-center text-sm font-semibold text-brand hover:underline">
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
