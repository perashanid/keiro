import { prisma } from "@/lib/server/prisma";
import type { Company } from "@/lib/types";
import type { DiscoveredCompany } from "@/lib/providers/types";

const BD_DIVISIONS = ["Dhaka", "Chattogram", "Khulna", "Rajshahi", "Sylhet", "Barishal", "Rangpur", "Mymensingh"];

type CompanyRow = {
  id: string;
  name: string;
  legalName: string | null;
  website: string;
  domain: string;
  industry: string;
  sector: string | null;
  division: string;
  city: string;
  employeeRange: string | null;
  employeeCount: number | null;
  revenueRange: string | null;
  foundedYear: number | null;
  businessType: string | null;
  description: string | null;
  products: string | null;
  technologies: string | null;
  growthSignals: string | null;
  score: number | null;
  logoInitials: string;
  source: string;
};

function parseJsonArray(value: string | null): string[] | undefined {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function rowToCompany(row: CompanyRow): Company {
  return {
    id: row.id,
    name: row.name,
    legalName: row.legalName ?? undefined,
    website: row.website,
    domain: row.domain,
    industry: row.industry,
    sector: row.sector ?? undefined,
    division: row.division,
    city: row.city,
    employeeRange: row.employeeRange ?? undefined,
    employeeCount: row.employeeCount ?? undefined,
    revenueRange: row.revenueRange ?? undefined,
    foundedYear: row.foundedYear ?? undefined,
    businessType: row.businessType ?? undefined,
    description: row.description ?? undefined,
    products: parseJsonArray(row.products),
    technologies: parseJsonArray(row.technologies),
    growthSignals: parseJsonArray(row.growthSignals),
    score: row.score ?? undefined,
    logoInitials: row.logoInitials,
    source: row.source === "google_places" ? "google_places" : "curated",
  };
}

export async function listCompanies(): Promise<Company[]> {
  const rows = await prisma.company.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map(rowToCompany);
}

export async function getCompanyByIdDb(id: string): Promise<Company | null> {
  const row = await prisma.company.findUnique({ where: { id } });
  return row ? rowToCompany(row) : null;
}

function normalizeKey(value: string): string {
  return value.trim().toLowerCase();
}

/** Returns previously-saved results for this exact (sector, location) search, or null on a cache miss. */
export async function getCachedSearch(sector: string, location: string): Promise<Company[] | null> {
  const cached = await prisma.placesSearchCache.findUnique({
    where: { sector_location: { sector: normalizeKey(sector), location: normalizeKey(location) } },
  });
  if (!cached) return null;

  const ids: string[] = JSON.parse(cached.companyIds);
  const rows = await prisma.company.findMany({ where: { id: { in: ids } } });
  return rows.map(rowToCompany);
}

function inferLocation(address: string, fallbackDivision: string): { division: string; city: string } {
  const match = BD_DIVISIONS.find((d) => address.toLowerCase().includes(d.toLowerCase()));
  if (!match) return { division: fallbackDivision, city: fallbackDivision };
  const idx = address.toLowerCase().indexOf(match.toLowerCase());
  const before = address.slice(0, idx).split(",").filter(Boolean);
  const city = before.length > 0 ? before[before.length - 1].trim() : match;
  return { division: match, city: city || match };
}

function logoInitialsFrom(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  return (words[0]?.[0] ?? "") + (words[1]?.[0] ?? words[0]?.[1] ?? "");
}

/**
 * Persists live Google Places results as real Company rows (source
 * "google_places") and records the search in the cache, so a repeat search
 * for the same (sector, location) serves from the database instead of
 * calling the paid API again. Never fabricates the intelligence fields a
 * directory listing doesn't provide (employee count, products, etc.) —
 * those stay null.
 */
export async function saveSearchResults(
  sector: string,
  location: string,
  discovered: DiscoveredCompany[]
): Promise<Company[]> {
  const saved: CompanyRow[] = [];

  for (const d of discovered) {
    const { division, city } = inferLocation(d.address, location);
    let domain = "";
    if (d.website) {
      try {
        domain = new URL(d.website).hostname.replace(/^www\./, "");
      } catch {
        domain = "";
      }
    }
    const row = await prisma.company.upsert({
      where: { placeId: d.id },
      create: {
        name: d.name,
        website: d.website ?? d.mapsUrl,
        domain,
        industry: sector,
        division,
        city,
        businessType: null,
        logoInitials: logoInitialsFrom(d.name),
        source: "google_places",
        placeId: d.id,
      },
      update: {
        name: d.name,
        website: d.website ?? d.mapsUrl,
        division,
        city,
      },
    });
    saved.push(row);
  }

  await prisma.placesSearchCache.upsert({
    where: { sector_location: { sector: normalizeKey(sector), location: normalizeKey(location) } },
    create: {
      sector: normalizeKey(sector),
      location: normalizeKey(location),
      companyIds: JSON.stringify(saved.map((r) => r.id)),
    },
    update: {
      companyIds: JSON.stringify(saved.map((r) => r.id)),
      fetchedAt: new Date(),
    },
  });

  return saved.map(rowToCompany);
}
