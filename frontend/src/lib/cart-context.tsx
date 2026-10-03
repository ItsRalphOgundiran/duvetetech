"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useLocalStorage } from "./use-local-storage";
import type { CartItem } from "./types";

/**
 * Client-side cart persisted to localStorage.
 *
 * Why client-side: the WooCommerce Store API's cart is session/cookie-bound and
 * awkward to share across two domains. Instead the frontend holds cart state
 * locally, and at checkout the order is created server-side via the
 * WooCommerce REST API (see /api/orders), which decrements stock and creates
 * the order record — so inventory and orders stay correct in Woo admin.
 */

const EMPTY: CartItem[] = [];

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "duvete-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>(STORAGE_KEY, EMPTY);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === item.productId);
        if (existing) {
          return prev.map((i) =>
            i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        return [...prev, { ...item, quantity }];
      });
      setIsOpen(true);
    },
    [setItems]
  );

  const removeItem = useCallback(
    (productId: number) => setItems((prev) => prev.filter((i) => i.productId !== productId)),
    [setItems]
  );

  const setQuantity = useCallback(
    (productId: number, quantity: number) =>
      setItems((prev) =>
        quantity <= 0
          ? prev.filter((i) => i.productId !== productId)
          : prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
      ),
    [setItems]
  );

  const clear = useCallback(() => setItems(EMPTY), [setItems]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    return {
      items,
      count,
      subtotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      setQuantity,
      clear,
    };
  }, [items, isOpen, addItem, removeItem, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
