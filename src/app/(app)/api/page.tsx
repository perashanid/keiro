"use client";

import { useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Plus, Trash2 } from "lucide-react";

interface ApiKey {
  id: string;
  label: string;
  preview: string;
  createdAt: string;
}

const initialKeys: ApiKey[] = [
  { id: "k-1", label: "Production", preview: "krio_live_••••••••wq3f", createdAt: "2026-08-02" },
  { id: "k-2", label: "Staging", preview: "krio_test_••••••••91ka", createdAt: "2026-08-20" },
];

const resources = ["Companies", "People", "Leads", "Lists", "Campaigns", "Contacts", "Enrichment"];

export default function ApiPage() {
  const [keys, setKeys] = useState(initialKeys);
  const showToast = useToast();

  function createKey() {
    const id = `k-${Date.now()}`;
    setKeys((prev) => [
      ...prev,
      { id, label: `Key ${prev.length + 1}`, preview: "krio_live_••••••••" + id.slice(-4), createdAt: new Date().toISOString().slice(0, 10) },
    ]);
    showToast("API key created");
  }

  function revokeKey(id: string) {
    setKeys((prev) => prev.filter((k) => k.id !== id));
    showToast("API key revoked");
  }

  return (
    <div>
      <PageHeader
        title="API"
        description="Create keys to access Keiro's API for companies, people, leads, and campaigns."
        actions={
          <Button size="sm" onClick={createKey}>
            <Plus size={14} /> Create key
          </Button>
        }
      />

      <Card className="mb-6 divide-y divide-ink-700">
        {keys.map((k) => (
          <div key={k.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-mist">{k.label}</p>
              <p className="font-mono text-xs text-slate-400">{k.preview}</p>
              <p className="mt-1 text-xs text-slate-500">Created {k.createdAt}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => revokeKey(k.id)}>
              <Trash2 size={14} /> Revoke
            </Button>
          </div>
        ))}
        {keys.length === 0 && <p className="px-5 py-6 text-sm text-slate-400">No API keys yet.</p>}
      </Card>

      <Card className="p-5">
        <p className="mb-3 text-sm font-medium text-mist">Available resources</p>
        <div className="flex flex-wrap gap-2">
          {resources.map((r) => (
            <span key={r} className="rounded-full border border-slate-600 px-2.5 py-1 text-xs text-slate-300">
              {r}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-400">
          Full API documentation and request logs are not yet available in this preview.
        </p>
      </Card>
    </div>
  );
}
