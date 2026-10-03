import { BadgeCheck, Lock, RotateCcw, Truck } from "lucide-react";

const ITEMS = [
  { Icon: BadgeCheck, title: "100% Genuine", sub: "Verified authentic products" },
  { Icon: Truck, title: "Fast Delivery", sub: "Same-day in Lagos, nationwide" },
  { Icon: Lock, title: "Secure Payment", sub: "Paystack · Pay on delivery" },
  { Icon: RotateCcw, title: "Easy Returns", sub: "7-day return policy" },
];

/** Green-accented trust strip. */
export default function TrustBar() {
  return (
    <section className="border-b border-gray-200/70 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4">
        {ITEMS.map(({ Icon, title, sub }) => (
          <div key={title} className="flex items-start gap-2.5">
            <span className="rounded-xl bg-trust/10 p-2 ring-1 ring-trust/15">
              <Icon className="h-5 w-5 text-trust" />
            </span>
            <div>
              <p className="text-sm font-bold text-navy">{title}</p>
              <p className="text-xs text-ink/55">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
