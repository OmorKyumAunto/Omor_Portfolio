"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-media-query";
import { portfolio } from "@/data/portfolio";
import { Section, SectionHeader } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import type { SkillGroup } from "@/types/portfolio";
import { duration, ease, stagger, travel, viewport } from "@/lib/motion";

const ROW = 30;
const groups = portfolio.skills;

/**
 * Capability map — a circuit fan-out rather than a grid of icons or, worse,
 * meaningless percentage bars. A shared bus connects five layers; each layer
 * fans out to the capabilities it contains. Hovering a layer traces its path.
 */
export function Capabilities() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <Section id="capabilities">
      <SectionHeader
        eyebrow="Capabilities"
        index="05"
        title="One connected stack."
        align="between"
        lead="Not a list of logos. These are the layers I work across, and how they connect in the systems I build."
      />

      <div
        className="mt-16 lg:mt-24"
        onMouseLeave={() => setHovered(null)}
      >
        {/* Shared bus — desktop only; it is the horizontal spine of the map */}
        <div aria-hidden="true" className="relative hidden h-10 lg:block">
          <div className="absolute inset-x-0 top-5 h-px bg-line-strong" />
          <div
            className="absolute inset-x-0 top-5 grid h-px"
            style={{ gridTemplateColumns: `repeat(${groups.length}, minmax(0,1fr))` }}
          >
            {groups.map((group) => (
              <span key={group.id} className="relative">
                <motion.span
                  className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                  animate={{
                    backgroundColor:
                      hovered === group.id ? "hsl(var(--accent))" : "hsl(var(--bg))",
                    borderColor:
                      hovered === group.id
                        ? "hsl(var(--accent))"
                        : "hsl(var(--line) / var(--line-strong-a))",
                    scale: hovered === group.id ? 1.35 : 1,
                  }}
                  transition={{ duration: 0.4, ease: ease.out }}
                />
                <span className="absolute left-1/2 top-1/2 h-5 w-px -translate-x-1/2 bg-line" />
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-8">
          {groups.map((group, i) => (
            <Layer
              key={group.id}
              group={group}
              order={i}
              hovered={hovered}
              onHover={setHovered}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

function Layer({
  group,
  order,
  hovered,
  onHover,
}: {
  group: SkillGroup;
  order: number;
  hovered: string | null;
  onHover: (id: string | null) => void;
}) {
  const reduced = useReducedMotion();
  const isActive = hovered === group.id;
  const isDimmed = hovered !== null && !isActive;
  const height = group.items.length * ROW;

  return (
    <motion.div
      onMouseEnter={() => onHover(group.id)}
      onFocus={() => onHover(group.id)}
      initial="hidden"
      whileInView="show"
      viewport={viewport.standard}
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : travel.md },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: reduced ? 0.25 : duration.reveal,
            ease: ease.out,
            delay: reduced ? 0 : order * 0.06,
            staggerChildren: reduced ? 0 : stagger.tight,
            delayChildren: reduced ? 0 : order * 0.06 + 0.12,
          },
        },
      }}
      className={cn(
        "relative transition-opacity duration-500 [transition-timing-function:var(--ease-expo)]",
        isDimmed ? "lg:opacity-45" : "opacity-100",
      )}
    >
      <div className="flex items-baseline gap-3 border-t border-line pt-4 lg:border-t-0 lg:pt-0">
        <span
          className={cn(
            "text-eyebrow tabular-nums transition-colors duration-400",
            isActive ? "text-accent" : "text-fg-faint",
          )}
        >
          {String(order + 1).padStart(2, "0")}
        </span>
        <h3 className="text-[0.9375rem] font-medium tracking-[-0.01em] text-fg">
          {group.label}
        </h3>
      </div>

      <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-fg-subtle">
        {group.description}
      </p>

      {/* Fan-out */}
      <div className="relative mt-6" style={{ height }}>
        <svg
          aria-hidden="true"
          width="22"
          height={height}
          viewBox={`0 0 22 ${height}`}
          className="absolute left-0 top-0 overflow-visible"
        >
          {/* Trunk */}
          <motion.line
            x1="5"
            y1="0"
            x2="5"
            y2={(group.items.length - 1) * ROW + ROW / 2}
            strokeWidth="1"
            stroke={
              isActive
                ? "hsl(var(--accent) / 0.7)"
                : "hsl(var(--line) / var(--line-strong-a))"
            }
            style={{ transition: "stroke 400ms var(--ease-expo)" }}
            variants={{
              hidden: { pathLength: reduced ? 1 : 0 },
              show: {
                pathLength: 1,
                transition: { duration: reduced ? 0 : 0.5, ease: ease.out },
              },
            }}
          />
          {group.items.map((item, i) => {
            const y = i * ROW + ROW / 2;
            return (
              <motion.path
                key={item}
                d={`M5 ${y - 11} Q 5 ${y} 17 ${y}`}
                fill="none"
                strokeWidth="1"
                stroke={
                  isActive
                    ? "hsl(var(--accent) / 0.55)"
                    : "hsl(var(--line) / var(--line-strong-a))"
                }
                style={{ transition: "stroke 400ms var(--ease-expo)" }}
                variants={{
                  hidden: { pathLength: reduced ? 1 : 0, opacity: reduced ? 1 : 0 },
                  show: {
                    pathLength: 1,
                    opacity: 1,
                    transition: {
                      duration: reduced ? 0 : 0.35,
                      delay: reduced ? 0 : 0.28 + i * 0.05,
                      ease: ease.out,
                    },
                  },
                }}
              />
            );
          })}
        </svg>

        <ul className="relative">
          {group.items.map((item, i) => (
            <motion.li
              key={item}
              className="flex items-center pl-[26px]"
              style={{ height: ROW }}
              variants={{
                hidden: { opacity: 0, x: reduced ? 0 : -travel.xs },
                show: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: reduced ? 0.2 : duration.ui,
                    delay: reduced ? 0 : 0.34 + i * 0.05,
                    ease: ease.out,
                  },
                },
              }}
            >
              <motion.span
                aria-hidden="true"
                className="mr-2.5 size-[3px] rounded-full"
                animate={{
                  backgroundColor: isActive
                    ? "hsl(var(--accent))"
                    : "hsl(var(--fg-faint))",
                }}
                transition={{ duration: 0.35, delay: isActive ? i * 0.03 : 0 }}
              />
              <span
                className={cn(
                  "text-[0.8125rem] leading-none transition-colors duration-400",
                  isActive ? "text-fg" : "text-fg-muted",
                )}
              >
                {item}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
