"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { useGmailStatus } from "@/hooks/use-gmail-status";
import { templates, substituteVariables, type EmailRecipient } from "@/lib/templates";
import { AlertCircle } from "lucide-react";

const VARIABLES = ["{{first_name}}", "{{last_name}}", "{{company_name}}", "{{job_title}}"];

export function EmailComposer({
  recipients,
  onClose,
}: {
  recipients: EmailRecipient[];
  onClose: () => void;
}) {
  const { status, loading } = useGmailStatus();
  const showToast = useToast();
  const [templateId, setTemplateId] = useState(templates[0].id);
  const [subject, setSubject] = useState(templates[0].subject);
  const [body, setBody] = useState(templates[0].body);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState<{ sent: number; total: number } | null>(null);

  const sendable = recipients.filter((r) => r.email);
  const missingEmail = recipients.length - sendable.length;
  const previewRecipient = sendable[0] ?? recipients[0];

  function applyTemplate(id: string) {
    const t = templates.find((t) => t.id === id);
    if (!t) return;
    setTemplateId(id);
    setSubject(t.subject);
    setBody(t.body);
  }

  function insertVariable(variable: string) {
    setBody((b) => `${b}${b.endsWith(" ") || b.length === 0 ? "" : " "}${variable}`);
  }

  async function handleSend() {
    if (!status?.connected || sendable.length === 0) return;
    setSending(true);
    setProgress({ sent: 0, total: sendable.length });
    let failures = 0;
    let sent = 0;
    let lastError: string | null = null;
    let stoppedEarly = false;

    for (let i = 0; i < sendable.length; i++) {
      const recipient = sendable[i];
      try {
        const res = await fetch("/api/gmail/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: recipient.email,
            subject: substituteVariables(subject, recipient),
            message: substituteVariables(body, recipient),
          }),
        });
        if (res.ok) {
          sent += 1;
        } else {
          failures += 1;
          const data = await res.json().catch(() => null);
          lastError = data?.error ?? lastError;
          if (res.status === 429) {
            stoppedEarly = true;
            setProgress({ sent: i + 1, total: sendable.length });
            break;
          }
        }
      } catch {
        failures += 1;
      }
      setProgress({ sent: i + 1, total: sendable.length });
      if (i < sendable.length - 1) await new Promise((r) => setTimeout(r, 300));
    }

    setSending(false);
    if (failures === 0) {
      showToast(sent === 1 ? "Email sent" : `Sent ${sent} emails`);
      onClose();
    } else if (stoppedEarly) {
      showToast(lastError ?? `Stopped after ${sent} sent`);
    } else {
      showToast(lastError ? `${sent} sent, ${failures} failed — ${lastError}` : `${sent} sent, ${failures} failed`);
    }
  }

  return (
    <Modal
      title={recipients.length === 1 ? `Email ${recipients[0].firstName} ${recipients[0].lastName}` : `Email ${recipients.length} prospects`}
      onClose={onClose}
      wide
    >
      {!loading && !status?.connected && (
        <div className="mb-4 flex items-start gap-2 rounded-[var(--radius-sm)] border border-warn/30 bg-warn/10 px-3 py-2 text-sm text-warn">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>
            No Gmail account connected.{" "}
            <Link href="/integrations" className="underline underline-offset-2">
              Connect one
            </Link>{" "}
            to send this email.
          </span>
        </div>
      )}

      {missingEmail > 0 && (
        <p className="mb-4 text-sm text-slate-400">
          {missingEmail} of {recipients.length} selected don&apos;t have a discovered email and will be skipped.
        </p>
      )}

      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs text-slate-400">Template</span>
        <select
          value={templateId}
          onChange={(e) => applyTemplate(e.target.value)}
          className="focus-ring h-8 rounded-[var(--radius-sm)] border border-ink-700 bg-ink-900 px-2 text-sm text-mist"
        >
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        className="focus-ring mb-2 h-10 w-full rounded-[var(--radius-sm)] border border-ink-700 bg-ink-900 px-3 text-sm text-mist placeholder:text-slate-500"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={7}
        placeholder="Write your message…"
        className="focus-ring w-full rounded-[var(--radius-sm)] border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-mist placeholder:text-slate-500"
      />
      <div className="mt-2 flex flex-wrap gap-1.5">
        {VARIABLES.map((v) => (
          <button
            key={v}
            onClick={() => insertVariable(v)}
            className="focus-ring rounded-full border border-slate-600 px-2 py-0.5 font-mono text-[11px] text-slate-400 hover:text-mist"
          >
            {v}
          </button>
        ))}
      </div>

      {previewRecipient && (
        <div className="mt-4 rounded-[var(--radius-sm)] border border-ink-700 p-3">
          <p className="mb-1 text-xs text-slate-400">
            Preview for {previewRecipient.firstName} {previewRecipient.lastName}
          </p>
          <p className="text-sm font-medium text-mist">{substituteVariables(subject, previewRecipient) || "(no subject)"}</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-300">
            {substituteVariables(body, previewRecipient) || "(no message)"}
          </p>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-ink-700 pt-4">
        <div className="text-xs text-slate-400">
          {status?.connected ? (
            <span className="flex items-center gap-1.5">
              Sending as <Badge tone="success">{status.email}</Badge>
            </span>
          ) : (
            <span>Not connected</span>
          )}
          {progress && (
            <span className="ml-2">
              · Sent {progress.sent}/{progress.total}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!status?.connected || sendable.length === 0 || sending || !subject.trim()}
            onClick={handleSend}
          >
            {sending ? "Sending…" : sendable.length > 1 ? `Send to ${sendable.length}` : "Send"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
