/** Site-wide constants — edit here or override via env vars. */

export const SITE = {
  name: "Duvete Technologies",
  tagline: "Genuine tech. Delivered fast across Nigeria.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000",
  phone: process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "+234 800 000 0000",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "hello@duvetetech.com",
  address: process.env.NEXT_PUBLIC_ADDRESS ?? "Ikeja, Lagos, Nigeria",
} as const;

export function whatsappLink(message?: string): string {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${SITE.whatsapp}${text}`;
}

/** Delivery zones — mirrored by WooCommerce shipping zones. Price in naira, null = quote at checkout. */
export const DELIVERY_ZONES = [
  { id: "lagos-same-day", label: "Lagos — Same Day (order before 2pm)", fee: 3500 },
  { id: "lagos-next-day", label: "Lagos — Next Day", fee: 2000 },
  { id: "abuja", label: "Abuja — 1–2 Days", fee: 4500 },
  { id: "nationwide", label: "Nationwide — 2–5 Days", fee: 5500 },
  { id: "pickup", label: "Store Pickup — Ikeja, Lagos", fee: 0 },
] as const;
