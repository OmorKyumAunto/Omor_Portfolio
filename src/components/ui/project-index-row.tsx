"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import type { Project } from "@/types/portfolio";
import { useReducedMotion } from "@/hooks/use-media-query";
import { Poster } from "./screenshot";
import { cn } from "@/lib/utils";
import { duration, ease, travel, viewport } from "@/lib/motion";

/**
 * Project index row.
 *
 * The non-featured systems used to be a four-up card grid, which flattened six
 * distinct products into wallpaper. This reads as an index instead — one full
 * width line per system, the way a table of contents does — with the poster
 * held at the end of the row and brought forward on hover or keyboard focus.
 *
 * The poster is always rendered, never hidden: hover only changes its emphasis,
 * so touch and keyboard users see exactly the same information.
 */
export function ProjectIndexRow({ project }: { project: Project }) {
  const reduced = useReducedMotion();

  return (
    <motion.article
      initial={{ opacity: 0, y: reduced ? 0 : travel.sm }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: viewport.standard.amount }}
      transition={{ duration: reduced ? 0.25 : duration.reveal, ease: ease.out }}
      className="group/row relative border-t border-line"
    >
      <Link
        href={`/work/${project.slug}`}
        className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-x-4 gap-y-4 py-6 focus-visible:outline-none md:grid-cols-[3rem_minmax(0,1.15fr)_minmax(0,0.85fr)_9.5rem_1.5rem] md:gap-x-8 md:py-7"
      >
        {/* Hover wash. Sits behind the content and bleeds past the container
            edges so the row lights up as a band, not as a boxed card. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -inset-x-4 -z-10 origin-left scale-x-0 bg-linear-to-r from-accent/[0.07] to-transparent opacity-0 transition-all duration-600 [transition-timing-function:var(--ease-expo)] group-hover/row:scale-x-100 group-hover/row:opacity-100 group-focus-within/row:scale-x-100 group-focus-within/row:opacity-100 md:-inset-x-8"
        />

        <span className="text-meta tabular-nums text-fg-faint transition-colors duration-500 group-hover/row:text-accent">
          {project.index}
        </span>

        <div className="min-w-0">
          <h4 className="truncate text-[1.0625rem] tracking-[-0.02em] text-fg transition-colors duration-500 group-hover/row:text-accent md:text-[1.1875rem]">
            {project.title}
          </h4>
          <p className="text-meta mt-1.5 text-fg-faint">{project.category}</p>
        </div>

        <p className="col-span-2 hidden text-[0.875rem] leading-relaxed text-fg-muted md:col-span-1 md:block">
          {project.tagline}
        </p>

        {/* Poster. Muted at rest, full colour and slightly larger on hover. */}
        <span
          className={cn(
            "col-start-2 block w-full max-w-[15rem] overflow-hidden rounded-md md:col-start-4 md:max-w-none",
            // Muted only where a real pointer exists. On touch there is no
            // hover to restore it, so the poster would be permanently washed out.
            "transition-all duration-700 [transition-timing-function:var(--ease-expo)]",
            "[@media(hover:hover)]:opacity-70 [@media(hover:hover)]:saturate-[0.55]",
            "group-hover/row:opacity-100 group-hover/row:saturate-100 group-focus-within/row:opacity-100 group-focus-within/row:saturate-100",
          )}
        >
          <span className="block transition-transform duration-700 [transition-timing-function:var(--ease-expo)] group-hover/row:scale-[1.04] motion-reduce:group-hover/row:scale-100">
            <Poster
              image={project.poster}
              showNote={false}
              sizes="(min-width: 768px) 160px, 240px"
              className="rounded-md"
            />
          </span>
        </span>

        <ArrowUpRight
          aria-hidden="true"
          className="hidden size-4 text-fg-faint transition-all duration-500 [transition-timing-function:var(--ease-expo)] group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:text-accent md:block"
          strokeWidth={1.75}
        />
      </Link>
    </motion.article>
  );
}
