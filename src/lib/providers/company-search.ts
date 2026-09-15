import { googlePlacesProvider } from "./google-places";
import type { CompanySearchProvider } from "./types";

export type { DiscoveredCompany, CompanySearchParams } from "./types";

// Swap or add providers here without touching the API route or UI that call
// this — e.g. a second entry for a people/contact-enrichment provider once
// one is chosen.
export const companySearchProvider: CompanySearchProvider = googlePlacesProvider;
