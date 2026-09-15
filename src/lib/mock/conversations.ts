export interface Message {
  id: string;
  direction: "outbound" | "inbound";
  body: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  personId: string;
  campaignName: string;
  lastMessagePreview: string;
  unread: boolean;
  messages: Message[];
}

// Deliberately empty — these were fabricated replies from fictional contacts
// tied to people.ts, which we no longer invent (see the note there). A real
// reply arriving through a connected Gmail account, or a manually-logged
// "Mark replied" from the campaign Prospects table, is what populates this.
export const conversations: Conversation[] = [];

export function getConversationById(id: string): Conversation | undefined {
  return conversations.find((c) => c.id === id);
}
