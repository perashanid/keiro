"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Person } from "@/lib/types";
import { getCompanyById } from "@/lib/mock/companies";
import { ScoreBadge, VerificationBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { seniorityLabel } from "@/lib/format";
import type { Seniority } from "@/lib/types";
import { useToast } from "@/components/ui/toast";
import { EmailComposer } from "@/components/outreach/email-composer";
import { ListPlus, ShieldCheck, Download, Mail } from "lucide-react";

const ALL = "All";

function initials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase();
}

export function PeopleTable({ people }: { people: Person[] }) {
  const showToast = useToast();
  const [seniority, setSeniority] = useState(ALL);
  const [department, setDepartment] = useState(ALL);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [composerOpen, setComposerOpen] = useState(false);

  const seniorities = useMemo(
    () => [ALL, ...Array.from(new Set(people.map((p) => p.seniority))).sort()],
    [people]
  );
  const departments = useMemo(
    () => [ALL, ...Array.from(new Set(people.map((p) => p.department))).sort()],
    [people]
  );

  const filtered = people.filter(
    (p) => (seniority === ALL || p.seniority === seniority) && (department === ALL || p.department === department)
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
    setSelected((prev) => (prev.size === filtered.length ? new Set() : new Set(filtered.map((p) => p.id))));
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select
          value={seniority}
          onChange={(e) => setSeniority(e.target.value)}
          className="focus-ring h-9 rounded-[var(--radius-sm)] border border-ink-700 bg-ink-900 px-3 text-sm text-mist"
        >
          {seniorities.map((s) => (
            <option key={s} value={s}>
              {s === ALL ? "All seniority" : seniorityLabel[s as Seniority]}
            </option>
          ))}
        </select>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="focus-ring h-9 rounded-[var(--radius-sm)] border border-ink-700 bg-ink-900 px-3 text-sm text-mist"
        >
          {departments.map((d) => (
            <option key={d} value={d}>
              {d === ALL ? "All departments" : d}
            </option>
          ))}
        </select>
        <span className="text-sm text-slate-400">{filtered.length} people</span>

        {selected.size > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-slate-400">{selected.size} selected</span>
            <Button variant="secondary" size="sm" onClick={() => setComposerOpen(true)}>
              <Mail size={14} /> Email
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                showToast(`Added ${selected.size} people to a list`);
                setSelected(new Set());
              }}
            >
              <ListPlus size={14} /> Add to list
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                showToast(`Verifying ${selected.size} email addresses`);
                setSelected(new Set());
              }}
            >
              <ShieldCheck size={14} /> Verify
            </Button>
            <Button variant="secondary" size="sm" onClick={() => showToast(`Exporting ${selected.size} people`)}>
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
                  aria-label="Select all people"
                />
              </th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-700">
            {filtered.map((p) => {
              const company = getCompanyById(p.companyId);
              return (
                <tr key={p.id} className="hover:bg-ink-800/60">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={() => toggle(p.id)}
                      className="accent-ivory"
                      aria-label={`Select ${p.firstName} ${p.lastName}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/people/${p.id}`} className="focus-ring flex items-center gap-3 rounded-sm">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-750 text-xs font-semibold text-slate-300">
                        {initials(p.firstName, p.lastName)}
                      </div>
                      <span className="font-medium text-mist">
                        {p.firstName} {p.lastName}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{p.title}</td>
                  <td className="px-4 py-3">
                    {company && (
                      <Link href={`/companies/${company.id}`} className="focus-ring rounded-sm text-slate-300 hover:text-mist">
                        {company.name}
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{p.location}</td>
                  <td className="px-4 py-3">
                    <VerificationBadge status={p.emailStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBadge score={p.score} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {composerOpen && (
        <EmailComposer
          recipients={people
            .filter((p) => selected.has(p.id))
            .map((p) => ({
              id: p.id,
              firstName: p.firstName,
              lastName: p.lastName,
              email: p.email,
              companyName: getCompanyById(p.companyId)?.name,
              title: p.title,
            }))}
          onClose={() => {
            setComposerOpen(false);
            setSelected(new Set());
          }}
        />
      )}
    </div>
  );
}
