import type { Person } from "@/lib/types";

// Deliberately empty. Unlike companies.ts, we don't fabricate people here:
// inventing a name, title, and guessed email for a real person and attaching
// it to a real company would be fabricating personal data and presenting it
// as fact — worse than having no data at all.
//
// Real decision-maker contacts need one of:
//   - A real contact-enrichment provider (e.g. Hunter.io, Apollo's own API)
//     wired up the same way Google Places is for company discovery — see
//     src/lib/providers/company-search.ts for the pattern to follow.
//   - Contacts the workspace already has the rights to use, imported directly.
export const people: Person[] = [];

export function getPeopleByCompany(companyId: string): Person[] {
  return people.filter((p) => p.companyId === companyId);
}

export function getPersonById(id: string): Person | undefined {
  return people.find((p) => p.id === id);
}
