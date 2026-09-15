import { NextResponse } from "next/server";
import { GMAIL_COOKIE_NAME } from "@/lib/gmail-session";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(GMAIL_COOKIE_NAME);
  return res;
}
