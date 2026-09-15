"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { campaigns as initialCampaigns } from "@/lib/mock/campaigns";
import type { Campaign, SequenceStep, CampaignStatus } from "@/lib/types";

interface WorkspaceState {
  campaigns: Campaign[];
  getCampaign: (id: string) => Campaign | undefined;
  updateSequence: (campaignId: string, steps: SequenceStep[]) => void;
  setStatus: (campaignId: string, status: CampaignStatus) => void;
  createCampaign: (input: { name: string; listId?: string; listName: string; prospects: number }) => Campaign;
}

let idCounter = 0;

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      campaigns: initialCampaigns,
      getCampaign: (id) => get().campaigns.find((c) => c.id === id),
      updateSequence: (campaignId, steps) =>
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === campaignId ? { ...c, sequence: steps } : c
          ),
        })),
      setStatus: (campaignId, status) =>
        set((state) => ({
          campaigns: state.campaigns.map((c) => (c.id === campaignId ? { ...c, status } : c)),
        })),
      createCampaign: (input) => {
        idCounter += 1;
        const campaign: Campaign = {
          id: `cmp-new-${idCounter}`,
          name: input.name,
          status: "draft",
          listId: input.listId,
          listName: input.listName,
          prospects: input.prospects,
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          replied: 0,
          bounced: 0,
          meetings: 0,
          createdAt: new Date().toISOString().slice(0, 10),
          sequence: [],
        };
        set((state) => ({ campaigns: [campaign, ...state.campaigns] }));
        return campaign;
      },
    }),
    { name: "keiro-workspace" }
  )
);
