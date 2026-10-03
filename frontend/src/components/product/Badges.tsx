import { BadgeCheck } from "lucide-react";
import { discountPercent } from "@/lib/format";
import type { WooProduct } from "@/lib/types";

export function SaleBadge({ product }: { product: WooProduct }) {
  if (!product.on_sale) return null;
  const pct = discountPercent(product.regular_price, product.sale_price);
  return (
    <span className="inline-flex items-center rounded-md bg-accent px-2 py-0.5 text-[11px] font-bold text-navy">
      {pct > 0 ? `-${pct}%` : "SALE"}
    </span>
  );
}

export function ConditionBadge({ product }: { product: WooProduct }) {
  if (product.condition === "refurbished") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-trust/10 px-2 py-0.5 text-[11px] font-semibold text-trust">
        <BadgeCheck className="h-3 w-3" /> Refurbished {product.grade ?? ""}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-trust/10 px-2 py-0.5 text-[11px] font-semibold text-trust">
      <BadgeCheck className="h-3 w-3" /> Genuine
    </span>
  );
}

export function StockBadge({ product }: { product: WooProduct }) {
  if (product.stock_status === "outofstock") {
    return <span className="text-sm font-semibold text-red-600">Out of stock</span>;
  }
  if (product.stock_status === "onbackorder") {
    return <span className="text-sm font-semibold text-accent-dark">Available on backorder</span>;
  }
  const qty = product.stock_quantity;
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-trust">
      <span className="h-2 w-2 rounded-full bg-trust" />
      In stock{qty != null && qty <= 5 ? ` — only ${qty} left` : ""}
    </span>
  );
}
