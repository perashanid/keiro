import { NextResponse } from "next/server";
import { getGmailSession } from "@/lib/gmail-session";
import { isGoogleConfigured } from "@/lib/google-oauth";

export async function GET() {
  const session = await getGmailSession();
  return NextResponse.json({
    configured: isGoogleConfigured(),
    connected: Boolean(session),
    email: session?.email ?? null,
  });
}
