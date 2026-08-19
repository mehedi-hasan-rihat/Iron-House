"use client";
import { useCallback, useSyncExternalStore } from "react";

/**
 * The wall clock as an external store, bucketed to the minute.
 *
 * Subscribing this way (rather than setState-in-effect) keeps the server
 * snapshot `null`, so the first client render matches the HTML and hydration
 * stays quiet. Callers branch on `null` to render a static, clock-free
 * fallback for the server pass.
 *
 * Returns minutes since the epoch — referentially stable between ticks, so a
 * re-render only happens when the displayed minute actually changes.
 */
export function useMinuteTick(): number | null {
  const subscribe = useCallback((onChange: () => void) => {
    const id = setInterval(onChange, 30_000);
    return () => clearInterval(id);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / 60_000),
    () => null
  );
}
