/**
 * Offers shown on the landing page's board section.
 *
 * Hard-coded for now. The shape below is deliberately flat and serialisable so
 * that swapping in a database is a one-line change at the call site:
 *
 *   const offers = await prisma.offer.findMany({
 *     where: { published: true },
 *     orderBy: { order: "asc" },
 *   });
 *
 * Two rules keep that swap painless:
 *   - `endsAt` is an ISO string, not a Date. Dates do not survive the
 *     server→client component boundary, and a string is what a Prisma
 *     `DateTime` should be mapped to before it is handed to <Offers />.
 *   - `price` and `was` are display strings, not numbers. Currency formatting
 *     is an editorial decision here, not a computation.
 */
export type Offer = {
  /** Stable key. Becomes the DB primary key later. */
  id: string;
  /** Small line above the title — who the offer is for. */
  kicker: string;
  title: string;
  /** One or two sentences, shown when the row is open. */
  blurb: string;
  /** Display price, or null for offers that are not a price (e.g. a free month). */
  price: string | null;
  /** Struck-through original price. Omit when there is nothing to compare to. */
  was?: string;
  /** ISO 8601 with offset. `null` means the offer runs indefinitely. */
  endsAt: string | null;
  /** The small print. Kept as a list so it stays scannable. */
  terms: string[];
  image: string;
  ctaLabel: string;
  ctaHref: string;
};

export const OFFERS: Offer[] = [
  {
    id: "six-week-reset",
    kicker: "Coached programme",
    title: "Six-Week Reset",
    blurb:
      "Twenty-four coached sessions, an intake assessment, and a written programme reviewed every fortnight. Built for people coming back after a long gap.",
    price: "৳9,500",
    was: "৳14,000",
    endsAt: "2026-08-08T22:00:00+06:00",
    terms: [
      "Twelve places per intake",
      "Intake assessment in the first week",
      "Not combinable with the annual rate",
    ],
    image: "https://iron-house.lovable.app/assets/exp-2-Bx-Wnp-a.jpg",
    ctaLabel: "Take a place",
    ctaHref: "#contact",
  },
  {
    id: "founding-annual",
    kicker: "New members",
    title: "Two Months Free",
    blurb:
      "Pay for ten months of the annual plan and train for twelve. Everything is included — floor, classes, locker, steam and parking.",
    price: "৳32,000",
    was: "৳42,000",
    endsAt: "2026-08-31T23:59:00+06:00",
    terms: [
      "Annual plan only, paid up front",
      "Joining fee waived",
      "Thirty days notice to cancel, unused months refunded",
    ],
    image: "https://iron-house.lovable.app/assets/hero-4-CDROxHqs.jpg",
    ctaLabel: "Claim the rate",
    ctaHref: "#membership",
  },
  {
    id: "training-partner",
    kicker: "Existing members",
    title: "Bring Your Partner",
    blurb:
      "Sign up someone you actually train with and you both get a month added to your plan. No cap on how many times you can do it.",
    price: null,
    endsAt: "2026-09-15T23:59:00+06:00",
    terms: [
      "Both months credit once the referral's first payment clears",
      "Referral must be new to the floor",
    ],
    image: "https://iron-house.lovable.app/assets/trainer-2-C9g2Jo5V.jpg",
    ctaLabel: "Refer someone",
    ctaHref: "#contact",
  },
  {
    id: "student-floor",
    kicker: "Students",
    title: "Off-Peak Floor Pass",
    blurb:
      "Full run of the floor between 6 AM and 4 PM on a valid student ID. Same racks, same coaches, quieter room.",
    price: "৳2,200",
    was: "৳3,500",
    endsAt: null,
    terms: [
      "Valid student ID, re-checked each term",
      "6 AM – 4 PM, Saturday to Thursday",
      "Classes charged separately",
    ],
    image: "https://iron-house.lovable.app/assets/hero-2-nGKAHpIT.jpg",
    ctaLabel: "Check eligibility",
    ctaHref: "#contact",
  },
  {
    id: "corporate-ten",
    kicker: "Companies",
    title: "Corporate Ten",
    blurb:
      "Ten or more people from one office, billed together, at a quarter off the standard monthly rate. We handle the paperwork with your HR team.",
    price: null,
    endsAt: null,
    terms: [
      "Minimum ten active members",
      "Billed to the company, one invoice",
      "Quarterly usage report if you want one",
    ],
    image: "https://iron-house.lovable.app/assets/exp-1-CKXz5iIt.jpg",
    ctaLabel: "Talk to us",
    ctaHref: "#contact",
  },
];
