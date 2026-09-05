import { existsSync } from "node:fs";
import path from "node:path";
import { portfolio } from "@/data/portfolio";

/**
 * Server-only asset checks.
 *
 * Import this from server components only -- it touches the filesystem.
 * It lets the UI hide actions whose file has not been added yet (the resume,
 * most importantly) instead of rendering a link that 404s.
 */

function publicFileExists(publicPath: string): boolean {
  if (!publicPath.startsWith("/")) return false;
  // Remote resumes are always considered available.
  if (/^https?:\/\//.test(publicPath)) return true;
  const clean = publicPath.split("?")[0] ?? publicPath;
  return existsSync(path.join(process.cwd(), "public", clean.replace(/^\//, "")));
}

/**
 * True when a resume URL is configured AND the file is actually present
 * (or is a remote URL). Drop `resume.pdf` into /public to enable the action.
 */
export function resumeAvailable(): boolean {
  const url = portfolio.personal.resumeUrl.trim();
  if (url.length === 0) return false;
  if (/^https?:\/\//.test(url)) return true;
  return publicFileExists(url);
}
