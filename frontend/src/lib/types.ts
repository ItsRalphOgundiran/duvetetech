export interface WooImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface WooCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: WooImage | null;
  count?: number;
}

export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  type: string;
  status?: string;
  sku?: string;
  /** Price in the store currency's minor display unit as string (Woo returns strings). */
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: "instock" | "outofstock" | "onbackorder";
  stock_quantity: number | null;
  description: string;
  short_description: string;
  images: WooImage[];
  categories: WooCategory[];
  attributes: { id: number; name: string; options: string[] }[];
  /** Cross-sell / upsell product ids */
  related_ids?: number[];
  upsell_ids?: number[];
  average_rating?: string;
  rating_count?: number;
  /** Custom meta used by the store, e.g. condition: "genuine" | "refurbished", grade */
  condition?: "genuine" | "refurbished" | "brand-new";
  grade?: string;
  featured?: boolean;
}

export interface CartItem {
  productId: number;
  name: string;
  slug: string;
  price: number; // naira
  quantity: number;
  image?: string;
  imageAlt?: string;
  sku?: string;
}

export interface CheckoutDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  paymentMethod: "paystack" | "pod"; // card/transfer via Paystack, or pay on delivery
  deliveryZone: string;
  notes?: string;
}

export interface OrderSummary {
  id: number;
  number: string;
  status: string;
  total: string;
  currency: string;
  dateCreated: string;
  paymentUrl?: string;
  items: { name: string; quantity: number; total: string }[];
  billingEmail?: string;
}
