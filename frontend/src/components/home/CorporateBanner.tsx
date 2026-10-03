import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

/** B2B callout — navy panel with cyan glow + accent CTA. */
export default function CorporateBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="relative overflow-hidden rounded-3xl bg-navy p-6 text-white sm:p-10">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative flex flex-col items-start gap-5 md:flex-row md:items-center">
          <span className="rounded-2xl bg-accent/15 p-3.5 ring-1 ring-accent/25">
            <Building2 className="h-8 w-8 text-accent" />
          </span>
          <div className="flex-1">
            <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
              Corporate &amp; Bulk Orders
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-white/65">
              Equipping a team? We supply laptops, phones and networking gear to Nigerian
              businesses — volume pricing, invoicing, and dedicated support.
            </p>
          </div>
          <Link
            href="/corporate"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-navy transition hover:bg-accent-dark hover:text-white"
          >
            Request a Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
