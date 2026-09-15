"use client";

import { useMemo, useState } from "react";
import { useCrmStore } from "@/lib/store/crm";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function NotesAndTasks({
  relatedType,
  relatedId,
}: {
  relatedType: "person" | "company";
  relatedId: string;
}) {
  const allNotes = useCrmStore((s) => s.notes);
  const allTasks = useCrmStore((s) => s.tasks);
  const notes = useMemo(
    () => allNotes.filter((n) => n.relatedType === relatedType && n.relatedId === relatedId),
    [allNotes, relatedType, relatedId]
  );
  const tasks = useMemo(
    () => allTasks.filter((t) => t.relatedType === relatedType && t.relatedId === relatedId),
    [allTasks, relatedType, relatedId]
  );
  const addNote = useCrmStore((s) => s.addNote);
  const addTask = useCrmStore((s) => s.addTask);
  const toggleTask = useCrmStore((s) => s.toggleTask);
  const deleteTask = useCrmStore((s) => s.deleteTask);

  const [noteDraft, setNoteDraft] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDue, setTaskDue] = useState(() => new Date().toISOString().slice(0, 10));

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium text-mist">Tasks</p>
        <div className="mb-3 flex gap-2">
          <input
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Follow up next Tuesday…"
            className="focus-ring h-9 flex-1 rounded-[var(--radius-sm)] border border-ink-700 bg-ink-900 px-3 text-sm text-mist placeholder:text-slate-500"
          />
          <input
            type="date"
            value={taskDue}
            onChange={(e) => setTaskDue(e.target.value)}
            className="focus-ring h-9 rounded-[var(--radius-sm)] border border-ink-700 bg-ink-900 px-2 text-sm text-mist"
          />
          <Button
            size="sm"
            disabled={!taskTitle.trim()}
            onClick={() => {
              addTask(relatedType, relatedId, taskTitle.trim(), taskDue);
              setTaskTitle("");
            }}
          >
            Add
          </Button>
        </div>
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-400">No tasks yet.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((t) => {
              const overdue = t.status === "open" && t.dueDate < today;
              return (
                <li key={t.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={t.status === "done"}
                    onChange={() => toggleTask(t.id)}
                    className="accent-ivory"
                    aria-label={`Mark "${t.title}" ${t.status === "done" ? "open" : "done"}`}
                  />
                  <span className={t.status === "done" ? "flex-1 text-slate-500 line-through" : "flex-1 text-mist"}>
                    {t.title}
                  </span>
                  <span className={overdue ? "text-xs text-danger" : "text-xs text-slate-400"}>
                    {formatDate(t.dueDate)}
                  </span>
                  <button
                    onClick={() => deleteTask(t.id)}
                    aria-label={`Delete task "${t.title}"`}
                    className="focus-ring rounded-sm p-1 text-slate-500 hover:text-danger"
                  >
                    <Trash2 size={13} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-mist">Notes</p>
        <div className="mb-3 flex gap-2">
          <textarea
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="Add a note…"
            rows={2}
            className="focus-ring flex-1 rounded-[var(--radius-sm)] border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-mist placeholder:text-slate-500"
          />
          <Button
            size="sm"
            disabled={!noteDraft.trim()}
            onClick={() => {
              addNote(relatedType, relatedId, noteDraft.trim());
              setNoteDraft("");
            }}
          >
            Add
          </Button>
        </div>
        {notes.length === 0 ? (
          <p className="text-sm text-slate-400">No notes yet.</p>
        ) : (
          <ul className="space-y-3">
            {notes.map((n) => (
              <li key={n.id} className="rounded-[var(--radius-sm)] border border-ink-700 p-3">
                <p className="text-sm text-slate-300">{n.body}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {n.author} · {formatDate(n.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
