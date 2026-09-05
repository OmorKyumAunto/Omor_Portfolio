"use client";

import Link from "next/link";
import { ArrowUpRight, Languages } from "lucide-react";
import { motion } from "motion/react";
import type { Project } from "@/types/portfolio";
import { useReducedMotion } from "@/hooks/use-media-query";
import { Poster } from "./screenshot";
import { cn } from "@/lib/utils";
import { duration, ease, stagger, travel, viewport } from "@/lib/motion";

/**
 * Poster-led project card.
 *
 * The poster does the talking: the surrounding copy is category, name, one line
 * of value and the stack. Everything else lives in the case study.
 */
export function ProjectCard({
  project,
  priority = false,
  size = "regular",
  sizes,
  className,
}: {
  project: Project;
  priority?: boolean;
  /** "feature" gets the larger homepage treatment. */
  size?: "feature" | "regular";
  sizes?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const isFeature = size === "feature";

  /**
   * The poster is wiped in from its bottom edge and settles from a hair under
   * full size. Both effects run on the *frame*, never on the image inside it —
   * the privacy masks are positioned in percentages of that frame, so anything
   * that moved the image independently would slide them off their targets.
   */
  const posterHidden = reduced
    ? { opacity: 0 }
    : { opacity: 0, clipPath: "inset(18% 0% 0% 0%)", scale: 0.985 };
  // Names every property `hidden` can set, reduced motion included: the first
  // render is always the full-motion branch, so anything omitted here would
  // never be cleared once the reduced-motion preference resolves.
  const posterShown = { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", scale: 1 };

  return (
    <motion.article
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: isFeature ? viewport.early.amount : viewport.standard.amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduced ? 0 : stagger.tight, delayChildren: 0.02 } },
      }}
      className={cn("group/card relative", className)}
    >
      <Link href={`/work/${project.slug}`} className="block focus-visible:outline-none">
        {/* Poster */}
        <motion.div
          className="relative"
          variants={{
            hidden: posterHidden,
            show: {
              ...posterShown,
              transition: {
                duration: reduced ? 0.25 : isFeature ? duration.editorial : duration.reveal,
                ease: ease.out,
              },
            },
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px rounded-xl opacity-0 ring-1 ring-accent/45 transition-opacity duration-400 [transition-timing-function:var(--ease-expo)] group-hover/card:opacity-100 group-focus-within/card:opacity-100"
          />
          <Poster
            image={project.poster}
            priority={priority}
            showNote={false}
            sizes={
              sizes ??
              (isFeature
                ? "(min-width: 1024px) 62vw, 100vw"
                : "(min-width: 1024px) 42vw, 100vw")
            }
          />
        </motion.div>

        {/* Meta */}
        <motion.div
          className={cn("mt-5", isFeature && "md:mt-7")}
          variants={{
            hidden: { opacity: 0, y: reduced ? 0 : travel.sm },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: reduced ? 0.25 : duration.reveal, ease: ease.out },
            },
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-eyebrow tabular-nums text-accent">{project.index}</span>
            <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
            <span className="text-eyebrow text-fg-faint">{project.category}</span>
            {project.multilingual ? (
              <span className="text-eyebrow ml-auto inline-flex items-center gap-1.5 text-fg-faint">
                <Languages aria-hidden="true" className="size-3" strokeWidth={1.75} />
                {project.multilingual.rtl ? "RTL" : project.multilingual.languages[0]}
              </span>
            ) : null}
          </div>

          <h3
            className={cn(
              "mt-3 tracking-[-0.03em] text-fg transition-colors duration-500 group-hover/card:text-accent",
              isFeature
                ? "text-[clamp(1.5rem,1rem+1.6vw,2.25rem)] leading-[1.1]"
                : "text-[1.25rem] leading-tight md:text-[1.375rem]",
            )}
          >
            {project.title}
          </h3>

          <p
            className={cn(
              "mt-2.5 max-w-xl leading-relaxed text-fg-muted",
              isFeature ? "text-[0.9375rem] md:text-base" : "text-[0.875rem]",
            )}
          >
            {project.tagline}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.6875rem] tracking-[0.05em] text-fg-faint">
              {project.technologies.slice(0, 4).map((tech, i) => (
                <span key={tech}>
                  {i > 0 ? <span className="mr-2 text-fg-faint/60">·</span> : null}
                  {tech}
                </span>
              ))}
            </span>

            <span className="inline-flex items-center gap-1.5 border-b border-line-strong pb-0.5 text-[0.8125rem] text-fg transition-colors duration-300 group-hover/card:border-accent">
              View case study
              <ArrowUpRight
                aria-hidden="true"
                className="size-3.5 text-fg-subtle transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
                strokeWidth={1.75}
              />
            </span>
          </div>
        </motion.div>
      </Link>
    </motion.article>
  );
}
