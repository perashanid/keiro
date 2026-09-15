"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SequenceBuilder } from "@/components/campaigns/sequence-builder";
import { useWorkspaceStore } from "@/lib/store/workspace";
import { useAutomationStore } from "@/lib/store/automation";
import { lists, resolveListPeople } from "@/lib/mock/lists";
import type { SequenceStep } from "@/lib/types";

function NewCampaignForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselected = searchParams.get("list");
  const createCampaign = useWorkspaceStore((s) => s.createCampaign);
  const updateSequence = useWorkspaceStore((s) => s.updateSequence);
  const setStatus = useWorkspaceStore((s) => s.setStatus);
  const enrollCampaign = useAutomationStore((s) => s.enrollCampaign);

  const [listId, setListId] = useState(preselected ?? lists[0]?.id ?? "");
  const selectedList = lists.find((l) => l.id === listId);
  const [name, setName] = useState(selectedList ? `${selectedList.name} outreach` : "New campaign");
  const [steps, setSteps] = useState<SequenceStep[]>([]);

  function launch() {
    const prospectCount = selectedList ? resolveListPeople(selectedList).length : 0;
    const campaign = createCampaign({
      name: name.trim() || "Untitled campaign",
      listId: selectedList?.id,
      listName: selectedList?.name ?? "No list selected",
      prospects: prospectCount,
    });
    if (steps.length > 0) {
      updateSequence(campaign.id, steps);
      setStatus(campaign.id, "active");
      enrollCampaign(campaign.id);
    }
    router.push(`/campaigns/${campaign.id}`);
  }

  return (
    <div>
      <PageHeader title="New campaign" description="Choose a list and build the sequence prospects will receive." />

      <Card className="mb-6 space-y-4 p-6">
        <div>
          <label className="mb-1.5 block text-xs text-slate-400">Campaign name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="focus-ring h-10 w-full max-w-md rounded-[var(--radius-sm)] border border-ink-700 bg-ink-900 px-3 text-sm text-mist"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-slate-400">List</label>
          <select
            value={listId}
            onChange={(e) => {
              setListId(e.target.value);
              const l = lists.find((x) => x.id === e.target.value);
              if (l) setName(`${l.name} outreach`);
            }}
            className="focus-ring h-10 w-full max-w-md rounded-[var(--radius-sm)] border border-ink-700 bg-ink-900 px-3 text-sm text-mist"
          >
            {lists.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} · {l.itemCount} items
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="p-6">
        <p className="mb-4 text-sm font-medium text-mist">Sequence</p>
        {steps.length === 0 && (
          <p className="mb-4 text-sm text-slate-400">Add at least one step to activate this campaign on launch — or launch as a draft and build it later.</p>
        )}
        <SequenceBuilder initialSteps={steps} onSave={setSteps} />
      </Card>

      <div className="mt-6 flex justify-end">
        <Button onClick={launch}>Launch campaign</Button>
      </div>
    </div>
  );
}

export default function NewCampaignPage() {
  return (
    <Suspense fallback={null}>
      <NewCampaignForm />
    </Suspense>
  );
}
