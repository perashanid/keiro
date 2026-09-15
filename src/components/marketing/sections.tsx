import { Card } from "@/components/ui/card";
import { CompanyRow } from "@/components/company-row";
import { Badge, VerificationBadge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { JourneyGraphic } from "@/components/marketing/journey-graphic";
import { RoutePath } from "@/components/brand/route-path";
import { companies } from "@/lib/mock/companies";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-20 sm:pt-28">
      <div className="max-w-2xl">
        <p className="text-sm text-slate-400">経路 · Find. Connect. Grow.</p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-ivory sm:text-6xl">
          Find the businesses that matter. Reach the people who decide.
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-7 text-slate-300">
          Keiro maps Bangladesh&apos;s business landscape — companies,
          decision-makers, and the route between them — so your team spends
          time on conversations, not searches.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/dashboard">Start prospecting</LinkButton>
          <LinkButton href="#discovery" variant="secondary">
            Explore the platform
          </LinkButton>
        </div>
      </div>
      <div className="mt-16 rounded-[var(--radius-lg)] border border-ink-700 bg-ink-900/60 p-8">
        <JourneyGraphic />
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-xl">
      <p className="text-sm text-slate-400">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl text-ivory sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-300">{description}</p>
    </div>
  );
}

export function DiscoverySection() {
  const results = [companies[10], companies[11], companies[0]];
  return (
    <section id="discovery" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid items-center gap-12 [&>*]:min-w-0 lg:grid-cols-2">
        <SectionHeading
          eyebrow="Discovery"
          title="Find the companies that fit your market"
          description="Filter by industry, division, employee count, and business type to narrow Bangladesh's company landscape down to the accounts worth your team's time."
        />
        <Card className="p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge>Manufacturing</Badge>
            <Badge>Dhaka</Badge>
            <Badge>1,000+ employees</Badge>
          </div>
          <div className="divide-y divide-ink-700">
            {results.map((c) => (
              <CompanyRow key={c.id} company={c} />
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

export function IntelligenceSection() {
  const company = companies[1];
  return (
    <section className="border-t border-ink-700 bg-ink-900/40">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 [&>*]:min-w-0 lg:grid-cols-2">
        <Card className="order-2 p-6 lg:order-1">
          <p className="text-sm font-medium text-mist">{company.name}</p>
          <p className="text-xs text-slate-400">{company.website}</p>
          <p className="mt-4 text-sm leading-6 text-slate-300">{company.description}</p>
          <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-400">Employees</p>
              <p className="text-mist">{company.employeeRange}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Founded</p>
              <p className="text-mist">{company.foundedYear}</p>
            </div>
          </div>
          <div className="mt-5">
            <p className="text-xs text-slate-400">Products &amp; services</p>
            <ul className="mt-2 space-y-1.5">
              {(company.products ?? []).map((s) => (
                <li key={s} className="text-sm text-slate-300">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </Card>
        <div className="order-1 lg:order-2">
          <SectionHeading
            eyebrow="Intelligence"
            title="Understand a business before you reach out"
            description="Every company profile brings together products, technologies, and growth signals — so the first message you send already shows you did the work."
          />
        </div>
      </div>
    </section>
  );
}

export function PeopleSection() {
  // Illustrative roles only — no invented names. Keiro doesn't fabricate
  // contacts for real companies (see src/lib/mock/people.ts).
  const roles = [
    { title: "Managing Director", company: companies[0] },
    { title: "Head of Procurement", company: companies[10] },
    { title: "VP, Business Development", company: companies[4] },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid items-center gap-12 [&>*]:min-w-0 lg:grid-cols-2">
        <SectionHeading
          eyebrow="People"
          title="Find the people who decide"
          description="Search by title, seniority, and department to surface the decision-makers behind each company — with a clear read on how confident we are in each email."
        />
        <Card className="divide-y divide-ink-700 p-5">
          {roles.map((r) => (
            <div key={r.title} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-mist">{r.title}</p>
                <p className="text-xs text-slate-400">{r.company.name}</p>
              </div>
              <Badge>Role to find</Badge>
            </div>
          ))}
        </Card>
      </div>
    </section>
  );
}

export function EnrichmentSection() {
  return (
    <section className="border-t border-ink-700 bg-ink-900/40">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 [&>*]:min-w-0 lg:grid-cols-2">
        <Card className="order-2 p-6 lg:order-1">
          <p className="text-xs text-slate-400">Example contact record</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-ink-700 pb-3">
              <span className="text-slate-400">Title</span>
              <span className="text-mist">Head of Procurement</span>
            </div>
            <div className="flex items-center justify-between border-b border-ink-700 pb-3">
              <span className="text-slate-400">Work email</span>
              <span className="flex items-center gap-2 text-mist">
                procurement@example-co.com <VerificationBadge status="likely" />
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Direct phone</span>
              <span className="text-slate-500">Not available</span>
            </div>
          </div>
        </Card>
        <div className="order-1 lg:order-2">
          <SectionHeading
            eyebrow="Enrichment"
            title="Fill in what's missing, honestly"
            description="Keiro enriches company and contact records with the fields your outreach needs — and never dresses up a guess as a fact. Uncertain data stays labeled uncertain."
          />
        </div>
      </div>
    </section>
  );
}

export function OutreachSection() {
  return (
    <section id="outreach" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid items-center gap-12 [&>*]:min-w-0 lg:grid-cols-2">
        <SectionHeading
          eyebrow="Outreach"
          title="Connect Gmail. Send without leaving Keiro."
          description="Compose individual or bulk emails with live personalization, then track opens, clicks, and replies against the same prospect record you started from."
        />
        <Card className="p-6">
          <div className="flex items-center justify-between border-b border-ink-700 pb-4">
            <div>
              <p className="text-sm font-medium text-mist">Gmail account</p>
              <p className="text-xs text-slate-400">tasnim@yourcompany.com</p>
            </div>
            <Badge tone="success">Connected</Badge>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <p className="text-slate-400">Subject</p>
            <p className="rounded-[var(--radius-sm)] border border-ink-700 px-3 py-2 text-mist">
              Faster customs clearance for {"{{company_name}}"}?
            </p>
            <p className="mt-3 text-slate-400">Preview</p>
            <p className="rounded-[var(--radius-sm)] border border-ink-700 px-3 py-2 text-slate-300">
              Hi {"{{first_name}}"}, noticed {"{{company_name}}"} clears freight through
              Chattogram — wanted to share how we&apos;ve cut clearance time for a few similar
              exporters…
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}

export function AutomationSection() {
  const steps = [
    { label: "Initial email", detail: "Sent immediately" },
    { label: "Wait 3 days", detail: "" },
    { label: "Follow-up", detail: "Skips if replied" },
    { label: "Wait 4 days", detail: "" },
    { label: "Final follow-up", detail: "Sequence ends after this step" },
  ];
  return (
    <section className="border-t border-ink-700 bg-ink-900/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow="Automation"
          title="Sequences that stop the moment someone replies"
          description="Build a short series of follow-ups with delays between each step. Keiro pauses the sequence automatically on reply, bounce, or unsubscribe."
        />
        <div className="mt-10 flex flex-col gap-0 sm:flex-row sm:items-start sm:gap-4">
          {steps.map((s, i) => (
            <div key={s.label} className="flex flex-1 items-start gap-3 sm:flex-col sm:gap-2">
              <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
                <span
                  className={
                    "flex h-7 w-7 items-center justify-center rounded-full border text-xs " +
                    (i % 2 === 0
                      ? "border-ivory/40 text-ivory"
                      : "border-slate-600 text-slate-400")
                  }
                >
                  {i + 1}
                </span>
              </div>
              <div className="pb-6 sm:pb-0">
                <p className="text-sm font-medium text-mist">{s.label}</p>
                {s.detail && <p className="text-xs text-slate-400">{s.detail}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AnalyticsSection() {
  const stats = [
    { label: "Companies discovered", value: "4,820" },
    { label: "Verified emails", value: "9,140" },
    { label: "Reply rate", value: "11.2%" },
    { label: "Meetings booked", value: "38" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Analytics"
        title="See what's working, at a glance"
        description="Track prospecting and outreach performance together — from companies discovered to meetings booked — with the time range that matters to you."
      />
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-xs text-slate-400">{s.label}</p>
            <p className="mt-2 font-display text-2xl text-ivory">{s.value}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function BangladeshSection() {
  const divisions = ["Dhaka", "Chattogram", "Khulna", "Rajshahi", "Sylhet", "Barishal", "Rangpur", "Mymensingh"];
  return (
    <section id="bangladesh" className="border-t border-ink-700 bg-ink-900/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 [&>*]:min-w-0 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Bangladesh"
            title="Built for how business actually happens here"
            description="Keiro starts with Bangladesh: local business types, divisions and districts, and the sectors that define the economy — garments, logistics, fintech, pharma, and more. The same architecture is built to extend beyond it."
          />
          <div className="flex flex-wrap content-start gap-2">
            {divisions.map((d) => (
              <Badge key={d}>{d}</Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ClosingCtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 text-center">
      <RoutePath className="mx-auto mb-8 max-w-xs opacity-80" />
      <h2 className="font-display text-3xl text-ivory sm:text-4xl">
        Find your route to the right customer.
      </h2>
      <div className="mt-8 flex justify-center">
        <LinkButton href="/dashboard">Start prospecting</LinkButton>
      </div>
    </section>
  );
}
