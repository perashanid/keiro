"use client";

import Link from "next/link";
import { people } from "@/lib/mock/people";
import { getCompanyById } from "@/lib/mock/companies";
import { team, getTeamMemberById } from "@/lib/mock/team";
import { useCrmStore } from "@/lib/store/crm";
import type { LeadStage } from "@/lib/types";
import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { ScoreBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ChevronRight } from "lucide-react";

const stageOrder: LeadStage[] = ["new", "contacted", "engaged", "qualified", "opportunity", "customer"];

const stageLabel: Record<LeadStage, string> = {
  new: "New",
  contacted: "Contacted",
  engaged: "Engaged",
  qualified: "Qualified",
  opportunity: "Opportunity",
  customer: "Customer",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default function LeadsPage() {
  const leads = useCrmStore((s) => s.leads);
  const setLeadStage = useCrmStore((s) => s.setLeadStage);
  const setLeadOwner = useCrmStore((s) => s.setLeadOwner);

  const stageOf = (personId: string) => leads.find((l) => l.personId === personId)?.stage ?? "new";
  const ownerOf = (personId: string) => leads.find((l) => l.personId === personId)?.ownerId ?? null;

  function advance(personId: string) {
    const idx = stageOrder.indexOf(stageOf(personId));
    if (idx >= stageOrder.length - 1) return;
    setLeadStage(personId, stageOrder[idx + 1]);
  }

  return (
    <div>
      <PageHeader title="Leads" description="Move prospects through your pipeline as conversations progress." />
      {people.length === 0 ? (
        <EmptyState
          title="No leads yet"
          description="Leads are created from real contacts. Connect a contact-enrichment provider, or import contacts you already have, to start building a pipeline."
          ctaLabel="Go to Integrations"
          ctaHref="/integrations"
        />
      ) : (
      <div className="grid grid-cols-1 gap-4 overflow-x-auto sm:grid-cols-2 lg:grid-cols-6">
        {stageOrder.map((stage) => {
          const inStage = people.filter((p) => stageOf(p.id) === stage);
          return (
            <div key={stage} className="min-w-[220px]">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-mist">{stageLabel[stage]}</p>
                <span className="text-xs text-slate-400">{inStage.length}</span>
              </div>
              <div className="space-y-2">
                {inStage.map((p) => {
                  const company = getCompanyById(p.companyId);
                  const isLast = stage === "customer";
                  const ownerId = ownerOf(p.id);
                  const owner = ownerId ? getTeamMemberById(ownerId) : null;
                  return (
                    <Card key={p.id} className="p-3">
                      <Link href={`/people/${p.id}`} className="focus-ring block rounded-sm">
                        <p className="truncate text-sm font-medium text-mist">
                          {p.firstName} {p.lastName}
                        </p>
                        <p className="truncate text-xs text-slate-400">{company?.name}</p>
                      </Link>
                      <div className="mt-2 flex items-center justify-between">
                        <ScoreBadge score={p.score} />
                        {!isLast && (
                          <button
                            onClick={() => advance(p.id)}
                            className="focus-ring flex items-center gap-0.5 rounded-sm text-xs text-slate-400 hover:text-ivory"
                            aria-label={`Move ${p.firstName} to next stage`}
                          >
                            Advance <ChevronRight size={12} />
                          </button>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-1.5 border-t border-ink-700 pt-2">
                        {owner && (
                          <span
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink-750 text-[9px] font-semibold text-slate-300"
                            title={owner.name}
                          >
                            {initials(owner.name)}
                          </span>
                        )}
                        <select
                          value={ownerId ?? ""}
                          onChange={(e) => setLeadOwner(p.id, e.target.value || null)}
                          className="focus-ring h-6 flex-1 rounded-[4px] border border-ink-700 bg-ink-900 text-[11px] text-slate-400"
                          aria-label={`Assign owner for ${p.firstName} ${p.lastName}`}
                        >
                          <option value="">Unassigned</option>
                          {team.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
