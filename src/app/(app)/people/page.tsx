import { PageHeader } from "@/components/app/page-header";
import { PeopleTable } from "@/components/people/people-table";
import { EmptyState } from "@/components/ui/empty-state";
import { people } from "@/lib/mock/people";

export default function PeoplePage() {
  return (
    <div>
      <PageHeader
        title="People"
        description="Find decision-makers by title, seniority, and department."
      />
      {people.length === 0 ? (
        <EmptyState
          title="No contacts yet"
          description="Keiro doesn't invent decision-makers for real companies. Connect a contact-enrichment provider, or import contacts you already have the rights to use, to populate this."
          ctaLabel="Go to Integrations"
          ctaHref="/integrations"
        />
      ) : (
        <PeopleTable people={people} />
      )}
    </div>
  );
}
