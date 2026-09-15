"use client";

import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/ui/card";
import { ProspectingFunnel } from "@/components/dashboard/funnel";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { TasksWidget } from "@/components/dashboard/tasks-widget";
import { activity } from "@/lib/mock/activity";
import { people } from "@/lib/mock/people";
import { useWorkspaceStore } from "@/lib/store/workspace";
import { useAutomationStore, computeCampaignStats } from "@/lib/store/automation";
import { useCompanies } from "@/hooks/use-companies";

export default function DashboardPage() {
  const { companies } = useCompanies();
  const campaigns = useWorkspaceStore((s) => s.campaigns);
  const enrollments = useAutomationStore((s) => s.enrollments);
  const emails = useAutomationStore((s) => s.emails);

  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
  const totals = campaigns.reduce(
    (acc, c) => {
      const stats = computeCampaignStats(enrollments, emails, c.id);
      return {
        sent: acc.sent + (stats.tracked ? stats.sent : c.sent),
        replied: acc.replied + (stats.tracked ? stats.replied : c.replied),
      };
    },
    { sent: 0, replied: 0 }
  );
  const verifiedEmails = people.filter((p) => p.emailStatus === "verified").length;

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Your prospecting and outreach performance, workspace-wide."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Companies" value={companies.length.toLocaleString()} />
        <StatCard label="Contacts" value={people.length.toLocaleString()} />
        <StatCard label="Verified emails" value={verifiedEmails.toLocaleString()} />
        <StatCard label="Active campaigns" value={String(activeCampaigns)} />
        <StatCard label="Emails sent" value={totals.sent.toLocaleString()} hint="All time" />
        <StatCard label="Replies" value={totals.replied.toLocaleString()} hint="All time" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProspectingFunnel companiesCount={companies.length} />
          <ActivityFeed items={activity} />
        </div>
        <TasksWidget />
      </div>
    </div>
  );
}
