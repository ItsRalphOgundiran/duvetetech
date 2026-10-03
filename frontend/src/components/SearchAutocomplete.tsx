"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { formatNaira } from "@/lib/format";
import type { WooProduct } from "@/lib/types";

/** Predictive search — queries /api/search which proxies the WooCommerce API. */
export default function SearchAutocomplete() {
  const [term, setTerm] = useState("");
  const [result, setResult] = useState<{ q: string; products: WooProduct[] } | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);
  const debounce = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    const q = term.trim();
    if (q.length < 2) return;
    debounce.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResult({ q, products: data.products ?? [] });
      } catch {
        setResult({ q, products: [] });
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [term]);

  const results = term.trim().length >= 2 && result?.q === term.trim() ? result.products : [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim()) return;
    setOpen(false);
    router.push(`/shop?search=${encodeURIComponent(term.trim())}`);
  };

  return (
    <div ref={boxRef} className="relative w-full">
      <form onSubmit={submit} role="search">
        <input
          type="search"
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search phones, laptops, gadgets…"
          className="w-full rounded-full border-0 bg-white px-4 py-2.5 pr-10 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Search products"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-brand p-1.5 text-white hover:bg-brand-dark"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </button>
      </form>

      {open && term.trim().length >= 2 && (
        <div className="absolute inset-x-0 top-full z-40 mt-1 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
          {results.length === 0 && !loading ? (
            <p className="px-4 py-3 text-sm text-ink/50">No products match “{term}”.</p>
          ) : (
            <ul>
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/product/${p.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-bg"
                  >
                    <span className="truncate font-medium text-ink">{p.name}</span>
                    <span className="shrink-0 font-bold text-brand">{formatNaira(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`/shop?search=${encodeURIComponent(term.trim())}`}
            onClick={() => setOpen(false)}
            className="block border-t bg-bg px-4 py-2 text-center text-xs font-semibold text-brand"
          >
            See all results
          </Link>
        </div>
      )}
    </div>
  );
}
