import type { Metadata } from "next";
import WishlistGrid from "@/components/WishlistGrid";

export const metadata: Metadata = {
  title: "Wishlist",
  robots: { index: false },
};

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-extrabold text-navy">My Wishlist</h1>
      <WishlistGrid />
    </div>
  );
}
