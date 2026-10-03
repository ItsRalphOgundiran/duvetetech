import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/catalog";

export const revalidate = 60;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const products = await searchProducts(q, 6);
  return NextResponse.json({ products });
}
