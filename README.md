# Fit Gym Center — Premium Fitness Website

A high-performance, visually immersive gym website built with Next.js 16, Framer Motion, and Tailwind CSS v4. Designed and developed as a professional agency project.

---

## Live Preview

> Deploy to [Vercel](https://vercel.com) in one click — see deployment section below.

---

## Features

### Animated Loading Screen
- Full-screen branded loader with a slot-machine digit counter (0 → 100%)
- Dumbbell SVG icon with an animated progress fill bar
- Curtain exit animation — screen splits into two halves that slide off in opposite directions
- Progress-driven top bar

### Hero Section — Scroll-driven Carousel
- **3-act scroll experience** pinned to the viewport (`sticky`) over `240vh` (mobile) / `280vh` (desktop)
- Each act transitions via pure opacity crossfade (`AnimatePresence mode="sync"`)
- **Act 1** — Full-bleed athletic photo, masked word reveals, location pin, stats bar
- **Act 2** — Two image panels slide in from opposite sides (Women's Program + Combat Training), staggered content labels
- **Act 3** — New full-bleed background, bold headline, copy + CTA
- Progress dots indicator + slide counter
- Mouse parallax on the background photo
- Scroll cue animation (animated line)

### Custom Cursor
- Dual-layer design: sharp dot (instant) + trailing ring (spring lag)
- Expands on hoverable elements (links, buttons)
- Shrinks on click
- Auto-hides on touch devices

### Sections
| # | Section | Highlights |
|---|---------|------------|
| 01 | **Hero** | Scroll carousel, 3 acts, parallax |
| 02 | **Marquee** | Infinite scrolling text ticker |
| 03 | **About** | Image + editorial copy, pillar grid |
| 04 | **Experience** | Horizontal scroll gallery (5 panels) |
| 05 | **Why Us** | Animated hover list with accent line |
| 06 | **Programs** | Bento grid layout, 8 programs |
| 07 | **Trainers** | Grayscale → colour hover, 3 coaches |
| 08 | **Transformation** | Member result quote + before/after |
| 09 | **Stats** | Animated counting numbers on scroll |
| 10 | **Membership** | 4 pricing tiers, highlighted plan |
| 11 | **FAQ** | Accordion with smooth height animation |
| 12 | **Contact** | Channel links, address card, hours |
| 13 | **Footer** | Wordmark + copyright |

### Design System
- **Accent color** — `#BFE01D` (lime-green) throughout
- **Display font** — Anton (Google Fonts)
- **Body font** — Inter
- **Mono font** — JetBrains Mono
- Dark theme: `#050505` background
- Tailwind CSS v4 with custom `@theme` design tokens
- `label` utility class for mono uppercase tracking text
- `grain-overlay` utility for film grain texture
- `marquee-track` utility for infinite scroll animation

### Performance & UX
- Smooth scroll via [Lenis](https://github.com/darkroomengineering/lenis)
- Scroll progress bar (top of page)
- Spotlight cursor glow effect
- Mobile-responsive with dedicated mobile layouts for all hero acts
- Mobile bottom CTA bar (Call / WhatsApp / Directions)
- `cursor: none` global with custom cursor replacing native
- Text selection color matches accent

### Favicon
- Dynamic `icon.tsx` via Next.js App Router
- Dumbbell SVG at 45° rotation, transparent background, `#BFE01D` color

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.2 | Framework, App Router, SSR |
| [React](https://react.dev) | 19 | UI library |
| [Framer Motion](https://www.framer.com/motion/) | 12 | All animations & transitions |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Styling, design tokens |
| [Lenis](https://lenis.darkroom.engineering/) | 1.3 | Smooth scroll |
| [Lucide React](https://lucide.dev) | latest | Icons (MapPin etc.) |
| [TypeScript](https://www.typescriptlang.org) | 5 | Type safety |

---

## Project Structure

```
src/
├── app/
│   ├── icon.tsx          # Dynamic favicon (dumbbell SVG)
│   ├── layout.tsx        # Root layout, fonts, metadata
│   ├── page.tsx          # Page composition
│   └── globals.css       # Design tokens, Tailwind config, utilities
├── components/
│   ├── Loader.tsx         # Animated loading screen
│   ├── PageWrapper.tsx    # Loader → page orchestration
│   ├── Cursor.tsx         # Custom cursor (dot + ring)
│   ├── Navbar.tsx         # Fixed navigation
│   ├── Hero.tsx           # 3-act scroll hero
│   ├── Marquee.tsx        # Infinite ticker
│   ├── About.tsx          # About section
│   ├── Experience.tsx     # Horizontal scroll gallery
│   ├── WhyUs.tsx          # Feature list
│   ├── Programs.tsx       # Bento grid programs
│   ├── Trainers.tsx       # Coach cards
│   ├── Transformation.tsx # Member result
│   ├── Stats.tsx          # Animated counters
│   ├── Membership.tsx     # Pricing cards
│   ├── FAQ.tsx            # Accordion FAQ
│   ├── Contact.tsx        # Contact channels + address
│   ├── Footer.tsx         # Footer
│   ├── MobileCTA.tsx      # Mobile bottom bar
│   ├── Magnetic.tsx       # Magnetic button effect
│   ├── ProgressBar.tsx    # Scroll progress indicator
│   ├── SmoothScroll.tsx   # Lenis initialisation
│   └── Spotlight.tsx      # Cursor spotlight glow
└── lib/
    └── translations.ts    # EN/BN translation strings
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Install

```bash
npm install
```

### Dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

---

## Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo at [vercel.com/new](https://vercel.com/new) — zero config needed for Next.js.

### Manual

```bash
npm run build
# output in .next/
# serve with: npm run start
```

---

## Customisation

| What | Where |
|---|---|
| Gym name | `src/components/Navbar.tsx`, `Hero.tsx`, `Footer.tsx`, `layout.tsx` |
| Accent color | `src/app/globals.css` → `--color-accent: #BFE01D` |
| Location / address | `Hero.tsx` (eyebrow), `Contact.tsx` |
| Images | Replace CDN URLs in each component |
| Membership prices | `src/components/Membership.tsx` → `plans` array |
| Programs | `src/components/Programs.tsx` → `items` array |
| Trainers | `src/components/Trainers.tsx` → `list` array |
| FAQ | `src/components/FAQ.tsx` → `faqs` array |
| Phone / WhatsApp | `Contact.tsx`, `MobileCTA.tsx` |

---

## Credits

Built by [Your Agency Name] · Bangladesh

---

## License

Private project — all rights reserved.
