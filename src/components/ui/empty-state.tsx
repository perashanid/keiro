import { RoutePath } from "@/components/brand/route-path";
import { LinkButton } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-ink-700 px-8 py-16 text-center">
      <RoutePath className="mb-6 max-w-[220px] opacity-70" />
      <h3 className="font-display text-xl text-ivory">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-400">{description}</p>
      {ctaLabel && ctaHref && (
        <LinkButton href={ctaHref} className="mt-6">
          {ctaLabel}
        </LinkButton>
      )}
    </div>
  );
}
