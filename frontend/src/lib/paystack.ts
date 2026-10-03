"use client";

/**
 * Paystack Inline JS loader + popup helper.
 * Docs: https://paystack.com/docs/payments/accept-payments/#inline
 */

const INLINE_SRC = "https://js.paystack.co/v1/inline.js";

declare global {
  interface Window {
    PaystackPop?: {
      setup(opts: Record<string, unknown>): { openIframe(): void };
      newTransaction?(opts: Record<string, unknown>): void;
    };
  }
}

let loading: Promise<void> | null = null;

export function loadPaystack(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.PaystackPop) return Promise.resolve();
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = INLINE_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Paystack"));
    document.head.appendChild(s);
  });
  return loading;
}

export interface PaystackArgs {
  email: string;
  /** Amount in NAIRA — converted to kobo internally. */
  amountNaira: number;
  reference: string;
  metadata?: Record<string, unknown>;
  onSuccess: (reference: string) => void;
  onCancel?: () => void;
}

export function openPaystackPopup(args: PaystackArgs): void {
  const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  if (!key) throw new Error("NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not set");
  if (!window.PaystackPop) throw new Error("Paystack library not loaded");

  window.PaystackPop.setup({
    key,
    email: args.email,
    amount: Math.round(args.amountNaira * 100), // kobo
    currency: "NGN",
    ref: args.reference,
    metadata: args.metadata ?? {},
    callback: (response: { reference: string }) => args.onSuccess(response.reference),
    onClose: () => args.onCancel?.(),
  }).openIframe();
}
