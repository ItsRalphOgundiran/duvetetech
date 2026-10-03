import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import CartDrawer from "@/components/cart/CartDrawer";
import { SITE } from "@/lib/site";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Genuine Gadgets & Computers in Lagos`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Buy genuine smartphones, laptops, accessories, gadgets and networking gear in Nigeria. Same-day delivery in Lagos, secure Paystack checkout, and warranty on every product.",
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_NG",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sora.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        {/*
          Analytics: add GA / Meta Pixel scripts here when NEXT_PUBLIC_GA_ID
          and NEXT_PUBLIC_META_PIXEL_ID are configured.
        */}
        <CartProvider>
          <WishlistProvider>
            <Header />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <Footer />
            <BottomNav />
            <CartDrawer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
