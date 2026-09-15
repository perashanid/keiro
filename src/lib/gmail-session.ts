import { cookies } from "next/headers";

// Demo-grade token storage: a single encrypted-at-transport, httpOnly cookie
// holding the connected Gmail account's tokens. A real multi-user workspace
// must store this per-workspace in the database (see GmailAccount in
// src/lib/types.ts) with tokens encrypted at rest, not in a cookie.

const COOKIE_NAME = "keiro_gmail";

export interface GmailSession {
  email: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // epoch ms
}

export async function getGmailSession(): Promise<GmailSession | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GmailSession;
  } catch {
    return null;
  }
}

export function gmailSessionCookie(session: GmailSession) {
  return {
    name: COOKIE_NAME,
    value: JSON.stringify(session),
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
}

export const GMAIL_COOKIE_NAME = COOKIE_NAME;
