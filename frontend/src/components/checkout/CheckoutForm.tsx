"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Banknote, Loader2, Lock, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/format";
import { DELIVERY_ZONES } from "@/lib/site";
import { loadPaystack, openPaystackPopup } from "@/lib/paystack";
import type { CheckoutDetails } from "@/lib/types";

const input =
  "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand";

const NIGERIAN_STATES = [
  "Lagos", "Abuja FCT", "Ogun", "Oyo", "Rivers", "Kano", "Kaduna", "Enugu", "Delta",
  "Edo", "Anambra", "Imo", "Abia", "Plateau", "Borno", "Osun", "Ondo", "Kwara",
  "Akwa Ibom", "Cross River", "Benue", "Niger", "Bauchi", "Sokoto", "Other",
];

export default function CheckoutForm() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<CheckoutDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Lagos",
    paymentMethod: "paystack",
    deliveryZone: "lagos-next-day",
    notes: "",
  });

  const zone = DELIVERY_ZONES.find((z) => z.id === form.deliveryZone)!;
  const total = useMemo(() => subtotal + zone.fee, [subtotal, zone]);

  const set = (k: keyof CheckoutDetails, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      // 1. Create the order (WooCommerce via our API route; demo mode simulates).
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, details: form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create order");
      const order = data.order as { id: number; number: string };

      if (form.paymentMethod === "pod") {
        clear();
        router.push(`/checkout/success?order=${order.id}&method=pod`);
        return;
      }

      // 2. Paystack — collect payment, then verify server-side.
      await loadPaystack();
      openPaystackPopup({
        email: form.email,
        amountNaira: total,
        reference: `DVT-${order.id}-${Date.now()}`,
        metadata: { order_id: order.id, custom_fields: [{ display_name: "Order", variable_name: "order", value: order.number }] },
        onSuccess: async (reference) => {
          try {
            await fetch("/api/orders/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: order.id, reference }),
            });
          } finally {
            clear();
            router.push(`/checkout/success?order=${order.id}&ref=${encodeURIComponent(reference)}`);
          }
        },
        onCancel: () => setBusy(false),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <ShoppingBag className="h-12 w-12 text-ink/20" />
        <p className="font-semibold text-ink/70">Your cart is empty</p>
        <Link href="/shop" className="rounded-xl bg-accent px-6 py-2.5 font-bold text-navy transition hover:bg-accent-dark hover:text-white">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-6 md:grid-cols-[1fr_340px]">
      <div className="space-y-5">
        {/* Contact */}
        <section className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5">
          <h2 className="mb-3 font-bold text-navy">Contact Details</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input required placeholder="First name" className={input} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} autoComplete="given-name" />
            <input required placeholder="Last name" className={input} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} autoComplete="family-name" />
            <input required type="email" placeholder="Email address" className={input} value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" inputMode="email" />
            <input required type="tel" placeholder="Phone (e.g. 0803 123 4567)" className={input} value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" inputMode="tel" />
          </div>
        </section>

        {/* Delivery */}
        <section className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5">
          <h2 className="mb-3 font-bold text-navy">Delivery</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input required placeholder="Street address" className={`${input} sm:col-span-2`} value={form.address} onChange={(e) => set("address", e.target.value)} autoComplete="street-address" />
            <input required placeholder="City" className={input} value={form.city} onChange={(e) => set("city", e.target.value)} autoComplete="address-level2" />
            <select className={input} value={form.state} onChange={(e) => set("state", e.target.value)}>
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="mt-3 space-y-2">
            {DELIVERY_ZONES.map((z) => (
              <label
                key={z.id}
                className={`flex cursor-pointer items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm ${
                  form.deliveryZone === z.id ? "border-brand bg-brand/5 font-semibold" : "border-gray-200"
                }`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="zone"
                    checked={form.deliveryZone === z.id}
                    onChange={() => set("deliveryZone", z.id)}
                    className="accent-brand"
                  />
                  {z.label}
                </span>
                <span className="font-bold text-brand">{z.fee === 0 ? "Free" : formatNaira(z.fee)}</span>
              </label>
            ))}
          </div>
          <textarea
            placeholder="Delivery notes (optional)"
            className={`${input} mt-3`}
            rows={2}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </section>

        {/* Payment */}
        <section className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5">
          <h2 className="mb-3 font-bold text-navy">Payment</h2>
          <div className="space-y-2">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 text-sm ${
                form.paymentMethod === "paystack" ? "border-brand bg-brand/5" : "border-gray-200"
              }`}
            >
              <input type="radio" name="pay" checked={form.paymentMethod === "paystack"} onChange={() => set("paymentMethod", "paystack")} className="accent-brand" />
              <Lock className="h-4 w-4 text-trust" />
              <span>
                <span className="block font-semibold">Pay Now — Paystack</span>
                <span className="text-xs text-ink/55">Card, bank transfer, USSD — secure checkout</span>
              </span>
            </label>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 text-sm ${
                form.paymentMethod === "pod" ? "border-brand bg-brand/5" : "border-gray-200"
              }`}
            >
              <input type="radio" name="pay" checked={form.paymentMethod === "pod"} onChange={() => set("paymentMethod", "pod")} className="accent-brand" />
              <Banknote className="h-4 w-4 text-trust" />
              <span>
                <span className="block font-semibold">Pay on Delivery</span>
                <span className="text-xs text-ink/55">Lagos &amp; Abuja only — cash or transfer on receipt</span>
              </span>
            </label>
          </div>
        </section>
      </div>

      {/* Summary */}
      <aside className="h-fit rounded-xl border border-gray-100 bg-white p-4 sm:p-5">
        <h2 className="mb-3 font-bold text-navy">Order Summary</h2>
        <ul className="max-h-56 space-y-2 overflow-y-auto border-b border-dashed pb-3">
          {items.map((i) => (
            <li key={i.productId} className="flex justify-between gap-3 text-sm">
              <span className="text-ink/70">
                {i.name} <span className="text-ink/40">×{i.quantity}</span>
              </span>
              <span className="shrink-0 font-semibold">{formatNaira(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="space-y-1.5 py-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink/60">Subtotal</dt>
            <dd className="font-semibold">{formatNaira(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/60">Delivery</dt>
            <dd className="font-semibold">{zone.fee === 0 ? "Free" : formatNaira(zone.fee)}</dd>
          </div>
          <div className="flex justify-between border-t border-dashed pt-2">
            <dt className="font-bold text-navy">Total</dt>
            <dd className="text-lg font-extrabold text-brand">{formatNaira(total)}</dd>
          </div>
        </dl>
        {error && <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 font-bold text-navy transition hover:bg-accent-dark hover:text-white disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {form.paymentMethod === "paystack" ? `Pay ${formatNaira(total)}` : "Place Order"}
        </button>
        <p className="mt-2 flex items-center justify-center gap-1 text-[11px] text-ink/45">
          <Lock className="h-3 w-3" /> Payments secured by Paystack
        </p>
      </aside>
    </form>
  );
}
