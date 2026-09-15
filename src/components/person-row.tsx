import type { Person } from "@/lib/types";
import { VerificationBadge } from "@/components/ui/badge";
import { getCompanyById } from "@/lib/mock/companies";
import { cn } from "@/lib/cn";

function initials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase();
}

export function PersonRow({ person, className }: { person: Person; className?: string }) {
  const company = getCompanyById(person.companyId);
  return (
    <div className={cn("flex items-center gap-3 py-3", className)}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-750 text-xs font-semibold text-slate-300">
        {initials(person.firstName, person.lastName)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-mist">
          {person.firstName} {person.lastName}
        </p>
        <p className="truncate text-xs text-slate-400">
          {person.title} · {company?.name}
        </p>
      </div>
      <VerificationBadge status={person.emailStatus} />
    </div>
  );
}
