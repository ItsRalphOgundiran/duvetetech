"use client";

import { useState } from "react";
import { Loader2, PackageSearch } from "lucide-react";
import { formatNaira } from "@/lib/format";

const STATUS_STEPS = ["pending", "processing", "on-hold", "completed"];

export default function TrackOrderForm() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<{
    number: string;
    status: string;
    total: string;
    dateCreated: string;
    items: { name: string; quantity: number; total: string }[];
  } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/track?id=${encodeURIComponent(orderId)}&email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order not found");
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setBusy(false);
    }
  }

  const stepIdx = order ? Math.max(0, STATUS_STEPS.indexOf(order.status)) : 0;

  return (
    <div className="mx-auto max-w-lg">
      <form onSubmit={submit} className="rounded-xl border border-gray-100 bg-white p-5">
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink/50">Order number</label>
        <input
          required
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="e.g. 1042"
          className="mb-3 w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink/50">Email used at checkout</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="mb-4 w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
        {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">{error}</p>}
        <button
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 font-bold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <PackageSearch className="h-4 w-4" />}
          Track Order
        </button>
      </form>

      {order && (
        <div className="mt-5 rounded-xl border border-gray-100 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-navy">Order #{order.number}</h2>
            <span className="rounded-full bg-trust/10 px-3 py-1 text-xs font-bold capitalize text-trust">
              {order.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-ink/50">
            Placed {new Date(order.dateCreated).toLocaleDateString("en-NG", { dateStyle: "medium" })}
          </p>

          {/* progress tracker */}
          <div className="mt-4 flex items-center">
            {["Placed", "Processing", "On the way", "Delivered"].map((label, i) => (
              <div key={label} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center">
                  <span
                    className={`h-3 w-3 rounded-full ${i <= stepIdx ? "bg-trust" : "bg-gray-200"}`}
                  />
                  <span className={`mt-1 text-[10px] font-semibold ${i <= stepIdx ? "text-trust" : "text-ink/40"}`}>
                    {label}
                  </span>
                </div>
                {i < 3 && <div className={`mx-1 mb-4 h-0.5 flex-1 ${i < stepIdx ? "bg-trust" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          <ul className="mt-4 space-y-1.5 border-t border-dashed pt-3 text-sm">
            {order.items.map((i, idx) => (
              <li key={idx} className="flex justify-between">
                <span className="text-ink/70">{i.name} ×{i.quantity}</span>
                <span className="font-semibold">{formatNaira(i.total)}</span>
              </li>
            ))}
            <li className="flex justify-between border-t border-dashed pt-2 font-bold text-navy">
              <span>Total</span>
              <span>{formatNaira(order.total)}</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
