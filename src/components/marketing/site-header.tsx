import Link from "next/link";
import { RouteLockup } from "@/components/brand/route-mark";
import { LinkButton } from "@/components/ui/button";

const navLinks = [
  { href: "#discovery", label: "Discovery" },
  { href: "#outreach", label: "Outreach" },
  { href: "#bangladesh", label: "Bangladesh" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-700 bg-ink-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="focus-ring rounded-sm">
          <RouteLockup />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="focus-ring rounded-sm text-sm text-slate-300 hover:text-mist"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LinkButton href="/dashboard" variant="ghost" size="sm">
            Log in
          </LinkButton>
          <LinkButton href="/dashboard" size="sm">
            Start prospecting
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
