"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Building2,
  Users,
  ListChecks,
  Target,
  Megaphone,
  Inbox,
  Workflow,
  BarChart3,
  Plug,
  Code2,
  Settings,
} from "lucide-react";
import { RouteLockup } from "@/components/brand/route-mark";
import { cn } from "@/lib/cn";

const items = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/search", label: "Search", icon: Search },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/people", label: "People", icon: Users },
  { href: "/lists", label: "Lists", icon: ListChecks },
  { href: "/leads", label: "Leads", icon: Target },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/sequences", label: "Sequences", icon: Workflow },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

const platformItems = [
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/api", label: "API", icon: Code2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "focus-ring flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-sm transition-colors",
        active
          ? "bg-ink-750 text-ivory"
          : "text-slate-400 hover:bg-ink-800 hover:text-mist"
      )}
    >
      <Icon size={17} />
      {label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="scroll-thin flex h-screen w-60 shrink-0 flex-col overflow-y-auto border-r border-ink-700 bg-ink-900 px-3 py-4">
      <Link href="/dashboard" className="focus-ring mb-6 block rounded-sm px-2">
        <RouteLockup />
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={pathname === item.href || pathname.startsWith(item.href + "/")}
          />
        ))}
      </nav>
      <div className="mt-4 flex flex-col gap-1 border-t border-ink-700 pt-4">
        {platformItems.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={pathname === item.href || pathname.startsWith(item.href + "/")}
          />
        ))}
      </div>
    </aside>
  );
}
