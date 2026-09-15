"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-ink-950/70 px-4 py-10 backdrop-blur-sm">
      <div
        className={cn(
          "w-full rounded-[var(--radius-lg)] border border-ink-700 bg-ink-800 shadow-2xl",
          wide ? "max-w-2xl" : "max-w-lg"
        )}
      >
        <div className="flex items-center justify-between border-b border-ink-700 px-6 py-4">
          <p className="font-display text-lg text-ivory">{title}</p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="focus-ring rounded-sm p-1 text-slate-400 hover:text-mist"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
