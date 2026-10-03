import { NextRequest, NextResponse } from "next/server";
import { getOrder, wooConfigured } from "@/lib/woo-server";

/**
 * GET /api/orders/track?id=<orderId>&email=<billing email>
 * The email must match the order's billing email to prevent enumeration.
 */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")?.replace(/^#/, "");
  const email = req.nextUrl.searchParams.get("email")?.toLowerCase();

  if (!id || !email) {
    return NextResponse.json({ error: "Order number and email are required" }, { status: 400 });
  }

  if (!wooConfigured()) {
    return NextResponse.json({
      order: {
        number: id,
        status: "processing",
        total: "0",
        dateCreated: new Date().toISOString(),
        items: [],
      },
      demo: true,
    });
  }

  try {
    const order = await getOrder(id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.billingEmail?.toLowerCase() !== email) {
      return NextResponse.json({ error: "Order not found for that email" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (err) {
    console.error("Order tracking failed:", err);
    return NextResponse.json({ error: "Could not look up order" }, { status: 502 });
  }
}
