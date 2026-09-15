import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import {
  HeroSection,
  DiscoverySection,
  IntelligenceSection,
  PeopleSection,
  EnrichmentSection,
  OutreachSection,
  AutomationSection,
  AnalyticsSection,
  BangladeshSection,
  ClosingCtaSection,
} from "@/components/marketing/sections";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <DiscoverySection />
        <IntelligenceSection />
        <PeopleSection />
        <EnrichmentSection />
        <OutreachSection />
        <AutomationSection />
        <AnalyticsSection />
        <BangladeshSection />
        <ClosingCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
