import { NextRequest, NextResponse } from "next/server";
import { createOrder, wooConfigured } from "@/lib/woo-server";
import type { CartItem, CheckoutDetails } from "@/lib/types";

/**
 * POST /api/orders — create a WooCommerce order from the checkout form.
 * Runs server-side so the consumer secret stays off the client.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    items?: CartItem[];
    details?: CheckoutDetails;
  } | null;

  if (!body?.items?.length || !body.details) {
    return NextResponse.json({ error: "Missing items or checkout details" }, { status: 400 });
  }

  if (!wooConfigured()) {
    // Demo mode — no WooCommerce backend configured yet.
    return NextResponse.json({
      demo: true,
      order: { id: 9000 + Math.floor(Math.random() * 999), number: `DEMO-${Date.now()}` },
    });
  }

  try {
    const order = await createOrder(body.items, body.details);
    return NextResponse.json({ order: { id: order.id, number: order.number } });
  } catch (err) {
    console.error("Order creation failed:", err);
    return NextResponse.json(
      { error: "Could not create your order. Please try again or contact us on WhatsApp." },
      { status: 502 }
    );
  }
}
