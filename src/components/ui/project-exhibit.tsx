"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight, Languages } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Project } from "@/types/portfolio";
import { useIsDesktop, useReducedMotion } from "@/hooks/use-media-query";
import { Poster } from "./screenshot";
import { cn } from "@/lib/utils";
import { duration, ease, travel, viewport } from "@/lib/motion";

/**
 * Featured project exhibit.
 *
 * V1 showed featured projects as poster-on-top / caption-underneath cards. This
 * is an exhibition instead: a dossier column of technical metadata beside a
 * poster that is by far the largest element in the section, with the project
 * numeral set as a compositional mark rather than a small label.
 *
 * Rows alternate sides so scrolling through the three featured systems reads as
 * a sequence rather than a repeated template.
 *
 * Parallax note: every transform here is applied to the poster *frame*. The
 * privacy masks are positioned in percentages of that frame, so moving the
 * image independently of it would slide the masks off the pixels they cover.
 */
export function ProjectExhibit({
  project,
  position,
  priority = false,
}: {
  project: Project;
  /** Zero-based order in the featured sequence; drives which side the poster sits on. */
  position: number;
  priority?: boolean;
}) {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const ref = useRef<HTMLElement>(null);
  const flipped = position % 2 === 1;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Small, single-axis drift. Enough to separate the poster from the page
  // without the wobble that larger ranges produce on fast scrolls.
  const posterY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  const markY = useTransform(scrollYProgress, [0, 1], ["18%", "-18%"]);
  const parallax = isDesktop && !reduced;

  const meta: [string, string][] = [
    ["System", project.index],
    ["Domain", project.category],
    ["Role", roleSummary(project.role)],
    ["Stack", project.technologies.slice(0, 5).join(" · ")],
  ];
  if (project.multilingual) {
    meta.push([
      "Languages",
      `${project.multilingual.languages.join(" · ")}${project.multilingual.rtl ? " · RTL" : ""}`,
    ]);
  }

  return (
    <motion.article
      ref={ref}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: viewport.early.amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: reduced ? 0 : 0.07 } } }}
      className="group/card relative"
    >
      <div
        className={cn(
          "grid items-center gap-x-12 gap-y-8 lg:gap-x-16",
          // The dossier is always first in the DOM so the reading and tab order
          // stay consistent; only the visual side alternates. The column widths
          // have to flip with it, or the poster inherits the narrow track.
          flipped
            ? "lg:grid-cols-[minmax(0,0.64fr)_minmax(0,0.36fr)] lg:[&>*:first-child]:order-2"
            : "lg:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)]",
        )}
      >
        {/* Dossier column */}
        <div className={cn("relative", flipped && "lg:pl-4")}>
          {/* The numeral is the compositional anchor of the row. Decorative:
              the real index is announced in the metadata list below. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-full left-0 -z-10 mb-2 block select-none"
          >
            <motion.span
              style={parallax ? { y: markY } : undefined}
              className="block text-[clamp(5rem,9vw,10rem)] leading-[0.78] font-medium tracking-[-0.06em] text-fg/[0.055] tabular-nums"
            >
              {project.index}
            </motion.span>
          </span>

          <motion.div variants={rise(reduced)}>
            <div className="flex items-center gap-3">
              <span className="text-meta text-accent">Featured System</span>
              <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
              {project.multilingual ? (
                <span className="text-meta inline-flex items-center gap-1.5 text-fg-faint">
                  <Languages aria-hidden="true" className="size-3" strokeWidth={1.75} />
                  {project.multilingual.rtl ? "RTL" : project.multilingual.languages[0]}
                </span>
              ) : null}
            </div>
          </motion.div>

          <motion.h3
            variants={rise(reduced)}
            className="mt-5 text-[clamp(1.75rem,1.1rem+2.1vw,2.75rem)] leading-[1.03] tracking-[-0.035em] text-fg"
          >
            <Link
              href={`/work/${project.slug}`}
              className="transition-colors duration-500 [transition-timing-function:var(--ease-expo)] hover:text-accent focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {project.title}
            </Link>
          </motion.h3>

          <motion.p
            variants={rise(reduced)}
            className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-fg-muted md:text-base"
          >
            {project.tagline}
          </motion.p>

          <motion.dl
            variants={rise(reduced)}
            className="mt-8 divide-y divide-line border-y border-line"
          >
            {meta.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 py-2.5">
                <dt className="text-meta pt-0.5 text-fg-faint">{k}</dt>
                <dd className="font-mono text-[0.75rem] leading-relaxed text-fg-muted">{v}</dd>
              </div>
            ))}
          </motion.dl>

          <motion.div variants={rise(reduced)} className="mt-8">
            <span className="text-meta inline-flex items-center gap-2 text-fg transition-colors duration-500 group-hover/card:text-accent">
              Explore System
              <ArrowUpRight
                aria-hidden="true"
                className="size-3.5 transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
                strokeWidth={2}
              />
            </span>
            <span
              aria-hidden="true"
              className="mt-2 block h-px w-full max-w-[9rem] origin-left scale-x-[0.28] bg-accent/70 transition-transform duration-700 [transition-timing-function:var(--ease-expo)] group-hover/card:scale-x-100"
            />
          </motion.div>
        </div>

        {/* Poster — the largest element in the section. */}
        <motion.div
          style={parallax ? { y: posterY } : undefined}
          variants={{
            hidden: reduced
              ? { opacity: 0 }
              : { opacity: 0, clipPath: "inset(0% 0% 22% 0%)", scale: 0.985 },
            // Names every property `hidden` can set, reduced-motion branch
            // included: the first render is always full-motion, so anything
            // omitted here would stay applied once the preference resolves.
            show: {
              opacity: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
              transition: { duration: reduced ? 0.3 : duration.editorial, ease: ease.out },
            },
          }}
          className="tech-corners relative"
        >
          {/* The poster is a second route to the same case study. It is hidden
              from assistive tech and removed from the tab order so the title
              link above stays the single announced target for this row. */}
          <Link
            href={`/work/${project.slug}`}
            aria-hidden="true"
            tabIndex={-1}
            className="absolute inset-0 z-10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px rounded-xl opacity-0 ring-1 ring-accent/40 transition-opacity duration-500 [transition-timing-function:var(--ease-expo)] group-hover/card:opacity-100 group-focus-within/card:opacity-100"
          />
          <Poster
            image={project.poster}
            priority={priority}
            showNote={false}
            sizes="(min-width: 1024px) 62vw, 100vw"
          />
        </motion.div>
      </div>
    </motion.article>
  );
}

const rise = (reduced: boolean) => ({
  hidden: { opacity: 0, y: reduced ? 0 : travel.sm },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0.25 : duration.reveal, ease: ease.out },
  },
});

/**
 * Role strings in the data are full sentences ("Full-stack. Data model, REST
 * API, ..."). The dossier only has room for the headline clause, and the case
 * study carries the full text.
 */
function roleSummary(role: string) {
  const first = role.split(".")[0]?.trim() ?? role;
  return first.length > 0 && first.length <= 28 ? first : role.slice(0, 48).trim();
}
