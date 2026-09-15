import { PrismaClient } from "@prisma/client";
import { companies } from "../src/lib/mock/companies";

const prisma = new PrismaClient();

async function main() {
  for (const c of companies) {
    const data = {
      name: c.name,
      legalName: c.legalName ?? null,
      website: c.website,
      domain: c.domain,
      industry: c.industry,
      sector: c.sector ?? null,
      division: c.division,
      city: c.city,
      employeeRange: c.employeeRange ?? null,
      employeeCount: c.employeeCount ?? null,
      revenueRange: c.revenueRange ?? null,
      foundedYear: c.foundedYear ?? null,
      businessType: c.businessType ?? null,
      description: c.description ?? null,
      products: c.products ? JSON.stringify(c.products) : null,
      technologies: c.technologies ? JSON.stringify(c.technologies) : null,
      growthSignals: c.growthSignals ? JSON.stringify(c.growthSignals) : null,
      score: c.score ?? null,
      logoInitials: c.logoInitials,
      source: "curated",
    };
    await prisma.company.upsert({
      where: { id: c.id },
      create: { id: c.id, ...data },
      update: data,
    });
  }
  console.log(`Seeded ${companies.length} curated companies.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
