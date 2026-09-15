import { NextRequest, NextResponse } from "next/server";
import { companySearchProvider } from "@/lib/providers/company-search";
import { getCachedSearch, saveSearchResults } from "@/lib/server/companies-db";

export async function GET(req: NextRequest) {
  const sector = req.nextUrl.searchParams.get("sector");
  const location = req.nextUrl.searchParams.get("location");
  if (!sector || !location) {
    return NextResponse.json({ error: "sector and location are required" }, { status: 400 });
  }

  const cached = await getCachedSearch(sector, location);
  if (cached) {
    return NextResponse.json({ results: cached, cached: true });
  }

  if (!companySearchProvider.isConfigured()) {
    return NextResponse.json(
      { error: "Company discovery isn't configured yet. Add GOOGLE_PLACES_API_KEY to your environment (see .env.example)." },
      { status: 503 }
    );
  }

  try {
    const discovered = await companySearchProvider.search({ sector, location });
    const saved = await saveSearchResults(sector, location, discovered);
    return NextResponse.json({ results: saved, cached: false });
  } catch (err) {
    console.error("Company discovery failed", err);
    return NextResponse.json(
      { error: "Couldn't reach the discovery provider right now. Try again in a moment." },
      { status: 502 }
    );
  }
}
