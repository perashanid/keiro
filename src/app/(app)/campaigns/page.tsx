"use client";

import Link from "next/link";
import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { CampaignStatusBadge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { useWorkspaceStore } from "@/lib/store/workspace";
import { useAutomationStore, computeCampaignStats } from "@/lib/store/automation";
import { Plus } from "lucide-react";

export default function CampaignsPage() {
  const campaigns = useWorkspaceStore((s) => s.campaigns);
  const enrollments = useAutomationStore((s) => s.enrollments);
  const emails = useAutomationStore((s) => s.emails);

  return (
    <div>
      <PageHeader
        title="Campaigns"
        description="Track outreach performance from first send to booked meeting."
        actions={
          <LinkButton href="/campaigns/new" size="sm">
            <Plus size={14} /> New campaign
          </LinkButton>
        }
      />
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-700 bg-ink-900/60 text-left text-xs text-slate-400">
              <th className="px-4 py-3 font-medium">Campaign</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Prospects</th>
              <th className="px-4 py-3 font-medium">Sent</th>
              <th className="px-4 py-3 font-medium">Opened</th>
              <th className="px-4 py-3 font-medium">Replied</th>
              <th className="px-4 py-3 font-medium">Meetings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-700">
            {campaigns.map((c) => {
              const stats = computeCampaignStats(enrollments, emails, c.id);
              const sent = stats.tracked ? stats.sent : c.sent;
              const replied = stats.tracked ? stats.replied : c.replied;
              return (
                <tr key={c.id} className="hover:bg-ink-800/60">
                  <td className="px-4 py-3">
                    <Link href={`/campaigns/${c.id}`} className="focus-ring rounded-sm">
                      <p className="font-medium text-mist">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.listName}</p>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <CampaignStatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-300">{c.prospects}</td>
                  <td className="px-4 py-3 text-slate-300">{sent}</td>
                  <td className="px-4 py-3 text-slate-300">{stats.tracked ? "—" : c.opened}</td>
                  <td className="px-4 py-3 text-slate-300">{replied}</td>
                  <td className="px-4 py-3 text-slate-300">{c.meetings}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
