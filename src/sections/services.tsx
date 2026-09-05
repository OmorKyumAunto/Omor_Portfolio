"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-media-query";
import { ArrowRight } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ease } from "@/lib/motion";

/**
 * Services as an editorial index — full-width rows with a hover sweep, rather
 * than eight identical rounded cards.
 */
export function Services() {
  const [hovered, setHovered] = useState<number | null>(null);
  const reduced = useReducedMotion();

  return (
    <Section id="services">
      <SectionHeader
        eyebrow="Services"
        index="07"
        trailing={`${portfolio.services.length} offerings`}
        title="What I can take on."
        align="between"
        lead="Scoped engagements, or ongoing work inside a codebase you already have."
      />

      <ul
        className="mt-16 border-t border-line lg:mt-20"
        onMouseLeave={() => setHovered(null)}
      >
        {portfolio.services.map((service, i) => (
          <motion.li
            key={service.index}
            initial={{ opacity: 0, y: reduced ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.05, ease: ease.out }}
            onMouseEnter={() => setHovered(i)}
            className={cn(
              "group/sv relative border-b border-line transition-opacity duration-500",
              "[transition-timing-function:var(--ease-expo)]",
              hovered !== null && hovered !== i ? "lg:opacity-50" : "opacity-100",
            )}
          >
            {/* Hover sweep — a fill that wipes in from the left */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-surface-2/45 transition-transform duration-600 [transition-timing-function:var(--ease-expo)] group-hover/sv:scale-x-100"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-accent transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover/sv:scale-y-100"
            />

            <div className="relative grid items-baseline gap-x-8 gap-y-2.5 px-0 py-6 sm:grid-cols-[auto_minmax(0,1.05fr)_minmax(0,1fr)] md:py-7 lg:px-5">
              <span className="text-meta tabular-nums text-fg-faint transition-colors duration-400 group-hover/sv:text-accent">
                {service.index}
              </span>

              <h3 className="text-[1.125rem] tracking-[-0.025em] text-fg md:text-[1.3125rem]">
                {service.title}
              </h3>

              <div className="sm:flex sm:items-baseline sm:justify-between sm:gap-6">
                <p className="max-w-md text-[0.875rem] leading-relaxed text-fg-subtle">
                  {service.description}
                </p>
                <span className="mt-3 hidden shrink-0 flex-col items-end gap-y-1 font-mono text-[0.625rem] leading-none tracking-[0.08em] text-fg-faint sm:mt-0 xl:flex">
                  {service.deliverables.map((item) => (
                    <span key={item} className="whitespace-nowrap">{item}</span>
                  ))}
                </span>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>

      {/* CTA */}
      <Reveal y={20} className="mt-16 lg:mt-20">
        <div className="relative overflow-hidden rounded-2xl border border-line-strong px-6 py-12 sm:px-10 md:px-14 md:py-16">
          <div
            aria-hidden="true"
            className="tech-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_right,black,transparent_70%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-accent/12 blur-[90px]"
          />
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <p className="text-display max-w-2xl text-[clamp(1.5rem,1rem+2vw,2.5rem)] text-fg">
              Have an existing application that needs a new feature?{" "}
              <span className="text-serif-accent text-accent">Let&apos;s build it properly.</span>
            </p>
            <Magnetic className="shrink-0">
              <Link
                href="#contact"
                className={cn(buttonVariants({ variant: "primary", size: "lg" }), "group/c")}
              >
                Start a project
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover/c:translate-x-1"
                  strokeWidth={2}
                />
              </Link>
            </Magnetic>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
