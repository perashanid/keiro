"use client";

import { useEffect } from "react";
import { useAutomationStore } from "@/lib/store/automation";

const POLL_MS = 15_000;

/**
 * Advances due sequence steps while the app is open in a tab. This stands in
 * for a real scheduler — in production, replace this with a cron job or
 * queue worker calling the same processDue() logic server-side on an
 * interval, since a browser tab isn't a reliable place to run background
 * jobs.
 */
export function AutomationRunner() {
  useEffect(() => {
    const tick = () => {
      void useAutomationStore.getState().processDue();
    };
    tick();
    const id = setInterval(tick, POLL_MS);
    return () => clearInterval(id);
  }, []);

  return null;
}
