"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

const input =
  "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand";

export default function QuoteForm() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd)),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-100 bg-white p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-trust" />
        <p className="font-bold text-navy">Request received</p>
        <p className="text-sm text-ink/60">
          Our procurement team will respond within one business day with pricing and availability.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-gray-100 bg-white p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-extrabold text-navy">Request a Quote</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="company" required placeholder="Company name *" className={input} />
        <input name="contact" required placeholder="Contact person *" className={input} />
        <input name="phone" required type="tel" placeholder="Phone *" className={input} inputMode="tel" />
        <input name="email" required type="email" placeholder="Work email *" className={input} inputMode="email" />
        <select name="interest" required className={input} defaultValue="">
          <option value="" disabled>
            Product interest *
          </option>
          <option>Laptops &amp; workstations</option>
          <option>Smartphones &amp; tablets</option>
          <option>Networking equipment</option>
          <option>Accessories &amp; peripherals</option>
          <option>Mixed order / other</option>
        </select>
        <input name="quantity" type="number" min={1} placeholder="Approx. quantity" className={input} inputMode="numeric" />
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us about your requirements — models, specs, timeline, delivery location…"
          className={`${input} sm:col-span-2`}
        />
      </div>
      {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">{error}</p>}
      <button
        disabled={busy}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-navy py-3 font-bold text-white hover:bg-navy-light disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Submit Request
      </button>
    </form>
  );
}
