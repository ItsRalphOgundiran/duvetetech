import { NextRequest, NextResponse } from "next/server";
import { markOrderPaid, wooConfigured } from "@/lib/woo-server";

/**
 * POST /api/orders/verify — verify a Paystack transaction server-side and mark
 * the WooCommerce order as paid. Never trust the browser's "success" callback.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    orderId?: number;
    reference?: string;
  } | null;

  if (!body?.orderId || !body.reference) {
    return NextResponse.json({ error: "Missing orderId or reference" }, { status: 400 });
  }

  if (!wooConfigured() || !process.env.PAYSTACK_SECRET_KEY) {
    // Demo mode — treat as verified.
    return NextResponse.json({ verified: true, demo: true });
  }

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(body.reference)}`,
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }, cache: "no-store" }
    );
    const data = await res.json();
    if (!data.status || data.data?.status !== "success") {
      return NextResponse.json({ verified: false, error: "Payment not confirmed" }, { status: 402 });
    }
    await markOrderPaid(body.orderId, body.reference);
    return NextResponse.json({ verified: true });
  } catch (err) {
    console.error("Paystack verification failed:", err);
    return NextResponse.json({ verified: false, error: "Verification error" }, { status: 502 });
  }
}
