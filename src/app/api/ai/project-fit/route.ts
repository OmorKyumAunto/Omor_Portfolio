import { NextResponse } from "next/server";
import { analyzeRequestSchema } from "@/lib/ai/schema";
import { isAiEnabled, resolveAiProvider } from "@/lib/ai/provider";
import { clientKey, createRateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * AI Project Fit Analyzer endpoint.
 *
 * Browser -> here -> validate -> rate limit -> portfolio context -> Gemini ->
 * schema-validated response -> UI. The API key never leaves this process, and
 * visitor prompts are never persisted or logged.
 */

// 6 analyses per IP per 10 minutes. Generous for a real visitor, tight enough
// that the endpoint cannot be used as free model access.
const limiter = createRateLimiter({ limit: 6, windowMs: 10 * 60 * 1000 });

export async function POST(request: Request) {
  if (!isAiEnabled()) {
    return NextResponse.json(
      { ok: false, code: "disabled", error: "The assistant is currently unavailable." },
      { status: 503 },
    );
  }

  const { allowed, retryAfter } = await limiter(clientKey(request));
  if (!allowed) {
    return NextResponse.json(
      {
        ok: false,
        code: "rate_limited",
        error: "You've reached the analysis limit. Please try again in a few minutes.",
      },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_input", error: "Invalid request." },
      { status: 400 },
    );
  }

  const parsed = analyzeRequestSchema.safeParse(payload);
  if (!parsed.success) {
    // Only the length messages are written for a human to read. Anything else
    // means a malformed request, so return a generic message rather than
    // surfacing a raw validator string.
    const issue = parsed.error.issues.find((i) => i.code === "too_small" || i.code === "too_big");
    return NextResponse.json(
      {
        ok: false,
        code: "invalid_input",
        error: issue?.message ?? "Please check your input and try again.",
      },
      { status: 422 },
    );
  }

  // Only operational metadata is logged -- never the visitor's text.
  console.info("[ai] analysis requested (%d chars)", parsed.data.input.length);

  const result = await resolveAiProvider().analyze(parsed.data.input);

  if (!result.ok) {
    const status = result.code === "not_configured" ? 503 : 502;
    return NextResponse.json(
      { ok: false, code: result.code, error: result.error },
      { status },
    );
  }

  return NextResponse.json({ ok: true, analysis: result.analysis });
}
