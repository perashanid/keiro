import Image from "next/image";
import { cn } from "@/lib/cn";

/** The Keiro badge mark — provided brand asset, not to be redrawn. */
export function RouteMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/brand/mark.png"
      alt="Keiro"
      width={size}
      height={size}
      className={cn("rounded-full", className)}
      priority
    />
  );
}

/** Full lockup: mark + wordmark, for nav and auth surfaces. */
export function RouteLockup({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <RouteMark size={size} />
      <span className="text-lg font-semibold tracking-tight text-ivory">keiro</span>
    </span>
  );
}
