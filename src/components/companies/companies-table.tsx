"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Company } from "@/lib/types";
import { getPeopleByCompany } from "@/lib/mock/people";
import { Badge, ScoreBadge } from "@/components/ui/badge";
import { CompanyMark } from "@/components/company-row";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { ListPlus, ShieldCheck, Download } from "lucide-react";

const ALL = "All";

export function CompaniesTable({ companies }: { companies: Company[] }) {
  const showToast = useToast();
  const [industry, setIndustry] = useState(ALL);
  const [division, setDivision] = useState(ALL);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const industries = useMemo(
    () => [ALL, ...Array.from(new Set(companies.map((c) => c.industry))).sort()],
    [companies]
  );
  const divisions = useMemo(
    () => [ALL, ...Array.from(new Set(companies.map((c) => c.division))).sort()],
    [companies]
  );

  const filtered = companies.filter(
    (c) => (industry === ALL || c.industry === industry) && (division === ALL || c.division === division)
  );

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => (prev.size === filtered.length ? new Set() : new Set(filtered.map((c) => c.id))));
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="focus-ring h-9 rounded-[var(--radius-sm)] border border-ink-700 bg-ink-900 px-3 text-sm text-mist"
        >
          {industries.map((i) => (
            <option key={i} value={i}>
              {i === ALL ? "All industries" : i}
            </option>
          ))}
        </select>
        <select
          value={division}
          onChange={(e) => setDivision(e.target.value)}
          className="focus-ring h-9 rounded-[var(--radius-sm)] border border-ink-700 bg-ink-900 px-3 text-sm text-mist"
        >
          {divisions.map((d) => (
            <option key={d} value={d}>
              {d === ALL ? "All divisions" : d}
            </option>
          ))}
        </select>
        <span className="text-sm text-slate-400">{filtered.length} companies</span>

        {selected.size > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-slate-400">{selected.size} selected</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                showToast(`Added ${selected.size} companies to a list`);
                setSelected(new Set());
              }}
            >
              <ListPlus size={14} /> Add to list
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                showToast(`Enriching ${selected.size} companies`);
                setSelected(new Set());
              }}
            >
              <ShieldCheck size={14} /> Enrich
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => showToast(`Exporting ${selected.size} companies`)}
            >
              <Download size={14} /> Export
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-ink-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-700 bg-ink-900/60 text-left text-xs text-slate-400">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.size > 0 && selected.size === filtered.length}
                  onChange={toggleAll}
                  className="accent-ivory"
                  aria-label="Select all companies"
                />
              </th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Industry</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Employees</th>
              <th className="px-4 py-3 font-medium">Decision-makers</th>
              <th className="px-4 py-3 font-medium">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-700">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-ink-800/60">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(c.id)}
                    onChange={() => toggle(c.id)}
                    className="accent-ivory"
                    aria-label={`Select ${c.name}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/companies/${c.id}`} className="focus-ring flex items-center gap-3 rounded-sm">
                    <CompanyMark company={c} size={32} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate font-medium text-mist">{c.name}</p>
                        {c.source === "google_places" && <Badge tone="accent">Live</Badge>}
                      </div>
                      <p className="truncate text-xs text-slate-400">{c.domain}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-300">{c.industry}</td>
                <td className="px-4 py-3 text-slate-300">
                  {c.city}, {c.division}
                </td>
                <td className="px-4 py-3 text-slate-300">{c.employeeRange ?? "—"}</td>
                <td className="px-4 py-3 text-slate-300">{getPeopleByCompany(c.id).length}</td>
                <td className="px-4 py-3">
                  {c.score !== undefined ? <ScoreBadge score={c.score} /> : <span className="text-slate-500">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
