import type { ActivityItem } from "@/lib/types";

// Illustrative workspace activity — the actors (Tasnim R., Imran K.) are this
// demo workspace's own fictional team members (see src/lib/mock/team.ts),
// not real people. Targets reference real companies from companies.ts.
export const activity: ActivityItem[] = [
  { id: "a-000", actor: "Tasnim R.", action: "added 6 more banks to", target: "Banking", timestamp: "2026-09-13T09:15:00", kind: "prospect" },
  { id: "a-00", actor: "Tasnim R.", action: "added 10 more Dhaka companies across banking, aviation, and consumer tech to", target: "the workspace", timestamp: "2026-09-12T10:30:00", kind: "prospect" },
  { id: "a-0", actor: "Tasnim R.", action: "added 10 real companies across telecom, steel, and retail to", target: "the workspace", timestamp: "2026-09-11T11:00:00", kind: "prospect" },
  { id: "a-1", actor: "Tasnim R.", action: "added 5 companies to", target: "Pharmaceutical exporters", timestamp: "2026-09-10T09:12:00", kind: "prospect" },
  { id: "a-2", actor: "Discovery", action: "found 3 new businesses via Google Places for", target: "Fintech, Dhaka", timestamp: "2026-09-10T08:40:00", kind: "discovery" },
  { id: "a-3", actor: "Tasnim R.", action: "enriched company profile for", target: "Brain Station 23 PLC", timestamp: "2026-09-09T18:05:00", kind: "enrichment" },
  { id: "a-4", actor: "Imran K.", action: "created a follow-up task for", target: "Envoy Textiles Limited", timestamp: "2026-09-08T15:30:00", kind: "task" },
  { id: "a-5", actor: "Tasnim R.", action: "saved a discovered company:", target: "DHL Global Forwarding (Bangladesh)", timestamp: "2026-09-08T10:02:00", kind: "discovery" },
];
