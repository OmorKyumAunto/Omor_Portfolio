import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

/**
 * The editorial section shell: a numbered hairline header rule, an eyebrow,
 * and generous vertical rhythm. Used by every section so spacing and hierarchy
 * stay identical across the page.
 */
export function Section({
  id,
  children,
  className,
  bleed = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Skip the container so the section can run edge-to-edge. */
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24 py-24 md:py-32 lg:py-40", className)}
    >
      {bleed ? children : <div className="container-page">{children}</div>}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  index,
  title,
  lead,
  align = "start",
  className,
  children,
}: {
  eyebrow: string;
  index?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "start" | "between";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <header className={cn("relative", className)}>
      <Reveal y={0} duration={0.6}>
        <div className="flex items-center gap-4 pb-5">
          <span className="text-eyebrow text-accent">{eyebrow}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
          {index ? (
            <span className="text-eyebrow tabular-nums text-fg-faint">{index}</span>
          ) : null}
        </div>
      </Reveal>

      <div
        className={cn(
          "grid gap-x-12 gap-y-6",
          align === "between" ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]" : "",
        )}
      >
        <Reveal y={18}>
          <h2 className="text-display text-[clamp(2rem,1.2rem+3.4vw,3.75rem)] text-fg">
            {title}
          </h2>
        </Reveal>
        {lead ? (
          <Reveal y={18} delay={0.08}>
            <div
              className={cn(
                "text-[0.9375rem] leading-relaxed text-fg-muted md:text-base",
                align === "between" ? "lg:pt-2 lg:max-w-md lg:justify-self-end" : "max-w-2xl",
              )}
            >
              {lead}
            </div>
          </Reveal>
        ) : null}
      </div>
      {children}
    </header>
  );
}

/** Fading hairline used between major sections. */
export function SectionRule({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("container-page", className)}>
      <div className="rule-fade h-px w-full" />
    </div>
  );
}
