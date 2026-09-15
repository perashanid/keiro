"use client";

import { useMemo } from "react";
import { useAutomationStore } from "@/lib/store/automation";

export function OutreachHistory({ personId, firstName }: { personId: string; firstName: string }) {
  const allEmails = useAutomationStore((s) => s.emails);
  const allEnrollments = useAutomationStore((s) => s.enrollments);

  const emails = useMemo(
    () => allEmails.filter((e) => e.personId === personId).sort((a, b) => b.sentAt - a.sentAt),
    [allEmails, personId]
  );
  const enrollment = useMemo(
    () => allEnrollments.find((e) => e.personId === personId),
    [allEnrollments, personId]
  );

  if (emails.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        No outreach yet. Add {firstName} to a campaign to start tracking sent emails and replies
        here.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {emails.map((e) => (
        <li key={e.id} className="flex items-center justify-between border-b border-ink-700 pb-3 last:border-0 last:pb-0">
          <div>
            <p className="text-sm text-mist">{e.subject}</p>
            <p className="text-xs text-slate-400">
              {new Date(e.sentAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              {e.simulated && " · simulated (Gmail not connected)"}
            </p>
          </div>
        </li>
      ))}
      {enrollment?.status === "stopped_replied" && (
        <li className="text-sm text-success">Replied — sequence stopped</li>
      )}
      {enrollment?.status === "stopped_bounced" && <li className="text-sm text-danger">Bounced — sequence stopped</li>}
    </ul>
  );
}
