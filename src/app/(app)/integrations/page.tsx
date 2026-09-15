"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, AnchorButton, LinkButton } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useGmailStatus } from "@/hooks/use-gmail-status";
import { Mail, MessageSquare, Zap, Webhook, MapPin } from "lucide-react";

const errorMessages: Record<string, string> = {
  not_configured:
    "Gmail isn't configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your environment (see .env.example) to enable this.",
  invalid_state: "That connection attempt looked invalid, so we stopped it. Try connecting again.",
  exchange_failed: "Google didn't confirm the connection. Try again in a moment.",
};

function GmailCard() {
  const { status, loading, refresh } = useGmailStatus();
  const showToast = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("gmail_error");
    const connected = searchParams.get("gmail_connected");
    if (error) showToast(errorMessages[error] ?? "Couldn't connect Gmail.");
    if (connected) {
      showToast("Gmail connected");
      refresh();
    }
    if (error || connected) router.replace("/integrations");
  }, [searchParams, showToast, refresh, router]);

  async function disconnect() {
    await fetch("/api/auth/google/disconnect", { method: "POST" });
    showToast("Gmail disconnected");
    refresh();
  }

  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-ink-750 text-slate-300">
          <Mail size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-mist">Gmail</p>
            {status?.connected && <Badge tone="success">Connected</Badge>}
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Send and track outreach from a connected Gmail account.
          </p>
          {status?.connected && <p className="mt-2 text-xs text-slate-500">{status.email}</p>}
          {!loading && status && !status.configured && (
            <p className="mt-2 text-xs text-warn">
              Not configured — add GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET to enable this.
            </p>
          )}
          <div className="mt-4">
            {status?.connected ? (
              <Button variant="secondary" size="sm" onClick={disconnect}>
                Disconnect
              </Button>
            ) : (
              <AnchorButton
                href="/api/auth/google/connect"
                variant="secondary"
                size="sm"
                className={loading ? "pointer-events-none opacity-40" : undefined}
              >
                Connect
              </AnchorButton>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function DiscoveryCard() {
  const [configured, setConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/discovery/status")
      .then((res) => res.json())
      .then((data) => setConfigured(data.configured))
      .catch(() => setConfigured(false));
  }, []);

  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-ink-750 text-slate-300">
          <MapPin size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-mist">Company discovery</p>
            {configured && <Badge tone="success">Connected</Badge>}
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Find real businesses by sector and location via Google Places, from the Companies page.
          </p>
          {configured === false && (
            <p className="mt-2 text-xs text-warn">
              Not configured — add GOOGLE_PLACES_API_KEY to enable this.
            </p>
          )}
          <div className="mt-4">
            <LinkButton href="/companies" variant="secondary" size="sm">
              Go to Companies
            </LinkButton>
          </div>
        </div>
      </div>
    </Card>
  );
}

const otherIntegrations = [
  {
    icon: MessageSquare,
    name: "Slack",
    description: "Get notified in Slack when a prospect replies.",
  },
  {
    icon: Zap,
    name: "Zapier",
    description: "Connect Keiro to thousands of apps via Zapier triggers.",
  },
  {
    icon: Webhook,
    name: "Webhooks",
    description: "Send workspace events to your own endpoint in real time.",
  },
];

function IntegrationsContent() {
  const showToast = useToast();

  return (
    <div>
      <PageHeader
        title="Integrations"
        description="Connect the tools your team already uses. Gmail is fully wired up here — the rest need real credentials before they can go live."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <GmailCard />
        <DiscoveryCard />
        {otherIntegrations.map((i) => (
          <Card key={i.name} className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-ink-750 text-slate-300">
                <i.icon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-mist">{i.name}</p>
                <p className="mt-1 text-sm text-slate-400">{i.description}</p>
                <div className="mt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => showToast(`${i.name} needs API credentials configured before it can connect`)}
                  >
                    Connect
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <Suspense fallback={null}>
      <IntegrationsContent />
    </Suspense>
  );
}
