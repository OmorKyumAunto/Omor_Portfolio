"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { useReducedMotion } from "@/hooks/use-media-query";
import { portfolio } from "@/data/portfolio";
import { Section, SectionHeader } from "@/components/ui/section";
import { ease } from "@/lib/motion";

/**
 * Process with a scroll-driven connector. The line between steps draws itself
 * as you read; under reduced motion it is simply already drawn.
 */
export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 65%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <Section id="process">
      <SectionHeader
        eyebrow="How I Work"
        index="08"
        trailing={`${portfolio.process.length} steps`}
        title="Six steps, no surprises."
        align="between"
        lead="The same sequence every time — so you always know what is happening and what comes next."
      />

      <div ref={ref} className="relative mt-16 lg:mt-24">
        {/* Connector: horizontal on desktop, vertical on mobile */}
        <div
          aria-hidden="true"
          className="absolute left-[7px] top-2 bottom-2 w-px bg-line lg:inset-x-0 lg:left-0 lg:top-[7px] lg:bottom-auto lg:h-px lg:w-full"
        >
          <motion.div
            style={{
              scaleY: reduced ? 1 : progress,
              scaleX: reduced ? 1 : progress,
            }}
            className="h-full w-full origin-top bg-linear-to-b from-accent via-accent-3 to-accent-2 lg:origin-left lg:bg-linear-to-r"
          />
        </div>

        <ol className="grid gap-y-10 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-0">
          {portfolio.process.map((step, i) => (
            <motion.li
              key={step.index}
              initial={{ opacity: 0, y: reduced ? 0 : 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.65, delay: i * 0.06, ease: ease.out }}
              className="relative pl-8 lg:pl-0 lg:pt-8 lg:pr-5"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-1.5 size-[15px] rounded-full border border-line-strong bg-bg lg:top-0 lg:left-0"
              />
              <span
                aria-hidden="true"
                className="absolute left-[5px] top-[11px] size-[5px] rounded-full bg-accent lg:top-[5px]"
              />

              <span className="text-meta block tabular-nums text-fg-faint">
                {step.index}
              </span>
              <h3 className="mt-2 text-[1.0625rem] font-medium tracking-[-0.015em] text-fg">
                {step.title}
              </h3>
              <p className="mt-2 max-w-xs text-[0.8125rem] leading-relaxed text-fg-subtle lg:max-w-none">
                {step.description}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
