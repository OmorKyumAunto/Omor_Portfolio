# Omor Kyum Aunto — Portfolio

A production-ready personal portfolio for a full-stack engineer, built as a
dark-first editorial product site. Every piece of content lives in one typed
data file; the UI components never need editing to change ordinary content.

**Live positioning:** Full-Stack Engineer · React · Next.js · Node.js · AI Integration

---

## Contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Editing your content](#editing-your-content)
  - [Personal information](#personal-information)
  - [Projects](#projects)
  - [Screenshots](#screenshots)
  - [Resume](#resume)
  - [Personal photo](#personal-photo)
  - [Social links](#social-links)
  - [Testimonials](#testimonials)
- [AI Project Fit Analyzer](#ai-project-fit-analyzer)
  - [How it is grounded](#how-it-is-grounded)
  - [Security](#security)
  - [Rate limiting](#rate-limiting)
  - [Disabling the AI feature](#disabling-the-ai-feature)
- [Screenshot privacy masking](#screenshot-privacy-masking)
- [Direct contact](#direct-contact)
- [Environment variables](#environment-variables)
- [Theming](#theming)
- [Architecture](#architecture)
- [Accessibility & motion](#accessibility--motion)
- [SEO](#seo)
- [Deploying to Cloudflare Workers](#deploying-to-cloudflare-workers)
- [Images](#images)
- [Analytics](#analytics)

---

## Tech stack

| Layer      | Choice                                                    |
| ---------- | --------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, React 19, Server Components)      |
| Language   | TypeScript, `strict` + `noUncheckedIndexedAccess`         |
| Styling    | Tailwind CSS v4 (CSS-first config, design tokens)         |
| Motion     | Motion (`motion/react`)                                   |
| Icons      | Lucide React (+ two inlined brand marks)                   |
| Forms      | React Hook Form + Zod                                     |
| Theming    | next-themes (dark / light / system)                       |
| AI         | Google Gemini via REST (no SDK), server-side only         |
| Hosting    | Cloudflare Workers via `@opennextjs/cloudflare`          |
| Analytics  | Vercel Analytics (Vercel only, inert elsewhere)           |

No CSS framework themes, no UI kit. `class-variance-authority` backs one small
button primitive; everything else is bespoke.

---

## Getting started

Requires **Node.js 20.9+** (built and tested on Node 22).

```bash
npm install
cp .env.example .env.local     # optional — the site runs fine without it
npm run dev
```

Open <http://localhost:3000>.

---

## Scripts

| Command             | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Development server                            |
| `npm run build`     | Production build                              |
| `npm start`         | Serve the production build                    |
| `npm run lint`      | ESLint (Next.js core-web-vitals + TypeScript) |
| `npm run typecheck` | `tsc --noEmit`                                |
| `npm run images`    | Regenerate `public/` from `source-images/`    |
| `npm run preview`   | Build and run in the Workers runtime locally  |
| `npm run deploy`    | Build and deploy to Cloudflare Workers        |

---

## Editing your content

> **Everything a visitor reads lives in [`src/data/portfolio.ts`](src/data/portfolio.ts).**
> It is fully typed against [`src/types/portfolio.ts`](src/types/portfolio.ts),
> so your editor will tell you if a field is missing or misspelled.

The UI enforces these rules for you, so nothing fake is ever rendered:

| If this is empty…            | …this happens                                  |
| ---------------------------- | ---------------------------------------------- |
| `project.liveUrl`            | The "View live" button is not rendered          |
| `project.repoUrl`            | The "Source" button is not rendered             |
| `personal.email`             | Every direct-email action disappears            |
| `personal.resumeUrl`         | The resume action disappears                    |
| `socials[].url`              | That social link disappears                     |
| `project.images`             | A designed fallback mockup renders instead      |
| `testimonials`               | The whole testimonials section disappears       |

There are no `#` placeholder links anywhere in the codebase.

### Personal information

```ts
personal: {
  name: "Omor Kyum Aunto",
  role: "Full-Stack Engineer",
  email: "",                    // ← add yours to enable mailto + copy-email
  resumeUrl: "/resume.pdf",
  location: "Dhaka, Bangladesh · Working remotely",
  availability: { enabled: true, label: "Available for selected freelance projects" },
}
```

Set `availability.enabled` to `false` when you are not taking work — the pulsing
indicator disappears from the hero and footer.

### Projects

Each entry in the `projects` array generates its homepage card, its slot in the
`/work` archive, and its own case study at `/work/<slug>`.

```ts
{
  slug: "it-asset-helpdesk-platform",   // becomes /work/it-asset-helpdesk-platform
  index: "01",
  title: "IT Asset & Helpdesk Platform",
  shortTitle: "IT Asset Platform",      // optional, for dense listings
  category: "Internal IT Operations",   // small label above the title
  featured: true,                       // larger homepage presentation
  featuredOrder: 1,                     // ordering within the featured block
  tagline: "One line, used on every card.",
  summary: "…",
  problem: "…", approach: "…", solution: "…",
  role: "…", challenge: "…", outcome: "…",
  capabilities: [...], features: [{ title, description }], technologies: [...],
  poster: { src, alt, width, height, redactions?, crop? },
  images: [ { src, alt, width, height, caption?, redactions?, crop? } ],
  multilingual: {                       // omit unless genuinely true
    languages: ["Arabic"], rtl: true, note: "…",
  },
  liveUrl: "", repoUrl: "",             // "" hides the button entirely
  hue: 214, visual: "table",            // only used by the fallback mockup
}
```

**Featured vs. more.** `featured: true` projects get the large poster-led
treatment at the top of Selected Work; the rest appear under *More systems I've
built*, and everything appears on `/work`. Change the split by flipping
`featured` — no component edits.

**`year` is optional and currently unset on every project.** Leave it out and
the UI shows a neutral "Selected Work" label rather than inventing a date.

**Posters.** `poster` is the project's primary marketing visual. It is used as
the homepage card, the `/work` card and the case-study hero. Posters are
deliberately **not** zoomable — they're covers, not detail views, which also
means the micro-type inside their embedded mockups is never rendered at a
legible size. Screenshots in `images` are zoomable.

To **add** a project, append an object — routing, static generation, metadata,
OG image, sitemap entry, next/previous navigation and the AI assistant's
knowledge all follow automatically.

### Screenshots

Full instructions live in [`docs/project-screenshots.md`](docs/project-screenshots.md).

**Current folders** (originals in `source-images/`, generated WebP in `public/`):

| Folder         | Project                          | Poster                   | Screens |
| -------------- | -------------------------------- | ------------------------ | ------- |
| `helpdesk/`    | IT Asset & Helpdesk Platform     | `helpdesk_poster`        | 3       |
| `hr-platform/` | AI Recruitment & HR Platform     | `hrm_poster`             | 3       |
| `cms/`         | Complaint Management System      | `cms_poster`             | 3       |
| `ticketing/`   | Enterprise Ticketing System      | `ticketing_poster`       | 2       |
| `ecommerce/`   | Bengali E-Commerce Storefront    | `urbanshopPoster`        | 3       |
| `drive/`       | Drive & Document Management      | `Drive_poster`           | 2       |
| `telecom/`     | Telecom Corporate Platform       | `telecom_poster`         | 2       |
| `others/`      | Arabic Service Business Platform | `Khamis_poster`          | 3       |
| `portfolios/`  | Portfolio & Personal Brand Sites | `portfolios_poster`      | 4       |

One file is intentionally unreferenced: **`ticketing/details.png`** is a ticket
list where employee names and IDs run through every card — masking it would
cover most of the content. Re-capture it with demo data to use it.

Short version — save the file, then reference it:Short version — save the file, then reference it:

```ts
images: [
  {
    src: "/projects/helpdesk/dashboard.png",
    alt: "Ticket queue sorted by SLA breach risk",
    width: 3412, height: 1826,      // required — sets the frame's aspect ratio
    caption: "Ticket queue",
    redactions: [ /* see Screenshot privacy masking below */ ],
  },
],
```

`width` and `height` are **required**: the frame takes the screenshot's own
aspect ratio so nothing is cropped and the privacy masks stay aligned. Read them
with `sips -g pixelWidth -g pixelHeight <file>` on macOS.

The first image is the project's cover on the homepage and at the top of the
case study; the rest fill the gallery. Every screenshot is clickable and opens
in a keyboard-accessible lightbox (Escape closes, focus is trapped and restored)
that only loads the full-resolution file when opened.

### Resume

Drop `resume.pdf` into [`public/`](docs/public-assets.md). The build checks that the
file exists — while it is missing, the "Download Resume" action is hidden rather
than linking to a 404. Point `personal.resumeUrl` at an `https://` URL to host
it elsewhere, or set it to `""` to remove the action permanently.

### Personal photo

The portrait lives at **`public/assets/my-image.jpg`** and is referenced as the
public path `/assets/my-image.jpg` — never a local filesystem path.

```ts
personal: {
  photo: {
    src: "/assets/my-image.jpg",
    alt: "Omor Kyum Aunto — Full-Stack Engineer",
    objectPosition: "50% 26%",   // keeps the face framed at every crop
    width: 1587, height: 2245,
    caption: "Dhaka, Bangladesh",
  },
}
```

It is used in two places:

1. **About section** — an editorial portrait in an architectural frame with
   corner ticks, a scroll-parallax drift, a mask reveal, and a restrained cool
   grade that resolves to full colour on hover. Not a circular avatar.
2. **AI assistant identity chip** — a small circular avatar beside
   "AI portfolio assistant", paired with copy making clear the analysis is
   AI-generated and not written by Omor.

To swap the photo, replace the file and update `width`/`height` (they set the
frame's aspect ratio). Adjust `objectPosition` if the face sits differently —
the first number is horizontal, the second vertical, both from the top-left.

### Social links

```ts
socials: [
  { key: "email",    label: "Email",    url: "Omorkyumaunto16@gmail.com" },
  { key: "github",   label: "GitHub",   url: "https://github.com/OmorKyumAunto" },
  { key: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/..." },
  { key: "upwork",   label: "Upwork",   url: "https://www.upwork.com/freelancers/..." },
],
```

Edit these in `personal.email` and `socials` in `src/data/portfolio.ts`. They
surface in the contact section and the footer, and every external link is
rendered with `target="_blank"` and `rel="noopener noreferrer"`.

An empty `url` hides that link everywhere — no dead icons. The GitHub, LinkedIn
and Upwork URLs also feed the JSON-LD `Person.sameAs` structured data
automatically.

### Testimonials

The section is fully built but ships empty, so no fabricated quotes appear. Add
real ones and the section renders itself:

```ts
testimonials: [
  { quote: "…", author: "Full Name", title: "CTO", company: "Company" },
],
```

---

## AI Project Fit Analyzer

A dedicated console section (`#project-fit`) where a visitor pastes a project
brief or a job posting and gets a structured, qualitative assessment of whether
the documented portfolio is a fit. It is not a floating chatbot.

The response is always structured:

```ts
{ matchLevel, summary, relevantSkills, relevantProjects, suggestedApproach, gaps, nextStep }
```

`matchLevel` is one of **Strong Match / Good Match / Partial Match /
Limited Match / Not Documented**. There are deliberately no numeric percentages,
because nothing in the portfolio supports a computed score.

### Architecture

```
Browser
  └─ POST /api/ai/project-fit
       ├─ Zod validation + whitespace normalisation   src/lib/ai/schema.ts
       ├─ Rate limit (per IP)                         src/lib/rate-limit.ts
       ├─ Provider resolution                         src/lib/ai/provider.ts
       ├─ System instruction + grounding context      src/lib/ai/prompts.ts
       │                                              src/lib/ai/context.ts
       ├─ Gemini REST call                            src/lib/ai/gemini.ts
       ├─ Schema validation of model output           src/lib/ai/types.ts
       └─ Project-slug reconciliation → UI            src/sections/project-fit.tsx
```

Adding a different model means implementing the `AiProvider` interface in
`src/lib/ai/provider.ts` and registering it. Nothing in the route or the UI
changes.

### How it is grounded

`src/lib/ai/context.ts` builds the entire grounding document **from
`src/data/portfolio.ts` at runtime**. Portfolio facts are never duplicated by
hand, so the assistant can never drift from what the site says. Update your
content and the assistant updates with it.

The system instruction forbids inventing employers, clients, years of
experience, dates, pricing, metrics, certifications, technologies, testimonials
and availability commitments, and requires the model to distinguish
**demonstrated** from **adjacent** from **undocumented** experience. When
something is not in the portfolio it says so plainly.

Model output is validated against a Zod schema server-side, and any project slug
the model returns is checked against the real project list — a hallucinated
project is dropped before it reaches the UI.

### Security

- **`GEMINI_API_KEY` is server-only.** It is read exclusively inside
  `src/lib/ai/gemini.ts`, which only ever executes in a route handler. There is
  no `NEXT_PUBLIC_` variant and there must never be one — that prefix would
  inline the key into the browser bundle.
- The key is sent as an `x-goog-api-key` header, not in the URL, so it cannot
  end up in a proxy or request log.
- The system prompt and grounding context are never sent to the browser. Asking
  the assistant to reveal them returns a short refusal.
- Visitor input is wrapped in explicit untrusted-content markers, and the system
  instruction states that instructions inside it must be ignored.
- Upstream failures log a status code only — never a response body, never the
  key, never the visitor's text.
- **Visitor prompts are not persisted.** No conversation storage, no analytics
  on prompt contents. Only the character count is logged.

### Rate limiting

`src/lib/rate-limit.ts` provides a small sliding-window limiter, applied at
**6 analyses per IP per 10 minutes**, returning `429` with a `Retry-After`
header.

> **Production limitation:** the default store is in-memory. On a serverless
> platform each instance keeps its own counters, so the effective limit is
> (limit x warm instances) and resets when an instance recycles. That is fine
> for a personal portfolio. To make it durable, implement the `RateLimitStore`
> interface against Upstash Redis or a Vercel KV-compatible client and pass it
> to `createRateLimiter` — nothing else changes.

### Disabling the AI feature

Either of these turns it off completely — the section is not rendered and the
API route returns `503`:

- leave `GEMINI_API_KEY` empty, or
- set `aiAssistant.enabled: false` in `src/data/portfolio.ts`.

### Local setup

```bash
cp .env.example .env.local
```

Then set in `.env.local` (which is gitignored):

```
AI_PROVIDER=gemini
GEMINI_API_KEY=your-key-from-aistudio.google.com/apikey
GEMINI_MODEL=gemini-2.5-flash
```

### Vercel setup

**Settings → Environment Variables**, added for Production (and Preview if you
want it there too):

| Name             | Value                                    |
| ---------------- | ---------------------------------------- |
| `AI_PROVIDER`    | `gemini`                                 |
| `GEMINI_API_KEY` | your key — mark it as a **Secret**       |
| `GEMINI_MODEL`   | `gemini-2.5-flash`                       |

Redeploy after adding them. Never paste the key into the repository, this
README, a commit message, or a client component.

---

## Screenshot privacy masking

Real product screenshots contain things that must not be published: employer
branding, employee names and IDs, client company names, hardware serial
numbers, internal hostnames and link tokens.

**Source files in `/public` are never modified.** Masking happens at render time
from data, so the originals stay intact and every mask records why it exists:

```ts
{
  src: "/projects/helpdesk/support.png",
  alt: "...",
  width: 3412, height: 1826,
  redactions: [
    { x: 2, y: 3, w: 10, h: 10, mode: "frost", reason: "Employer logo" },
    { x: 41.8, y: 54.5, w: 11.5, h: 45.5, mode: "solid",
      reason: "Employee names, employee IDs and client company names" },
  ],
}
```

- All values are **percentages of the image box**, so masks stay aligned at
  thumbnail, gallery and full-size lightbox sizes. The screenshot frame is
  locked to each image's intrinsic aspect ratio precisely so a crop can never
  slide a mask off the pixels it covers.
- `mode: "solid"` is fully opaque — use it for anything a blur could plausibly
  be reversed on (names, emails, phone numbers, serials, tokens).
- `mode: "frost"` is a heavy backdrop blur plus tint — enough for logos and
  business-unit names.
- A masked image renders a small "Regions masked for client privacy" note.

### What masking does not do

> **Masks are render-time only.** The files in `public/projects/` are still
> served at their own URLs, where no mask applies — anyone can open
> `/projects/<folder>/<file>.png` directly and see the unmasked image.
>
> Masking makes the portfolio safe to *look at*. It does not make the source
> files safe to *publish*. For anything that matters, re-capture the screen with
> demo data and replace the file.
>
> Files that should not be deployed at all live in `private-assets/`, outside
> `public/`.

Set `reviewNote` on an image to flag that it should be re-captured with demo
data before publishing.

### Cropping

`crop` trims edges in percentages — used to remove third-party logos or dead
space without touching the source file:

```ts
crop: { bottom: 24 }   // drops the bottom 24% of the image
crop: { top: 44 }      // starts 44% down
```

The image and its redaction layer are scaled and offset together inside the
clipping window, so **masks stay aligned to the pixels they cover even when the
image is cropped**. Two images use this today: the telecom poster and its
service screenshot, both to remove a band of third-party partner logos.

---

## Direct contact

**There is no contact form.** The closing section offers direct channels only —
one click to a real destination:

| Channel  | Action                                                     |
| -------- | ---------------------------------------------------------- |
| Email    | `mailto:` with a pre-filled subject, plus a copy-email button |
| Upwork   | Opens the profile in a new tab                              |
| LinkedIn | Opens the profile in a new tab                              |
| GitHub   | Opens the profile in a new tab                              |

All of it is driven by `personal.email` and `socials` in
`src/data/portfolio.ts`. Empty a `url` and that channel disappears everywhere.

The AI analyzer's result ends with the same options — **Email Omor**, **Message
on Upwork**, **Connect on LinkedIn**. The visitor's project description is never
attached to the email; it stays in their browser.

There is no contact API route, no provider adapter and no form schema. Those
files were removed along with the form, and `CONTACT_PROVIDER`, `RESEND_API_KEY`,
`FORMSPREE_ENDPOINT` and `CONTACT_WEBHOOK_URL` are no longer used or documented.

---

## Environment variables

Copy [`.env.example`](.env.example) to `.env.local`. **All of them are optional** —
the site builds and runs with none set.

| Variable                | Purpose                                                   |
| ----------------------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`  | Canonical origin for metadata, sitemap, robots, OG tags   |
| `AI_PROVIDER`           | `gemini` (the only provider currently registered)         |
| `GEMINI_API_KEY`        | **Server-only secret.** Empty disables the AI feature.    |
| `GEMINI_MODEL`          | Defaults to `gemini-2.5-flash`                            |

Only `NEXT_PUBLIC_SITE_URL` is exposed to the browser. Everything else is
server-side. `.gitignore` excludes every `.env*` file except `.env.example`, so
secrets cannot be committed by accident.

**No production domain is configured yet, and none is hardcoded.** The
canonical origin resolves in this order:

1. `NEXT_PUBLIC_SITE_URL` — set this once you have a domain
2. Vercel's own production URL (automatic on Vercel, no config needed)
3. `http://localhost:3000` for local development

So canonical URLs, the sitemap and `robots.txt` never point at a domain you do
not own, even if you deploy before configuring anything.

---

## Theming

Three modes — **dark** (the flagship), **light**, and **system** — via
`next-themes`, persisted to `localStorage` and applied as `data-theme` on `<html>`.

All colour lives as HSL channel tokens in
[`src/app/globals.css`](src/app/globals.css). Change the accent everywhere at
once by editing three lines:

```css
:root {
  --accent:   214 100% 62%;   /* primary blue   */
  --accent-2: 262 84% 68%;    /* violet         */
  --accent-3: 186 88% 56%;    /* cyan           */
}
```

The `:root[data-theme="light"]` block holds the light equivalents. Surfaces,
text tiers, hairlines, ambient-light intensity, grain and grid density are all
tokens in the same file.

> **A note on the text ramp:** `--fg-muted`, `--fg-subtle` and `--fg-faint` are
> calibrated to clear WCAG AA (4.5:1) against the background in both themes.
> `--fg-decor` is deliberately dimmer and is only used inside `aria-hidden`
> decorative artwork. If you darken the text tokens, re-check contrast.

Fonts are configured in [`src/lib/fonts.ts`](src/lib/fonts.ts) — Inter Tight
(UI/display), Instrument Serif (italic accent), JetBrains Mono (technical labels),
all self-hosted through `next/font`.

---

## Architecture

```
src/
  app/
    layout.tsx              Root shell: fonts, theme, header, footer, JSON-LD
    page.tsx                Homepage — composes sections, nothing else
    work/page.tsx           Project archive — every project, poster-first
    work/[slug]/
      page.tsx              Static params + dynamic metadata
      case-study.tsx        Case-study layout
      opengraph-image.tsx   Per-project OG image
    api/ai/project-fit/     AI Project Fit Analyzer endpoint
    opengraph-image.tsx     Site OG image
    icon.svg, apple-icon.tsx
    sitemap.ts, robots.ts, manifest.ts
    not-found.tsx, error.tsx, global-error.tsx, loading.tsx
  sections/                 One file per homepage section
  components/
    layout/                 Header, mobile nav, footer, theme toggle, JSON-LD
    motion/                 Reveal, Stagger, Magnetic, ScrollProgress
    ui/                     Button, form fields, Section, Tag, project + hero visuals
  data/portfolio.ts         ← all content
  types/portfolio.ts        ← content contract
  hooks/                    Media queries, active section, clipboard
  lib/
    ai/                     Grounding context, prompts, Gemini client, provider
    rate-limit.ts           Sliding-window limiter (swappable store)
    ...                     utils, site helpers, fonts, JSON-LD, OG fonts
```

**Server-first.** The homepage, case studies, About, Trust, AI and Testimonials
sections are Server Components. `"use client"` appears only where an interaction
genuinely needs it — the header, theme toggle, scroll-linked sections, the
capability map and the contact form.

---

## Accessibility & motion

- Semantic landmarks, one `<h1>` per page, ordered headings, skip-to-content link.
- Every form control has a real `<label>`; errors are announced via `role="alert"`
  and wired with `aria-describedby` / `aria-invalid`.
- Visible focus rings everywhere (`:focus-visible`, never suppressed for keyboards).
- Decorative artwork is `aria-hidden`; informative SVGs carry `role="img"` and a label.
- Text colours meet WCAG AA in both themes.
- **`prefers-reduced-motion` is fully respected.** Movement is removed, opacity
  transitions stay, looping animations stop, and the layout is unchanged — the
  reduced-motion experience is designed, not degraded. The preference is read
  through a hydration-safe hook so it never causes a mismatch.
- Desktop gets the cinematic treatment (sticky case-study storytelling, pointer
  parallax, magnetic CTAs); touch devices get lighter, cheaper motion.

---

## SEO

Handled through the Next.js Metadata API:

- `metadataBase`, title template, canonical URLs on every route
- Open Graph + Twitter card metadata, per-project overrides
- Dynamic OG images: one for the site, one per project (generated at build)
- JSON-LD: `Person`, `WebSite`, plus `CreativeWork` + `BreadcrumbList` per project
- `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, favicon and apple icon

Set `NEXT_PUBLIC_SITE_URL` to your real domain before deploying, or the canonical
URLs and sitemap will point at the placeholder in `portfolio.seo.siteUrl`.

---

## Deploying to Cloudflare Workers

The site is deployed on Cloudflare Workers via
[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare).

**Live:** <https://buildwith.omor.workers.dev>

### Deploy

```bash
npm run deploy      # opennextjs-cloudflare build && opennextjs-cloudflare deploy
```

`npm run preview` runs the same build locally in the Workers runtime first.

### One-time setup on a new account

```bash
npx wrangler login                    # switch accounts with `wrangler logout` first
npx wrangler secret put GEMINI_API_KEY
```

Everything else lives in `wrangler.jsonc`: the Worker name, the assets binding,
`nodejs_compat`, and the two non-secret AI variables. Only the API key is a
secret.

### Configuration notes

- **`open-next.config.ts`** uses the **static assets incremental cache**. Every
  page here is prerendered and nothing revalidates on demand, so the prerendered
  payloads are served straight from Workers static assets. Without this override
  the Worker cannot read them and every `/work/[slug]` page returns 404.
- **`.env.production`** holds `NEXT_PUBLIC_SITE_URL` and is committed on purpose
  — it contains no secrets, and `NEXT_PUBLIC_*` values are inlined at *build*
  time, so a Worker variable would be too late for canonical URLs, the sitemap
  and `robots.txt`. Change it here when you get a custom domain, then redeploy.
- **Images are pre-optimised at build time**, not by Cloudflare. See below.

### The URL

`workers.dev` URLs are always three parts:

```
<worker-name>.<account-subdomain>.workers.dev
  buildwith  .      omor         .workers.dev
```

The Worker name is set in `wrangler.jsonc`; the account subdomain is changed in
the Cloudflare dashboard (*Compute (Workers)* → *Workers & Pages* → **Change**
next to *Your subdomain*).

A bare two-part `workers.dev` hostname is not possible — the worker name is
always a required label.

**If you change the account subdomain** (Cloudflare dashboard → *Compute
(Workers)* → *Workers & Pages* → **Change** next to *Your subdomain*), two
things follow:

1. Cloudflare issues a fresh certificate for `*.<new-subdomain>.workers.dev`.
   Until it lands, the site returns `ERR_SSL_VERSION_OR_CIPHER_MISMATCH`. This
   is normal and clears on its own — usually within minutes.
2. Update `NEXT_PUBLIC_SITE_URL` in `.env.production` and run `npm run deploy`.
   `NEXT_PUBLIC_*` is inlined at build time, so canonical URLs, the sitemap and
   `robots.txt` only follow the new host after a rebuild.

### A real domain

For an actual `buildwithomor.com` (no `www.` or `.workers.dev` tail), register
the domain, add it to this Cloudflare account, then attach it under the Worker's
**Settings → Domains & Routes → Add → Custom domain**. Update
`NEXT_PUBLIC_SITE_URL` and redeploy. Same Worker, same deploy command.

---

## Images

`public/` is **generated**. The originals live in `source-images/` and are never
deployed.

```bash
npm run images      # source-images/ -> public/
```

The script (`scripts/build-images.mjs`) does three things to every file:

1. **Bakes in the privacy masks** declared in `src/data/portfolio.ts`, so the
   deployed file is masked in its own pixels — not just when the app draws over
   it. It then *verifies* each mask actually covers its region and refuses to
   write an unmasked image.
2. **Downscales** to 2560px maximum width.
3. **Re-encodes as WebP**, which took this set from 44.4 MB to 2.5 MB.

Because the files ship already optimised, `next.config.ts` sets
`images.unoptimized: true` — Cloudflare's runtime optimiser needs either the
paid Images product or a zone with transformations enabled, and neither is
necessary here.

After changing a screenshot or a redaction region, re-run `npm run images`
before deploying.

---

## Analytics

`@vercel/analytics` is wired into the root layout. On Vercel, enable Analytics in
the dashboard and it starts reporting. Anywhere else it is inert — no requests,
no cookies, nothing to configure. To remove it entirely, delete the `<Analytics />`
line from `src/app/layout.tsx` and uninstall the package.

---

## Licence

Content and design are personal to Omor Kyum Aunto. The code is yours to adapt.
