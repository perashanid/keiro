import { PageHeader } from "@/components/app/page-header";
import { CompaniesTable } from "@/components/companies/companies-table";
import { DiscoverPanel } from "@/components/companies/discover-panel";
import { listCompanies } from "@/lib/server/companies-db";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const companies = await listCompanies();

  return (
    <div>
      <PageHeader
        title="Companies"
        description="Search Bangladesh's business landscape by industry, division, and size."
      />
      <DiscoverPanel />
      <p className="mb-3 text-sm font-medium text-mist">Companies ({companies.length})</p>
      <CompaniesTable companies={companies} />
    </div>
  );
}
