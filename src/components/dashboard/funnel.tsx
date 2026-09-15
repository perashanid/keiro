"use client";

import { Card } from "@/components/ui/card";
import { people } from "@/lib/mock/people";
import { useCrmStore } from "@/lib/store/crm";

export function ProspectingFunnel({ companiesCount }: { companiesCount: number }) {
  const leads = useCrmStore((s) => s.leads);
  const qualified = leads.filter((l) => ["qualified", "opportunity", "customer"].includes(l.stage)).length;
  const opportunities = leads.filter((l) => ["opportunity", "customer"].includes(l.stage)).length;

  const stages = [
    { label: "Companies discovered", value: companiesCount },
    { label: "People found", value: people.length },
    { label: "Qualified leads", value: qualified },
    { label: "Opportunities", value: opportunities },
  ];
  const max = Math.max(...stages.map((s) => s.value), 1);

  return (
    <Card className="p-6">
      <p className="text-sm font-medium text-mist">Companies → People → Qualified leads → Opportunities</p>
      <div className="mt-6 flex items-end gap-6">
        {stages.map((s, i) => {
          const height = 24 + (s.value / max) * 96;
          return (
            <div key={s.label} className="flex flex-1 flex-col items-center gap-3">
              <div className="flex h-32 w-full items-end">
                <div
                  className="w-full rounded-t-[var(--radius-sm)]"
                  style={{
                    height,
                    background: i === stages.length - 1 ? "var(--ivory)" : "var(--slate-600)",
                  }}
                />
              </div>
              <p className="font-display text-xl text-ivory">{s.value.toLocaleString()}</p>
              <p className="text-center text-xs text-slate-400">{s.label}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
