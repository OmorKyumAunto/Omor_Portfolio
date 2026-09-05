"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, ArrowRight, ArrowUpRight, CornerDownLeft, Mail, RotateCcw, Sparkles } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { activeSocials, hasEmail, mailtoHref, webmailComposeHref } from "@/lib/site";
import { MAX_INPUT, MIN_INPUT } from "@/lib/ai/schema";
import type { Analysis, MatchLevel } from "@/lib/ai/types";
import { useReducedMotion } from "@/hooks/use-media-query";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { duration, ease, stagger, travel } from "@/lib/motion";

/** Platforms a client can start a conversation on, in preference order. */
const directChannels = (["upwork", "linkedin"] as const)
  .map((key) => activeSocials.find((s) => s.key === key))
  .filter((s): s is NonNullable<typeof s> => Boolean(s));

type Status = "idle" | "analyzing" | "done" | "error";

/**
 * AI Project Fit Analyzer.
 *
 * A dedicated console inside the portfolio, not a floating chat bubble. The
 * visitor pastes a brief or a job posting; the server compares it against the
 * documented portfolio and returns a structured, qualitative assessment.
 */
export function ProjectFit() {
  const { aiAssistant, personal } = portfolio;
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const reduced = useReducedMotion();

  const trimmed = value.replace(/\s+/g, " ").trim();
  const tooShort = trimmed.length > 0 && trimmed.length < MIN_INPUT;
  const canSubmit = trimmed.length >= MIN_INPUT && status !== "analyzing";

  async function run(input: string) {
    setStatus("analyzing");
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch("/api/ai/project-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data: { ok?: boolean; analysis?: Analysis; error?: string } = await response
        .json()
        .catch(() => ({}));

      if (!response.ok || !data.ok || !data.analysis) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setAnalysis(data.analysis);
      setStatus("done");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  function applyExample(prompt: string) {
    setValue(prompt);
    setStatus("idle");
    setAnalysis(null);
    setError(null);
    textareaRef.current?.focus();
  }

  return (
    <Section id="project-fit" className="relative overflow-hidden border-y border-line bg-bg-deep">
      <div
        aria-hidden="true"
        className="tech-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(85%_65%_at_50%_40%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-accent/[0.08] blur-[120px]"
      />

      <div className="container-page relative">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          {/* ------------------------------------------------------- intro -- */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal y={0} duration={0.6}>
              <div className="flex items-center gap-4 pb-5">
                <span className="text-eyebrow text-accent">{aiAssistant.eyebrow}</span>
                <span aria-hidden="true" className="h-px w-16 bg-line-strong" />
                <span className="text-eyebrow tabular-nums text-fg-faint">04</span>
              </div>
            </Reveal>

            <Reveal y={20}>
              <h2 className="text-display text-[clamp(2rem,1.2rem+3.2vw,3.5rem)] text-fg">
                {aiAssistant.heading}{" "}
                <span className="text-serif-accent text-accent">{aiAssistant.headingAccent}</span>
              </h2>
            </Reveal>

            <Reveal y={18} delay={0.08}>
              <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-fg-muted">
                {aiAssistant.lead}
              </p>
            </Reveal>

            {/* Assistant identity — real photo, explicit about what this is */}
            <Reveal y={16} delay={0.14}>
              <div className="mt-9 flex items-start gap-3.5 border-t border-line pt-6">
                <span className="relative mt-0.5 size-9 shrink-0 overflow-hidden rounded-full border border-line-strong">
                  <Image
                    src={personal.photo.src}
                    alt=""
                    fill
                    sizes="36px"
                    className="object-cover saturate-[0.85]"
                    style={{ objectPosition: personal.photo.objectPosition }}
                  />
                </span>
                <div>
                  <p className="flex items-center gap-1.5 text-[0.875rem] font-medium text-fg">
                    <Sparkles aria-hidden="true" className="size-3.5 text-accent" strokeWidth={1.75} />
                    AI portfolio assistant
                  </p>
                  <p className="mt-1 max-w-xs text-[0.8125rem] leading-relaxed text-fg-subtle">
                    {aiAssistant.disclosure}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ------------------------------------------------------ console -- */}
          <Reveal y={22} amount={0.15}>
            <div className="rounded-2xl border border-line-strong bg-surface/60 backdrop-blur-sm">
              {/* Console header */}
              <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5 sm:px-6">
                <span className="text-eyebrow text-fg-faint">Project fit analyzer</span>
                <StatusPill status={status} />
              </div>

              <div className="p-5 sm:p-6">
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (canSubmit) void run(trimmed);
                  }}
                >
                  <label
                    htmlFor="fit-input"
                    className="text-eyebrow block text-fg-subtle"
                  >
                    {aiAssistant.inputLabel}
                  </label>

                  <textarea
                    ref={textareaRef}
                    id="fit-input"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={(event) => {
                      if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && canSubmit) {
                        event.preventDefault();
                        void run(trimmed);
                      }
                    }}
                    rows={6}
                    maxLength={MAX_INPUT + 500}
                    placeholder={aiAssistant.placeholder}
                    aria-describedby="fit-hint"
                    className="mt-3 w-full resize-y rounded-lg border border-line-strong bg-bg/50 px-4 py-3.5 text-[0.9375rem] leading-relaxed text-fg placeholder:text-fg-faint transition-colors duration-300 [transition-timing-function:var(--ease-expo)] hover:border-fg/25 focus:border-accent focus:outline-none"
                  />

                  <div
                    id="fit-hint"
                    className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1"
                  >
                    <span
                      className={cn(
                        "text-[0.75rem]",
                        tooShort ? "text-fg-muted" : "text-fg-faint",
                      )}
                    >
                      {tooShort
                        ? `${MIN_INPUT - trimmed.length} more characters to analyze`
                        : "Nothing is stored — your text is used for this analysis only."}
                    </span>
                    <span className="font-mono text-[0.6875rem] tabular-nums text-fg-faint">
                      {trimmed.length.toLocaleString()} / {MAX_INPUT.toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className={cn(buttonVariants({ variant: "primary", size: "md" }), "group/run")}
                    >
                      {status === "analyzing" ? "Analyzing" : aiAssistant.submitLabel}
                      {status === "analyzing" ? (
                        <PulseDots />
                      ) : (
                        <ArrowRight
                          aria-hidden="true"
                          className="size-4 transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover/run:translate-x-1"
                          strokeWidth={2}
                        />
                      )}
                    </button>

                    {status === "done" || status === "error" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setValue("");
                          setStatus("idle");
                          setAnalysis(null);
                          setError(null);
                          textareaRef.current?.focus();
                        }}
                        className={cn(buttonVariants({ variant: "quiet", size: "none" }), "gap-2 text-sm")}
                      >
                        <RotateCcw aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
                        Start over
                      </button>
                    ) : (
                      <span className="hidden items-center gap-1.5 font-mono text-[0.6875rem] text-fg-faint sm:inline-flex">
                        <CornerDownLeft aria-hidden="true" className="size-3" strokeWidth={1.75} />
                        ⌘ + Enter
                      </span>
                    )}
                  </div>
                </form>

                {/* Quick prompts */}
                {status === "idle" ? (
                  <div className="mt-7 border-t border-line pt-5">
                    <p className="text-eyebrow mb-3 text-fg-faint">Or try one of these</p>
                    <ul className="flex flex-wrap gap-2">
                      {aiAssistant.examples.map((example) => (
                        <li key={example.label}>
                          <button
                            type="button"
                            onClick={() => applyExample(example.prompt)}
                            className="rounded-full border border-line-strong px-3.5 py-2 text-[0.8125rem] text-fg-muted transition-colors duration-300 [transition-timing-function:var(--ease-expo)] hover:border-accent/40 hover:bg-accent-soft hover:text-fg"
                          >
                            {example.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {/* Results region */}
                <div
                  aria-live="polite"
                  aria-atomic="false"
                  className={cn(status === "idle" && "sr-only")}
                >
                  <AnimatePresence mode="wait">
                    {status === "analyzing" ? (
                      <Analyzing key="analyzing" label={aiAssistant.analyzingLabel} reduced={Boolean(reduced)} />
                    ) : null}
                    {status === "error" && error ? (
                      <ErrorState key="error" message={error} />
                    ) : null}
                    {status === "done" && analysis ? (
                      <Result key="result" analysis={analysis} reduced={Boolean(reduced)} />
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------- fragments -- */

function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, { label: string; tone: string }> = {
    idle: { label: "Ready", tone: "bg-fg-faint" },
    analyzing: { label: "Analyzing", tone: "bg-accent" },
    done: { label: "Complete", tone: "bg-positive" },
    error: { label: "Error", tone: "bg-danger" },
  };
  const { label, tone } = map[status];

  return (
    <span className="inline-flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-fg-muted">
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", tone)} />
      {label}
    </span>
  );
}

/** Three signal dots, matching the hero diagram's language. */
function PulseDots() {
  return (
    <span aria-hidden="true" className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1 rounded-full bg-current"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.16, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

/**
 * Staged processing.
 *
 * These are presentation states over a *single* request — the server does not
 * run four passes. They advance on a timer only to give the wait structure, and
 * the last one stays active until the real response lands, so nothing is ever
 * delayed artificially: when the answer arrives the UI cuts straight to it.
 */
const ANALYSIS_STEPS = [
  "Reading your requirements",
  "Comparing with documented projects",
  "Matching technical capabilities",
  "Preparing the assessment",
] as const;

function Analyzing({ label, reduced }: { label: string; reduced: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    // Ease off as it goes, so the last step can sit while the request finishes
    // instead of the list racing ahead of reality.
    const timers = ANALYSIS_STEPS.slice(1).map((_, i) =>
      setTimeout(() => setActive(i + 1), 600 + i * 850),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: duration.ui, ease: ease.out }}
      className="mt-7 border-t border-line pt-6"
    >
      <p className="text-[0.9375rem] text-fg-muted">{label}</p>

      <ol className="mt-5 space-y-2.5">
        {ANALYSIS_STEPS.map((stepLabel, i) => {
          const done = i < active;
          const current = i === active;
          return (
            <li
              key={stepLabel}
              className={cn(
                "flex items-center gap-3 text-[0.8125rem] transition-colors duration-500",
                done ? "text-fg-subtle" : current ? "text-fg" : "text-fg-faint",
              )}
            >
              <span aria-hidden="true" className="relative grid size-3 shrink-0 place-items-center">
                <span
                  className={cn(
                    "block rounded-full transition-all duration-500 [transition-timing-function:var(--ease-expo)]",
                    done ? "size-1.5 bg-fg-subtle" : current ? "size-2 bg-accent" : "size-1 bg-fg-faint",
                  )}
                />
                {current && !reduced ? (
                  <span className="absolute inline-flex size-2 rounded-full bg-accent/60 [animation:pulse-ring_1.8s_var(--ease-expo)_infinite]" />
                ) : null}
              </span>
              {stepLabel}
            </li>
          );
        })}
      </ol>

      {/* One moving element, not four. */}
      <div aria-hidden="true" className="mt-6 h-px w-full overflow-hidden bg-line">
        {reduced ? (
          <div className="h-full w-1/3 bg-accent/50" />
        ) : (
          <div className="h-full w-1/3 bg-linear-to-r from-transparent via-accent to-transparent [animation:rule-sweep_1.4s_var(--ease-inout)_infinite]" />
        )}
      </div>
    </motion.div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: ease.out }}
      className="mt-7 flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/[0.06] p-4"
    >
      <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-danger" strokeWidth={1.75} />
      <div>
        <p className="text-[0.875rem] text-fg">{message}</p>
        <p className="mt-1.5 text-[0.8125rem] text-fg-subtle">
          You can also{" "}
          <Link
            href="#contact"
            className="text-fg underline decoration-line-strong underline-offset-[4px] hover:decoration-accent"
          >
            reach me directly
          </Link>
          .
        </p>
      </div>
    </motion.div>
  );
}

const MATCH_TONE: Record<MatchLevel, { dot: string; text: string; bar: number }> = {
  "Strong Match": { dot: "bg-positive", text: "text-positive", bar: 100 },
  "Good Match": { dot: "bg-accent", text: "text-accent", bar: 75 },
  "Partial Match": { dot: "bg-accent-3", text: "text-accent-3", bar: 50 },
  "Limited Match": { dot: "bg-fg-muted", text: "text-fg-muted", bar: 25 },
  "Not Documented": { dot: "bg-fg-faint", text: "text-fg-muted", bar: 8 },
};

function Result({ analysis, reduced }: { analysis: Analysis; reduced: boolean }) {
  const tone = MATCH_TONE[analysis.matchLevel] ?? MATCH_TONE["Partial Match"];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: reduced ? 0 : stagger.loose, delayChildren: 0.05 },
        },
      }}
      className="mt-7 border-t border-line pt-6"
    >
      {/* Match level — conveyed by label and shape, never by colour alone */}
      <motion.div variants={blockIn(reduced)} className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <span className="inline-flex items-center gap-2.5 rounded-full border border-line-strong px-3.5 py-2">
          <span aria-hidden="true" className={cn("size-2 rounded-full", tone.dot)} />
          <span className={cn("text-[0.8125rem] font-medium", tone.text)}>
            {analysis.matchLevel}
          </span>
        </span>

        <span aria-hidden="true" className="flex min-w-24 flex-1 items-center gap-1">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              initial={{ scaleX: reduced ? 1 : 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.45, delay: reduced ? 0 : 0.25 + i * 0.08, ease: ease.out }}
              className={cn(
                "h-0.5 flex-1 origin-left rounded-full",
                tone.bar > i * 25 ? tone.dot : "bg-line-strong",
              )}
            />
          ))}
        </span>
      </motion.div>

      <motion.p variants={blockIn(reduced)} className="mt-5 text-[0.9375rem] leading-[1.7] text-fg">
        {analysis.summary}
      </motion.p>

      {analysis.relevantSkills.length > 0 ? (
        <Block title="Relevant capabilities" reduced={reduced}>
          <ul className="flex flex-wrap gap-1.5">
            {analysis.relevantSkills.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-line-strong bg-surface-2/50 px-2.5 py-1 font-mono text-[0.6875rem] text-fg-muted"
              >
                {skill}
              </li>
            ))}
          </ul>
        </Block>
      ) : null}

      {analysis.relevantProjects.length > 0 ? (
        <Block title="Relevant work" reduced={reduced}>
          <ul className="divide-y divide-[color:var(--color-line)] border-y border-line">
            {analysis.relevantProjects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/work/${project.slug}`}
                  className="group/rp flex items-start justify-between gap-4 py-3.5"
                >
                  <span>
                    <span className="block text-[0.875rem] font-medium text-fg transition-colors duration-300 group-hover/rp:text-accent">
                      {project.title}
                    </span>
                    <span className="mt-1 block text-[0.8125rem] leading-relaxed text-fg-subtle">
                      {project.why}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="mt-1 size-3.5 shrink-0 text-fg-faint transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover/rp:translate-x-1"
                    strokeWidth={1.75}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Block>
      ) : null}

      {analysis.suggestedApproach.length > 0 ? (
        <Block title="Suggested technical direction" reduced={reduced}>
          <ol className="space-y-2.5">
            {analysis.suggestedApproach.map((step, i) => (
              <li key={i} className="flex gap-3 text-[0.875rem] leading-relaxed text-fg-muted">
                <span className="text-eyebrow mt-0.5 shrink-0 tabular-nums text-fg-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Block>
      ) : null}

      {analysis.gaps.length > 0 ? (
        <Block title="Gaps / things to discuss" reduced={reduced}>
          <ul className="space-y-2.5">
            {analysis.gaps.map((gap, i) => (
              <li key={i} className="flex gap-3 text-[0.875rem] leading-relaxed text-fg-muted">
                <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-accent-3" />
                {gap}
              </li>
            ))}
          </ul>
        </Block>
      ) : null}

      <motion.div variants={blockIn(reduced)} className="mt-7 rounded-lg border border-line-strong bg-bg/40 p-5">
        <p className="text-eyebrow text-fg-faint">Recommended next step</p>
        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-fg-muted">{analysis.nextStep}</p>

        <p className="mt-6 text-[0.875rem] font-medium text-fg">Discuss this project with me</p>
        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          {hasEmail ? (
            <>
              <a
                href={mailtoHref}
                className={cn(buttonVariants({ variant: "primary", size: "md" }), "group/dc")}
              >
                <Mail aria-hidden="true" className="size-4" strokeWidth={2} />
                Email Omor
              </a>
              <a
                href={webmailComposeHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "md" }))}
              >
                Gmail
              </a>
            </>
          ) : null}

          {directChannels.map((social) => (
            <a
              key={social.key}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "md" }), "group/ch")}
            >
              {social.key === "upwork" ? "Message on Upwork" : "Connect on LinkedIn"}
              <ArrowUpRight
                aria-hidden="true"
                className="size-3.5 text-fg-subtle transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover/ch:translate-x-0.5 group-hover/ch:-translate-y-0.5"
                strokeWidth={1.75}
              />
            </a>
          ))}
        </div>

        <p className="mt-4 text-[0.75rem] leading-relaxed text-fg-faint">
          Your project description stays in your browser — it is never attached to
          the message.
        </p>
      </motion.div>
    </motion.div>
  );
}

/** Shared entrance for each result block. */
function blockIn(reduced: boolean) {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : travel.sm },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.2 : duration.reveal, ease: ease.out },
    },
  };
}

function Block({
  title,
  children,
  reduced,
}: {
  title: string;
  children: React.ReactNode;
  reduced: boolean;
}) {
  return (
    <motion.div variants={blockIn(reduced)} className="mt-7">
      <h3 className="text-eyebrow mb-3 text-fg-faint">{title}</h3>
      {children}
    </motion.div>
  );
}
