import { buildSystemInstruction, buildUserPrompt } from "./prompts";
import { MATCH_LEVELS, analysisSchema, reconcileProjects, type AnalyzeResult } from "./types";

/**
 * Gemini via the REST API.
 *
 * Deliberately no SDK: one fetch call is the entire integration, and it keeps
 * the dependency footprint at zero. The API key is read from the server
 * environment only and never appears in a response, a log line or an error.
 */

const DEFAULT_MODEL = "gemini-2.5-flash";
const TIMEOUT_MS = 30_000;

/** Structured-output schema handed to Gemini so it returns parseable JSON. */
const responseSchema = {
  type: "OBJECT",
  properties: {
    matchLevel: { type: "STRING", enum: [...MATCH_LEVELS] },
    summary: { type: "STRING" },
    relevantSkills: { type: "ARRAY", items: { type: "STRING" }, maxItems: 12 },
    relevantProjects: {
      type: "ARRAY",
      maxItems: 4,
      items: {
        type: "OBJECT",
        properties: {
          slug: { type: "STRING" },
          title: { type: "STRING" },
          why: { type: "STRING" },
        },
        required: ["slug", "title", "why"],
      },
    },
    suggestedApproach: { type: "ARRAY", items: { type: "STRING" }, maxItems: 6 },
    gaps: { type: "ARRAY", items: { type: "STRING" }, maxItems: 6 },
    nextStep: { type: "STRING" },
  },
  required: ["matchLevel", "summary", "nextStep"],
} as const;

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export async function analyzeWithGemini(input: string): Promise<AnalyzeResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, code: "not_configured", error: "The assistant is not configured." };
  }

  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model,
      )}:generateContent`,
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          // Header auth keeps the key out of the URL, so it can never end up
          // in a proxy or request log.
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: buildSystemInstruction() }] },
          contents: [{ role: "user", parts: [{ text: buildUserPrompt(input) }] }],
          generationConfig: {
            temperature: 0.25,
            topP: 0.9,
            // Gemini 2.5 counts reasoning tokens against this budget. Thinking
            // is disabled below, but keep headroom so a long structured answer
            // is never truncated mid-JSON.
            maxOutputTokens: 4096,
            responseMimeType: "application/json",
            responseSchema,
            // This is a grounded extraction task with a fixed output shape --
            // reasoning tokens add latency and can starve the response budget.
            thinkingConfig: { thinkingBudget: 0 },
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
          ],
        }),
      },
    );

    if (!response.ok) {
      // Status only. The upstream body can echo request details, so it is not
      // logged and never reaches the client.
      console.error("[ai] gemini request failed with status %d", response.status);
      return {
        ok: false,
        code: "upstream_error",
        error: "The assistant is unavailable right now. Please try again shortly.",
      };
    }

    const payload: unknown = await response.json();
    const finishReason = extractFinishReason(payload);
    const text = extractText(payload);

    if (finishReason === "MAX_TOKENS") {
      console.error("[ai] response truncated by the token limit");
      return {
        ok: false,
        code: "unparsable",
        error: "That was too much to analyse at once. Try trimming it to the key requirements.",
      };
    }

    if (!text) {
      return {
        ok: false,
        code: "unparsable",
        error: "The assistant could not complete that analysis. Try rephrasing your requirements.",
      };
    }

    const parsed = safeParseJson(text);
    if (!parsed) {
      return {
        ok: false,
        code: "unparsable",
        error: "The assistant returned an unexpected response. Please try again.",
      };
    }

    const validated = analysisSchema.safeParse(parsed);
    if (!validated.success) {
      // Field paths only -- never the model text or the visitor's input.
      console.error(
        "[ai] model output failed schema validation: %s",
        validated.error.issues.map((i) => `${i.path.join(".") || "<root>"}:${i.code}`).join(", "),
      );
      return {
        ok: false,
        code: "unparsable",
        error: "The assistant returned an unexpected response. Please try again.",
      };
    }

    return { ok: true, analysis: reconcileProjects(validated.data) };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    console.error("[ai] gemini call failed: %s", aborted ? "timeout" : "network error");
    return {
      ok: false,
      code: "upstream_error",
      error: aborted
        ? "The analysis took too long. Please try again."
        : "The assistant is unavailable right now. Please try again shortly.",
    };
  } finally {
    clearTimeout(timeout);
  }
}

/** Why generation stopped, when the API reports it. */
function extractFinishReason(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) return null;
  const candidates = (payload as { candidates?: unknown }).candidates;
  if (!Array.isArray(candidates) || candidates.length === 0) return null;
  const reason = (candidates[0] as { finishReason?: unknown })?.finishReason;
  return typeof reason === "string" ? reason : null;
}

/** Pulls the text part out of a Gemini response without trusting its shape. */
function extractText(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) return null;
  const candidates = (payload as { candidates?: unknown }).candidates;
  if (!Array.isArray(candidates) || candidates.length === 0) return null;

  const parts = (candidates[0] as { content?: { parts?: unknown } })?.content?.parts;
  if (!Array.isArray(parts)) return null;

  const text = parts
    .map((part) => (typeof part === "object" && part !== null ? (part as { text?: unknown }).text : null))
    .filter((value): value is string => typeof value === "string")
    .join("");

  return text.trim().length > 0 ? text : null;
}

/** Tolerates a stray markdown fence around the JSON. */
function safeParseJson(text: string): unknown {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end <= start) return null;
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}
