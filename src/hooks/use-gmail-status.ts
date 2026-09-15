"use client";

import { useCallback, useEffect, useState } from "react";

export interface GmailStatus {
  configured: boolean;
  connected: boolean;
  email: string | null;
}

export function useGmailStatus() {
  const [status, setStatus] = useState<GmailStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gmail/status");
      const data = (await res.json()) as GmailStatus;
      setStatus(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch-on-mount: setLoading(true) runs synchronously before the first
    // await, which is expected and harmless for this one-shot status check.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  return { status, loading, refresh };
}
