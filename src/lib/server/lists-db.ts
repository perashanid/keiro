import type { ListRecord, Company } from "@/lib/types";
import { listCompanies } from "@/lib/server/companies-db";

/** Matches companies whose industry a list's tags reference; falls back to
 * the first `itemCount` records if no tag matches (e.g. a custom list with
 * tags that don't map to an industry). Server-only: queries the database. */
export async function resolveListCompanies(list: ListRecord): Promise<Company[]> {
  if (list.kind === "people") return [];
  const companies = await listCompanies();
  const matches = companies.filter((c) => list.tags.some((tag) => c.industry.toLowerCase() === tag.toLowerCase()));
  const source = matches.length > 0 ? matches : companies;
  return source.slice(0, Math.min(list.itemCount, source.length));
}
