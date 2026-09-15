export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member";
}

export const team: TeamMember[] = [
  { id: "u-1", name: "Tasnim Rahman", email: "tasnim@yourcompany.com", role: "Owner" },
  { id: "u-2", name: "Imran Kabir", email: "imran@yourcompany.com", role: "Admin" },
  { id: "u-3", name: "Nadia Haque", email: "nadia@yourcompany.com", role: "Member" },
];

export function getTeamMemberById(id: string): TeamMember | undefined {
  return team.find((m) => m.id === id);
}
