import { notFound } from "next/navigation";
import Link from "next/link";
import { getCompanyByIdDb, listCompanies } from "@/lib/server/companies-db";
import { getPeopleByCompany } from "@/lib/mock/people";
import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { Badge, ScoreBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CompanyMark } from "@/components/company-row";
import { PersonRow } from "@/components/person-row";
import { NotesAndTasks } from "@/components/crm/notes-and-tasks";
import { ListPlus, ShieldCheck, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CompanyProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getCompanyByIdDb(id);
  if (!company) notFound();

  const companyPeople = getPeopleByCompany(company.id);
  const allCompanies = await listCompanies();
  const related = allCompanies.filter((c) => c.id !== company.id && c.industry === company.industry).slice(0, 3);

  const websiteHref = company.website.startsWith("http") ? company.website : `https://${company.website}`;

  return (
    <div>
      <PageHeader
        title={company.name}
        actions={
          <>
            <Button variant="secondary" size="sm">
              <ListPlus size={14} /> Add to list
            </Button>
            <Button variant="secondary" size="sm">
              <ShieldCheck size={14} /> Enrich
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <CompanyMark company={company} size={48} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={websiteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring flex items-center gap-1 text-sm text-slate-400 hover:text-mist"
                  >
                    {company.website} <ExternalLink size={12} />
                  </a>
                  {company.source === "google_places" && <Badge tone="accent">Live · Google Places</Badge>}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {company.description ?? "No description available yet."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>{company.industry}</Badge>
                  <Badge>{company.city}, {company.division}</Badge>
                  {company.employeeRange && <Badge>{company.employeeRange} employees</Badge>}
                  {company.businessType && <Badge>{company.businessType}</Badge>}
                  {company.foundedYear && <Badge>Founded {company.foundedYear}</Badge>}
                </div>
              </div>
              {company.score !== undefined && (
                <div className="shrink-0 text-right">
                  <p className="text-xs text-slate-400">ICP score</p>
                  <div className="mt-1">
                    <ScoreBadge score={company.score} />
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-medium text-mist">Intelligence</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-400">Products &amp; services</p>
                {company.products && company.products.length > 0 ? (
                  <ul className="mt-2 space-y-1 text-sm text-slate-300">
                    {company.products.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">Not available</p>
                )}
              </div>
              <div>
                <p className="text-xs text-slate-400">Technologies</p>
                {company.technologies && company.technologies.length > 0 ? (
                  <ul className="mt-2 space-y-1 text-sm text-slate-300">
                    {company.technologies.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">Not available</p>
                )}
              </div>
              <div>
                <p className="text-xs text-slate-400">Growth signals</p>
                {company.growthSignals && company.growthSignals.length > 0 ? (
                  <ul className="mt-2 space-y-1 text-sm text-slate-300">
                    {company.growthSignals.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">Not available</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-mist">People ({companyPeople.length})</p>
              <Link href={`/people?company=${company.id}`} className="focus-ring rounded-sm text-xs text-slate-400 hover:text-mist">
                View all
              </Link>
            </div>
            {companyPeople.length > 0 ? (
              <div className="divide-y divide-ink-700">
                {companyPeople.map((p) => (
                  <Link
                    key={p.id}
                    href={`/people/${p.id}`}
                    className="focus-ring -mx-2 block rounded-sm px-2"
                  >
                    <PersonRow person={p} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No decision-makers discovered yet.</p>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <p className="text-sm font-medium text-mist">Related companies</p>
            {related.length > 0 ? (
              <div className="mt-3 divide-y divide-ink-700">
                {related.map((c) => (
                  <Link key={c.id} href={`/companies/${c.id}`} className="focus-ring -mx-2 block rounded-sm px-2 py-3">
                    <p className="text-sm font-medium text-mist">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.city}, {c.division}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-400">No related companies found.</p>
            )}
          </Card>

          <Card className="p-5">
            <NotesAndTasks relatedType="company" relatedId={company.id} />
          </Card>
        </div>
      </div>
    </div>
  );
}
