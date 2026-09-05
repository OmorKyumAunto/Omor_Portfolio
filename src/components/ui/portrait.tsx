"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { portfolio } from "@/data/portfolio";
import { useReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";

/**
 * Editorial portrait.
 *
 * Not a circular avatar: the photo sits inside an architectural frame with
 * corner ticks and a mono annotation rail, revealed by a rising mask. The image
 * itself drifts slightly slower than the frame on scroll, which gives the
 * composition depth without moving anything the reader is trying to look at.
 *
 * Colour is handled with restraint — a slight desaturation and cool grade that
 * settles the photo's teal backdrop into the Signal palette, resolving to full
 * colour on hover. The face is never distorted, retouched or recomposed.
 */
export function Portrait({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { photo, name, role } = portfolio.personal;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Small, deliberate: 4% of the frame height across the whole scroll pass.
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {/* Ambient ground */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 -z-10 opacity-[var(--ambient-a)]"
      >
        <div className="absolute left-[10%] top-[12%] size-[55%] rounded-full bg-accent/14 blur-[80px]" />
        <div className="absolute bottom-[8%] right-[6%] size-[45%] rounded-full bg-accent-3/10 blur-[80px]" />
      </div>

      <div className="relative">
        {/* Corner ticks — technical annotation, not decoration for its own sake */}
        {(
          [
            "left-0 top-0 border-l border-t",
            "right-0 top-0 border-r border-t",
            "left-0 bottom-0 border-l border-b",
            "right-0 bottom-0 border-r border-b",
          ] as const
        ).map((position) => (
          <span
            key={position}
            aria-hidden="true"
            className={cn(
              "absolute z-10 size-5 border-fg/25 md:size-7",
              position,
              position.includes("left-0") ? "-translate-x-2" : "translate-x-2",
              position.includes("top-0") ? "-translate-y-2" : "translate-y-2",
            )}
          />
        ))}

        {/* The viewport trigger lives on the frame, which is never transformed.
            Driving the reveal from a clipped child instead would deadlock:
            IntersectionObserver intersects with clipping ancestors, so an
            element translated outside an overflow-hidden parent reports a ratio
            of 0 and its own whileInView could never fire. */}
        <motion.figure
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="group/portrait relative aspect-4/5 w-full overflow-hidden border border-line-strong bg-surface-2"
        >
          {/* Mask reveal: the image rises out of the frame edge. Transform only,
              so it never triggers layout or a clip-path repaint. */}
          <motion.div
            variants={{
              hidden: { y: reduced ? "0%" : "101%", opacity: reduced ? 0 : 1 },
              show: {
                y: "0%",
                opacity: 1,
                transition: { duration: reduced ? 0.4 : 1.15, ease: ease.out },
              },
            }}
            className="absolute inset-0"
          >
          <motion.div style={reduced ? undefined : { y }} className="absolute -inset-y-[5%] inset-x-0">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 34vw, (min-width: 640px) 60vw, 88vw"
              quality={88}
              className="object-cover saturate-[0.82] contrast-[1.04] transition-[filter] duration-[900ms] [transition-timing-function:var(--ease-expo)] group-hover/portrait:saturate-100"
              style={{ objectPosition: photo.objectPosition }}
            />
          </motion.div>
          </motion.div>

          {/* Cool grade that settles the photo into the Signal palette. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-bg-deep/92 via-bg-deep/45 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-accent/[0.07] mix-blend-color transition-opacity duration-[900ms] group-hover/portrait:opacity-0"
          />

          {/* Name plate */}
          <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 md:p-5">
            <div>
              <p className="text-[0.9375rem] font-medium tracking-[-0.02em] text-fg">{name}</p>
              <p className="mt-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-fg-muted">
                {role}
              </p>
            </div>
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-fg-subtle">
              {photo.caption}
            </span>
          </figcaption>
        </motion.figure>
      </div>
    </div>
  );
}
