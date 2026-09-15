"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmailComposer } from "@/components/outreach/email-composer";
import type { EmailRecipient } from "@/lib/templates";
import { Mail } from "lucide-react";

export function ComposeButton({ recipient }: { recipient: EmailRecipient }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="sm" disabled={!recipient.email} onClick={() => setOpen(true)}>
        <Mail size={14} /> Compose email
      </Button>
      {open && <EmailComposer recipients={[recipient]} onClose={() => setOpen(false)} />}
    </>
  );
}
