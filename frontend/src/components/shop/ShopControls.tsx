"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import type { WooCategory } from "@/lib/types";

/**
 * Shop controls drive everything through URL search params so results stay
 * server-rendered and shareable. Three exported pieces:
 *   <SortBar/>     — sort select + mobile "Filters" button + filter sheet
 *   <ShopSidebar/> — sticky desktop filter panel
 */

function useShopParams() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const get = (k: string) => params.get(k) ?? "";
  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`${pathname}?${next.toString()}`);
  };
  const setMany = (entries: Record<string, string>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(entries)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    router.push(`${pathname}?${next.toString()}`);
  };
  return { get, setParam, setMany, pathname, activeCount: ["brand", "min", "max", "sale"].filter((k) => params.get(k)).length };
}

function FiltersForm({ categories, brands }: { categories: WooCategory[]; brands: string[] }) {
  const { get, setParam, setMany, pathname, activeCount } = useShopParams();
  const router = useRouter();
  const isCategoryPage = pathname.startsWith("/category/");

  return (
    <div className="space-y-5">
      {!isCategoryPage && (
        <div>
          <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-ink/50">Category</h4>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setParam("category", "")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                !get("category") ? "bg-brand text-white" : "bg-white text-ink/70 ring-1 ring-gray-200"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setParam("category", c.slug)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  get("category") === c.slug ? "bg-brand text-white" : "bg-white text-ink/70 ring-1 ring-gray-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {brands.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-ink/50">Brand</h4>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setParam("brand", "")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                !get("brand") ? "bg-navy text-white" : "bg-white text-ink/70 ring-1 ring-gray-200"
              }`}
            >
              All
            </button>
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => setParam("brand", b)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  get("brand") === b ? "bg-navy text-white" : "bg-white text-ink/70 ring-1 ring-gray-200"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-ink/50">Price (₦)</h4>
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            setMany({ min: String(fd.get("min") ?? ""), max: String(fd.get("max") ?? "") });
          }}
        >
          <input
            name="min"
            inputMode="numeric"
            placeholder="Min"
            defaultValue={get("min")}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <span className="text-ink/40">–</span>
          <input
            name="max"
            inputMode="numeric"
            placeholder="Max"
            defaultValue={get("max")}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <button className="rounded-lg bg-navy px-3 py-2 text-xs font-bold text-white">Go</button>
        </form>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-ink/80">
        <input
          type="checkbox"
          checked={!!get("sale")}
          onChange={(e) => setParam("sale", e.target.checked ? "1" : "")}
          className="h-4 w-4 accent-accent"
        />
        On sale only
      </label>

      {activeCount > 0 && (
        <button
          onClick={() => {
            const next = new URLSearchParams();
            if (get("search")) next.set("search", get("search"));
            if (get("sort")) next.set("sort", get("sort"));
            router.push(`${pathname}?${next.toString()}`);
          }}
          className="inline-flex items-center gap-1 text-xs font-bold text-red-500"
        >
          <X className="h-3.5 w-3.5" /> Clear all filters ({activeCount})
        </button>
      )}
    </div>
  );
}

export function SortBar({ categories, brands }: { categories: WooCategory[]; brands: string[] }) {
  const { get, setParam, activeCount } = useShopParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => setFiltersOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
          {activeCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-navy">
              {activeCount}
            </span>
          )}
        </button>
        <div className="relative ml-auto">
          <select
            value={get("sort") || "popularity"}
            onChange={(e) => setParam("sort", e.target.value === "popularity" ? "" : e.target.value)}
            className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="Sort products"
          >
            <option value="popularity">Most Popular</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name">Name A–Z</option>
            <option value="newest">Newest</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 bg-navy/60 lg:hidden" onClick={() => setFiltersOpen(false)}>
          <div
            className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-bg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold text-navy">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="rounded-full p-1.5 hover:bg-gray-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <FiltersForm categories={categories} brands={brands} />
            <button
              onClick={() => setFiltersOpen(false)}
              className="mt-5 w-full rounded-xl bg-accent py-3 font-bold text-navy transition hover:bg-accent-dark hover:text-white"
            >
              Show Results
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function ShopSidebar({ categories, brands }: { categories: WooCategory[]; brands: string[] }) {
  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <div className="sticky top-40 rounded-xl border border-gray-100 bg-white p-4">
        <FiltersForm categories={categories} brands={brands} />
      </div>
    </aside>
  );
}
