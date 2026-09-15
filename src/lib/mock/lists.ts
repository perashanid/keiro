import type { ListRecord } from "@/lib/types";
import { people } from "@/lib/mock/people";
import type { Person } from "@/lib/types";

export const lists: ListRecord[] = [
  { id: "l-1", name: "Pharmaceutical exporters", description: "Bangladeshi pharmaceutical manufacturers with significant export volume.", kind: "companies", itemCount: 3, updatedAt: "2026-09-08", tags: ["Pharmaceuticals"] },
  { id: "l-2", name: "Fintech & mobile financial services", description: "Mobile financial service and payments companies.", kind: "companies", itemCount: 2, updatedAt: "2026-09-07", tags: ["Fintech"] },
  { id: "l-3", name: "E-commerce platforms", description: "Online marketplaces and retail platforms.", kind: "companies", itemCount: 3, updatedAt: "2026-09-05", tags: ["E-commerce"] },
  { id: "l-4", name: "Garment & textile manufacturers", description: "Denim, yarn, and fabric manufacturers.", kind: "companies", itemCount: 2, updatedAt: "2026-09-09", tags: ["Garments & Textiles"] },
  { id: "l-5", name: "Real estate & logistics", description: "Property developers and freight/logistics operators.", kind: "companies", itemCount: 2, updatedAt: "2026-08-28", tags: ["Real Estate", "Logistics & Freight"] },
  { id: "l-6", name: "Telecom operators", description: "Mobile network operators.", kind: "companies", itemCount: 3, updatedAt: "2026-09-11", tags: ["Telecommunications"] },
  { id: "l-7", name: "Retail chains", description: "Supermarket and superstore chains.", kind: "companies", itemCount: 2, updatedAt: "2026-09-11", tags: ["Retail"] },
  { id: "l-8", name: "Heavy industry", description: "Steel, cement, and shipbuilding manufacturers.", kind: "companies", itemCount: 3, updatedAt: "2026-09-11", tags: ["Steel", "Cement & Construction Materials", "Shipbuilding"] },
  { id: "l-9", name: "Banking", description: "State-owned, private, foreign, and Islamic commercial banks.", kind: "companies", itemCount: 8, updatedAt: "2026-09-13", tags: ["Banking"] },
  { id: "l-10", name: "Aviation", description: "Domestic and international airlines.", kind: "companies", itemCount: 2, updatedAt: "2026-09-12", tags: ["Aviation"] },
  { id: "l-11", name: "Consumer tech & delivery", description: "Ride-sharing, food delivery, and edtech platforms.", kind: "companies", itemCount: 3, updatedAt: "2026-09-12", tags: ["Transportation Technology", "Food Delivery", "Education Technology"] },
];

export function getListById(id: string): ListRecord | undefined {
  return lists.find((l) => l.id === id);
}

/**
 * People a campaign built on this list should reach. Client-safe and DB-free
 * on purpose: with zero real contacts (see src/lib/mock/people.ts), the
 * answer is always empty regardless of which companies match, so there's no
 * need to pull in company data (and no need for this file to ever touch the
 * database) to compute it. Once a real people/contact provider exists, this
 * should be rewritten to resolve properly — most likely moved server-side
 * alongside resolveListCompanies in src/lib/server/lists-db.ts.
 */
export function resolveListPeople(list: ListRecord): Person[] {
  if (people.length === 0) return [];
  return list.kind === "people" ? people.slice(0, Math.min(list.itemCount, people.length)) : [];
}
