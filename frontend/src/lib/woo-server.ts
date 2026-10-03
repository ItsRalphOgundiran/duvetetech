import "server-only";
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CartItem, CheckoutDetails, OrderSummary } from "./types";

/**
 * Server-side WooCommerce REST API v3 client — used ONLY inside Next.js route
 * handlers so the consumer key/secret never reach the browser.
 *
 * Used for write/privileged operations the public Store API can't do:
 *   - creating orders with arbitrary line items
 *   - marking orders paid after Paystack verification
 *   - looking up order status for the tracking page
 */

const WC_URL = (process.env.WOOCOMMERCE_API_URL ?? "").replace(/\/$/, "");
const CK = process.env.WC_CONSUMER_KEY ?? "";
const CS = process.env.WC_CONSUMER_SECRET ?? "";

export const wooConfigured = () => !!(WC_URL && CK && CS);

function authHeader() {
  return "Basic " + Buffer.from(`${CK}:${CS}`).toString("base64");
}

async function woo(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${WC_URL}/wp-json/wc/v3${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
}

function mapOrder(o: any): OrderSummary {
  return {
    id: o.id,
    number: String(o.number ?? o.id),
    status: o.status,
    total: o.total,
    currency: o.currency ?? "NGN",
    dateCreated: o.date_created,
    items: (o.line_items ?? []).map((li: any) => ({
      name: li.name,
      quantity: li.quantity,
      total: li.total,
    })),
    billingEmail: o.billing?.email,
  };
}

/** Create a WooCommerce order from cart contents. Returns the order summary. */
export async function createOrder(items: CartItem[], d: CheckoutDetails): Promise<OrderSummary> {
  const body = {
    payment_method: d.paymentMethod === "pod" ? "cod" : "paystack",
    payment_method_title: d.paymentMethod === "pod" ? "Pay on Delivery" : "Paystack",
    set_paid: false,
    billing: {
      first_name: d.firstName,
      last_name: d.lastName,
      email: d.email,
      phone: d.phone,
      address_1: d.address,
      city: d.city,
      state: d.state,
      country: "NG",
    },
    shipping: {
      first_name: d.firstName,
      last_name: d.lastName,
      address_1: d.address,
      city: d.city,
      state: d.state,
      country: "NG",
    },
    line_items: items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
    customer_note: `${d.notes ?? ""}\nDelivery zone: ${d.deliveryZone}`.trim(),
    meta_data: [
      { key: "delivery_zone", value: d.deliveryZone },
      { key: "_created_via", value: "duvete-storefront" },
    ],
  };
  const res = await woo("/orders", { method: "POST", body: JSON.stringify(body) });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WooCommerce order creation failed (${res.status}): ${text.slice(0, 300)}`);
  }
  return mapOrder(await res.json());
}

/** Look up an order by id or number (for the tracking page). */
export async function getOrder(idOrNumber: string): Promise<OrderSummary | null> {
  const res = await woo(`/orders/${encodeURIComponent(idOrNumber)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Order lookup failed (${res.status})`);
  return mapOrder(await res.json());
}

/** Mark an order as paid (called after Paystack verification succeeds). */
export async function markOrderPaid(orderId: number, paystackRef: string): Promise<void> {
  await woo(`/orders/${orderId}`, {
    method: "PUT",
    body: JSON.stringify({
      status: "processing",
      transaction_id: paystackRef,
      meta_data: [{ key: "paystack_reference", value: paystackRef }],
    }),
  });
}
