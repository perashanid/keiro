"use client";

import Link from "next/link";
import { useCrmStore } from "@/lib/store/crm";
import { getPersonById } from "@/lib/mock/people";
import { getCompanyById } from "@/lib/mock/companies";
import { Card } from "@/components/ui/card";

function relatedInfo(relatedType: "person" | "company", relatedId: string) {
  if (relatedType === "person") {
    const p = getPersonById(relatedId);
    return p ? { label: `${p.firstName} ${p.lastName}`, href: `/people/${p.id}` } : null;
  }
  const c = getCompanyById(relatedId);
  return c ? { label: c.name, href: `/companies/${c.id}` } : null;
}

export function TasksWidget() {
  const tasks = useCrmStore((s) => s.tasks);
  const toggleTask = useCrmStore((s) => s.toggleTask);

  const today = new Date().toISOString().slice(0, 10);
  const open = tasks
    .filter((t) => t.status === "open")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 6);

  return (
    <Card className="p-5">
      <p className="mb-4 text-sm font-medium text-mist">Your tasks</p>
      {open.length === 0 ? (
        <p className="text-sm text-slate-400">No open tasks. Add one from a company or person profile.</p>
      ) : (
        <ul className="space-y-3">
          {open.map((t) => {
            const related = relatedInfo(t.relatedType, t.relatedId);
            const overdue = t.dueDate < today;
            return (
              <li key={t.id} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  onChange={() => toggleTask(t.id)}
                  className="mt-0.5 accent-ivory"
                  aria-label={`Mark "${t.title}" done`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-mist">{t.title}</p>
                  {related && (
                    <Link href={related.href} className="focus-ring text-xs text-slate-400 hover:text-mist">
                      {related.label}
                    </Link>
                  )}
                </div>
                <span className={overdue ? "shrink-0 text-xs text-danger" : "shrink-0 text-xs text-slate-500"}>
                  {t.dueDate}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
