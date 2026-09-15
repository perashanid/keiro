import { cn } from "@/lib/cn";

/**
 * Abstract route motif — a single winding line from origin to destination.
 * Used sparingly: empty states, journey dividers. Not the logo itself.
 */
export function RoutePath({
  className,
  stops = 3,
}: {
  className?: string;
  stops?: number;
}) {
  const dotPositions = [
    { x: 24, y: 92 },
    { x: 150, y: 40 },
    { x: 276, y: 92 },
  ].slice(0, stops);

  return (
    <svg
      viewBox="0 0 300 120"
      fill="none"
      className={cn("w-full", className)}
      aria-hidden="true"
    >
      <path
        d="M12 100C60 100 70 40 120 40C170 40 150 92 200 92C240 92 250 30 288 30"
        stroke="var(--slate-500)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {dotPositions.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={i === dotPositions.length - 1 ? 5 : 3.5}
          fill={i === dotPositions.length - 1 ? "var(--ivory)" : "var(--slate-400)"}
        />
      ))}
    </svg>
  );
}
