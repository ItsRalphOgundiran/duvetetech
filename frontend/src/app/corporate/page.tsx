import type { Metadata } from "next";
import { Building2, FileCheck2, Handshake, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import QuoteForm from "@/components/QuoteForm";
import { SITE, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Corporate & Procurement",
  description:
    "Bulk device supply, IT asset provisioning and corporate gifting for Nigerian businesses. Volume pricing and dedicated support from Duvete Technologies.",
};

const SERVICES = [
  {
    Icon: PackageCheck,
    title: "Bulk Device Supply",
    text: "Laptops, smartphones and tablets at volume pricing — sourced, verified and delivered to your office.",
  },
  {
    Icon: FileCheck2,
    title: "IT Asset Provisioning",
    text: "Pre-configured, asset-tagged devices ready for your team on day one, with documentation for your records.",
  },
  {
    Icon: Handshake,
    title: "Corporate Gifting",
    text: "Branded gadgets and accessories for clients and staff — curated to your budget.",
  },
];

const STEPS = [
  "Submit the quote form or message us on WhatsApp",
  "We confirm stock, pricing and delivery timeline",
  "Pro-forma invoice issued; pay by bank transfer or Paystack",
  "Devices delivered, verified and documented",
];

export default function CorporatePage() {
  return (
    <>
      {/* navy-heavy hero — formal B2B tone */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/80">
            <Building2 className="h-3.5 w-3.5" /> For Businesses
          </span>
          <h1 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl">
            Corporate &amp; Procurement
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/70 sm:text-base">
            Reliable device procurement for Nigerian companies — from startups to
            enterprises. Genuine products, proper invoicing, nationwide delivery.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {SERVICES.map(({ Icon, title, text }) => (
            <div key={title} className="rounded-xl border border-gray-100 bg-white p-5">
              <span className="inline-flex rounded-lg bg-brand/10 p-2.5">
                <Icon className="h-6 w-6 text-brand" />
              </span>
              <h2 className="mt-3 font-bold text-navy">{title}</h2>
              <p className="mt-1.5 text-sm text-ink/60">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-extrabold text-navy">How it works</h2>
            <ol className="mt-4 space-y-3">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-sm text-ink/70">{s}</p>
                </li>
              ))}
            </ol>

            <div className="mt-6 space-y-2 rounded-xl bg-trust/5 p-4">
              {[
                { Icon: ShieldCheck, text: "All devices covered by manufacturer or Duvete warranty" },
                { Icon: Truck, text: `Nationwide delivery · HQ in ${SITE.address}` },
              ].map(({ Icon, text }) => (
                <p key={text} className="flex items-center gap-2 text-sm text-ink/70">
                  <Icon className="h-4 w-4 shrink-0 text-trust" /> {text}
                </p>
              ))}
            </div>

            <a
              href={whatsappLink("Hi! I'd like to discuss a corporate device order.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-lg border border-trust px-5 py-2.5 text-sm font-bold text-trust hover:bg-trust/5"
            >
              Prefer WhatsApp? Message our sales team
            </a>
          </div>

          <QuoteForm />
        </div>
      </section>
    </>
  );
}
