"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Copies text and flips `copied` to true for 1.6s (PLAN §5.6). Used by email and Copy link. */
export function useCopy(duration = 1600) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Clipboard can be blocked (permissions, insecure context). Still show feedback,
        // matching the prototype; the URL is visible in the address bar regardless.
      }
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), duration);
    },
    [duration],
  );

  return { copied, copy };
}
