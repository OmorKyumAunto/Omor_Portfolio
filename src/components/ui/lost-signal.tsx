"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-media-query";

/**
 * A packet leaving the path — the 404's technical animation. Six nodes on a
 * route; the signal reaches the fourth and drifts off the line.
 */
export function LostSignal() {
  const reduced = useReducedMotion();
  const nodes = [
    [20, 120], [90, 78], [160, 132], [230, 70], [300, 118], [370, 84],
  ] as const;

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-accent/[0.07] blur-[80px]"
      />

      <svg
        viewBox="0 0 400 200"
        role="img"
        aria-label="A signal travelling along a route, then leaving the path."
        className="w-full overflow-visible"
      >
        <path
          d="M20 120 L90 78 L160 132 L230 70"
          fill="none"
          stroke="hsl(var(--line) / var(--line-strong-a))"
          strokeWidth="1.25"
        />
        {/* The broken remainder of the route */}
        <path
          d="M230 70 L300 118 L370 84"
          fill="none"
          stroke="hsl(var(--line) / var(--line-strong-a))"
          strokeWidth="1.25"
          strokeDasharray="3 7"
          opacity="0.55"
        />

        {nodes.map(([x, y], i) => (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r="4.5"
              fill="hsl(var(--bg))"
              stroke={i > 3 ? "hsl(var(--line) / 0.3)" : "hsl(var(--accent))"}
              strokeWidth="1.25"
            />
            {i <= 3 ? <circle cx={x} cy={y} r="1.75" fill="hsl(var(--accent))" /> : null}
          </g>
        ))}

        {/* The packet: follows the route, then drifts away */}
        {!reduced ? (
          <motion.circle
            r="4"
            fill="hsl(var(--accent))"
            initial={{ cx: 20, cy: 120, opacity: 0 }}
            animate={{
              cx: [20, 90, 160, 230, 300, 392],
              cy: [120, 78, 132, 70, 22, -34],
              opacity: [0, 1, 1, 1, 0.5, 0],
            }}
            transition={{
              duration: 3.6,
              times: [0, 0.16, 0.34, 0.52, 0.78, 1],
              repeat: Infinity,
              repeatDelay: 1.4,
              ease: "easeInOut",
            }}
          />
        ) : (
          <circle cx="300" cy="22" r="4" fill="hsl(var(--accent))" opacity="0.5" />
        )}

        <text
          x="316"
          y="14"
          className="fill-[hsl(var(--fg-decor))] font-mono text-[11px] tracking-[0.14em]"
        >
          404
        </text>
      </svg>
    </div>
  );
}
