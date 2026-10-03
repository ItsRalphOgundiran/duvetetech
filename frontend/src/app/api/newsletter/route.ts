import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/newsletter — captures an email signup.
 * Currently logs it; wire to Mailchimp/Brevo or a WP REST endpoint later.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { email?: string } | null;
  if (!body?.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  console.log(`Newsletter signup: ${body.email}`);
  return NextResponse.json({ ok: true });
}
