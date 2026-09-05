"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, FileText } from "lucide-react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-media-query";
import { portfolio } from "@/data/portfolio";
import { Magnetic } from "@/components/motion/magnetic";
import { SystemVisual } from "@/components/ui/system-visual";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ease } from "@/lib/motion";

export function Hero({ resumeAvailable = false }: { resumeAvailable?: boolean }) {
  const reduced = useReducedMotion();
  const { hero, personal } = portfolio;

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: reduced ? delay * 0.4 : delay, ease: ease.out },
  });

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20 lg:min-h-[92svh] lg:pt-44 lg:pb-24"
    >
      {/* Backdrop: technical grid, masked so it never reads as wallpaper */}
      <div
        aria-hidden="true"
        className="tech-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(120%_80%_at_50%_0%,black,transparent_72%)] opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-linear-to-r from-transparent via-accent/30 to-transparent"
      />

      <div className="container-page">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 xl:gap-20">
          {/* ------------------------------------------------------- copy -- */}
          <div className="relative">
            {personal.availability.enabled ? (
              <motion.div {...fade(0.05)} className="mb-8 flex items-start gap-3 sm:items-center">
                <span aria-hidden="true" className="relative mt-[0.3rem] flex size-2 shrink-0 sm:mt-0">
                  <span className="absolute inline-flex size-full rounded-full bg-positive/60 [animation:pulse-ring_2.6s_var(--ease-expo)_infinite]" />
                  <span className="relative inline-flex size-2 rounded-full bg-positive" />
                </span>
                <span className="text-eyebrow text-fg-muted">
                  {personal.availability.label}
                </span>
              </motion.div>
            ) : null}

            <h1 className="text-display text-[clamp(2.5rem,1.1rem+5.6vw,5.25rem)] text-fg">
              {hero.headline.map((part, i) => (
                <span key={i} className="block overflow-hidden [clip-path:inset(-0.25em_-0.15em_-0.2em_-0.15em)]">
                  <motion.span
                    className="block"
                    initial={{ y: reduced ? 0 : "108%", opacity: reduced ? 0 : 1 }}
                    animate={{ y: "0%", opacity: 1 }}
                    transition={{
                      duration: reduced ? 0.4 : 1.05,
                      delay: reduced ? 0.05 * i : 0.12 + i * 0.09,
                      ease: ease.out,
                    }}
                  >
                    {part.accent ? (
                      <span className="text-serif-accent bg-linear-to-r from-accent via-accent-3 to-accent-2 bg-clip-text pr-[0.06em] text-transparent">
                        {part.text}
                      </span>
                    ) : (
                      part.text
                    )}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              {...fade(0.46)}
              className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-fg-muted md:text-lg"
            >
              {hero.lead}
            </motion.p>

            {/* CTAs — one primary, one secondary, resume kept deliberately quiet */}
            <motion.div {...fade(0.58)} className="mt-10 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Link
                  href={hero.primaryCta.href}
                  className={cn(buttonVariants({ variant: "primary", size: "lg" }), "group/p")}
                >
                  {hero.primaryCta.label}
                  <ArrowDownRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover/p:translate-y-0.5"
                    strokeWidth={2}
                  />
                </Link>
              </Magnetic>

              <Link
                href={hero.secondaryCta.href}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "group/s px-7")}
              >
                {hero.secondaryCta.label}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 text-fg-subtle transition-all duration-500 [transition-timing-function:var(--ease-expo)] group-hover/s:translate-x-0.5 group-hover/s:-translate-y-0.5 group-hover/s:text-fg"
                  strokeWidth={1.75}
                />
              </Link>

              {resumeAvailable ? (
                <a
                  href={personal.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "quiet", size: "none" }), "ml-1 gap-2 text-sm")}
                >
                  <FileText aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
                  Download Resume
                </a>
              ) : null}
            </motion.div>

            {/* Positioning line — the 10-second answer to "what does he do" */}
            <motion.div {...fade(0.7)} className="mt-12 border-t border-line pt-6">
              <p className="font-mono text-[0.75rem] leading-relaxed tracking-[0.06em] text-fg-subtle">
                {portfolio.personal.positioning
                  .split("·")
                  .map((chunk, i) => (
                    <span key={i} className="inline-block whitespace-nowrap">
                      {i > 0 ? <span className="mx-2 text-fg-faint">/</span> : null}
                      <span className={cn(i === 0 && "text-fg-muted")}>{chunk.trim()}</span>
                    </span>
                  ))}
              </p>
            </motion.div>
          </div>

          {/* ----------------------------------------------------- visual -- */}
          <div className="relative -mx-2 sm:mx-0">
            <SystemVisual className="mx-auto max-w-[34rem] lg:max-w-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
