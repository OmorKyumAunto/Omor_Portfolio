import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

/**
 * Signal V2 primitives.
 *
 * One vocabulary for the technical furniture that frames every section —
 * coordinates, labels, key/value metadata, corner brackets. Sections compose
 * these instead of inventing their own, which is what keeps the page reading as
 * a single instrument rather than a stack of separate concepts.
 */

/**
 * The section coordinate line: `03 / SELECTED WORK ————————— 07 SYSTEMS`.
 * Replaces V1's eyebrow-plus-rule with something that reads as an index entry.
 */
export function SectionLabel({
  index,
  label,
  trailing,
  tone = "accent",
  className,
}: {
  index: string;
  label: string;
  /** Optional right-aligned counterpart, e.g. a count or status. */
  trailing?: ReactNode;
  tone?: "accent" | "violet" | "muted";
  className?: string;
}) {
  const toneClass =
    tone === "violet" ? "text-accent-2" : tone === "muted" ? "text-fg-subtle" : "text-accent";

  return (
    <Reveal variant="fade" duration={0.4}>
      <div className={cn("flex items-center gap-4", className)}>
        <span className={cn("text-meta tabular-nums", toneClass)}>{index}</span>
        <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
        <span className="text-meta text-fg-subtle">{label}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
        {trailing ? <span className="text-meta text-fg-faint">{trailing}</span> : null}
      </div>
    </Reveal>
  );
}

/** A single `KEY / value` pair. The unit of technical metadata across V2. */
export function Meta({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-meta text-fg-faint">{label}</dt>
      <dd className="mt-1.5 text-[0.875rem] leading-snug text-fg-muted">{value}</dd>
    </div>
  );
}

/** Row or column of `Meta` pairs, separated by hairlines. */
export function MetaList({
  children,
  columns = 2,
  className,
}: {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid gap-x-8 gap-y-6 border-t border-line pt-5",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-2 sm:grid-cols-3",
        columns === 4 && "grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {children}
    </dl>
  );
}

/**
 * Oversized index numeral used as a compositional element.
 * Decorative by definition — the real number is always in the label beside it.
 */
export function IndexMark({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("text-index select-none text-fg/[0.045]", className)}
    >
      {value}
    </span>
  );
}

/** Live status dot with a pulse ring. Used for availability and AI state. */
export function StatusDot({
  tone = "positive",
  className,
}: {
  tone?: "positive" | "accent" | "muted";
  className?: string;
}) {
  const color =
    tone === "accent" ? "bg-accent" : tone === "muted" ? "bg-fg-faint" : "bg-positive";
  return (
    <span aria-hidden="true" className={cn("relative flex size-1.5 shrink-0", className)}>
      <span
        className={cn(
          "absolute inline-flex size-full rounded-full opacity-60 [animation:pulse-ring_2.6s_var(--ease-expo)_infinite] motion-reduce:animate-none",
          color,
        )}
      />
      <span className={cn("relative inline-flex size-1.5 rounded-full", color)} />
    </span>
  );
}
