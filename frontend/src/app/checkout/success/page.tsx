import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Package, Truck } from "lucide-react";
import { getOrder } from "@/lib/woo-server";
import { formatNaira } from "@/lib/format";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; ref?: string; method?: string }>;
}) {
  const { order, ref, method } = await searchParams;
  let summary = null;
  if (order) {
    try {
      summary = await getOrder(order);
    } catch {
      summary = null;
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center sm:p-10">
        <CheckCircle2 className="mx-auto h-16 w-16 text-trust" />
        <h1 className="mt-4 text-2xl font-extrabold text-navy">Thank you for your order!</h1>
        <p className="mt-2 text-sm text-ink/60">
          {method === "pod"
            ? "Your order is confirmed. Please have payment ready when your items arrive."
            : "Your payment was received and your order is being processed."}
        </p>

        {(summary || order) && (
          <div className="mt-6 rounded-xl bg-bg p-4 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-ink/55">Order number</span>
              <span className="font-bold text-navy">#{summary?.number ?? order}</span>
            </div>
            {summary && (
              <>
                <div className="mt-1.5 flex justify-between text-sm">
                  <span className="text-ink/55">Status</span>
                  <span className="font-semibold capitalize text-trust">{summary.status}</span>
                </div>
                <div className="mt-1.5 flex justify-between text-sm">
                  <span className="text-ink/55">Total</span>
                  <span className="font-bold">{formatNaira(summary.total)}</span>
                </div>
                {summary.items.length > 0 && (
                  <ul className="mt-3 space-y-1 border-t border-dashed pt-3 text-sm text-ink/70">
                    {summary.items.map((i, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{i.name} ×{i.quantity}</span>
                        <span>{formatNaira(i.total)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
            {ref && (
              <div className="mt-1.5 flex justify-between text-xs">
                <span className="text-ink/45">Payment ref</span>
                <span className="font-mono text-ink/60">{ref}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
          <div className="flex items-start gap-2.5 rounded-xl bg-trust/5 p-3">
            <Truck className="mt-0.5 h-5 w-5 text-trust" />
            <p className="text-xs text-ink/70">
              <span className="font-bold text-navy">Delivery updates</span>
              <br />We&apos;ll contact you to confirm delivery timing.
            </p>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl bg-trust/5 p-3">
            <Package className="mt-0.5 h-5 w-5 text-trust" />
            <p className="text-xs text-ink/70">
              <span className="font-bold text-navy">Track anytime</span>
              <br />Use your order number on the tracking page.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/track-order"
            className="rounded-lg bg-navy px-6 py-3 text-sm font-bold text-white hover:bg-navy-light"
          >
            Track Order
          </Link>
          <a
            href={whatsappLink(`Hi! I just placed order #${summary?.number ?? order ?? ""}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-trust px-6 py-3 text-sm font-bold text-trust hover:bg-trust/5"
          >
            Confirm on WhatsApp
          </a>
          <Link href="/shop" className="rounded-lg px-6 py-3 text-sm font-bold text-brand hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
