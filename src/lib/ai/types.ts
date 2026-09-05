import { z } from "zod";
import { portfolio } from "@/data/portfolio";

/** Deliberately qualitative. No invented percentages. */
export const MATCH_LEVELS = [
  "Strong Match",
  "Good Match",
  "Partial Match",
  "Limited Match",
  "Not Documented",
] as const;

export type MatchLevel = (typeof MATCH_LEVELS)[number];

const projectSlugs = portfolio.projects.map((p) => p.slug);

/**
 * What the server will accept from the model.
 *
 * Length limits CLAMP rather than reject. A model returning fourteen relevant
 * skills instead of twelve is a valid answer with more content than the UI
 * wants to show — failing the whole analysis over it would be the wrong call.
 * Only the things that must be right (the match level, the required fields)
 * are strict.
 */
const clampedText = (max: number) =>
  z
    .string()
    .min(1)
    .transform((value) => (value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value));

const clampedList = <T extends z.ZodTypeAny>(item: T, max: number) =>
  z
    .array(item)
    .default([])
    .transform((items) => items.slice(0, max));

export const analysisSchema = z.object({
  matchLevel: z.enum(MATCH_LEVELS).catch("Partial Match"),
  summary: clampedText(900),
  relevantSkills: clampedList(clampedText(60), 12),
  relevantProjects: clampedList(
    z.object({
      slug: z.string().min(1).max(200),
      title: clampedText(140),
      why: clampedText(320),
    }),
    4,
  ),
  suggestedApproach: clampedList(clampedText(320), 6),
  gaps: clampedList(clampedText(320), 6),
  nextStep: clampedText(400),
});

export type Analysis = z.infer<typeof analysisSchema>;

/**
 * Drops any project the model may have hallucinated and repairs titles from the
 * real data, so the UI can only ever link to a project that exists.
 */
export function reconcileProjects(analysis: Analysis): Analysis {
  const relevantProjects = analysis.relevantProjects
    .filter((entry) => projectSlugs.includes(entry.slug))
    .map((entry) => {
      const project = portfolio.projects.find((p) => p.slug === entry.slug);
      return { ...entry, title: project?.title ?? entry.title };
    });

  return { ...analysis, relevantProjects };
}

export type AnalyzeSuccess = { ok: true; analysis: Analysis };
export type AnalyzeFailure = { ok: false; error: string; code: ErrorCode };
export type AnalyzeResult = AnalyzeSuccess | AnalyzeFailure;

export type ErrorCode =
  | "invalid_input"
  | "rate_limited"
  | "not_configured"
  | "upstream_error"
  | "unparsable"
  | "disabled";
