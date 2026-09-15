"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useWorkspaceStore } from "./workspace";
import { useCrmStore } from "./crm";
import { getListById, resolveListPeople } from "@/lib/mock/lists";
import { getPersonById } from "@/lib/mock/people";
import { getCompanyById } from "@/lib/mock/companies";
import { substituteVariables } from "@/lib/templates";

export type EnrollmentStatus =
  | "pending"
  | "skipped_no_email"
  | "suppressed"
  | "stopped_replied"
  | "stopped_bounced"
  | "completed";

export interface Enrollment {
  id: string;
  campaignId: string;
  personId: string;
  stepIndex: number;
  status: EnrollmentStatus;
  /** How the most recent step was actually delivered — display-only, doesn't gate processing. */
  lastOutcome?: "sent" | "simulated";
  nextSendAt: number;
  lastActionAt?: number;
}

export interface SentEmail {
  id: string;
  campaignId: string;
  personId: string;
  stepId: string;
  subject: string;
  sentAt: number;
  simulated: boolean;
}

let counter = 0;
function nextId(prefix: string) {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}

function unsubscribeFooter(email: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `\n\n—\nUnsubscribe: ${origin}/api/unsubscribe?email=${encodeURIComponent(email)}`;
}

interface AutomationState {
  enrollments: Enrollment[];
  emails: SentEmail[];
  enrollCampaign: (campaignId: string) => void;
  processDue: () => Promise<void>;
  sendNow: (enrollmentId: string) => Promise<void>;
  markReplied: (enrollmentId: string) => void;
  markBounced: (enrollmentId: string) => void;
}

/**
 * Pure — callers select the raw `enrollments`/`emails` arrays reactively via
 * the store hook, then pass them here (typically in a `useMemo`). Never call
 * this from inside a zustand selector: it returns a new object every call,
 * which breaks useSyncExternalStore's reference-equality check and causes
 * an infinite render loop.
 */
export function computeCampaignStats(enrollments: Enrollment[], emails: SentEmail[], campaignId: string) {
  const campaignEnrollments = enrollments.filter((e) => e.campaignId === campaignId);
  const campaignEmails = emails.filter((e) => e.campaignId === campaignId);
  return {
    tracked: campaignEnrollments.length > 0,
    sent: campaignEmails.length,
    replied: campaignEnrollments.filter((e) => e.status === "stopped_replied").length,
    bounced: campaignEnrollments.filter((e) => e.status === "stopped_bounced").length,
  };
}

export const useAutomationStore = create<AutomationState>()(
  persist(
    (set, get) => {
      async function processOne(enrollmentId: string, gmailConnectedOverride?: boolean): Promise<"ok" | "limit" | "error"> {
        const enr = get().enrollments.find((e) => e.id === enrollmentId);
        if (!enr) return "error";
        const campaign = useWorkspaceStore.getState().getCampaign(enr.campaignId);
        const person = getPersonById(enr.personId);
        const step = campaign?.sequence[enr.stepIndex];
        if (!campaign || !person || !step) return "error";

        if (!person.email) {
          set((s) => ({
            enrollments: s.enrollments.map((e) =>
              e.id === enrollmentId ? { ...e, status: "skipped_no_email", lastActionAt: Date.now() } : e
            ),
          }));
          return "ok";
        }

        const company = getCompanyById(person.companyId);
        const recipient = {
          id: person.id,
          firstName: person.firstName,
          lastName: person.lastName,
          email: person.email,
          companyName: company?.name,
          title: person.title,
        };
        const subject = substituteVariables(step.subject, recipient);
        const message = substituteVariables(step.preview, recipient) + unsubscribeFooter(person.email);

        let gmailConnected = gmailConnectedOverride;
        if (gmailConnected === undefined) {
          try {
            const statusRes = await fetch("/api/gmail/status");
            const statusData = await statusRes.json();
            gmailConnected = Boolean(statusData.connected);
          } catch {
            gmailConnected = false;
          }
        }

        let simulated = true;

        if (gmailConnected) {
          try {
            const res = await fetch("/api/gmail/send", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ to: person.email, subject, message }),
            });
            if (res.ok) {
              simulated = false;
            } else if (res.status === 429) {
              return "limit";
            } else if (res.status === 403) {
              set((s) => ({
                enrollments: s.enrollments.map((e) =>
                  e.id === enrollmentId ? { ...e, status: "suppressed", lastActionAt: Date.now() } : e
                ),
              }));
              return "ok";
            } else {
              return "error";
            }
          } catch {
            return "error";
          }
        }

        const now = Date.now();
        set((s) => ({
          emails: [
            ...s.emails,
            { id: nextId("email"), campaignId: campaign.id, personId: person.id, stepId: step.id, subject, sentAt: now, simulated },
          ],
        }));

        const nextIndex = enr.stepIndex + 1;
        const nextStep = campaign.sequence[nextIndex];
        set((s) => ({
          enrollments: s.enrollments.map((e) =>
            e.id === enrollmentId
              ? nextStep
                ? {
                    ...e,
                    stepIndex: nextIndex,
                    status: "pending",
                    lastOutcome: simulated ? "simulated" : "sent",
                    nextSendAt: now + nextStep.delayDays * 86_400_000,
                    lastActionAt: now,
                  }
                : {
                    ...e,
                    status: "completed",
                    lastOutcome: simulated ? "simulated" : "sent",
                    lastActionAt: now,
                  }
              : e
          ),
        }));

        return "ok";
      }

      return {
        enrollments: [],
        emails: [],

        enrollCampaign: (campaignId) => {
          if (get().enrollments.some((e) => e.campaignId === campaignId)) return;
          const campaign = useWorkspaceStore.getState().getCampaign(campaignId);
          if (!campaign || !campaign.listId || campaign.sequence.length === 0) return;
          const list = getListById(campaign.listId);
          if (!list) return;
          const targets = resolveListPeople(list);
          const now = Date.now();
          set((state) => ({
            enrollments: [
              ...state.enrollments,
              ...targets.map((p) => ({
                id: nextId("enr"),
                campaignId,
                personId: p.id,
                stepIndex: 0,
                status: "pending" as EnrollmentStatus,
                nextSendAt: now,
              })),
            ],
          }));
        },

        processDue: async () => {
          const due = get().enrollments.filter((e) => e.status === "pending" && e.nextSendAt <= Date.now());
          if (due.length === 0) return;
          let gmailConnected: boolean;
          try {
            const res = await fetch("/api/gmail/status");
            gmailConnected = Boolean((await res.json()).connected);
          } catch {
            gmailConnected = false;
          }
          for (const enr of due) {
            const result = await processOne(enr.id, gmailConnected);
            if (result === "limit") break;
          }
        },

        sendNow: async (enrollmentId) => {
          await processOne(enrollmentId);
        },

        markReplied: (enrollmentId) => {
          const enr = get().enrollments.find((e) => e.id === enrollmentId);
          set((state) => ({
            enrollments: state.enrollments.map((e) =>
              e.id === enrollmentId ? { ...e, status: "stopped_replied", lastActionAt: Date.now() } : e
            ),
          }));
          if (enr) {
            const lead = useCrmStore.getState().getLead(enr.personId);
            if (lead.stage === "new" || lead.stage === "contacted") {
              useCrmStore.getState().setLeadStage(enr.personId, "engaged");
            }
          }
        },

        markBounced: (enrollmentId) =>
          set((state) => ({
            enrollments: state.enrollments.map((e) =>
              e.id === enrollmentId ? { ...e, status: "stopped_bounced", lastActionAt: Date.now() } : e
            ),
          })),
      };
    },
    { name: "keiro-automation" }
  )
);
