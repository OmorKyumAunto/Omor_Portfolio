"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { useIsDesktop, useReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";

/**
 * "Signal Stack" — the hero visual.
 *
 * An abstract read of a real system: interface fragments feeding an API spine,
 * through data, into an AI step, out to automation. Deliberately not a literal
 * architecture diagram and deliberately not floating framework logos.
 *
 * Everything is inline SVG (no raster assets), animation is transform/opacity
 * or a single animated attribute per element, and pointer parallax is desktop
 * only. Under reduced motion the diagram renders in its resting state.
 */

const W = 520;
const H = 560;
const SPINE_X = 54;
const STATIONS = [70, 178, 286, 394, 502] as const;

const LAYERS = [
  { id: "interface", index: "01", label: "Interface", meta: "React · Next.js" },
  { id: "api", index: "02", label: "API", meta: "Node.js · REST" },
  { id: "data", index: "03", label: "Data", meta: "PostgreSQL · MySQL" },
  { id: "ai", index: "04", label: "AI", meta: "LLM integration" },
  { id: "automation", index: "05", label: "Automation", meta: "Workflows · Jobs" },
] as const;

export function SystemVisual({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const interactive = isDesktop && !reduced;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 90, damping: 20, mass: 0.6 });

  // Depth planes: nearer content moves further.
  const nearX = useTransform(sx, [-1, 1], [-14, 14]);
  const nearY = useTransform(sy, [-1, 1], [-10, 10]);
  const midX = useTransform(sx, [-1, 1], [-7, 7]);
  const midY = useTransform(sy, [-1, 1], [-5, 5]);
  const farX = useTransform(sx, [-1, 1], [5, -5]);
  const farY = useTransform(sy, [-1, 1], [4, -4]);

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      onPointerMove={(event) => {
        if (!interactive || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        px.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
        py.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      {/* Ambient wash behind the diagram */}
      <motion.div
        aria-hidden="true"
        style={interactive ? { x: farX, y: farY } : undefined}
        className="pointer-events-none absolute -inset-16 -z-10 opacity-[var(--ambient-a)]"
      >
        <div className="absolute left-1/4 top-[12%] size-[52%] rounded-full bg-accent/22 blur-[90px]" />
        <div className="absolute right-[8%] top-[46%] size-[42%] rounded-full bg-accent-2/18 blur-[100px]" />
        <div className="absolute left-[14%] bottom-[6%] size-[38%] rounded-full bg-accent-3/12 blur-[90px]" />
      </motion.div>

      <motion.svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Abstract diagram of a software system: interface, API, data, AI and automation layers connected in sequence."
        className="w-full overflow-visible"
        style={interactive ? { x: midX, y: midY } : undefined}
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.35, ease: ease.out }}
      >
        <defs>
          <linearGradient id="sv-spine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0" />
            <stop offset="18%" stopColor="hsl(var(--accent))" stopOpacity="0.55" />
            <stop offset="62%" stopColor="hsl(var(--accent-2))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--accent-3))" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sv-bar" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.18" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.75" />
          </linearGradient>
          <radialGradient id="sv-glow">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Spine */}
        <line
          x1={SPINE_X}
          y1={40}
          x2={SPINE_X}
          y2={H - 28}
          stroke="url(#sv-spine)"
          strokeWidth="1.25"
        />

        {/* Travelling signal down the spine */}
        {!reduced ? (
          <motion.circle
            r="16"
            cx={SPINE_X}
            fill="url(#sv-glow)"
            initial={{ cy: 50, opacity: 0 }}
            animate={{ cy: [50, H - 40], opacity: [0, 0.85, 0.85, 0] }}
            transition={{
              duration: 5.2,
              times: [0, 0.1, 0.85, 1],
              repeat: Infinity,
              repeatDelay: 1.1,
              ease: "linear",
              delay: 1.4,
            }}
          />
        ) : null}

        {LAYERS.map((layer, i) => {
          const y = STATIONS[i] ?? 0;
          return (
            <Station
              key={layer.id}
              y={y}
              index={layer.index}
              label={layer.label}
              meta={layer.meta}
              order={i}
              reduced={Boolean(reduced)}
            >
              {i === 0 ? <InterfaceFragment /> : null}
              {i === 1 ? <ApiFragment reduced={Boolean(reduced)} /> : null}
              {i === 2 ? <DataFragment /> : null}
              {i === 3 ? <AiFragment reduced={Boolean(reduced)} /> : null}
              {i === 4 ? <AutomationFragment /> : null}
            </Station>
          );
        })}
      </motion.svg>

      {/* Foreground detail chip — the nearest parallax plane */}
      <motion.div
        aria-hidden="true"
        style={interactive ? { x: nearX, y: nearY } : undefined}
        className="pointer-events-none absolute right-0 -top-5 hidden md:block lg:-top-7"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.8, ease: ease.out }}
          className="flex items-center gap-2 rounded-full border border-line-strong bg-bg/80 px-3 py-1.5 backdrop-blur-md"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full rounded-full bg-positive/70 [animation:pulse-ring_2.4s_var(--ease-expo)_infinite]" />
            <span className="relative inline-flex size-1.5 rounded-full bg-positive" />
          </span>
          <span className="font-mono text-[0.625rem] tracking-[0.14em] uppercase text-fg-muted">
            System online
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ parts -- */

function Station({
  y,
  index,
  label,
  meta,
  order,
  reduced,
  children,
}: {
  y: number;
  index: string;
  label: string;
  meta: string;
  order: number;
  reduced: boolean;
  children: React.ReactNode;
}) {
  const boxX = 120;
  const boxY = y - 38;
  const boxW = 388;
  const boxH = 76;

  return (
    <motion.g
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.9,
        delay: 0.5 + order * 0.11,
        ease: ease.out,
      }}
    >
      {/* Node */}
      <circle cx={SPINE_X} cy={y} r="4.5" fill="hsl(var(--bg))" stroke="hsl(var(--accent))" strokeWidth="1.25" />
      <circle cx={SPINE_X} cy={y} r="1.75" fill="hsl(var(--accent))" />

      {/* Connector */}
      <path
        d={`M${SPINE_X + 8} ${y} H ${boxX - 10}`}
        stroke="hsl(var(--line) / 0.28)"
        strokeWidth="1"
        strokeDasharray="2 4"
        fill="none"
      />

      {/* Index rail, left of the spine */}
      <text
        x={SPINE_X - 18}
        y={y + 3.5}
        textAnchor="end"
        className="fill-[hsl(var(--fg-decor))] font-mono text-[11px] tracking-[0.14em]"
      >
        {index}
      </text>

      {/* Fragment frame */}
      <rect
        x={boxX}
        y={boxY}
        width={boxW}
        height={boxH}
        rx="8"
        fill="hsl(var(--surface) / 0.62)"
        stroke="hsl(var(--line) / 0.2)"
        strokeWidth="1"
      />

      <text
        x={boxX + 14}
        y={boxY + 20}
        className="fill-[hsl(var(--fg))] font-mono text-[11px] font-medium tracking-[0.1em] uppercase"
      >
        {label}
      </text>
      <text
        x={boxX + boxW - 14}
        y={boxY + 20}
        textAnchor="end"
        className="hidden fill-[hsl(var(--fg-decor))] font-mono text-[10px] tracking-[0.06em] sm:block"
      >
        {meta}
      </text>

      <g transform={`translate(${boxX + 15}, ${boxY + 33}) scale(1.14)`}>{children}</g>
    </motion.g>
  );
}

/** Layer 01 — a UI fragment: toolbar, list rows and a small chart. */
function InterfaceFragment() {
  const bars = [16, 26, 12, 30, 21, 34];
  return (
    <g>
      {[0, 1, 2].map((row) => (
        <g key={row}>
          <rect y={row * 12} width="8" height="8" rx="2" fill="hsl(var(--line) / 0.28)" />
          <rect x="14" y={row * 12 + 2.5} width={[86, 62, 74][row]} height="3" rx="1.5" fill="hsl(var(--line) / 0.22)" />
        </g>
      ))}
      <g transform="translate(180, 0)">
        {bars.map((h, i) => (
          <rect key={i} x={i * 15} y={36 - h} width="7" height={h} rx="2" fill="url(#sv-bar)" />
        ))}
      </g>
    </g>
  );
}

/** Layer 02 — request rows with a signal travelling through. */
function ApiFragment({ reduced }: { reduced: boolean }) {
  const rows = [
    { method: "GET", w: 104 },
    { method: "POST", w: 132 },
    { method: "PATCH", w: 88 },
  ];
  return (
    <g>
      {rows.map((row, i) => (
        <g key={row.method} transform={`translate(0, ${i * 13})`}>
          <rect width="34" height="9" rx="2.5" fill="hsl(var(--accent) / 0.14)" />
          <text x="4.5" y="6.8" className="fill-[hsl(var(--accent))] font-mono text-[6.5px] tracking-[0.08em]">
            {row.method}
          </text>
          <rect x="42" y="3" width={row.w} height="3" rx="1.5" fill="hsl(var(--line) / 0.22)" />
        </g>
      ))}
      {!reduced ? (
        <motion.rect
          y="3"
          width="20"
          height="3"
          rx="1.5"
          fill="hsl(var(--accent))"
          initial={{ x: 42, opacity: 0 }}
          animate={{ x: [42, 126], opacity: [0, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut", delay: 2 }}
        />
      ) : null}
      <g transform="translate(232, 0)">
        <rect width="60" height="35" rx="4" fill="none" stroke="hsl(var(--line) / 0.2)" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x="7" y={7 + i * 7} width={[44, 30, 38, 22][i]} height="2.5" rx="1.25" fill="hsl(var(--line) / 0.18)" />
        ))}
      </g>
    </g>
  );
}

/** Layer 03 — a table grid: rows, columns, a keyed column. */
function DataFragment() {
  return (
    <g>
      {[0, 1, 2, 3].map((row) => (
        <g key={row} transform={`translate(0, ${row * 9})`}>
          <rect width="10" height="4" rx="1" fill={row === 0 ? "hsl(var(--accent) / 0.55)" : "hsl(var(--line) / 0.3)"} />
          {[0, 1, 2, 3, 4, 5].map((col) => (
            <rect
              key={col}
              x={20 + col * 44}
              width={[30, 38, 24, 34, 28, 40][col]}
              height="4"
              rx="1"
              fill={row === 0 ? "hsl(var(--line) / 0.34)" : "hsl(var(--line) / 0.17)"}
            />
          ))}
        </g>
      ))}
    </g>
  );
}

/** Layer 04 — a constellation: nodes, weighted links, one active edge. */
function AiFragment({ reduced }: { reduced: boolean }) {
  const nodes = [
    [10, 26], [52, 6], [88, 30], [130, 12], [168, 32], [206, 8], [244, 26], [282, 14],
  ] as const;
  const edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [1, 3], [2, 4], [4, 6]] as const;

  return (
    <g>
      {edges.map(([a, b], i) => {
        const p1 = nodes[a];
        const p2 = nodes[b];
        if (!p1 || !p2) return null;
        return (
          <line
            key={i}
            x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]}
            stroke="hsl(var(--accent-2) / 0.3)"
            strokeWidth={i > 6 ? 0.6 : 1}
          />
        );
      })}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 3 : 2} fill="hsl(var(--accent-2))" opacity={i % 3 === 0 ? 0.9 : 0.5} />
      ))}
      {!reduced ? (
        <motion.circle
          r="2.5"
          fill="hsl(var(--fg))"
          initial={{ cx: 10, cy: 26, opacity: 0 }}
          animate={{
            cx: [10, 52, 130, 206, 282],
            cy: [26, 6, 12, 8, 14],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{ duration: 3.4, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut", delay: 2.6 }}
        />
      ) : null}
    </g>
  );
}

/** Layer 05 — a branching flow with a decision split. */
function AutomationFragment() {
  return (
    <g>
      <path
        d="M6 18 H60 M60 18 C 84 18 84 6 108 6 M60 18 C 84 18 84 30 108 30 M132 6 H186 M132 30 H186 M186 6 C 210 6 210 18 234 18 M186 30 C 210 30 210 18 234 18 M234 18 H288"
        fill="none"
        stroke="hsl(var(--line) / 0.28)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {[[6, 18], [60, 18], [120, 6], [120, 30], [186, 6], [186, 30], [234, 18], [288, 18]].map(
        ([x, y], i) => (
          <rect
            key={i}
            x={(x ?? 0) - 5}
            y={(y ?? 0) - 5}
            width="10"
            height="10"
            rx="2.5"
            fill="hsl(var(--bg))"
            stroke={i === 7 ? "hsl(var(--accent-3))" : "hsl(var(--line) / 0.34)"}
            strokeWidth="1.1"
          />
        ),
      )}
      <circle cx="288" cy="18" r="2" fill="hsl(var(--accent-3))" />
    </g>
  );
}
