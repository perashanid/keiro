import { notFound } from "next/navigation";
import Link from "next/link";
import { getPersonById } from "@/lib/mock/people";
import { getCompanyById } from "@/lib/mock/companies";
import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { Badge, VerificationBadge, ScoreBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CompanyMark } from "@/components/company-row";
import { ComposeButton } from "@/components/outreach/compose-button";
import { OutreachHistory } from "@/components/outreach/outreach-history";
import { NotesAndTasks } from "@/components/crm/notes-and-tasks";
import { seniorityLabel } from "@/lib/format";
import { ListPlus } from "lucide-react";

function initials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase();
}

export default async function PersonProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = getPersonById(id);
  if (!person) notFound();
  const company = getCompanyById(person.companyId);

  return (
    <div>
      <PageHeader
        title={`${person.firstName} ${person.lastName}`}
        description={`${person.title}${company ? ` at ${company.name}` : ""}`}
        actions={
          <>
            <Button variant="secondary" size="sm">
              <ListPlus size={14} /> Add to list
            </Button>
            <ComposeButton
              recipient={{
                id: person.id,
                firstName: person.firstName,
                lastName: person.lastName,
                email: person.email,
                companyName: company?.name,
                title: person.title,
              }}
            />
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink-750 text-lg font-semibold text-slate-300">
                {initials(person.firstName, person.lastName)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2">
                  <Badge>{person.department}</Badge>
                  <Badge>{seniorityLabel[person.seniority]}</Badge>
                  <Badge>{person.location}</Badge>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between border-b border-ink-700 pb-3">
                    <span className="text-slate-400">Work email</span>
                    {person.email ? (
                      <span className="flex items-center gap-2 text-mist">
                        {person.email}
                        <VerificationBadge status={person.emailStatus} />
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-slate-500">
                        Not discovered
                        <VerificationBadge status={person.emailStatus} />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Direct phone</span>
                    <span className="text-slate-300">{person.phone ?? "Not available"}</span>
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs text-slate-400">Lead score</p>
                <div className="mt-1">
                  <ScoreBadge score={person.score} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <p className="mb-3 text-sm font-medium text-mist">Outreach history</p>
            <OutreachHistory personId={person.id} firstName={person.firstName} />
          </Card>

          <Card className="p-6">
            <NotesAndTasks relatedType="person" relatedId={person.id} />
          </Card>
        </div>

        <div className="space-y-6">
          {company && (
            <Card className="p-5">
              <p className="mb-3 text-sm font-medium text-mist">Company</p>
              <Link href={`/companies/${company.id}`} className="focus-ring -mx-2 flex items-center gap-3 rounded-sm px-2 py-1">
                <CompanyMark company={company} size={36} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-mist">{company.name}</p>
                  <p className="truncate text-xs text-slate-400">
                    {company.industry} · {company.city}
                  </p>
                </div>
              </Link>
            </Card>
          )}
          <Card className="p-5">
            <p className="mb-2 text-sm font-medium text-mist">Lists</p>
            <p className="text-sm text-slate-400">Not on any list yet.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
