"use client";

import Link from "next/link";
import { Heart, Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/shop", label: "Shop All" },
  { href: "/category/smartphones-tablets", label: "Phones & Tablets" },
  { href: "/category/laptops-computers", label: "Laptops" },
  { href: "/category/accessories", label: "Accessories" },
  { href: "/category/gadgets", label: "Gadgets" },
  { href: "/category/networking", label: "Networking" },
  { href: "/corporate", label: "Corporate" },
];

export default function Header() {
  const { count, openCart } = useCart();
  const { ids } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-navy/95 text-white shadow-lg shadow-navy/20 backdrop-blur-md">
      {/* Promo bar */}
      <div className="bg-gradient-to-r from-brand-dark via-brand to-brand-dark px-4 py-1.5 text-center text-[11px] font-semibold tracking-wide sm:text-xs">
        Same-day delivery in Lagos · 100% genuine products · Pay securely with Paystack
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        {/* Mobile menu button */}
        <button
          className="rounded-md p-1.5 hover:bg-navy-light md:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/" className="shrink-0 text-lg font-extrabold tracking-tight sm:text-xl">
          Duvete<span className="text-accent">Tech</span>
        </Link>

        {/* Desktop search */}
        <div className="mx-auto hidden w-full max-w-xl md:block">
          <SearchAutocomplete />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link href="/wishlist" className="relative rounded-md p-2 hover:bg-navy-light" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
            {ids.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-navy">
                {ids.length}
              </span>
            )}
          </Link>
          <button onClick={openCart} className="relative rounded-md p-2 hover:bg-navy-light" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-navy">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="px-4 pb-3 md:hidden">
        <SearchAutocomplete />
      </div>

      {/* Desktop nav */}
      <nav className="hidden border-t border-white/10 md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-white/80 transition hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile drawer menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-navy/60 md:hidden" onClick={() => setMenuOpen(false)}>
          <div
            className="h-full w-72 max-w-[85%] overflow-y-auto bg-navy p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-extrabold">
                Duvete<span className="text-accent">Tech</span>
              </span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="rounded-md p-1.5 hover:bg-navy-light">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="space-y-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/85 hover:bg-navy-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-3">
                <Link
                  href="/track-order"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg border border-white/20 px-3 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Track My Order
                </Link>
              </li>
              <li>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="block rounded-lg bg-accent px-3 py-2.5 text-center text-sm font-bold text-navy"
                >
                  Call {SITE.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
