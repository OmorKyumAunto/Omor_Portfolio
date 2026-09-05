import { portfolio } from "@/data/portfolio";
import { analyzeWithGemini, isGeminiConfigured } from "./gemini";
import type { AnalyzeResult } from "./types";

/**
 * Provider abstraction. Adding another model means implementing this signature
 * and registering it below — nothing in the API route or the UI changes.
 */
export type AiProvider = {
  name: string;
  isConfigured: () => boolean;
  analyze: (input: string) => Promise<AnalyzeResult>;
};

const gemini: AiProvider = {
  name: "gemini",
  isConfigured: isGeminiConfigured,
  analyze: analyzeWithGemini,
};

const REGISTRY: Record<string, AiProvider> = { gemini };

export function resolveAiProvider(): AiProvider {
  const key = (process.env.AI_PROVIDER ?? "gemini").toLowerCase();
  return REGISTRY[key] ?? gemini;
}

/** The feature is off unless both the content flag and a key are present. */
export function isAiEnabled(): boolean {
  return portfolio.aiAssistant.enabled && resolveAiProvider().isConfigured();
}
