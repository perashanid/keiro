-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "legalName" TEXT,
    "website" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "sector" TEXT,
    "division" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "employeeRange" TEXT,
    "employeeCount" INTEGER,
    "revenueRange" TEXT,
    "foundedYear" INTEGER,
    "businessType" TEXT,
    "description" TEXT,
    "products" TEXT,
    "technologies" TEXT,
    "growthSignals" TEXT,
    "score" INTEGER,
    "logoInitials" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'curated',
    "placeId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PlacesSearchCache" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sector" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "companyIds" TEXT NOT NULL,
    "fetchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_placeId_key" ON "Company"("placeId");

-- CreateIndex
CREATE INDEX "Company_industry_idx" ON "Company"("industry");

-- CreateIndex
CREATE INDEX "Company_division_idx" ON "Company"("division");

-- CreateIndex
CREATE UNIQUE INDEX "PlacesSearchCache_sector_location_key" ON "PlacesSearchCache"("sector", "location");
