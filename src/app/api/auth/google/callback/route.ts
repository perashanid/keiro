import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, getGoogleUserEmail, isGoogleConfigured } from "@/lib/google-oauth";
import { gmailSessionCookie } from "@/lib/gmail-session";

export async function GET(req: NextRequest) {
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  const redirectTo = (params: Record<string, string>) => {
    const url = new URL("/integrations", appUrl);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    return NextResponse.redirect(url);
  };

  if (!isGoogleConfigured()) {
    return redirectTo({ gmail_error: "not_configured" });
  }

  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const expectedState = req.cookies.get("keiro_oauth_state")?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    return redirectTo({ gmail_error: "invalid_state" });
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const email = await getGoogleUserEmail(tokens.access_token);

    const res = redirectTo({ gmail_connected: "1" });
    res.cookies.set(
      gmailSessionCookie({
        email,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: Date.now() + tokens.expires_in * 1000,
      })
    );
    res.cookies.delete("keiro_oauth_state");
    return res;
  } catch (err) {
    console.error("Gmail OAuth callback failed", err);
    return redirectTo({ gmail_error: "exchange_failed" });
  }
}
