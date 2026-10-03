"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * useSyncExternalStore-backed localStorage state.
 * Server snapshot is always `initial`, so there's no hydration mismatch —
 * React re-renders on the client once it can read the stored value.
 */

// Per-key snapshot caches so getSnapshot returns a stable reference.
const caches = new Map<string, { raw: string | null; value: unknown }>();

function getSnapshot<T>(key: string, initial: T): () => T {
  return () => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(key);
    } catch {
      /* storage unavailable */
    }
    const cached = caches.get(key);
    if (cached && cached.raw === raw) return cached.value as T;
    let value: T = initial;
    try {
      if (raw != null) value = JSON.parse(raw) as T;
    } catch {
      /* corrupt JSON */
    }
    caches.set(key, { raw, value });
    return value;
  };
}

function subscribe(key: string) {
  return (onStoreChange: () => void) => {
    const onCustom = () => onStoreChange();
    const onStorage = (e: StorageEvent) => {
      if (e.key === key || e.key === null) onStoreChange();
    };
    window.addEventListener(`ls:${key}`, onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(`ls:${key}`, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  };
}

export function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const value = useSyncExternalStore(subscribe(key), getSnapshot(key, initial), () => initial);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      try {
        const current = getSnapshot(key, initial)();
        const resolved = typeof next === "function" ? (next as (p: T) => T)(current) : next;
        localStorage.setItem(key, JSON.stringify(resolved));
        caches.set(key, { raw: JSON.stringify(resolved), value: resolved });
        window.dispatchEvent(new Event(`ls:${key}`));
      } catch {
        /* storage unavailable */
      }
    },
    [key, initial]
  );

  return [value, set];
}
