import type { CompanySearchProvider, CompanySearchParams, DiscoveredCompany } from "./types";

const SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.types",
  "places.websiteUri",
  "places.internationalPhoneNumber",
  "places.rating",
  "places.googleMapsUri",
  "places.businessStatus",
].join(",");

interface PlacesApiResult {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  types?: string[];
  websiteUri?: string;
  internationalPhoneNumber?: string;
  rating?: number;
  googleMapsUri?: string;
  businessStatus?: string;
}

function humanizeType(type?: string): string | null {
  if (!type) return null;
  return type
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export const googlePlacesProvider: CompanySearchProvider = {
  name: "Google Places",

  isConfigured() {
    return Boolean(process.env.GOOGLE_PLACES_API_KEY);
  },

  async search({ sector, location }: CompanySearchParams): Promise<DiscoveredCompany[]> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_PLACES_API_KEY is not configured");
    }

    const textQuery = `${sector} in ${location}, Bangladesh`;

    const res = await fetch(SEARCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({
        textQuery,
        regionCode: "BD",
        languageCode: "en",
        maxResultCount: 20,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Google Places search failed (${res.status}): ${detail.slice(0, 300)}`);
    }

    const data = (await res.json()) as { places?: PlacesApiResult[] };
    const places = data.places ?? [];

    return places
      .filter((p) => p.businessStatus !== "CLOSED_PERMANENTLY")
      .map((p) => ({
        id: p.id,
        source: "google_places" as const,
        name: p.displayName?.text ?? "Unnamed business",
        address: p.formattedAddress ?? "",
        phone: p.internationalPhoneNumber ?? null,
        website: p.websiteUri ?? null,
        category: humanizeType(p.types?.[0]),
        rating: p.rating ?? null,
        mapsUrl: p.googleMapsUri ?? `https://www.google.com/maps/search/?api=1&query=place_id:${p.id}`,
      }));
  },
};
