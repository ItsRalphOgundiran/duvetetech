import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Delivery, warranty, returns and payment questions — answered.",
};

const SECTIONS = [
  {
    id: "delivery",
    title: "Delivery",
    faqs: [
      {
        q: "How fast is delivery in Lagos?",
        a: "Orders placed before 2pm qualify for same-day delivery within Lagos. Next-day delivery is available for later orders.",
      },
      {
        q: "Do you deliver outside Lagos?",
        a: "Yes — we deliver nationwide via trusted courier partners. Abuja typically takes 1–2 days; other states 2–5 business days.",
      },
      {
        q: "Can I pick up my order?",
        a: "Yes. Select 'Store Pickup' at checkout and collect from our Ikeja, Lagos location during opening hours.",
      },
    ],
  },
  {
    id: "warranty",
    title: "Warranty & Returns",
    faqs: [
      {
        q: "Are your products genuine?",
        a: "Yes — every product is sourced through authorized channels. Genuine items carry the manufacturer warranty; certified refurbished items carry a Duvete warranty and are clearly graded.",
      },
      {
        q: "What is your return policy?",
        a: "You have 7 days from delivery to return items in original condition and packaging for a refund or exchange. Faulty items are covered by warranty terms.",
      },
      {
        q: "What if my device develops a fault?",
        a: "Contact us on WhatsApp with your order number. We'll arrange inspection and repair/replacement under warranty.",
      },
    ],
  },
  {
    id: "payment",
    title: "Payment",
    faqs: [
      {
        q: "What payment methods do you accept?",
        a: "Paystack (debit card, bank transfer, USSD) and Pay on Delivery within Lagos and Abuja.",
      },
      {
        q: "Is it safe to pay online?",
        a: "Yes. Payments are processed by Paystack — a PCI-DSS certified payment provider. We never see or store your card details.",
      },
      {
        q: "Do you offer instalments or corporate invoicing?",
        a: "For bulk/corporate orders we issue pro-forma invoices and accept bank transfer. Use the Corporate page to request a quote.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-navy">Frequently Asked Questions</h1>
      {SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-brand">{section.title}</h2>
          <div className="space-y-3">
            {section.faqs.map((f) => (
              <details key={f.q} className="group rounded-xl border border-gray-100 bg-white p-4 open:border-brand/30">
                <summary className="cursor-pointer list-none font-semibold text-navy [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="float-right text-brand transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
