import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Reach Duvete Technologies — WhatsApp, phone, email or visit our Lagos store.",
};

export default function ContactPage() {
  const cards = [
    {
      Icon: MessageCircle,
      title: "WhatsApp",
      value: SITE.phone,
      href: whatsappLink("Hi Duvete Technologies!"),
      cta: "Chat now",
      highlight: true,
    },
    { Icon: Phone, title: "Phone", value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, "")}`, cta: "Call us" },
    { Icon: Mail, title: "Email", value: SITE.email, href: `mailto:${SITE.email}`, cta: "Send email" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-navy">Contact Us</h1>
      <p className="mt-2 text-sm text-ink/60">
        Questions about a product, order or delivery? We respond fastest on WhatsApp.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map(({ Icon, title, value, href, cta, highlight }) => (
          <a
            key={title}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className={`rounded-xl border p-5 transition hover:shadow-md ${
              highlight ? "border-trust/30 bg-trust/5" : "border-gray-100 bg-white"
            }`}
          >
            <Icon className={`h-6 w-6 ${highlight ? "text-trust" : "text-brand"}`} />
            <h2 className="mt-2 font-bold text-navy">{title}</h2>
            <p className="mt-0.5 break-words text-sm text-ink/60">{value}</p>
            <span className={`mt-2 inline-block text-sm font-bold ${highlight ? "text-trust" : "text-brand"}`}>
              {cta} →
            </span>
          </a>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-gray-100 bg-white p-5">
        <h2 className="flex items-center gap-2 font-bold text-navy">
          <MapPin className="h-5 w-5 text-brand" /> Visit Us
        </h2>
        <p className="mt-2 text-sm text-ink/70">{SITE.address}</p>
        <p className="mt-3 flex items-center gap-2 text-sm text-ink/60">
          <Clock className="h-4 w-4" /> Mon–Sat: 9:00am – 7:00pm · Sundays: closed
        </p>
      </div>
    </div>
  );
}
