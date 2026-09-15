import { NextRequest, NextResponse } from "next/server";
import { getGmailSession, gmailSessionCookie } from "@/lib/gmail-session";
import { refreshAccessToken, sendGmailMessage } from "@/lib/google-oauth";
import { DAILY_SEND_LIMIT, getSentToday, isSuppressed, recordSend } from "@/lib/server/gmail-safety-store";

export async function POST(req: NextRequest) {
  const session = await getGmailSession();
  if (!session) {
    return NextResponse.json(
      { error: "No Gmail account connected. Connect one from Integrations first." },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { to, subject, message } = body as { to?: string; subject?: string; message?: string };
  if (!to || !subject || !message) {
    return NextResponse.json({ error: "to, subject, and message are required" }, { status: 400 });
  }

  if (await isSuppressed(to)) {
    return NextResponse.json(
      { error: `${to} has unsubscribed and can't be emailed.` },
      { status: 403 }
    );
  }

  const sentToday = await getSentToday();
  if (sentToday >= DAILY_SEND_LIMIT) {
    return NextResponse.json(
      { error: `Daily sending limit reached (${DAILY_SEND_LIMIT}/day). Try again tomorrow.` },
      { status: 429 }
    );
  }

  let accessToken = session.accessToken;
  let refreshedCookie: ReturnType<typeof gmailSessionCookie> | null = null;

  if (Date.now() >= session.expiresAt) {
    if (!session.refreshToken) {
      return NextResponse.json(
        { error: "Gmail session expired. Reconnect your account from Integrations." },
        { status: 401 }
      );
    }
    try {
      const refreshed = await refreshAccessToken(session.refreshToken);
      accessToken = refreshed.access_token;
      const nextSession = {
        ...session,
        accessToken,
        expiresAt: Date.now() + refreshed.expires_in * 1000,
      };
      refreshedCookie = gmailSessionCookie(nextSession);
    } catch (err) {
      console.error("Gmail token refresh failed", err);
      return NextResponse.json(
        { error: "Gmail session expired. Reconnect your account from Integrations." },
        { status: 401 }
      );
    }
  }

  try {
    const result = await sendGmailMessage(accessToken, {
      from: session.email,
      to,
      subject,
      body: message,
    });
    await recordSend();
    const res = NextResponse.json({ ok: true, id: result.id });
    if (refreshedCookie) res.cookies.set(refreshedCookie);
    return res;
  } catch (err) {
    console.error("Gmail send failed", err);
    return NextResponse.json({ error: "Gmail couldn't send this message. Try again in a moment." }, { status: 502 });
  }
}
