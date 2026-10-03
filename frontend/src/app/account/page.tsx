import type { Metadata } from "next";
import Link from "next/link";
import { Heart, MessageCircle, PackageSearch } from "lucide-react";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false },
};

/** Lightweight account hub — guest checkout is the primary flow, so this page
 *  links to order tracking, wishlist and support rather than requiring login. */
export default function AccountPage() {
  const links = [
    { href: "/track-order", Icon: PackageSearch, title: "Track an Order", text: "Check delivery status with your order number" },
    { href: "/wishlist", Icon: Heart, title: "My Wishlist", text: "Products you've saved for later" },
  ];

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-extrabold text-navy">My Account</h1>
      <p className="mt-2 text-sm text-ink/55">
        No account needed — we keep checkout fast. Manage your order below.
      </p>
      <div className="mt-6 space-y-3">
        {links.map(({ href, Icon, title, text }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 transition hover:shadow-md"
          >
            <span className="rounded-lg bg-brand/10 p-2.5">
              <Icon className="h-5 w-5 text-brand" />
            </span>
            <span>
              <span className="block font-bold text-navy">{title}</span>
              <span className="text-sm text-ink/55">{text}</span>
            </span>
          </Link>
        ))}
        <a
          href={whatsappLink("Hi! I need help with my account/order.")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-xl border border-trust/30 bg-trust/5 p-4 transition hover:shadow-md"
        >
          <span className="rounded-lg bg-trust/10 p-2.5">
            <MessageCircle className="h-5 w-5 text-trust" />
          </span>
          <span>
            <span className="block font-bold text-navy">Get Help</span>
            <span className="text-sm text-ink/55">Chat with us on WhatsApp</span>
          </span>
        </a>
      </div>
    </div>
  );
}
