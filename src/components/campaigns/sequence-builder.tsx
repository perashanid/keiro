"use client";

import { useState } from "react";
import type { SequenceStep } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

const VARIABLES = ["{{first_name}}", "{{last_name}}", "{{company_name}}", "{{job_title}}"];

let stepIdCounter = 0;
function nextStepId() {
  stepIdCounter += 1;
  return `step-${Date.now()}-${stepIdCounter}`;
}

function renumber(steps: SequenceStep[]): SequenceStep[] {
  return steps.map((s, i) => ({ ...s, order: i + 1 }));
}

export function SequenceBuilder({
  initialSteps,
  onSave,
}: {
  initialSteps: SequenceStep[];
  onSave: (steps: SequenceStep[]) => void;
}) {
  const [steps, setSteps] = useState<SequenceStep[]>(initialSteps);
  const [dirty, setDirty] = useState(false);

  function mutate(next: SequenceStep[]) {
    setSteps(renumber(next));
    setDirty(true);
  }

  function addStep() {
    mutate([
      ...steps,
      {
        id: nextStepId(),
        order: steps.length + 1,
        delayDays: steps.length === 0 ? 0 : 3,
        subject: "",
        preview: "",
      },
    ]);
  }

  function removeStep(id: string) {
    mutate(steps.filter((s) => s.id !== id));
  }

  function move(id: string, direction: -1 | 1) {
    const idx = steps.findIndex((s) => s.id === id);
    const swapWith = idx + direction;
    if (swapWith < 0 || swapWith >= steps.length) return;
    const next = [...steps];
    [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
    mutate(next);
  }

  function updateStep(id: string, patch: Partial<SequenceStep>) {
    mutate(steps.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function insertVariable(id: string, field: "subject" | "preview", variable: string) {
    const step = steps.find((s) => s.id === id);
    if (!step) return;
    updateStep(id, { [field]: `${step[field]} ${variable}`.trim() });
  }

  return (
    <div>
      <div className="space-y-5">
        {steps.map((step, i) => (
          <div key={step.id} className="rounded-[var(--radius-md)] border border-ink-700 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-600 text-xs text-slate-300">
                  {i + 1}
                </span>
                {i === 0 ? (
                  <span className="text-xs text-slate-400">Sent immediately</span>
                ) : (
                  <label className="flex items-center gap-2 text-xs text-slate-400">
                    Wait
                    <input
                      type="number"
                      min={1}
                      value={step.delayDays}
                      onChange={(e) => updateStep(step.id, { delayDays: Number(e.target.value) || 1 })}
                      className="focus-ring h-7 w-14 rounded-[var(--radius-sm)] border border-ink-700 bg-ink-900 px-2 text-mist"
                    />
                    days, then
                  </label>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  aria-label="Move step up"
                  disabled={i === 0}
                  onClick={() => move(step.id, -1)}
                  className="focus-ring rounded-sm p-1 text-slate-400 hover:text-mist disabled:opacity-30"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  aria-label="Move step down"
                  disabled={i === steps.length - 1}
                  onClick={() => move(step.id, 1)}
                  className="focus-ring rounded-sm p-1 text-slate-400 hover:text-mist disabled:opacity-30"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  aria-label="Remove step"
                  onClick={() => removeStep(step.id)}
                  className="focus-ring rounded-sm p-1 text-slate-400 hover:text-danger"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <input
              value={step.subject}
              onChange={(e) => updateStep(step.id, { subject: e.target.value })}
              placeholder="Subject line"
              className="focus-ring mb-2 h-9 w-full rounded-[var(--radius-sm)] border border-ink-700 bg-ink-900 px-3 text-sm text-mist placeholder:text-slate-500"
            />
            <textarea
              value={step.preview}
              onChange={(e) => updateStep(step.id, { preview: e.target.value })}
              placeholder="Email body"
              rows={3}
              className="focus-ring w-full rounded-[var(--radius-sm)] border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-mist placeholder:text-slate-500"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {VARIABLES.map((v) => (
                <button
                  key={v}
                  onClick={() => insertVariable(step.id, "preview", v)}
                  className="focus-ring rounded-full border border-slate-600 px-2 py-0.5 font-mono text-[11px] text-slate-400 hover:text-mist"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Button variant="secondary" size="sm" onClick={addStep}>
          <Plus size={14} /> Add step
        </Button>
        <Button
          size="sm"
          disabled={!dirty}
          onClick={() => {
            onSave(steps);
            setDirty(false);
          }}
        >
          Save sequence
        </Button>
      </div>
    </div>
  );
}
