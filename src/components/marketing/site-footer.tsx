import { RouteLockup } from "@/components/brand/route-mark";

const columns = [
  {
    title: "Product",
    links: ["Company search", "People search", "Enrichment", "Sequences", "Analytics"],
  },
  {
    title: "Platform",
    links: ["Integrations", "API", "Security", "Status"],
  },
  {
    title: "Company",
    links: ["About", "Bangladesh", "Contact"],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-700">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <RouteLockup />
            <p className="mt-4 max-w-xs text-sm text-slate-400">
              Find. Connect. Grow. — a business intelligence and outreach
              platform for the Bangladesh B2B market.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-medium text-mist">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <span className="text-sm text-slate-400 hover:text-mist">{link}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-ink-700 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Keiro. 経路 — route, path, course, way.</p>
          <p>Dhaka, Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}
