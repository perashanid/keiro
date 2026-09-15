export interface EmailRecipient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  companyName?: string;
  title?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export const templates: EmailTemplate[] = [
  {
    id: "tpl-intro",
    name: "Cold intro",
    subject: "Quick question about {{company_name}}",
    body: "Hi {{first_name}},\n\nNoticed {{company_name}} and wanted to reach out — I help teams like yours with prospecting and outreach.\n\nOpen to a quick chat this week?\n\nBest,\n",
  },
  {
    id: "tpl-followup",
    name: "Follow-up",
    subject: "Following up — {{company_name}}",
    body: "Hi {{first_name}},\n\nWanted to make sure my last note reached you. Happy to share more detail whenever is useful.\n\nBest,\n",
  },
  {
    id: "tpl-blank",
    name: "Blank",
    subject: "",
    body: "",
  },
];

export function substituteVariables(text: string, recipient: EmailRecipient): string {
  return text
    .replaceAll("{{first_name}}", recipient.firstName)
    .replaceAll("{{last_name}}", recipient.lastName)
    .replaceAll("{{company_name}}", recipient.companyName ?? "")
    .replaceAll("{{job_title}}", recipient.title ?? "");
}
