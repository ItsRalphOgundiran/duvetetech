import { getProducts } from "@/lib/catalog";
import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import CategoryTiles from "@/components/home/CategoryTiles";
import ProductCarousel from "@/components/home/ProductCarousel";
import CorporateBanner from "@/components/home/CorporateBanner";
import NewsletterBlock from "@/components/home/NewsletterBlock";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, deals] = await Promise.all([
    getProducts({ perPage: 10, orderby: "popularity", order: "desc" }),
    getProducts({ perPage: 10, onSale: true }),
  ]);

  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryTiles />
      <ProductCarousel title="Bestsellers" products={featured.slice(0, 8)} href="/shop" />
      <ProductCarousel title="Deals & Discounts" products={deals} href="/shop?sale=1" />
      <CorporateBanner />
      <NewsletterBlock />
    </>
  );
}
