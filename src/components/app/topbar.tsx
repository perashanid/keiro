import { Search } from "lucide-react";

export function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-4 border-b border-ink-700 px-6">
      <div className="focus-ring hidden h-9 w-64 items-center gap-2 rounded-[var(--radius-sm)] border border-ink-700 px-3 text-sm text-slate-400 sm:flex">
        <Search size={14} />
        <span>Search companies, people…</span>
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-750 text-xs font-medium text-slate-300">
        TR
      </div>
    </header>
  );
}
