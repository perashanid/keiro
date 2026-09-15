import { NextRequest, NextResponse } from "next/server";
import { addSuppression } from "@/lib/server/gmail-safety-store";

function page(body: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>Keiro</title>
  <style>body{background:#070a0f;color:#e8edf1;font-family:system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}
  .card{max-width:28rem;padding:2rem;text-align:center}
  h1{color:#f4f1e8;font-size:1.25rem}</style></head>
  <body><div class="card">${body}</div></body></html>`;
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return new NextResponse(page("<h1>Missing address</h1><p>This unsubscribe link is missing an email address.</p>"), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  await addSuppression(email);

  return new NextResponse(
    page(`<h1>You're unsubscribed</h1><p>${email} won't receive any further emails from this workspace.</p>`),
    { headers: { "Content-Type": "text/html" } }
  );
}
