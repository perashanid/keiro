import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { buildAuthUrl, isGoogleConfigured } from "@/lib/google-oauth";

export async function GET() {
  if (!isGoogleConfigured()) {
    const url = new URL("/integrations", process.env.APP_URL ?? "http://localhost:3000");
    url.searchParams.set("gmail_error", "not_configured");
    return NextResponse.redirect(url);
  }

  const state = randomBytes(16).toString("hex");
  const res = NextResponse.redirect(buildAuthUrl(state));
  res.cookies.set("keiro_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });
  return res;
}
