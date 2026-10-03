/** Format a number or numeric string as Nigerian Naira, no awkward decimals. */
export function formatNaira(value: number | string): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (!Number.isFinite(n)) return "₦0";
  const rounded = Math.round(n);
  return `₦${rounded.toLocaleString("en-NG")}`;
}

export function discountPercent(regular: string | number, sale: string | number): number {
  const r = typeof regular === "string" ? parseFloat(regular) : regular;
  const s = typeof sale === "string" ? parseFloat(sale) : sale;
  if (!r || !s || s >= r) return 0;
  return Math.round(((r - s) / r) * 100);
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim();
}
