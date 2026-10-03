import Link from "next/link";
import { ArrowUpRight, Laptop, Network, Smartphone, Sparkles, Watch } from "lucide-react";
import { getCategories } from "@/lib/catalog";

const ICONS: Record<string, typeof Smartphone> = {
  "smartphones-tablets": Smartphone,
  "laptops-computers": Laptop,
  accessories: Watch,
  gadgets: Sparkles,
  networking: Network,
};

/** Big tappable category tiles. */
export default async function CategoryTiles() {
  const categories = await getCategories();
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="mb-5 text-xl font-extrabold tracking-tight text-navy sm:text-2xl">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((c) => {
          const Icon = ICONS[c.slug] ?? Sparkles;
          return (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="group relative flex min-h-32 flex-col justify-between rounded-2xl bg-white p-4 ring-1 ring-gray-200/70 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-navy/5 hover:ring-accent"
            >
              <div className="flex items-start justify-between">
                <span className="rounded-xl bg-navy/5 p-2.5 text-navy transition group-hover:bg-accent/15 group-hover:text-accent-dark">
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-ink/20 transition group-hover:text-accent-dark" />
              </div>
              <div>
                <span className="block text-sm font-bold text-ink sm:text-base">{c.name}</span>
                {typeof c.count === "number" && (
                  <span className="text-xs text-ink/45">{c.count} products</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
