import { cn } from "@/lib/cn";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const base =
  "focus-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] font-medium transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-ivory text-ink-950 hover:bg-ivory-dim",
  secondary: "border border-slate-600 text-mist hover:border-slate-400 hover:bg-ink-800",
  ghost: "text-mist-dim hover:text-mist hover:bg-ink-800",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}

/** For hrefs the Next router shouldn't handle client-side, e.g. API routes that redirect. */
export function AnchorButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </a>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </Link>
  );
}
