"use client";

import { motion } from "motion/react";
import type { ElementType, ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-media-query";
import { duration as dur, ease, stagger as step, travel, viewport } from "@/lib/motion";

/**
 * Scroll entrances.
 *
 * Three variants rather than one, so a section can pick motion that matches its
 * role instead of every block on the page rising 22px in 0.75s:
 *
 *   rise — the default. Short travel, quick settle.
 *   fade — no travel at all. For body copy, where movement is noise.
 *   mask — a wipe from the bottom edge. For posters and figures.
 *
 * All three are transform/opacity/clip-path only, so none of them trigger
 * layout. Under reduced motion every variant collapses to a short fade.
 */

export type RevealVariant = "rise" | "fade" | "mask";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  variant?: RevealVariant;
  /** Vertical travel in px. Ignored by `fade` and under reduced motion. */
  y?: number;
  delay?: number;
  duration?: number;
  /** How much of the element must be visible. Lower fires earlier. */
  amount?: number;
  once?: boolean;
};

export function Reveal({
  children,
  as = "div",
  className,
  variant = "rise",
  y = travel.md,
  delay = 0,
  duration = dur.reveal,
  amount = viewport.standard.amount,
  once = true,
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as "div"] ?? motion.div;

  const hidden = reduced
    ? { opacity: 0 }
    : variant === "fade"
      ? { opacity: 0 }
      : variant === "mask"
        ? { opacity: 0, clipPath: "inset(14% 0% 0% 0%)", y: y * 0.4 }
        : { opacity: 0, y };

  /**
   * `shown` always names every property `hidden` can set, including under
   * reduced motion. `useReducedMotion` is hydration-safe, so the first render
   * is always the full-motion branch — if the reduced `show` state omitted
   * `clipPath`, the clip applied on that first render would never be cleared
   * and the element would stay permanently cropped.
   */
  const shown =
    variant === "mask"
      ? { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", y: 0 }
      : { opacity: 1, y: 0 };

  return (
    <MotionTag
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once, amount }}
      transition={{
        duration: reduced ? 0.25 : duration,
        delay: reduced ? 0 : delay,
        ease: ease.out,
      }}
    >
      {children}
    </MotionTag>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  amount?: number;
  delayChildren?: number;
  staggerChildren?: number;
};

export function Stagger({
  children,
  className,
  amount = viewport.standard.amount,
  delayChildren = 0.04,
  staggerChildren = step.normal,
}: StaggerProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduced ? 0 : staggerChildren,
            delayChildren: reduced ? 0 : delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = travel.sm,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: reduced ? 0.25 : dur.reveal, ease: ease.out },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
