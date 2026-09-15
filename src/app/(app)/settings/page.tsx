"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { team } from "@/lib/mock/team";

interface Limits {
  sentToday: number;
  dailyLimit: number;
  suppressed: number;
}

export default function SettingsPage() {
  const [limits, setLimits] = useState<Limits | null>(null);

  useEffect(() => {
    fetch("/api/gmail/limits")
      .then((res) => res.json())
      .then(setLimits)
      .catch(() => setLimits(null));
  }, []);

  return (
    <div className="max-w-3xl">
      <PageHeader title="Settings" description="Manage your workspace, team, and account." />

      <Card className="mb-6 p-6">
        <p className="text-sm font-medium text-mist">Workspace</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-400">Workspace name</p>
            <p className="mt-1 text-sm text-mist">Keiro Demo Workspace</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Plan</p>
            <p className="mt-1 text-sm text-mist">Growth</p>
          </div>
        </div>
      </Card>

      <Card className="mb-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-mist">Team members</p>
          <Button variant="secondary" size="sm">
            Invite member
          </Button>
        </div>
        <div className="divide-y divide-ink-700">
          {team.map((m) => (
            <div key={m.email} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm text-mist">{m.name}</p>
                <p className="text-xs text-slate-400">{m.email}</p>
              </div>
              <Badge>{m.role}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <p className="text-sm font-medium text-mist">Sending safety</p>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Daily sending limit</span>
            <span className="text-mist">
              {limits ? `${limits.sentToday} / ${limits.dailyLimit} sent today` : "300 emails / account / day"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Suppression list</span>
            <span className="text-mist">{limits ? `${limits.suppressed} addresses` : "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Unsubscribe link</span>
            <span className="text-mist">Included on all sequence emails</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
