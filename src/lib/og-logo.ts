import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * The brand mark as a data URI, for the generated Open Graph images.
 *
 * `ImageResponse` cannot fetch site-relative assets, and these routes are
 * prerendered at build time, so the file is read from disk and inlined.
 * Returns null rather than throwing — a social image without the mark is far
 * better than a build that fails over one.
 */
export async function loadLogoDataUri(): Promise<string | null> {
  try {
    const file = path.join(process.cwd(), "public/assets/logo-mark-96.png");
    const buffer = await readFile(file);
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}
