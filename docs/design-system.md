# Design System

## Brand Identity

Iron House uses a dark, high-contrast aesthetic that reads as serious and premium — fitting for a gym. The palette is near-black backgrounds with a single acid-yellow accent.

---

## Colour Tokens

| Token | Hex | Usage |
|---|---|---|
| `#050505` | Near-black | Page backgrounds, input fills |
| `#0a0a0a` | Panel background | Cards, sidebar, admin shell |
| `#111111` | Elevated surface | Hover states on panels |
| `#f2f4e8` | Off-white | Primary text, headings |
| `#9aa87a` | Muted olive | Labels, secondary text, icons |
| `#BFE01D` | Acid yellow (accent) | CTAs, focus rings, active states, borders |
| `#BFE01D/15` | Accent at 15% opacity | Subtle panel borders |
| `red-400` | Tailwind red-400 | Validation errors, danger actions |
| `amber-400` | Tailwind amber-400 | Warning badges (e.g. FROZEN) |

The accent `#BFE01D` is aliased as `ACC` in component files that need it inline:
```ts
const ACC = "#BFE01D";
```

---

## Typography

**Display font** — used for page headings, set in uppercase with wide tracking:
```css
font-family: var(--font-display);   /* set in layout.tsx */
letter-spacing: 0.05em;
text-transform: uppercase;
```

**Body / UI font** — system-safe sans-serif via Tailwind default.

**Label style** — 10px, uppercase, tracking `0.3em`, colour `#9aa87a`:
```html
<span class="text-[10px] uppercase tracking-[0.3em] text-[#9aa87a]">Field Label</span>
```
This utility class is also available as `.label` in the global stylesheet.

---

## Spacing & Layout

- Max content width: `max-w-2xl` (forms), `max-w-4xl` (tables/lists)
- Page padding: handled by `AdminShell` — `p-6` on desktop
- Section spacing: `space-y-6` between logical groups
- Grid: `grid gap-5 md:grid-cols-2` for form field pairs

---

## Components

### Input / Select / Textarea

All form controls share the same base class string (`inputCls`):

```ts
const inputCls = "w-full bg-[#050505] border border-[#BFE01D]/15 text-[#f2f4e8] text-sm px-4 py-2.5 outline-none focus:border-[#BFE01D] transition-colors";
```

Error state — add to the base class:
```ts
"border-red-500 focus:border-red-500"
```

### Field Wrapper

```tsx
function Field({ label, children, required }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9aa87a] mb-2">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
```

### Panel / Card

```html
<div class="border border-[#BFE01D]/15 panel p-6 space-y-5">
  ...
</div>
```

`.panel` is a global CSS class that applies the dark background and optional subtle inner shadow.

### Primary Button (CTA)

```tsx
<button
  style={{ backgroundColor: "#BFE01D" }}
  className="text-black text-xs font-bold uppercase tracking-[0.25em] px-8 py-3.5 disabled:opacity-50 transition-opacity hover:opacity-85"
>
  Action
</button>
```

### Ghost / Text Button

```html
<button class="text-[#9aa87a] text-xs uppercase tracking-[0.2em] hover:text-[#f2f4e8] transition-colors">
  Cancel
</button>
```

### Status Badges

```tsx
// Member status
const statusColour = {
  ACTIVE:    "text-[#BFE01D] border-[#BFE01D]/30",
  SUSPENDED: "text-red-400 border-red-400/30",
  FROZEN:    "text-amber-400 border-amber-400/30",
};

// Membership status
const membershipColour = {
  ACTIVE:    "text-[#BFE01D]",
  PENDING:   "text-amber-400",
  EXPIRED:   "text-red-400",
  FROZEN:    "text-sky-400",
  CANCELLED: "text-[#9aa87a]",
};
```

Badge shell:
```html
<span class="text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 border rounded-sm {colour}">
  STATUS
</span>
```

### Validation Error (inline, field-level)

```html
<p class="text-red-400 text-[10px] mt-1">Error message here.</p>
```

### Validation Error (form-level)

```html
<p class="text-red-400 text-xs">Something went wrong.</p>
```

---

## Admin Shell

`AdminShell` (`src/components/admin/AdminShell.tsx`) wraps all admin pages. It renders the sidebar navigation and a top header with notification bell. Pages render inside the main content slot.

The sidebar uses the same dark palette. Active nav item gets the accent colour on the left border and text.

---

## Landing Page Animations

GSAP 3 drives all landing page motion. Reusable wrappers live in `src/components/motion/`:

| Component | Effect |
|---|---|
| `Reveal` | Fade-up on scroll enter |
| `SplitReveal` | SplitText char/word reveal |
| `CountUp` | Animated number counter |
| `Stagger` | Sequential child reveals |
| `Parallax` | Scroll-linked Y offset |
| `MagneticBox` | Cursor-magnetic hover |
| `ScrollProgress` | Top progress bar |
| `BackToTop` | Smooth-scroll button |

All wrappers respect `prefers-reduced-motion` via GSAP `MatchMedia`.

---

## Responsive Breakpoints

Tailwind default breakpoints. Key patterns used:

- `md:grid-cols-2` — two-column form grid on medium+
- `hidden md:flex` — sidebar hidden on mobile, visible on desktop
- Landing page sections use `container mx-auto px-4 md:px-8`
