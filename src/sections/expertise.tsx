"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { useReducedMotion } from "@/hooks/use-media-query";
import { portfolio } from "@/data/portfolio";
import { Section, SectionHeader } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";

/**
 * Experience expressed as capability areas rather than an invented employer
 * history. A scroll-linked rail tracks reading position; each row lights up as
 * it becomes the active area.
 */
export function Expertise() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 62%", "end 78%"],
  });
  const railScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <Section id="experience">
      <SectionHeader
        eyebrow="Experience"
        index="02"
        title="Where the work happens."
        align="between"
        lead="Six areas I've built in repeatedly. Each one is a class of problem, not a job title."
      />

      <div ref={containerRef} className="relative mt-16 lg:mt-24">
        <div className="relative pl-8 sm:pl-14 lg:pl-0">
          {/* Rail */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-px bg-line lg:left-[calc(16.6667%-1px)]"
          >
            <motion.div
              style={{ scaleY: reduced ? 1 : railScale }}
              className="h-full w-px origin-top bg-linear-to-b from-accent via-accent-3 to-accent-2"
            />
          </div>

          <ul>
            {portfolio.expertise.map((area, i) => (
              <li key={area.index}>
                <motion.article
                  initial={{ opacity: 0, y: reduced ? 0 : 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.75, ease: ease.out }}
                  className={cn(
                    "group/x relative grid gap-x-10 gap-y-4 py-9 transition-opacity duration-500 md:py-11",
                    "lg:grid-cols-[16.6667%_minmax(0,1fr)_minmax(0,0.8fr)] lg:items-start lg:pl-0",
                    active === i ? "opacity-100" : "opacity-100 lg:opacity-80",
                  )}
                >
                  {/* Sentinel: tracks which area is centred in the viewport.
                      Kept separate from the entrance animation above so the
                      row never animates back out once it has been revealed. */}
                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    onViewportEnter={() => setActive(i)}
                    viewport={{ margin: "-45% 0px -45% 0px" }}
                  />

                  {/* Node on the rail */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-[3.1rem] -left-8 size-[7px] -translate-x-[3.5px] rounded-full border transition-all duration-500 md:top-[3.65rem] sm:-left-14",
                      "lg:left-[16.6667%]",
                      active === i
                        ? "scale-125 border-accent bg-accent"
                        : "border-line-strong bg-bg",
                    )}
                    style={{ transitionTimingFunction: "var(--ease-expo)" }}
                  />

                  <div className="lg:pr-10">
                    <span
                      className={cn(
                        "text-display block text-[2.25rem] tabular-nums transition-colors duration-500 md:text-[3rem]",
                        active === i ? "text-fg" : "text-fg-faint",
                      )}
                    >
                      {area.index}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-[1.375rem] leading-tight tracking-[-0.025em] text-fg md:text-[1.625rem]">
                      {area.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-fg-muted">
                      {area.summary}
                    </p>
                  </div>

                  <ul className="flex flex-wrap gap-x-5 gap-y-1.5 lg:flex-col lg:gap-y-2 lg:pt-1.5">
                    {area.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-baseline gap-2 font-mono text-[0.6875rem] tracking-[0.06em] text-fg-subtle"
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "inline-block size-1 shrink-0 translate-y-[-1px] rounded-full transition-colors duration-500",
                            active === i ? "bg-accent" : "bg-fg-faint",
                          )}
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.article>

                <div aria-hidden="true" className="h-px w-full bg-line" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
