"use client";

import { useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { StatCard, Card } from "@/components/ui/card";
import { useWorkspaceStore } from "@/lib/store/workspace";
import { useAutomationStore, computeCampaignStats } from "@/lib/store/automation";
import { cn } from "@/lib/cn";

const ranges = ["Today", "7 days", "30 days", "90 days"] as const;

export default function AnalyticsPage() {
  const campaigns = useWorkspaceStore((s) => s.campaigns);
  const enrollments = useAutomationStore((s) => s.enrollments);
  const emails = useAutomationStore((s) => s.emails);
  const [range, setRange] = useState<(typeof ranges)[number]>("30 days");

  const rows = campaigns.map((c) => {
    const stats = computeCampaignStats(enrollments, emails, c.id);
    return {
      campaign: c,
      tracked: stats.tracked,
      sent: stats.tracked ? stats.sent : c.sent,
      opened: stats.tracked ? null : c.opened,
      replied: stats.tracked ? stats.replied : c.replied,
      bounced: stats.tracked ? stats.bounced : c.bounced,
      delivered: stats.tracked ? null : c.delivered,
    };
  });

  const totals = rows.reduce(
    (acc, r) => ({
      sent: acc.sent + r.sent,
      opened: acc.opened + (r.opened ?? 0),
      openTracked: acc.openTracked + (r.opened !== null ? r.sent : 0),
      replied: acc.replied + r.replied,
      meetings: acc.meetings + r.campaign.meetings,
    }),
    { sent: 0, opened: 0, openTracked: 0, replied: 0, meetings: 0 }
  );

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Prospecting and outreach performance across your workspace."
        actions={
          <div className="flex items-center gap-1 rounded-[var(--radius-sm)] border border-ink-700 p-1">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "focus-ring rounded-[4px] px-2.5 py-1 text-xs",
                  range === r ? "bg-ink-750 text-ivory" : "text-slate-400 hover:text-mist"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Emails sent" value={totals.sent.toLocaleString()} hint={range} />
        <StatCard
          label="Open rate"
          value={totals.openTracked > 0 ? `${Math.round((totals.opened / totals.openTracked) * 100)}%` : "—"}
          hint={range}
        />
        <StatCard
          label="Reply rate"
          value={totals.sent > 0 ? `${Math.round((totals.replied / totals.sent) * 100)}%` : "—"}
          hint={range}
        />
        <StatCard label="Meetings booked" value={String(totals.meetings)} hint={range} />
      </div>

      <div className="mt-6">
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-700 bg-ink-900/60 text-left text-xs text-slate-400">
                <th className="px-4 py-3 font-medium">Campaign</th>
                <th className="px-4 py-3 font-medium">Sent</th>
                <th className="px-4 py-3 font-medium">Delivery rate</th>
                <th className="px-4 py-3 font-medium">Open rate</th>
                <th className="px-4 py-3 font-medium">Reply rate</th>
                <th className="px-4 py-3 font-medium">Bounce rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-700">
              {rows
                .filter((r) => r.sent > 0)
                .map((r) => (
                  <tr key={r.campaign.id} className="hover:bg-ink-800/60">
                    <td className="px-4 py-3 font-medium text-mist">{r.campaign.name}</td>
                    <td className="px-4 py-3 text-slate-300">{r.sent}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {r.delivered !== null ? `${Math.round((r.delivered / r.sent) * 100)}%` : "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {r.opened !== null ? `${Math.round((r.opened / r.sent) * 100)}%` : "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{Math.round((r.replied / r.sent) * 100)}%</td>
                    <td className="px-4 py-3 text-slate-300">{Math.round((r.bounced / r.sent) * 100)}%</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
