# /public

Static assets served from the site root.

## Resume — `resume.pdf`

Drop your resume here as `public/resume.pdf`.

The path is configured in `src/data/portfolio.ts` as `personal.resumeUrl`.
The site checks at build time whether the file actually exists: **if it is
missing, the "Download Resume" action is not rendered at all** — no broken link.
Add the file and the action appears automatically on the next build.

To host it elsewhere, set `resumeUrl` to a full `https://` URL instead. To hide
the action permanently, set `resumeUrl: ""`.

## Personal photo — `assets/my-image.jpg`

The portrait used in the About section and as the AI assistant's identity
avatar. Referenced as `/assets/my-image.jpg` from
`personal.photo` in `src/data/portfolio.ts`.

If you replace it, update `personal.photo.width` / `height` (they set the
frame's aspect ratio) and check `objectPosition` still keeps the face framed.

## Project screenshots — `projects/`

See [`projects/README.md`](./projects/README.md).

## Icons

Favicons and the app icon are generated from the app directory, not from here:

- `src/app/icon.svg` — browser tab icon
- `src/app/apple-icon.tsx` — Apple touch icon (rendered to PNG at build)
- `src/app/opengraph-image.tsx` — social share image

Edit those files to change the mark.
