"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin reading-progress rule pinned under the header. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-px origin-left bg-linear-to-r from-accent via-accent-3 to-accent-2"
    />
  );
}
