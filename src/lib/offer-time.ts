import type { Offer } from "@/content/offers";

/* Inside this window an offer stops reading as "later" and starts reading as
   "now" — it gets the accent treatment and a live hours-and-minutes clock. */
export const URGENT_MS = 72 * 60 * 60 * 1000;

export type Countdown =
  | { state: "ongoing" }
  | { state: "closed" }
  /** Pre-hydration: a fixed date, so server and client HTML agree. */
  | { state: "date";    text: string }
  | { state: "running"; text: string; urgent: boolean };

/* Both formatters pin locale and time zone, so they produce identical output on
   the server and in the browser regardless of where the visitor is. Leaving the
   zone to the host would be a hydration mismatch waiting to happen. */

/** Server-safe date, used until the clock store wakes up on the client. */
export const asDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Dhaka",
  }).format(new Date(iso));

/** The exact closing moment, spelled out under the panel's countdown. */
export const asFullDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Dhaka",
  }).format(new Date(iso));

export function countdownFor(endsAt: string | null, now: number | null): Countdown {
  if (!endsAt) return { state: "ongoing" };
  if (now === null) return { state: "date", text: asDate(endsAt) };

  const left = new Date(endsAt).getTime() - now;
  if (left <= 0) return { state: "closed" };

  const d = Math.floor(left / 86_400_000);
  const h = Math.floor((left % 86_400_000) / 3_600_000);
  const m = Math.floor((left % 3_600_000) / 60_000);

  return {
    state: "running",
    /* Days push minutes off the end — three units is noise at that distance. */
    text: d > 0 ? `${d}d ${h}h` : `${h}h ${m}m`,
    urgent: left < URGENT_MS,
  };
}

export const isRunning = (o: Offer, now: number | null) =>
  !o.endsAt || now === null || new Date(o.endsAt).getTime() > now;

/**
 * The one offer worth putting in front of someone who has not scrolled: the
 * soonest to close. Offers with no end date only win if nothing else is
 * running, since "no deadline" is the weakest possible reason to act now.
 */
export function headlineOffer(offers: Offer[], now: number | null): Offer | null {
  const live = offers.filter((o) => isRunning(o, now));
  if (!live.length) return null;

  const dated = live.filter((o) => o.endsAt);
  if (!dated.length) return live[0];

  return dated.reduce((soonest, o) =>
    new Date(o.endsAt!).getTime() < new Date(soonest.endsAt!).getTime() ? o : soonest
  );
}
