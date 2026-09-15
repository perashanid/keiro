import type { Company } from "@/lib/types";
import { ScoreBadge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

export function CompanyMark({ company, size = 36 }: { company: Company; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-ink-750 text-xs font-semibold text-slate-300"
      style={{ width: size, height: size }}
    >
      {company.logoInitials}
    </div>
  );
}

export function CompanyRow({
  company,
  compact = false,
  className,
}: {
  company: Company;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 py-3", className)}>
      <CompanyMark company={company} size={compact ? 32 : 36} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-mist">{company.name}</p>
        {!compact && (
          <p className="truncate text-xs text-slate-400">
            {company.industry} · {company.city}, {company.division}
          </p>
        )}
      </div>
      {!compact && (
        <div className="hidden shrink-0 text-xs text-slate-400 sm:block">
          {company.employeeRange ?? "—"}
        </div>
      )}
      {company.score !== undefined ? (
        <ScoreBadge score={company.score} />
      ) : (
        <span className="text-xs text-slate-500">—</span>
      )}
    </div>
  );
}
