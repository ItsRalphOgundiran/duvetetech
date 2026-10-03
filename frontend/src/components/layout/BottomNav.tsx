"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid2x2, Home, MessageCircle, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { whatsappLink } from "@/lib/site";

/** Sticky mobile bottom navigation — hidden on md+. */
export default function BottomNav() {
  const pathname = usePathname();
  const { count, openCart } = useCart();

  const item = (href: string, label: string, Icon: typeof Home, active = false) => (
    <Link
      href={href}
      className={`flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium ${
        active ? "text-accent" : "text-white/70"
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  );

  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-white/10 bg-navy text-white md:hidden">
      {item("/", "Home", Home, pathname === "/")}
      {item("/shop", "Categories", Grid2x2, pathname.startsWith("/shop") || pathname.startsWith("/category"))}
      <button
        onClick={openCart}
        className="relative flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium text-white/70"
      >
        <ShoppingCart className="h-5 w-5" />
        Cart
        {count > 0 && (
          <span className="absolute right-[22%] top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-navy">
            {count}
          </span>
        )}
      </button>
      <a
        href={whatsappLink("Hi Duvete Technologies! I need help with an order.")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium text-trust"
      >
        <MessageCircle className="h-5 w-5" />
        WhatsApp
      </a>
      {item("/account", "Account", User, pathname === "/account")}
    </nav>
  );
}
