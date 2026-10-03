import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * POST /api/quote — corporate procurement quote requests.
 * Emails QUOTE_NOTIFY_EMAIL via SMTP when configured; otherwise logs and
 * returns success so the form works in demo mode.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Record<string, string> | null;
  const { company, contact, phone, email, interest, quantity, message } = body ?? {};

  if (!company || !contact || !phone || !email || !interest) {
    return NextResponse.json({ error: "Please fill in all required fields" }, { status: 400 });
  }

  const text = [
    `Company: ${company}`,
    `Contact: ${contact}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Product interest: ${interest}`,
    `Quantity: ${quantity || "n/a"}`,
    "",
    message || "",
  ].join("\n");

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, QUOTE_NOTIFY_EMAIL } = process.env;

  if (SMTP_HOST && SMTP_USER && QUOTE_NOTIFY_EMAIL) {
    try {
      const transport = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT || 587),
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });
      await transport.sendMail({
        from: `Duvete Technologies <${SMTP_USER}>`,
        to: QUOTE_NOTIFY_EMAIL,
        replyTo: email,
        subject: `Bulk quote request — ${company}`,
        text,
      });
    } catch (err) {
      console.error("Quote email failed:", err);
      return NextResponse.json(
        { error: "Could not send your request right now. Please reach us on WhatsApp." },
        { status: 502 }
      );
    }
  } else {
    console.log("Quote request (SMTP not configured):\n" + text);
  }

  return NextResponse.json({ ok: true });
}
