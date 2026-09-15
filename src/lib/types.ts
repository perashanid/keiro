// Core domain types for Keiro.
// This mirrors the intended Postgres schema (see /docs data model). All data
// returned by src/lib/mock is illustrative demo data, not live records.

export type VerificationStatus = "verified" | "likely" | "unknown" | "invalid";

export type LeadStage =
  | "new"
  | "contacted"
  | "engaged"
  | "qualified"
  | "opportunity"
  | "customer";

export type CampaignStatus = "draft" | "scheduled" | "active" | "paused" | "completed";

export type Seniority =
  | "founder"
  | "c_suite"
  | "vp"
  | "director"
  | "head"
  | "manager"
  | "individual_contributor";

export interface Company {
  id: string;
  name: string;
  legalName?: string;
  website: string;
  domain: string;
  industry: string;
  sector?: string;
  division: string; // Bangladesh division, e.g. Dhaka
  city: string;
  // Below: real for hand-curated companies (source "curated"), genuinely
  // unknown for ones found via live company search (source "google_places")
  // — a directory listing doesn't tell you headcount or products. Left
  // undefined rather than guessed; render as "Not available".
  employeeRange?: string;
  employeeCount?: number;
  revenueRange?: string;
  foundedYear?: number;
  businessType?: string; // e.g. Private Limited, Public Limited, Sole Proprietorship
  description?: string;
  products?: string[];
  technologies?: string[];
  growthSignals?: string[];
  score?: number; // 0-100 Keiro-derived ICP fit score
  logoInitials: string;
  source: "curated" | "google_places";
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  department: string;
  seniority: Seniority;
  companyId: string;
  location: string;
  email?: string;
  emailStatus: VerificationStatus;
  phone?: string;
  score: number;
}

export interface Lead {
  personId: string;
  companyId: string;
  stage: LeadStage;
  ownerId: string;
  score: number;
}

export interface ListRecord {
  id: string;
  name: string;
  description: string;
  kind: "companies" | "people" | "mixed";
  itemCount: number;
  updatedAt: string;
  tags: string[];
}

export interface SequenceStep {
  id: string;
  order: number;
  delayDays: number;
  subject: string;
  preview: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  listId?: string;
  listName: string;
  prospects: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replied: number;
  bounced: number;
  meetings: number;
  createdAt: string;
  sequence: SequenceStep[];
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  kind: "prospect" | "campaign" | "enrichment" | "discovery" | "task";
}

export interface GmailAccount {
  email: string;
  connected: boolean;
  dailyLimit: number;
  sentToday: number;
}
