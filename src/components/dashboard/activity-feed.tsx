import { Card } from "@/components/ui/card";
import type { ActivityItem } from "@/lib/types";
import { UserPlus, Send, ShieldCheck, Compass, CheckSquare } from "lucide-react";

const iconByKind: Record<ActivityItem["kind"], React.ComponentType<{ size?: number; className?: string }>> = {
  prospect: UserPlus,
  campaign: Send,
  enrichment: ShieldCheck,
  discovery: Compass,
  task: CheckSquare,
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.round(diffMs / 3_600_000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="p-5">
      <p className="mb-4 text-sm font-medium text-mist">Recent activity</p>
      <ul className="space-y-4">
        {items.map((item) => {
          const Icon = iconByKind[item.kind];
          return (
            <li key={item.id} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-750 text-slate-300">
                <Icon size={14} />
              </div>
              <p className="text-sm leading-5 text-slate-300">
                <span className="text-mist">{item.actor}</span> {item.action}{" "}
                <span className="text-mist">{item.target}</span>
              </p>
              <span className="ml-auto shrink-0 text-xs text-slate-500">{timeAgo(item.timestamp)}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
