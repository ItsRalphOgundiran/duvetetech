import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";

const cols = [
  {
    title: "Shop",
    links: [
      { href: "/category/smartphones-tablets", label: "Phones & Tablets" },
      { href: "/category/laptops-computers", label: "Laptops & Computers" },
      { href: "/category/accessories", label: "Accessories" },
      { href: "/category/gadgets", label: "Gadgets" },
      { href: "/category/networking", label: "Networking" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/corporate", label: "Corporate & Procurement" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/track-order", label: "Track Your Order" },
      { href: "/faq#delivery", label: "Delivery Info" },
      { href: "/faq#warranty", label: "Warranty & Returns" },
      { href: "/faq#payment", label: "Payment Methods" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 md:grid-cols-5">
        <div className="col-span-2">
          <p className="text-xl font-extrabold">
            Duvete<span className="text-accent">Tech</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-white/60">{SITE.tagline}</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-accent" /> {SITE.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent" /> {SITE.email}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" /> {SITE.address}
            </li>
            <li>
              <a
                href={whatsappLink("Hi Duvete Technologies!")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-trust"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/70 transition hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved. · Secure payments by Paystack
      </div>
      {/* spacer for mobile bottom nav */}
      <div className="h-14 md:hidden" />
    </footer>
  );
}
