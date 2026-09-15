import { notFound } from "next/navigation";
import { getListById, resolveListPeople } from "@/lib/mock/lists";
import { resolveListCompanies } from "@/lib/server/lists-db";
import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { CompanyRow } from "@/components/company-row";
import { PersonRow } from "@/components/person-row";
import { Megaphone } from "lucide-react";

export default async function ListDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const list = getListById(id);
  if (!list) notFound();

  const sampleCompanies = await resolveListCompanies(list);
  const samplePeople = list.kind === "companies" ? [] : resolveListPeople(list);

  return (
    <div>
      <PageHeader
        title={list.name}
        description={list.description}
        actions={
          <LinkButton href={`/campaigns/new?list=${list.id}`} size="sm">
            <Megaphone size={14} /> Start campaign
          </LinkButton>
        }
      />
      <div className="mb-6 flex flex-wrap gap-1.5">
        {list.tags.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>

      {sampleCompanies.length > 0 && (
        <Card className="mb-6 divide-y divide-ink-700 p-5">
          {sampleCompanies.map((c) => (
            <CompanyRow key={c.id} company={c} />
          ))}
        </Card>
      )}

      {samplePeople.length > 0 && (
        <Card className="divide-y divide-ink-700 p-5">
          {samplePeople.map((p) => (
            <PersonRow key={p.id} person={p} />
          ))}
        </Card>
      )}
    </div>
  );
}
