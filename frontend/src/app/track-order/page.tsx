import type { Metadata } from "next";
import TrackOrderForm from "@/components/track/TrackOrderForm";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Check the status of your Duvete Technologies order.",
};

export default function TrackOrderPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-center text-2xl font-extrabold text-navy">Track Your Order</h1>
      <p className="mb-6 text-center text-sm text-ink/55">
        Enter your order number and the email you used at checkout.
      </p>
      <TrackOrderForm />
    </div>
  );
}
