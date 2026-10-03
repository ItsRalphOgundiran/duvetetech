import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, HeartHandshake, MapPin, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Duvete Technologies — durable, genuine, trusted tech for Nigeria. Learn our story.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-navy">About Duvete Technologies</h1>
      <p className="mt-4 text-base leading-relaxed text-ink/70">
        Duvete Technologies started with a simple frustration: buying genuine tech in Nigeria
        shouldn&apos;t be a gamble. Too many shoppers have paid full price for refurbished
        devices sold as new, or waited weeks for orders that never arrived.
      </p>
      <p className="mt-4 text-base leading-relaxed text-ink/70">
        We&apos;re fixing that. Every product we sell — phones, laptops, accessories, gadgets
        and networking gear — is sourced from authorized channels, verified before it ships,
        and backed by a real warranty. If it&apos;s refurbished, we say so and grade it honestly.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          { Icon: BadgeCheck, title: "Genuine, always", text: "Authorized sourcing only. Every device verified before dispatch." },
          { Icon: Truck, title: "Built for Nigeria", text: "Same-day delivery in Lagos, reliable nationwide shipping, pay-on-delivery options." },
          { Icon: HeartHandshake, title: "Support that stays", text: "Real humans on WhatsApp and phone — before and after you buy." },
          { Icon: MapPin, title: "Proudly Lagos-based", text: "Headquartered in Ikeja, serving customers and businesses across all 36 states." },
        ].map(({ Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-gray-100 bg-white p-5">
            <Icon className="h-6 w-6 text-brand" />
            <h2 className="mt-2 font-bold text-navy">{title}</h2>
            <p className="mt-1 text-sm text-ink/60">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl bg-navy p-6 text-center text-white">
        <p className="font-bold">Ready to shop genuine tech?</p>
        <Link href="/shop" className="mt-3 inline-block rounded-xl bg-accent px-6 py-2.5 font-bold text-navy transition hover:bg-accent-dark hover:text-white">
          Browse the Store
        </Link>
      </div>
    </div>
  );
}
