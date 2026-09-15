import Link from "next/link";
import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { lists } from "@/lib/mock/lists";
import { Plus } from "lucide-react";

export default function ListsPage() {
  return (
    <div>
      <PageHeader
        title="Lists"
        description="Organize companies and people into working sets you can enrich, verify, or run campaigns against."
        actions={
          <Button size="sm">
            <Plus size={14} /> New list
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lists.map((l) => (
          <Link key={l.id} href={`/lists/${l.id}`} className="focus-ring block rounded-[var(--radius-lg)]">
            <Card className="h-full p-5">
              <p className="text-sm font-medium text-mist">{l.name}</p>
              <p className="mt-1 text-xs text-slate-400">{l.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {l.tags.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>{l.itemCount} items</span>
                <span>Updated {l.updatedAt}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
