"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Company } from "@/lib/types";
import { ExternalLink, Search } from "lucide-react";

const SECTORS = [
  "Garments & Textiles",
  "Logistics & Freight",
  "Food & Agro-processing",
  "Pharmaceuticals",
  "Fintech",
  "Retail",
  "Software & IT Services",
  "Construction",
  "Export / Import",
  "Real Estate",
  "E-commerce",
  "Industrial Manufacturing",
  "Professional Services",
  "Consumer Goods",
];

const DIVISIONS = ["Dhaka", "Chattogram", "Khulna", "Rajshahi", "Sylhet", "Barishal", "Rangpur", "Mymensingh"];

export function DiscoverPanel() {
  const router = useRouter();
  const [sector, setSector] = useState(SECTORS[0]);
  const [division, setDivision] = useState(DIVISIONS[0]);
  const [city, setCity] = useState("");
  const [results, setResults] = useState<Company[] | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runSearch() {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const location = city.trim() ? `${city.trim()}, ${division}` : division;
      const res = await fetch(
        `/api/discovery/companies?sector=${encodeURIComponent(sector)}&location=${encodeURIComponent(location)}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setResults(data.results);
      setFromCache(Boolean(data.cached));
      router.refresh();
    } catch {
      setError("Couldn't reach the discovery provider right now. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mb-6 p-5">
      <p className="text-sm font-medium text-mist">Discover companies</p>
      <p className="mt-1 text-sm text-slate-400">
        Real businesses from Google Places, by sector and location — results are saved to your
        Companies list automatically, so a repeat search doesn&apos;t call the API again.
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1.5 block text-xs text-slate-400">Sector</label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="focus-ring h-9 rounded-[var(--radius-sm)] border border-ink-700 bg-ink-900 px-3 text-sm text-mist"
          >
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-slate-400">Division</label>
          <select
            value={division}
            onChange={(e) => setDivision(e.target.value)}
            className="focus-ring h-9 rounded-[var(--radius-sm)] border border-ink-700 bg-ink-900 px-3 text-sm text-mist"
          >
            {DIVISIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-slate-400">City (optional)</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Gazipur"
            className="focus-ring h-9 rounded-[var(--radius-sm)] border border-ink-700 bg-ink-900 px-3 text-sm text-mist placeholder:text-slate-500"
          />
        </div>
        <Button size="sm" onClick={runSearch} disabled={loading}>
          <Search size={14} /> {loading ? "Searching…" : "Discover companies"}
        </Button>
      </div>

      {error && (
        <p className="mt-4 rounded-[var(--radius-sm)] border border-warn/30 bg-warn/10 px-3 py-2 text-sm text-warn">
          {error}
        </p>
      )}

      {results && results.length === 0 && !error && (
        <p className="mt-4 text-sm text-slate-400">No results for that sector and location.</p>
      )}

      {results && results.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs text-slate-400">
            {fromCache ? "Served from a previous search — no API call made." : "Added to Companies below."}
          </p>
          <div className="divide-y divide-ink-700 rounded-[var(--radius-md)] border border-ink-700">
            {results.map((c) => (
              <div key={c.id} className="flex items-start gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-mist">{c.name}</p>
                    <Badge>{c.industry}</Badge>
                    <Badge tone="accent">Live</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    {c.city}, {c.division}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <a
                      href={c.website.startsWith("http") ? c.website : `https://${c.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring flex items-center gap-1 rounded-sm hover:text-mist"
                    >
                      {c.domain || "View"} <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
