import { NextResponse } from "next/server";
import { companySearchProvider } from "@/lib/providers/company-search";

export async function GET() {
  return NextResponse.json({ configured: companySearchProvider.isConfigured(), name: companySearchProvider.name });
}
