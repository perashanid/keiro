// A discovered company comes from a real external source (currently Google
// Places), not from Keiro's own intelligence — so it deliberately carries
// less data than the mock Company type (src/lib/types.ts). No employee
// count, revenue, products, or growth signals are fabricated for it.
export interface DiscoveredCompany {
  id: string;
  source: "google_places";
  name: string;
  address: string;
  phone: string | null;
  website: string | null;
  category: string | null;
  rating: number | null;
  mapsUrl: string;
}

export interface CompanySearchParams {
  sector: string;
  location: string;
}

export interface CompanySearchProvider {
  name: string;
  isConfigured(): boolean;
  search(params: CompanySearchParams): Promise<DiscoveredCompany[]>;
}
