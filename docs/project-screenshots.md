# Project screenshots

Drop your screenshots into the folder that matches the project, then reference
them from `src/data/portfolio.ts`. Until you do, the site renders a designed
fallback mockup in exactly the same frame — nothing looks broken or empty.

## Folders

| Folder         | Project                          | Poster                |
| -------------- | -------------------------------- | --------------------- |
| `helpdesk/`    | IT Asset & Helpdesk Platform     | `helpdesk_poster.png` |
| `hr-platform/` | AI Recruitment & HR Platform     | `hrm_poster.png`      |
| `cms/`         | Complaint Management System      | `cms_poster.png`      |
| `ticketing/`   | Enterprise Ticketing System      | `ticketing_poster.png`|
| `ecommerce/`   | Bengali E-Commerce Storefront    | `urbanshopPoster.png` |
| `drive/`       | Drive & Document Management      | `Drive_poster.png`    |
| `telecom/`     | Telecom Corporate Platform       | `telecom_poster.png`  |
| `others/`      | Arabic Service Business Platform | `Khamis_poster.png`   |
| `portfolios/`  | Portfolio & Personal Brand Sites | `portfolios_poster.png` |

> Originals live in `source-images/`. Run `npm run images` to regenerate the
> masked, optimised WebP set in `public/`. Avoid spaces in filenames — they
> break URLs.

## Posters vs. screenshots

- The **poster** is the project's marketing visual. It becomes the homepage
  card, the `/work` card and the case-study hero. Posters are not zoomable.
- **Screenshots** are the evidence. They appear in the case-study gallery and
  open in a lightbox so the dashboard detail can actually be inspected.

Add a new project by creating a folder here, then adding the entry to
`src/data/portfolio.ts` with `poster` and `images`.

## Moved out of this folder

- `ticketing/details.png` now lives in `private-assets/ticketing/`. Employee
  names and IDs run through every ticket card, and while it sat here it was
  publicly fetchable even though nothing rendered it. Re-capture with demo data
  before bringing it back.

## Important: masks are render-time only

`redactions` in `src/data/portfolio.ts` mask regions **as the page renders**.
The original files in this folder are still served at their own URLs, where no
mask applies. Anyone can open `/projects/<folder>/<file>.png` directly and see
the unmasked image.

Masking makes the portfolio safe to *look at*. It does not make the source files
safe to *publish*. Re-capture with demo data for anything that matters.

## How to add them

1. Save your images, e.g. `public/projects/helpdesk/dashboard.png`.
2. Get its pixel size: `sips -g pixelWidth -g pixelHeight <file>`
3. Open `src/data/portfolio.ts`, find that project, and fill in `images`:

```ts
images: [
  {
    src: "/projects/helpdesk/dashboard.png",
    alt: "Helpdesk dashboard showing open ticket load by team",
    width: 3412, height: 1826,   // required
    caption: "Operational dashboard",
    redactions: [
      { x: 2, y: 3, w: 10, h: 10, mode: "frost", reason: "Employer logo" },
    ],
  },
],
```

The **first image** becomes the project's main visual on the homepage and at the
top of its case study. Every image after that fills the case-study gallery.

## What makes them look right

- **Any aspect ratio works.** The frame takes the screenshot's own ratio from
  the `width`/`height` you supply, so nothing is cropped and dashboards stay
  fully readable. This is also what keeps privacy masks aligned.
- **Recommended size: 2560 × 1600** (or 1920 × 1200 minimum). Next.js generates
  AVIF/WebP variants at every breakpoint, so upload the large version.
- **Capture in dark mode** if your app has one — it sits better in the frame.
- **Blur what is confidential.** Real names, emails, phone numbers, internal
  URLs, ticket contents, employee data, company logos. Redact before saving.
- **PNG for UI**, JPEG only for photographic content.

## Alt text

`alt` is required and is read by screen readers and search engines. Describe
what the screen *shows*, not that it is a screenshot:

- Good: `"Ticket queue filtered by SLA breach risk, sorted by age"`
- Bad: `"Screenshot 1"` / `"helpdesk.png"`

## Privacy masking

Source files here are **never modified**. Masking is applied at render time from
`redactions` in `src/data/portfolio.ts`, in percentages of the image box:

```ts
redactions: [
  { x: 2,    y: 3,    w: 10,   h: 10,   mode: "frost", reason: "Employer logo" },
  { x: 41.8, y: 54.5, w: 11.5, h: 45.5, mode: "solid", reason: "Employee names and IDs" },
]
```

- `solid` — fully opaque. Use for names, emails, phone numbers, serial numbers
  and link tokens: anything a blur could plausibly be reversed on.
- `frost` — heavy backdrop blur plus tint. Fine for logos and business-unit names.

To find coordinates, open the image, measure the region you want covered as a
percentage of the full image width/height, and pad it slightly.

Set `reviewNote: "..."` on an image to flag that it should be re-captured with
demo data before the site goes public.

**Still prefer to capture with demo data where you can.** Masking is a safety
net, not a substitute. Never commit screenshots containing credentials, API
endpoints or production database contents.
