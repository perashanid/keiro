import { cn } from "@/lib/cn";
import type { VerificationStatus, LeadStage, CampaignStatus } from "@/lib/types";

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "success" | "warn" | "danger" | "accent";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-ink-750 text-slate-300 border-slate-600",
    success: "bg-success/10 text-success border-success/30",
    warn: "bg-warn/10 text-warn border-warn/30",
    danger: "bg-danger/10 text-danger border-danger/30",
    accent: "bg-ivory/10 text-ivory border-ivory/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

const verificationTone: Record<VerificationStatus, "success" | "warn" | "neutral" | "danger"> = {
  verified: "success",
  likely: "warn",
  unknown: "neutral",
  invalid: "danger",
};

const verificationLabel: Record<VerificationStatus, string> = {
  verified: "Verified",
  likely: "Likely",
  unknown: "Unknown",
  invalid: "Invalid",
};

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  return <Badge tone={verificationTone[status]}>{verificationLabel[status]}</Badge>;
}

const stageLabel: Record<LeadStage, string> = {
  new: "New",
  contacted: "Contacted",
  engaged: "Engaged",
  qualified: "Qualified",
  opportunity: "Opportunity",
  customer: "Customer",
};

export function StageBadge({ stage }: { stage: LeadStage }) {
  return <Badge tone={stage === "customer" ? "success" : stage === "opportunity" ? "accent" : "neutral"}>{stageLabel[stage]}</Badge>;
}

const campaignTone: Record<CampaignStatus, "success" | "warn" | "neutral" | "accent"> = {
  draft: "neutral",
  scheduled: "warn",
  active: "success",
  paused: "warn",
  completed: "accent",
};

const campaignLabel: Record<CampaignStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  active: "Active",
  paused: "Paused",
  completed: "Completed",
};

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  return <Badge tone={campaignTone[status]}>{campaignLabel[status]}</Badge>;
}

export function ScoreBadge({ score }: { score: number }) {
  const tone = score >= 80 ? "success" : score >= 55 ? "warn" : "neutral";
  return <Badge tone={tone}>{score}</Badge>;
}
