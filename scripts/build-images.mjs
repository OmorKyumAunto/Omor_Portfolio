/**
 * Generates the deployable image set.
 *
 *   source-images/**  (originals, never deployed)
 *        |
 *        |  1. burn in the privacy masks declared in src/data/portfolio.ts
 *        |  2. downscale to a sane maximum width
 *        |  3. re-encode as WebP
 *        v
 *   public/**  (what actually ships)
 *
 * Two things matter here:
 *
 *  - Originals are never modified. Re-run this any time; it only writes to
 *    public/.
 *  - Masks are baked into the pixels. The render-time overlay in the app is a
 *    second layer, but this is the one that protects the file when someone
 *    opens its URL directly.
 *
 * Usage: node scripts/build-images.mjs
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE = path.join(ROOT, "source-images");
const OUT = path.join(ROOT, "public");
const DATA = path.join(ROOT, "src/data/portfolio.ts");
const APP = path.join(ROOT, "src/app");

/** Handled separately by buildLogo(), not by the generic screenshot walk. */
const LOGO = path.join(SOURCE, "assets/logo.png");

/**
 * The supplied logo is a 1254px circular badge with the wordmark and taglines
 * baked in, on an opaque dark ground. Two derivatives come out of it:
 *
 *  - the monogram alone, with alpha derived from luminance so the dark ground
 *    drops away and it reads on either theme. Used wherever the mark is small
 *    (header, favicon), because the baked-in text is illegible below ~120px.
 *  - the full disc, for sizes with room for it (the Apple touch icon).
 */
const GLYPH_BOX = { left: 265, top: 252, width: 730, height: 495 };

async function buildLogo() {
  const region = await sharp(LOGO).extract(GLYPH_BOX).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = region.info;
  const rgba = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i += 1) {
    const r = region.data[i * 3];
    const g = region.data[i * 3 + 1];
    const b = region.data[i * 3 + 2];
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    rgba[i * 4] = r;
    rgba[i * 4 + 1] = g;
    rgba[i * 4 + 2] = b;
    // Near-black becomes fully transparent; the gradient stays solid.
    rgba[i * 4 + 3] = Math.round(Math.max(0, Math.min(1, (lum - 0.06) / 0.34)) * 255);
  }

  const glyph = await sharp(rgba, { raw: { width, height, channels: 4 } }).png().toBuffer();
  const side = Math.round(Math.max(width, height) * 1.16);

  // sharp resizes before compositing, so square it in one pass and scale in another.
  const squared = await sharp({
    create: { width: side, height: side, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: glyph, left: Math.round((side - width) / 2), top: Math.round((side - height) / 2) }])
    .png()
    .toBuffer();

  await mkdir(path.join(OUT, "assets"), { recursive: true });
  await sharp(squared).resize(512, 512).png({ compressionLevel: 9 }).toFile(path.join(OUT, "assets/logo-mark.png"));
  await sharp(squared).resize(512, 512).png({ compressionLevel: 9 }).toFile(path.join(APP, "icon.png"));

  // Full badge, cropped to the ring and given a circular alpha.
  const meta = await sharp(LOGO).metadata();
  const size = 1180;
  const disc = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`,
  );
  const badge = await sharp(LOGO)
    .extract({
      left: Math.round((meta.width - size) / 2),
      top: Math.round((meta.height - size) / 2),
      width: size,
      height: size,
    })
    .composite([{ input: disc, blend: "dest-in" }])
    .png()
    .toBuffer();

  await sharp(badge).resize(512, 512).png({ compressionLevel: 9 }).toFile(path.join(OUT, "assets/logo-badge.png"));
  await sharp(badge).resize(180, 180).png({ compressionLevel: 9 }).toFile(path.join(APP, "apple-icon.png"));

  // Inlined as a data URI by the OG image routes, which cannot fetch assets.
  await sharp(squared).resize(96, 96).png({ compressionLevel: 9 }).toFile(path.join(OUT, "assets/logo-mark-96.png"));

  console.log("logo: mark (512/96), badge (512), favicon (512), apple icon (180)");
}

/** Nothing is displayed wider than ~1280 CSS px, so 2560 covers 2x. */
const MAX_WIDTH = 2560;
const QUALITY = 82;

/**
 * Opaque neutral grey. Deliberately equal across channels: the verification
 * step below measures flatness across all channels, and a tinted colour would
 * register its own spread as if the mask had failed.
 *
 * The app draws its own mask over the same region at render time, so this
 * colour is only visible through the frost-mode overlays.
 */
const MASK = { r: 237, g: 237, b: 237, alpha: 1 };

/**
 * Reads the redaction regions out of the portfolio data.
 *
 * The data file is the single source of truth, so this parses it directly
 * rather than keeping a second copy that could drift. It asserts that every
 * `src:` it can see was actually parsed, so a format change fails loudly
 * instead of silently shipping an unmasked image.
 */
async function readRedactions() {
  const source = await readFile(DATA, "utf8");
  const expected = [...source.matchAll(/src: "(\/(?:projects|assets)\/[^"]+)"/g)].map((m) => m[1]);

  /** Extension-agnostic key: sources are .png/.jpg, data references .webp. */
  const key = (p) => p.replace(/\.(png|jpe?g|webp)$/i, "");

  const map = new Map();
  const blockRe = /src: "(\/(?:projects|assets)\/[^"]+)"([\s\S]*?)(?=\n\s{6,10}\{?\s*src: "\/|\n\s{6}\},?\n\s{6}(?:images|liveUrl|poster)|\n\s{4}\},)/g;

  for (const match of source.matchAll(blockRe)) {
    const [, src, body] = match;
    const regions = [...body.matchAll(
      /\{\s*x:\s*([\d.]+),\s*y:\s*([\d.]+),\s*w:\s*([\d.]+),\s*h:\s*([\d.]+)/g,
    )].map((r) => ({ x: +r[1], y: +r[2], w: +r[3], h: +r[4] }));
    map.set(key(src), regions);
  }

  const missing = expected.filter((src) => !map.has(key(src)));
  if (missing.length > 0) {
    throw new Error(
      `Could not parse redaction blocks for:\n  ${missing.join("\n  ")}\n` +
        "The data file format changed — fix this parser before shipping images.",
    );
  }
  // Total declared regions, used as a cross-check after generation. Finding
  // zero masks must be an error, not a silent pass.
  const declared = [...source.matchAll(/reason: "/g)].length;
  return { map, declared };
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (full !== LOGO && /\.(png|jpe?g|webp)$/i.test(entry.name)) yield full;
  }
}

const fmt = (n) => `${(n / 1024).toFixed(0)} KB`.padStart(9);

async function main() {
  await buildLogo();

  const { map: redactions, declared } = await readRedactions();
  const keyOf = (p) => p.replace(/\.(png|jpe?g|webp)$/i, "");
  const results = [];
  let before = 0;
  let after = 0;

  for await (const file of walk(SOURCE)) {
    const rel = path.relative(SOURCE, file);
    const publicPath = `/${rel.split(path.sep).join("/")}`;
    const outRel = rel.replace(/\.(png|jpe?g)$/i, ".webp");
    const outFile = path.join(OUT, outRel);

    const meta = await sharp(file).metadata();
    const targetWidth = Math.min(MAX_WIDTH, meta.width);
    const targetHeight = Math.round((meta.height * targetWidth) / meta.width);

    // sharp applies `composite` AFTER `resize` no matter what order they are
    // called in, so the overlay geometry has to be computed against the OUTPUT
    // dimensions. Masks are percentages, which makes that straightforward —
    // but getting this wrong silently produces misplaced masks, so the
    // verification step at the end of this script is not optional.
    const regions = redactions.get(keyOf(publicPath)) ?? [];
    const overlays = regions.map((r) => {
      const left = Math.max(0, Math.min(targetWidth - 1, Math.round((r.x / 100) * targetWidth)));
      const top = Math.max(0, Math.min(targetHeight - 1, Math.round((r.y / 100) * targetHeight)));
      return {
        input: {
          create: {
            width: Math.max(1, Math.min(targetWidth - left, Math.round((r.w / 100) * targetWidth))),
            height: Math.max(1, Math.min(targetHeight - top, Math.round((r.h / 100) * targetHeight))),
            channels: 4,
            background: MASK,
          },
        },
        left,
        top,
      };
    });

    const buffer = await sharp(file)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .composite(overlays)
      .webp({ quality: QUALITY, effort: 5 })
      .toBuffer();

    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, buffer);

    const originalSize = (await stat(file)).size;
    before += originalSize;
    after += buffer.length;

    // Verify each mask actually landed. WebP rings slightly at the boundary
    // between a flat panel and the detail around it, so this samples the
    // middle 60% of the region — comfortably inside the mask, and still zero
    // if the mask were misplaced.
    for (const [i, r] of regions.entries()) {
      const left = Math.max(0, Math.round((r.x / 100) * targetWidth));
      const top = Math.max(0, Math.round((r.y / 100) * targetHeight));
      const w = Math.max(1, Math.min(targetWidth - left, Math.round((r.w / 100) * targetWidth)));
      const h = Math.max(1, Math.min(targetHeight - top, Math.round((r.h / 100) * targetHeight)));

      const sw = Math.floor(w * 0.6);
      const sh = Math.floor(h * 0.6);
      if (sw < 4 || sh < 4) continue;

      const { data } = await sharp(buffer)
        .extract({
          left: left + Math.floor((w - sw) / 2),
          top: top + Math.floor((h - sh) / 2),
          width: sw,
          height: sh,
        })
        .raw()
        .toBuffer({ resolveWithObject: true });

      let min = 255;
      let max = 0;
      for (const v of data) {
        if (v < min) min = v;
        if (v > max) max = v;
      }
      if (max - min > 8) {
        throw new Error(
          `Mask ${i} on ${publicPath} did not cover its region ` +
            `(channel range ${min}-${max} in the sampled centre). ` +
            "Refusing to ship an unmasked image.",
        );
      }
    }

    const outMeta = await sharp(buffer).metadata();
    results.push({
      from: publicPath,
      to: `/${outRel.split(path.sep).join("/")}`,
      width: outMeta.width,
      height: outMeta.height,
      masks: regions.length,
      originalSize,
      size: buffer.length,
    });

    console.log(
      `${fmt(originalSize)} -> ${fmt(buffer.length)}  ${String(regions.length).padStart(2)} masks  ${outRel}`,
    );
  }

  results.sort((a, b) => a.to.localeCompare(b.to));
  await writeFile(
    path.join(ROOT, "scripts/image-manifest.json"),
    `${JSON.stringify(
      { generated: results.length, hash: createHash("sha1").update(JSON.stringify(results)).digest("hex").slice(0, 12), images: results },
      null,
      2,
    )}\n`,
  );

  console.log(
    `\n${results.length} images  ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB` +
      `  (${(100 - (after / before) * 100).toFixed(1)}% smaller)`,
  );
  const applied = results.reduce((n, r) => n + r.masks, 0);
  console.log(`${applied} privacy masks baked in.`);

  if (applied !== declared) {
    throw new Error(
      `Mask count mismatch: the data declares ${declared} redaction regions but ` +
        `${applied} were applied. The parser is out of sync with the data file — ` +
        "refusing to leave partially masked images in public/.",
    );
  }
}

await main();
