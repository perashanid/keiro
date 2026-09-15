import { NextResponse } from "next/server";
import { DAILY_SEND_LIMIT, getSentToday, getSuppressionCount } from "@/lib/server/gmail-safety-store";

export async function GET() {
  const [sentToday, suppressed] = await Promise.all([getSentToday(), getSuppressionCount()]);
  return NextResponse.json({ sentToday, dailyLimit: DAILY_SEND_LIMIT, suppressed });
}
