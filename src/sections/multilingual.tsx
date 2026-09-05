import Link from "next/link";
import { ArrowUpRight, Languages } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { Section } from "@/components/ui/section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Poster } from "@/components/ui/screenshot";
import { Tag } from "@/components/ui/tag";
import { duration, viewport } from "@/lib/motion";

/**
 * Multilingual capability.
 *
 * Compact by design — one claim, four supporting points and a single piece of
 * real proof. Only rendered when a project in the data actually ships a
 * non-English interface.
 */
export function Multilingual() {
  const { multilingual } = portfolio;
  const projects = multilingual.projectSlugs
    .map((slug) => portfolio.projects.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p?.multilingual));

  if (projects.length === 0) return null;

  const languages = [...new Set(projects.flatMap((p) => p.multilingual!.languages))];
  const rtl = projects.some((p) => p.multilingual!.rtl);

  return (
    <Section id="multilingual" className="relative overflow-hidden border-y border-line bg-bg-deep">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/4 size-[420px] rounded-full bg-accent-2/[0.08] blur-[120px]"
      />

      <div className="relative grid items-center gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div>
          <Reveal y={0} duration={0.6}>
            <div className="flex items-center gap-4 pb-5">
              <span className="text-eyebrow text-accent-2">{multilingual.eyebrow}</span>
              <span aria-hidden="true" className="h-px w-16 bg-line-strong" />
            </div>
          </Reveal>

          <Reveal y={20}>
            <h2 className="text-display text-[clamp(1.75rem,1.1rem+2.4vw,2.75rem)] text-fg">
              {multilingual.heading}{" "}
              <span className="text-serif-accent text-accent-2">
                {multilingual.headingAccent}
              </span>
            </h2>
          </Reveal>

          <Reveal variant="fade" delay={0.08}>
            <p className="mt-6 max-w-lg text-[0.9375rem] leading-relaxed text-fg-muted md:text-base">
              {multilingual.lead}
            </p>
          </Reveal>

          <Stagger className="mt-10" amount={0.15}>
            <ul className="grid gap-x-10 border-t border-line sm:grid-cols-2">
              {multilingual.points.map((point) => (
                <StaggerItem key={point.title}>
                  <li className="border-b border-line py-4">
                    <h3 className="text-[0.875rem] font-medium tracking-[-0.01em] text-fg">
                      {point.title}
                    </h3>
                    <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-fg-subtle">
                      {point.description}
                    </p>
                  </li>
                </StaggerItem>
              ))}
            </ul>
          </Stagger>
        </div>

        {/* Proof */}
        <Reveal variant="mask" duration={duration.editorial} amount={viewport.early.amount}>
          <div className="space-y-8">
            {projects.map((project, i) => (
              <figure key={project.slug}>
                <Poster
                  image={project.poster}
                  showNote={false}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className={i === 0 ? "shadow-[0_40px_120px_-60px_hsl(var(--bg-deep))]" : undefined}
                />
                <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <Link
                    href={`/work/${project.slug}`}
                    className="group/ml inline-flex items-center gap-2 border-b border-line-strong pb-0.5 text-[0.875rem] text-fg transition-colors duration-300 hover:border-accent-2"
                  >
                    {project.title}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-3.5 text-fg-subtle transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover/ml:translate-x-0.5 group-hover/ml:-translate-y-0.5"
                      strokeWidth={1.75}
                    />
                  </Link>
                  <span className="flex flex-wrap gap-1.5">
                    <Tag tone="accent">
                      <Languages aria-hidden="true" className="mr-1.5 size-3" strokeWidth={1.75} />
                      {project.multilingual!.languages.join(", ")}
                    </Tag>
                    {project.multilingual!.rtl ? <Tag tone="accent">Right-to-left</Tag> : null}
                  </span>
                </figcaption>
              </figure>
            ))}

            <p className="max-w-md text-[0.875rem] leading-relaxed text-fg-subtle">
              {languages.join(" and ")} interfaces shipped to production
              {rtl ? ", including a fully right-to-left layout" : ""}.
            </p>
          </div>
        </Reveal>

      </div>
    </Section>
  );
}
