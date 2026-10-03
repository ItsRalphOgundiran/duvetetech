import Link from "next/link";
import { ArrowRight, BadgeCheck, Star, Truck, Zap } from "lucide-react";

/**
 * Promo hero — hardcoded content (edit here to change banners).
 * Deep navy base with grid overlay, blue/cyan glows and gradient headline.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      {/* layered background: grid + glows */}
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-32 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-brand/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-[-5%] h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:py-20 md:py-24">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-accent">
          <Zap className="h-3.5 w-3.5" /> Lagos Tech Deals — Live Now
        </span>

        <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
          Genuine gadgets &amp; computers,{" "}
          <span className="text-gradient">delivered fast</span> across Nigeria.
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
          Smartphones, laptops, accessories and networking gear — 100% authentic,
          warrantied, and priced right. Pay securely with Paystack or on delivery.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 font-bold text-navy shadow-lg shadow-accent/25 transition hover:bg-accent-dark hover:text-white"
          >
            Shop Now <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/corporate"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/10"
          >
            Corporate Orders
          </Link>
        </div>

        {/* social proof strip */}
        <dl className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-6">
          <div className="flex items-center gap-2.5">
            <Star className="h-4 w-4 text-accent" />
            <div>
              <dt className="text-sm font-bold">4.8/5 rating</dt>
              <dd className="text-xs text-white/50">from verified buyers</dd>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Truck className="h-4 w-4 text-accent" />
            <div>
              <dt className="text-sm font-bold">Same-day delivery</dt>
              <dd className="text-xs text-white/50">within Lagos</dd>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <BadgeCheck className="h-4 w-4 text-accent" />
            <div>
              <dt className="text-sm font-bold">100% genuine</dt>
              <dd className="text-xs text-white/50">warranty on every item</dd>
            </div>
          </div>
        </dl>
      </div>
    </section>
  );
}
