"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useIsDesktop, useReducedMotion } from "@/hooks/use-media-query";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Signal Stack V2.
 *
 * V1 was a tall vertical diagram sized for a narrow hero column. V2 reads left
 * to right as a system pipeline, which is both what the architecture actually
 * looks like and what lets it sit full width inside the hero composition.
 *
 *   INTERFACE → API → DATA → AI → AUTOMATION
 *
 * A single signal travels the rail on a long cycle. One moving element, not
 * five, and it stops entirely under reduced motion.
 *
 * Below 1024px the same five stages become a horizontally swipeable track of
 * technical panels. Five columns will not survive a phone, and stacking them
 * vertically turns an architecture into a bullet list — the horizontal track
 * keeps the left-to-right reading that is the whole point of the diagram.
 * Native scroll-snap only: no carousel library, and vertical page scrolling is
 * never intercepted.
 */

type Layer = {
  index: string;
  label: string;
  meta: string;
  glyph: "interface" | "api" | "data" | "ai" | "automation";
};

const LAYERS: Layer[] = [
  { index: "01", label: "Interface", meta: "React · Next.js", glyph: "interface" },
  { index: "02", label: "API", meta: "Node.js · REST", glyph: "api" },
  { index: "03", label: "Data", meta: "PostgreSQL · MySQL", glyph: "data" },
  { index: "04", label: "AI", meta: "LLM integration", glyph: "ai" },
  { index: "05", label: "Automation", meta: "Workflows · Jobs", glyph: "automation" },
];

export function SystemVisual({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const animate = isDesktop && !reduced;

  return (
    <div
      className={cn("relative", className)}
      role="group"
      aria-label="System architecture: an interface layer calling an API, backed by a database, with AI and automation layers alongside."
    >
      {/* Ambient wash */}
      <div aria-hidden="true" className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 opacity-[var(--ambient-a)]">
        <div className="absolute left-[6%] top-1/4 size-[38%] rounded-full bg-accent/16 blur-[90px]" />
        <div className="absolute right-[10%] top-1/3 size-[32%] rounded-full bg-accent-2/14 blur-[100px]" />
      </div>

      <div className="relative border-y border-line py-8 md:py-10">
        {/* Desktop rail. The signal sweep rides this line. */}
        <div
          aria-hidden="true"
          className="absolute top-[2.15rem] left-0 hidden h-px w-full bg-line-strong lg:block"
        >
          {animate ? (
            <motion.span
              className="absolute -top-px h-px w-24 bg-linear-to-r from-transparent via-accent to-transparent"
              initial={{ left: "-10%", opacity: 0 }}
              animate={{ left: ["-10%", "100%"], opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 4.2,
                times: [0, 0.08, 0.9, 1],
                repeat: Infinity,
                repeatDelay: 3.4,
                ease: "linear",
                delay: 1.2,
              }}
            />
          ) : null}
        </div>

        {/* ------------------------------------------------- desktop (lg+) -- */}
        <ol className="relative hidden lg:grid lg:grid-cols-5 lg:gap-x-6">
          {LAYERS.map((layer, i) => (
            <motion.li
              key={layer.label}
              initial={{ opacity: 0, y: reduced ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduced ? 0.3 : 0.7,
                delay: reduced ? 0 : 0.7 + i * 0.09,
                ease: ease.out,
              }}
              className="relative pr-4"
            >
              {/* Node on the rail */}
              <span
                aria-hidden="true"
                className="absolute top-[0.95rem] left-0 grid size-2.5 place-items-center"
              >
                <span className="size-2.5 rounded-full border border-accent/60 bg-bg" />
                <span className="absolute size-1 rounded-full bg-accent" />
              </span>

              <div className="pt-8">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-meta tabular-nums text-fg-faint">{layer.index}</span>
                  <span className="text-[0.9375rem] font-medium tracking-[-0.015em] text-fg">
                    {layer.label}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[0.6875rem] tracking-[0.04em] text-fg-subtle">
                  {layer.meta}
                </p>
                <Glyph kind={layer.glyph} className="mt-4" />
              </div>
            </motion.li>
          ))}
        </ol>

        {/* -------------------------------------------- mobile + tablet -- */}
        <MobilePipeline reduced={reduced} />
      </div>
    </div>
  );
}

/**
 * The same five stages as a horizontally swipeable track, below 1024px.
 *
 * Native scroll-snap does all the work — no carousel package, no gesture
 * interception. `touch-action` is left alone so a mostly-vertical swipe still
 * scrolls the page; only `overscroll-x-contain` is set, which stops a
 * horizontal fling from chaining into the browser's back gesture without
 * touching the vertical axis.
 *
 * Panels are sized so one stage dominates and the next one is visibly cut off
 * at the right edge. That peek is the affordance, which is why the scrollbar
 * chrome can be hidden without hiding the interaction.
 */
function MobilePipeline({ reduced }: { reduced: boolean }) {
  const trackRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // A narrow band down the middle of the track: exactly one panel can be
    // inside it, so this fires about five times over the whole gesture rather
    // than on every frame.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = Number((entry.target as HTMLElement).dataset.stage);
          if (!Number.isNaN(i)) setActive(i);
        }
      },
      { root: track, rootMargin: "0px -48% 0px -48%", threshold: 0 },
    );

    for (const panel of track.querySelectorAll("[data-stage]")) observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="lg:hidden">
      <ol
        ref={trackRef}
        tabIndex={0}
        aria-label="System stages, in order"
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-5 pb-1 scroll-px-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:-mx-10 md:gap-5 md:px-10 md:scroll-px-10"
      >
        {LAYERS.map((layer, i) => {
          const isActive = i === active;
          return (
            <li
              key={layer.label}
              data-stage={i}
              className="w-[min(84vw,26rem)] shrink-0 snap-start sm:w-[22rem]"
            >
              <article
                className={cn(
                  "relative flex h-full flex-col rounded-md border p-5 transition-colors duration-500 [transition-timing-function:var(--ease-expo)] motion-reduce:transition-none",
                  isActive ? "border-line-strong bg-surface/40" : "border-line bg-transparent",
                )}
              >
                {/* Stage header. The hairline continues into the gap on every
                    panel but the first, so the row reads as one rail rather
                    than five separate cards. */}
                <div className="relative flex items-center gap-3">
                  {i > 0 ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 right-full h-px w-[2.4375rem] -translate-y-1/2 bg-line-strong md:w-[2.6875rem]"
                    />
                  ) : null}

                  <span aria-hidden="true" className="grid size-2.5 shrink-0 place-items-center">
                    <span
                      className={cn(
                        "size-2.5 rounded-full border bg-bg transition-colors duration-500 motion-reduce:transition-none",
                        isActive ? "border-accent" : "border-accent/40",
                      )}
                    />
                    <span
                      className={cn(
                        "absolute rounded-full bg-accent transition-all duration-500 motion-reduce:transition-none",
                        isActive ? "size-1.5" : "size-1 opacity-60",
                      )}
                    />
                  </span>

                  <span
                    className={cn(
                      "text-meta tabular-nums transition-colors duration-500 motion-reduce:transition-none",
                      isActive ? "text-accent" : "text-fg-faint",
                    )}
                  >
                    {layer.index}
                  </span>

                  <span aria-hidden="true" className="h-px flex-1 bg-line" />
                </div>

                <h3 className="mt-7 text-[1.0625rem] font-medium tracking-[-0.015em] text-fg">
                  {layer.label}
                </h3>
                <p className="mt-1.5 font-mono text-[0.6875rem] tracking-[0.04em] text-fg-subtle">
                  {layer.meta}
                </p>

                {/* Same illustration as desktop, given more room to read at
                    phone size. */}
                <Glyph kind={layer.glyph} align="start" className="mt-8 h-16 max-w-none" />

                <span className="text-meta mt-auto pt-7 text-right tabular-nums text-fg-faint">
                  {layer.index} / {String(LAYERS.length).padStart(2, "0")}
                </span>
              </article>
            </li>
          );
        })}
      </ol>

      {/* Progress rail. Discrete segments, not carousel dots. */}
      <div aria-hidden="true" className="mt-5 flex items-center gap-2.5">
        <span className="text-meta tabular-nums text-accent">
          {String(active + 1).padStart(2, "0")}
        </span>
        <span className="flex flex-1 items-center gap-1.5">
          {LAYERS.map((layer, i) => (
            <span
              key={layer.label}
              className={cn(
                "h-px flex-1 transition-colors duration-500 motion-reduce:transition-none",
                i <= active ? "bg-accent" : "bg-line-strong",
              )}
            />
          ))}
        </span>
        <span className="text-meta tabular-nums text-fg-faint">
          {String(LAYERS.length).padStart(2, "0")}
        </span>
      </div>

      {/* Only rendered where the peek alone might not read: the reduced-motion
          branch never gets the settle animation that hints at the axis. */}
      {reduced ? (
        <p className="text-meta mt-3 text-fg-faint">Swipe to explore &rarr;</p>
      ) : null}
    </div>
  );
}

/**
 * Abstract per-layer visuals. Each one suggests the shape of its layer without
 * pretending to be a screenshot — bars for an interface, request rows for an
 * API, a grid for data, a graph for AI, a branch for automation.
 */
function Glyph({
  kind,
  className,
  align = "mid",
}: {
  kind: Layer["glyph"];
  className?: string;
  /**
   * The viewBox is wider than it is tall, so it always letterboxes. Desktop
   * columns centre it; the mobile panels align it to the left edge so it lines
   * up with the stage's own text.
   */
  align?: "mid" | "start";
}) {
  const stroke = "hsl(var(--line) / 0.34)";
  const accent = "hsl(var(--accent) / 0.65)";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 44"
      preserveAspectRatio={align === "start" ? "xMinYMid meet" : "xMidYMid meet"}
      className={cn("h-11 w-full max-w-[13rem] md:max-w-none", className)}
    >
      {kind === "interface" ? (
        <>
          <rect x="0" y="2" width="46" height="3" rx="1.5" fill={stroke} />
          <rect x="0" y="10" width="32" height="3" rx="1.5" fill={stroke} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x={62 + i * 10}
              y={44 - [14, 24, 10, 30, 19, 34][i]!}
              width="6"
              height={[14, 24, 10, 30, 19, 34][i]}
              rx="1.5"
              fill={i === 5 ? accent : stroke}
            />
          ))}
        </>
      ) : null}

      {kind === "api" ? (
        <>
          {["GET", "POST", "PATCH"].map((m, i) => (
            <g key={m} transform={`translate(0, ${i * 14})`}>
              <rect width="26" height="9" rx="2.5" fill="hsl(var(--accent) / 0.16)" />
              <text x="3.5" y="6.6" className="fill-[hsl(var(--accent))] font-mono text-[5.5px]">
                {m}
              </text>
              <rect x="32" y="3" width={[64, 82, 52][i]} height="3" rx="1.5" fill={stroke} />
            </g>
          ))}
        </>
      ) : null}

      {kind === "data" ? (
        <>
          {[0, 1, 2, 3].map((r) => (
            <g key={r} transform={`translate(0, ${r * 11})`}>
              <rect width="9" height="4" rx="1" fill={r === 0 ? accent : stroke} />
              {[0, 1, 2, 3].map((c) => (
                <rect key={c} x={16 + c * 27} width={[20, 24, 16, 22][c]} height="4" rx="1" fill={stroke} />
              ))}
            </g>
          ))}
        </>
      ) : null}

      {kind === "ai" ? (
        <>
          <polyline
            points="2,34 22,20 42,26 62,10 82,18 102,6 118,14"
            fill="none"
            stroke="hsl(var(--accent-2) / 0.55)"
            strokeWidth="1.25"
          />
          {(
            [
              [2, 34], [22, 20], [42, 26], [62, 10], [82, 18], [102, 6], [118, 14],
            ] as const
          ).map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 2 === 0 ? 2.4 : 1.6} fill="hsl(var(--accent-2))" opacity={i % 2 === 0 ? 0.9 : 0.5} />
          ))}
        </>
      ) : null}

      {kind === "automation" ? (
        <>
          <path
            d="M4 22 H30 M30 22 C44 22 44 8 58 8 M30 22 C44 22 44 36 58 36 M74 8 H88 M74 36 H88 M88 8 C100 8 100 22 112 22 M88 36 C100 36 100 22 112 22"
            fill="none"
            stroke={stroke}
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          {([[4, 22], [30, 22], [66, 8], [66, 36], [112, 22]] as const).map(([x, y], i) => (
            <rect
              key={i}
              x={x - 4}
              y={y - 4}
              width="8"
              height="8"
              rx="2"
              fill="hsl(var(--bg))"
              stroke={i === 4 ? "hsl(var(--accent-3))" : stroke}
              strokeWidth="1.1"
            />
          ))}
        </>
      ) : null}
    </svg>
  );
}
