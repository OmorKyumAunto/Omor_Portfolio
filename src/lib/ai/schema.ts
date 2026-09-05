import { z } from "zod";

export const MIN_INPUT = 20;
export const MAX_INPUT = 10_000;

/**
 * Request validation. Whitespace is normalised before length checks so a wall
 * of newlines cannot pass as a substantial brief, and the cap keeps payloads
 * (and token spend) bounded.
 */
export const analyzeRequestSchema = z.object({
  input: z
    .string()
    .max(MAX_INPUT + 2_000, "That message is too long.")
    .transform((value) => value.replace(/\s+/g, " ").trim())
    .pipe(
      z
        .string()
        .min(MIN_INPUT, `Please add a little more detail — at least ${MIN_INPUT} characters.`)
        .max(MAX_INPUT, `Please keep it under ${MAX_INPUT.toLocaleString()} characters.`),
    ),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
