"use client";

import Link from "next/link";
import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWorkspaceStore } from "@/lib/store/workspace";

export default function SequencesPage() {
  const campaigns = useWorkspaceStore((s) => s.campaigns);
  const withSequences = campaigns.filter((c) => c.sequence.length > 0);

  return (
    <div>
      <PageHeader
        title="Sequences"
        description="Multi-step follow-ups that pause automatically on reply, bounce, or unsubscribe."
      />
      {withSequences.length === 0 ? (
        <p className="text-sm text-slate-400">No sequences yet. Build one from a campaign.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {withSequences.map((c) => (
            <Link key={c.id} href={`/campaigns/${c.id}`} className="focus-ring block rounded-[var(--radius-lg)]">
              <Card className="h-full p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-mist">{c.name}</p>
                  <Badge>{c.sequence.length} steps</Badge>
                </div>
                <ul className="mt-4 space-y-2">
                  {c.sequence.map((s) => (
                    <li key={s.id} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-600 text-[10px] text-slate-400">
                        {s.order}
                      </span>
                      <span className="truncate">{s.subject || "(no subject yet)"}</span>
                      {s.delayDays > 0 && (
                        <span className="ml-auto shrink-0 text-xs text-slate-500">+{s.delayDays}d</span>
                      )}
                    </li>
                  ))}
                </ul>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
