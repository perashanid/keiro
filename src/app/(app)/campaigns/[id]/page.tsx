"use client";

import { use, useMemo } from "react";
import { notFound } from "next/navigation";
import { useWorkspaceStore } from "@/lib/store/workspace";
import { useAutomationStore, computeCampaignStats } from "@/lib/store/automation";
import { PageHeader } from "@/components/app/page-header";
import { Card, StatCard } from "@/components/ui/card";
import { CampaignStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SequenceBuilder } from "@/components/campaigns/sequence-builder";
import { ProspectsTable } from "@/components/campaigns/prospects-table";
import { useToast } from "@/components/ui/toast";
import { Pause, Play } from "lucide-react";

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const campaign = useWorkspaceStore((s) => s.getCampaign(id));
  const updateSequence = useWorkspaceStore((s) => s.updateSequence);
  const setStatus = useWorkspaceStore((s) => s.setStatus);
  const enrollCampaign = useAutomationStore((s) => s.enrollCampaign);
  const enrollments = useAutomationStore((s) => s.enrollments);
  const emails = useAutomationStore((s) => s.emails);
  const showToast = useToast();

  const stats = useMemo(
    () => (campaign ? computeCampaignStats(enrollments, emails, campaign.id) : null),
    [enrollments, emails, campaign]
  );

  if (!campaign) notFound();

  const sent = stats?.tracked ? stats.sent : campaign.sent;
  const replied = stats?.tracked ? stats.replied : campaign.replied;
  const bounced = stats?.tracked ? stats.bounced : campaign.bounced;
  const rate = (n: number) => (sent > 0 ? `${Math.round((n / sent) * 100)}%` : "—");

  return (
    <div>
      <PageHeader
        title={campaign.name}
        description={`Targeting “${campaign.listName}”`}
        actions={
          <>
            <CampaignStatusBadge status={campaign.status} />
            {campaign.status === "active" || campaign.status === "scheduled" ? (
              <Button variant="secondary" size="sm" onClick={() => setStatus(campaign.id, "paused")}>
                <Pause size={14} /> Pause
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (campaign.sequence.length === 0) {
                    showToast("Add at least one sequence step before activating");
                    return;
                  }
                  setStatus(campaign.id, "active");
                  enrollCampaign(campaign.id);
                }}
              >
                <Play size={14} /> Activate
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Prospects" value={String(campaign.prospects)} />
        <StatCard label="Sent" value={String(sent)} />
        <StatCard
          label="Opened"
          value={stats?.tracked ? "—" : rate(campaign.opened)}
          hint={stats?.tracked ? "Not tracked automatically" : `${campaign.opened} opens`}
        />
        <StatCard label="Replied" value={rate(replied)} hint={`${replied} replies`} />
        <StatCard label="Bounced" value={String(bounced)} />
        <StatCard label="Meetings" value={String(campaign.meetings)} />
      </div>

      <div className="mt-6">
        <Card className="p-6">
          <p className="mb-4 text-sm font-medium text-mist">Sequence</p>
          <SequenceBuilder
            initialSteps={campaign.sequence}
            onSave={(steps) => {
              updateSequence(campaign.id, steps);
              showToast("Sequence saved");
            }}
          />
        </Card>
      </div>

      <ProspectsTable campaign={campaign} />
    </div>
  );
}
