"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { people } from "@/lib/mock/people";
import { getCompanyById } from "@/lib/mock/companies";
import { useCompanies } from "@/hooks/use-companies";
import { CompanyMark } from "@/components/company-row";
import { Card } from "@/components/ui/card";
import { ScoreBadge } from "@/components/ui/badge";
import { PageHeader } from "@/components/app/page-header";
import { Search as SearchIcon } from "lucide-react";

function initials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase();
}

export default function SearchPage() {
  const { companies } = useCompanies();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

  const matchedCompanies = useMemo(() => {
    if (!q) return [];
    return companies
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.division.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [q, companies]);

  const matchedPeople = useMemo(() => {
    if (!q) return [];
    return people
      .filter(
        (p) =>
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [q]);

  return (
    <div>
      <PageHeader
        title="Search"
        description="Search across companies, people, industries, and locations."
      />
      <div className="focus-within:border-slate-400 flex items-center gap-3 rounded-[var(--radius-md)] border border-ink-700 bg-ink-900 px-4 py-3">
        <SearchIcon size={16} className="text-slate-400" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “garment manufacturers in Dhaka” or “Head of Procurement”"
          className="w-full bg-transparent text-sm text-mist outline-none placeholder:text-slate-500"
        />
      </div>

      {!q && (
        <p className="mt-6 text-sm text-slate-400">
          Start typing to search companies and people across your workspace.
        </p>
      )}

      {q && matchedCompanies.length === 0 && matchedPeople.length === 0 && (
        <p className="mt-6 text-sm text-slate-400">No results for “{query}”.</p>
      )}

      {matchedCompanies.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-sm font-medium text-mist">Companies</p>
          <Card className="divide-y divide-ink-700 p-2">
            {matchedCompanies.map((c) => (
              <Link key={c.id} href={`/companies/${c.id}`} className="focus-ring flex items-center gap-3 rounded-sm px-3 py-3">
                <CompanyMark company={c} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-mist">{c.name}</p>
                  <p className="truncate text-xs text-slate-400">
                    {c.industry} · {c.city}, {c.division}
                  </p>
                </div>
                {c.score !== undefined && <ScoreBadge score={c.score} />}
              </Link>
            ))}
          </Card>
        </div>
      )}

      {matchedPeople.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-sm font-medium text-mist">People</p>
          <Card className="divide-y divide-ink-700 p-2">
            {matchedPeople.map((p) => {
              const company = getCompanyById(p.companyId);
              return (
                <Link key={p.id} href={`/people/${p.id}`} className="focus-ring flex items-center gap-3 rounded-sm px-3 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-750 text-xs font-semibold text-slate-300">
                    {initials(p.firstName, p.lastName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-mist">
                      {p.firstName} {p.lastName}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {p.title} · {company?.name}
                    </p>
                  </div>
                  <ScoreBadge score={p.score} />
                </Link>
              );
            })}
          </Card>
        </div>
      )}
    </div>
  );
}
