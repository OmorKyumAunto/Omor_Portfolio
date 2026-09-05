"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, FileText } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { portfolio } from "@/data/portfolio";
import { useReducedMotion } from "@/hooks/use-media-query";
import { duration, ease } from "@/lib/motion";
import { Magnetic } from "@/components/motion/magnetic";
import { SystemVisual } from "@/components/ui/system-visual";
import { StatusDot } from "@/components/ui/signal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Signal V2 hero.
 *
 * V1 was a conventional two-column marketing hero. This is composed as an
 * instrument panel: a metadata strip across the top, a monumental headline that
 * breaks out past the text column, and the system diagram sitting inside the
 * composition rather than beside it.
 *
 * The headline drives everything — it is the largest type on the site by a wide
 * margin, and the supporting copy is deliberately small so the hierarchy is
 * unmistakable in the first second.
 */
export function Hero({ resumeAvailable = false }: { resumeAvailable?: boolean }) {
  const reduced = useReducedMotion();
  const { hero, personal } = portfolio;

  // Hero recedes slightly as the page moves under it, so leaving feels
  // continuous rather than like a cut. Transform + opacity only.
  const { scrollYProgress } = useScroll({ offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const stackY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  // Derived from the data, not written by hand, so these never contradict the
  // work actually listed on the site.
  const shippedLanguages = [
    "English",
    ...new Set(portfolio.projects.flatMap((p) => p.multilingual?.languages ?? [])),
  ];

  const facts: [string, string][] = [
    ["Systems", `${portfolio.projects.length} shipped`],
    ["Interfaces", shippedLanguages.join(" · ")],
    ["Based in", personal.location],
  ];

  const line = (i: number) => ({
    initial: { y: reduced ? 0 : "112%", opacity: reduced ? 0 : 1 },
    animate: { y: "0%", opacity: 1 },
    transition: {
      duration: reduced ? 0.35 : 1,
      delay: reduced ? i * 0.04 : 0.1 + i * 0.075,
      ease: ease.out,
    },
  });

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: reduced ? delay * 0.3 : delay, ease: ease.out },
  });

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-28 pb-16 md:pt-32 lg:min-h-[94svh] lg:pt-36 lg:pb-20"
    >
      {/* Sparse technical field — the lightest backdrop on the page. */}
      <div
        aria-hidden="true"
        className="tech-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.55] [mask-image:radial-gradient(115%_75%_at_50%_0%,black,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="field-rails container-page pointer-events-none absolute inset-0 -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-linear-to-r from-transparent via-accent/35 to-transparent"
      />

      <div className="container-page">
        {/* Metadata strip */}
        <motion.div
          {...fade(0.04)}
          className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line pb-4"
        >
          <span className="text-meta text-fg-subtle">{personal.role}</span>
          <span aria-hidden="true" className="hidden h-3 w-px bg-line-strong sm:block" />
          <span className="text-meta text-fg-subtle">AI Integration</span>
          {personal.availability.enabled ? (
            <span className="ml-auto flex items-center gap-2.5">
              <StatusDot />
              <span className="text-meta text-fg-muted">{personal.availability.label}</span>
            </span>
          ) : null}
        </motion.div>

        <motion.div style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}>
          {/* Monumental headline. Breaks out of the reading column on purpose. */}
          <h1 className="text-monumental mt-10 text-[clamp(2.75rem,0.4rem+9.6vw,8.5rem)] text-fg md:mt-14">
            {hero.headline.map((part, i) => (
              <span
                key={i}
                className="block overflow-hidden [clip-path:inset(-0.3em_-0.2em_-0.22em_-0.2em)]"
              >
                <motion.span className="block" {...line(i)}>
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

          {/* Supporting copy + CTAs sit in a narrow column under the headline,
              which keeps the type hierarchy unambiguous. */}
          <div className="mt-10 grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,0.52fr)_minmax(0,0.48fr)] lg:items-end">
            <motion.div {...fade(0.5)}>
              <p className="max-w-md text-[1.0625rem] leading-relaxed text-fg-muted">
                {hero.lead}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
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
                    Résumé
                  </a>
                ) : null}
              </div>
            </motion.div>

            {/* Verifiable facts, derived from the portfolio data itself so the
                numbers can never drift away from what the page actually shows. */}
            <motion.dl
              {...fade(0.62)}
              className="grid grid-cols-2 gap-x-8 gap-y-4 border-t border-line pt-5 sm:grid-cols-3 lg:border-t-0 lg:pt-0"
            >
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-meta text-fg-faint">{k}</dt>
                  <dd className="mt-1.5 font-mono text-[0.75rem] leading-snug text-fg-muted">{v}</dd>
                </div>
              ))}
            </motion.dl>
          </div>
        </motion.div>

        {/* System diagram — inside the composition, full bleed to the rails. */}
        <motion.div
          style={reduced ? undefined : { y: stackY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.editorial, delay: reduced ? 0.2 : 0.55, ease: ease.out }}
          className="relative mt-14 md:mt-20"
        >
          <SystemVisual />
        </motion.div>
      </div>
    </section>
  );
}
