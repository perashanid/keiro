"use client";

import { useState } from "react";
import Link from "next/link";
import { conversations } from "@/lib/mock/conversations";
import { getPersonById } from "@/lib/mock/people";
import { getCompanyById } from "@/lib/mock/companies";
import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

function initials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase();
}

export default function InboxPage() {
  const [selectedId, setSelectedId] = useState(conversations[0]?.id);
  const selected = conversations.find((c) => c.id === selectedId);
  const selectedPerson = selected ? getPersonById(selected.personId) : undefined;
  const selectedCompany = selectedPerson ? getCompanyById(selectedPerson.companyId) : undefined;

  return (
    <div>
      <PageHeader title="Inbox" description="Replies from your outreach campaigns, in one place." />
      {conversations.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-400">
            No replies yet. Once a connected Gmail account gets a reply, or you mark a prospect
            replied from a campaign, the conversation shows up here.
          </p>
        </Card>
      ) : (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="divide-y divide-ink-700 lg:col-span-1">
          {conversations.map((c) => {
            const person = getPersonById(c.personId);
            if (!person) return null;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={cn(
                  "focus-ring flex w-full items-start gap-3 px-4 py-3 text-left",
                  c.id === selectedId ? "bg-ink-750" : "hover:bg-ink-800/60"
                )}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-700 text-xs font-semibold text-slate-300">
                  {initials(person.firstName, person.lastName)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium text-mist">
                      {person.firstName} {person.lastName}
                    </p>
                    {c.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-ivory" />}
                  </div>
                  <p className="truncate text-xs text-slate-400">{c.campaignName}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">{c.lastMessagePreview}</p>
                </div>
              </button>
            );
          })}
        </Card>

        <Card className="p-6 lg:col-span-2">
          {selected && selectedPerson ? (
            <div>
              <div className="mb-4 flex items-center justify-between border-b border-ink-700 pb-4">
                <div>
                  <p className="text-sm font-medium text-mist">
                    {selectedPerson.firstName} {selectedPerson.lastName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {selectedCompany && (
                      <Link href={`/companies/${selectedCompany.id}`} className="focus-ring rounded-sm hover:text-mist">
                        {selectedCompany.name}
                      </Link>
                    )}
                    {" · "}
                    {selected.campaignName}
                  </p>
                </div>
                <Link href={`/people/${selectedPerson.id}`} className="focus-ring rounded-sm text-xs text-slate-400 hover:text-mist">
                  View profile
                </Link>
              </div>
              <div className="space-y-4">
                {selected.messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "max-w-md rounded-[var(--radius-md)] px-4 py-3 text-sm",
                      m.direction === "outbound"
                        ? "ml-auto bg-ivory text-ink-950"
                        : "bg-ink-750 text-mist"
                    )}
                  >
                    {m.body}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 border-t border-ink-700 pt-4">
                <input
                  placeholder="Write a reply…"
                  className="focus-ring h-10 flex-1 rounded-[var(--radius-sm)] border border-ink-700 bg-ink-900 px-3 text-sm text-mist placeholder:text-slate-500"
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Select a conversation to view it.</p>
          )}
        </Card>
      </div>
      )}
    </div>
  );
}
