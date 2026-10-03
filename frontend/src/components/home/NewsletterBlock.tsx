"use client";

import { useState } from "react";
import { Check, Mail, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site";

/** Newsletter + WhatsApp signup block. */
export default function NewsletterBlock() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } finally {
      setDone(true);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark via-brand to-navy p-6 text-white sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-extrabold sm:text-xl">Get deals first</h2>
            <p className="mt-1 text-sm text-white/75">
              New arrivals, price drops and Lagos flash sales — straight to your inbox or WhatsApp.
            </p>
          </div>
          <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            {done ? (
              <p className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-3 text-sm font-semibold">
                <Check className="h-4 w-4 text-accent" /> You&apos;re on the list!
              </p>
            ) : (
              <form onSubmit={submit} className="flex w-full gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="min-w-0 flex-1 rounded-lg border-0 px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-navy transition hover:bg-accent-dark hover:text-white">
                  <Mail className="h-4 w-4" /> Subscribe
                </button>
              </form>
            )}
            <a
              href={whatsappLink("Hi! Please add me to the Duvete Tech deals list.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/40 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp instead
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
