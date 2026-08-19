"use client";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useMinuteTick } from "@/lib/use-minute-tick";
import { countdownFor, headlineOffer } from "@/lib/offer-time";
import type { Offer } from "@/content/offers";

const DISMISS_KEY = "fgc:offer-bar-dismissed";

/** Must match the bar's rendered height — the navbars are pushed down by it. */
const BAR_H = "2.5rem";

/* sessionStorage as an external store. Reading it in an effect and calling
   setState would work, but it is a cascading render the compiler rightly
   objects to — this is the shape React wants for "state that lives outside
   React". The server snapshot reports dismissed, so the bar is absent from the
   SSR markup and appears once hydrated; it is position-fixed, so nothing in the
   document reflows when it does. */
const listeners = new Set<() => void>();

const readDismissed = () => {
  try {
    return sessionStorage.getItem(DISMISS_KEY) !== null;
  } catch {
    /* Private mode or blocked storage — treat as not dismissed. */
    return false;
  }
};

const setDismissed = () => {
  try {
    sessionStorage.setItem(DISMISS_KEY, "1");
  } catch {
    /* Nothing to persist to; the notify below still closes it for this view. */
  }
  listeners.forEach((l) => l());
};

function useDismissed(): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    listeners.add(onChange);
    return () => void listeners.delete(onChange);
  }, []);

  return useSyncExternalStore(subscribe, readDismissed, () => true);
}

/**
 * A slim accent strip above the navbar carrying the single most urgent offer.
 *
 * The offer board itself sits a long way down the page, and most visitors never
 * get there. This is the part that does not require scrolling at all: one deal,
 * one live countdown, one link into the board.
 *
 * It owns `--offer-bar-h`, which both navbars read for their `top` offset —
 * that is how the header stack stays correct whether the bar is shown,
 * dismissed, or absent entirely.
 */
export default function OfferBar({ offers }: { offers: Offer[] }) {
  const dismissed = useDismissed();
  const now = useMinuteTick();
  const nowMs = now === null ? null : now * 60_000;

  const offer = headlineOffer(offers, nowMs);
  const shown = !dismissed && offer !== null;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--offer-bar-h", shown ? BAR_H : "0px");
    return () => root.style.setProperty("--offer-bar-h", "0px");
  }, [shown]);

  if (!shown || !offer) return null;

  const c = countdownFor(offer.endsAt, nowMs);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-10 bg-[#BFE01D] text-black">
      <div className="mx-auto flex h-full max-w-[1600px] items-center gap-3 px-4 md:px-10">
        <span className="hidden h-1.5 w-1.5 shrink-0 rotate-45 bg-black sm:block" />

        <a
          href="#offers"
          className="flex min-w-0 flex-1 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] md:gap-4 md:text-[11px] md:tracking-[0.22em]"
        >
          <span className="hidden shrink-0 font-semibold sm:inline">Now on</span>

          <span className="truncate font-semibold">{offer.title}</span>

          {offer.price && (
            <span className="hidden shrink-0 font-display text-sm md:inline">
              {offer.price}
            </span>
          )}

          {/* normal-case so the countdown reads "3d 11h", not "3D 11H". */}
          {(c.state === "running" || c.state === "date") && (
            <span className="shrink-0 normal-case tracking-[0.18em] text-black/60">
              {c.state === "running" ? `${c.text} left` : `ends ${c.text}`}
            </span>
          )}

          <span className="ml-auto hidden shrink-0 items-center gap-2 font-semibold md:flex">
            See all offers
            <svg width="14" height="8" viewBox="0 0 16 8" fill="none">
              <path d="M1 4h14m0 0L11 1m4 3l-4 3" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
        </a>

        <button
          type="button"
          onClick={setDismissed}
          aria-label="Dismiss offer"
          className="-mr-1 shrink-0 p-1 text-base leading-none text-black/50 transition-colors duration-200 hover:text-black"
        >
          ×
        </button>
      </div>
    </div>
  );
}
