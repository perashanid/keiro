"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { people } from "@/lib/mock/people";
import type { LeadStage } from "@/lib/types";

export interface Note {
  id: string;
  relatedType: "person" | "company";
  relatedId: string;
  body: string;
  author: string;
  createdAt: string;
}

export interface Task {
  id: string;
  relatedType: "person" | "company";
  relatedId: string;
  title: string;
  dueDate: string; // yyyy-mm-dd
  status: "open" | "done";
  createdAt: string;
}

export interface LeadRecord {
  personId: string;
  stage: LeadStage;
  ownerId: string | null;
}

function initialStage(score: number): LeadStage {
  if (score >= 90) return "opportunity";
  if (score >= 78) return "qualified";
  if (score >= 62) return "engaged";
  if (score >= 48) return "contacted";
  return "new";
}

let counter = 0;
function nextId(prefix: string) {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}

interface CrmState {
  notes: Note[];
  tasks: Task[];
  leads: LeadRecord[];
  addNote: (relatedType: Note["relatedType"], relatedId: string, body: string) => void;
  addTask: (relatedType: Task["relatedType"], relatedId: string, title: string, dueDate: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  getLead: (personId: string) => LeadRecord;
  setLeadStage: (personId: string, stage: LeadStage) => void;
  setLeadOwner: (personId: string, ownerId: string | null) => void;
}

export const useCrmStore = create<CrmState>()(
  persist(
    (set, get) => ({
      notes: [],
      tasks: [],
      leads: people.map((p) => ({ personId: p.id, stage: initialStage(p.score), ownerId: null })),

      addNote: (relatedType, relatedId, body) =>
        set((state) => ({
          notes: [
            { id: nextId("note"), relatedType, relatedId, body, author: "You", createdAt: new Date().toISOString() },
            ...state.notes,
          ],
        })),

      addTask: (relatedType, relatedId, title, dueDate) =>
        set((state) => ({
          tasks: [
            {
              id: nextId("task"),
              relatedType,
              relatedId,
              title,
              dueDate,
              status: "open",
              createdAt: new Date().toISOString(),
            },
            ...state.tasks,
          ],
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, status: t.status === "open" ? "done" : "open" } : t)),
        })),

      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

      getLead: (personId) => {
        const existing = get().leads.find((l) => l.personId === personId);
        if (existing) return existing;
        const person = people.find((p) => p.id === personId);
        return { personId, stage: initialStage(person?.score ?? 0), ownerId: null };
      },

      setLeadStage: (personId, stage) =>
        set((state) => ({
          leads: state.leads.some((l) => l.personId === personId)
            ? state.leads.map((l) => (l.personId === personId ? { ...l, stage } : l))
            : [...state.leads, { personId, stage, ownerId: null }],
        })),

      setLeadOwner: (personId, ownerId) =>
        set((state) => ({
          leads: state.leads.some((l) => l.personId === personId)
            ? state.leads.map((l) => (l.personId === personId ? { ...l, ownerId } : l))
            : [...state.leads, { personId, stage: "new", ownerId }],
        })),
    }),
    { name: "keiro-crm" }
  )
);
