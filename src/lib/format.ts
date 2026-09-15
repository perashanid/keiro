import type { Seniority } from "@/lib/types";

export const seniorityLabel: Record<Seniority, string> = {
  founder: "Founder",
  c_suite: "C-suite",
  vp: "VP",
  director: "Director",
  head: "Head",
  manager: "Manager",
  individual_contributor: "Individual contributor",
};
