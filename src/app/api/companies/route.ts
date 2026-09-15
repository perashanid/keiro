import { NextResponse } from "next/server";
import { listCompanies } from "@/lib/server/companies-db";

export async function GET() {
  const companies = await listCompanies();
  return NextResponse.json({ companies });
}
