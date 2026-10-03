"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/format";
import ProductImage from "@/components/product/ProductImage";

/** Slide-out cart drawer. */
export default function CartDrawer() {
  const { items, subtotal, isOpen, closeCart, setQuantity, removeItem } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-navy/60" onClick={closeCart}>
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="flex items-center gap-2 text-base font-bold text-navy">
            <ShoppingBag className="h-5 w-5" /> Your Cart
          </h2>
          <button onClick={closeCart} aria-label="Close cart" className="rounded-full p-1.5 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <ShoppingBag className="h-12 w-12 text-ink/20" />
            <p className="font-semibold text-ink/70">Your cart is empty</p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y overflow-y-auto px-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3 py-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white">
                    <ProductImage src={item.image} alt={item.imageAlt || item.name} seed={item.productId} sizes="80px" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={closeCart}
                      className="line-clamp-2 text-sm font-semibold hover:text-brand"
                    >
                      {item.name}
                    </Link>
                    <span className="mt-0.5 text-sm font-bold text-brand">{formatNaira(item.price)}</span>
                    <div className="mt-auto flex items-center gap-2">
                      <div className="flex items-center rounded-lg border border-gray-200">
                        <button
                          className="p-1.5 hover:bg-gray-50"
                          onClick={() => setQuantity(item.productId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          className="p-1.5 hover:bg-gray-50"
                          onClick={() => setQuantity(item.productId, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        aria-label="Remove item"
                        className="ml-auto rounded-md p-1.5 text-ink/40 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-ink/60">Subtotal</span>
                <span className="text-lg font-extrabold text-navy">{formatNaira(subtotal)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block rounded-xl bg-accent py-3 text-center font-bold text-navy transition hover:bg-accent-dark hover:text-white"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="mt-2 block rounded-lg border border-gray-200 py-2.5 text-center text-sm font-semibold text-ink hover:bg-gray-50"
              >
                View Cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
