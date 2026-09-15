"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useAutomationStore, type Enrollment } from "@/lib/store/automation";
import { getPersonById } from "@/lib/mock/people";
import { getCompanyById } from "@/lib/mock/companies";
import { Badge } from "@/components/ui/badge";
import type { Campaign } from "@/lib/types";

const statusTone: Record<Enrollment["status"], "neutral" | "success" | "warn" | "danger" | "accent"> = {
  pending: "warn",
  skipped_no_email: "danger",
  suppressed: "danger",
  stopped_replied: "accent",
  stopped_bounced: "danger",
  completed: "success",
};

const statusLabel: Record<Enrollment["status"], string> = {
  pending: "Scheduled",
  skipped_no_email: "No email on file",
  suppressed: "Unsubscribed",
  stopped_replied: "Replied — stopped",
  stopped_bounced: "Bounced — stopped",
  completed: "Sequence completed",
};

function formatWhen(ms: number): string {
  const diff = ms - Date.now();
  if (diff <= 0) return "due now";
  const mins = Math.round(diff / 60_000);
  if (mins < 60) return `in ${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `in ${hours}h`;
  return `in ${Math.round(hours / 24)}d`;
}

export function ProspectsTable({ campaign }: { campaign: Campaign }) {
  const allEnrollments = useAutomationStore((s) => s.enrollments);
  const enrollments = useMemo(
    () => allEnrollments.filter((e) => e.campaignId === campaign.id),
    [allEnrollments, campaign.id]
  );
  const markReplied = useAutomationStore((s) => s.markReplied);
  const markBounced = useAutomationStore((s) => s.markBounced);
  const sendNow = useAutomationStore((s) => s.sendNow);

  if (enrollments.length === 0) return null;

  return (
    <div className="mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-ink-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink-700 bg-ink-900/60 text-left text-xs text-slate-400">
            <th className="px-4 py-3 font-medium">Prospect</th>
            <th className="px-4 py-3 font-medium">Step</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Next send</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-700">
          {enrollments.map((e) => {
            const person = getPersonById(e.personId);
            if (!person) return null;
            const company = getCompanyById(person.companyId);
            const active = e.status === "pending";
            return (
              <tr key={e.id} className="hover:bg-ink-800/60">
                <td className="px-4 py-3">
                  <Link href={`/people/${person.id}`} className="focus-ring rounded-sm">
                    <p className="font-medium text-mist">
                      {person.firstName} {person.lastName}
                    </p>
                    <p className="text-xs text-slate-400">{company?.name}</p>
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-300">
                  Step {Math.min(e.stepIndex + 1, campaign.sequence.length)} of {campaign.sequence.length}
                  {e.lastOutcome === "simulated" && (
                    <span className="ml-2 text-xs text-slate-500">(simulated — Gmail not connected)</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone[e.status]}>{statusLabel[e.status]}</Badge>
                </td>
                <td className="px-4 py-3 text-slate-300">{active ? formatWhen(e.nextSendAt) : "—"}</td>
                <td className="px-4 py-3">
                  {active && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => sendNow(e.id)}
                        className="focus-ring rounded-sm text-xs text-slate-400 hover:text-ivory"
                      >
                        Send now
                      </button>
                      <button
                        onClick={() => markReplied(e.id)}
                        className="focus-ring rounded-sm text-xs text-slate-400 hover:text-ivory"
                      >
                        Mark replied
                      </button>
                      <button
                        onClick={() => markBounced(e.id)}
                        className="focus-ring rounded-sm text-xs text-slate-400 hover:text-danger"
                      >
                        Mark bounced
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
