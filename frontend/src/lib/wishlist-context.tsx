"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "./use-local-storage";

/** Wishlist stored client-side in localStorage — just product ids. */

const EMPTY: number[] = [];

interface WishlistContextValue {
  ids: number[];
  has: (id: number) => boolean;
  toggle: (id: number) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "duvete-wishlist-v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useLocalStorage<number[]>(STORAGE_KEY, EMPTY);

  const toggle = useCallback(
    (id: number) =>
      setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [setIds]
  );

  const value = useMemo<WishlistContextValue>(
    () => ({ ids, has: (id) => ids.includes(id), toggle }),
    [ids, toggle]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
