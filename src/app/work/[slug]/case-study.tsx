import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ExternalLink, Languages } from "lucide-react";
import type { Project } from "@/types/portfolio";
import { Poster, Screenshot } from "@/components/ui/screenshot";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { StackDiagram } from "@/components/ui/stack-diagram";
import { GithubIcon } from "@/components/ui/brand-icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { duration, travel, viewport } from "@/lib/motion";

/**
 * Compact case study. Every optional action is conditional — a project with no
 * live URL and no repository simply shows neither, never a dead "#".
 */
export function CaseStudy({ project, next }: { project: Project; next: Project }) {
  const hasLive = project.liveUrl.trim().length > 0;
  const hasRepo = project.repoUrl.trim().length > 0;
  // The poster leads the page, so the gallery shows every real screenshot.
  const galleryImages = project.images;

  return (
    <article>
      {/* ------------------------------------------------------------ hero */}
      <header className="relative overflow-hidden pt-32 pb-14 md:pt-40 md:pb-20">
        <div
          aria-hidden="true"
          className="tech-grid pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(110%_70%_at_50%_0%,black,transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-linear-to-r from-transparent via-accent/30 to-transparent"
        />

        <div className="container-page">
          <Reveal variant="fade" duration={duration.ui}>
            <Link
              href="/#work"
              className="group/back inline-flex items-center gap-2 text-[0.8125rem] text-fg-subtle transition-colors duration-300 hover:text-fg"
            >
              <ArrowLeft
                aria-hidden="true"
                className="size-3.5 transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover/back:-translate-x-1"
                strokeWidth={1.75}
              />
              All work
            </Link>
          </Reveal>

          <div className="mt-10 flex items-center gap-4">
            <span className="text-meta tabular-nums text-accent">{project.index}</span>
            <span aria-hidden="true" className="h-px w-10 bg-line-strong" />
            <span className="text-meta text-fg-faint">{project.category}</span>
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
            {project.multilingual ? (
              <span className="text-meta inline-flex items-center gap-1.5 text-accent-2">
                <Languages aria-hidden="true" className="size-3" strokeWidth={1.75} />
                {project.multilingual.languages.join(", ")}
                {project.multilingual.rtl ? " · RTL" : ""}
              </span>
            ) : (
              <span className="text-meta text-fg-faint">
                {project.year ?? "Selected Work"}
              </span>
            )}
          </div>

          <div className="mt-7 grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
            <Reveal y={travel.lg} duration={duration.editorial} delay={0.06}>
              <h1 className="text-display text-[clamp(2.25rem,1.2rem+4.2vw,4.5rem)] text-fg">
                {project.title}
              </h1>
            </Reveal>

            <Reveal y={travel.md} delay={0.18}>
              <div className="lg:pb-2">
                <p className="border-l border-line-strong pl-5 text-[1.0625rem] leading-relaxed text-fg-muted">
                  {project.summary}
                </p>
                <p className="mt-5 pl-5 font-mono text-[0.6875rem] leading-relaxed tracking-[0.06em] text-fg-faint">
                  {project.technologies.join("  ·  ")}
                </p>
              </div>
            </Reveal>
          </div>

          {hasLive || hasRepo ? (
            <Reveal y={travel.sm} delay={0.26}>
              <div className="mt-10 flex flex-wrap gap-3">
                {hasLive ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "primary", size: "md" }), "group/l")}
                  >
                    View live
                    <ExternalLink aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
                  </a>
                ) : null}
                {hasRepo ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline", size: "md" }))}
                  >
                    <GithubIcon className="size-3.5" />
                    Source
                  </a>
                ) : null}
              </div>
            </Reveal>
          ) : null}
        </div>
      </header>

      {/* ------------------------------------------------------------ poster */}
      <div className="container-page">
        <Reveal variant="mask" duration={duration.editorial} delay={0.1} amount={viewport.early.amount}>
          <Poster
            image={project.poster}
            priority
            sizes="(min-width: 1440px) 1280px, 100vw"
            className="shadow-[0_50px_140px_-60px_hsl(var(--bg-deep))]"
          />
        </Reveal>
      </div>

      {/* ---------------------------------------------------------- overview */}
      <section className="container-page py-20 md:py-28">
        <div className="grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="max-w-2xl space-y-12">
            <Block eyebrow="The problem" body={project.problem} />
            <Block eyebrow="Approach" body={project.approach} />
            <Block eyebrow="Solution" body={project.solution} />
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <Reveal y={18}>
              <dl className="divide-y divide-[color:var(--color-line)] border-y border-line">
                <div className="py-5">
                  <dt className="text-meta text-fg-faint">My role</dt>
                  <dd className="mt-2.5 text-[0.875rem] leading-relaxed text-fg-muted">
                    {project.role}
                  </dd>
                </div>
                <div className="py-5">
                  <dt className="text-meta text-fg-faint">Capabilities</dt>
                  <dd className="mt-3">
                    <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
                      {project.capabilities.map((capability) => (
                        <li
                          key={capability}
                          className="flex items-baseline gap-2.5 text-[0.8125rem] text-fg-subtle"
                        >
                          <span
                            aria-hidden="true"
                            className="size-1 shrink-0 translate-y-[-2px] rounded-full bg-accent/70"
                          />
                          {capability}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* ----------------------------------------------------- system layers */}
      <section className="container-page pb-20 md:pb-28">
        <StackDiagram project={project} />
      </section>

      {/* ---------------------------------------------------------- features */}
      <section className="border-y border-line bg-bg-deep py-20 md:py-28">
        <div className="container-page">
          <Reveal y={0} duration={0.5}>
            <div className="flex items-center gap-4 pb-8">
              <span className="text-meta text-accent">Key features</span>
              <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
            </div>
          </Reveal>

          <Stagger amount={0.1}>
            <ul className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
              {project.features.map((feature, i) => (
                <StaggerItem key={feature.title}>
                  <li className="group/f border-t border-line py-6">
                    <span className="text-meta tabular-nums text-fg-faint transition-colors duration-400 group-hover/f:text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-[1.0625rem] font-medium tracking-[-0.015em] text-fg">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-[0.875rem] leading-relaxed text-fg-subtle">
                      {feature.description}
                    </p>
                  </li>
                </StaggerItem>
              ))}
            </ul>
          </Stagger>
        </div>
      </section>

      {/* ----------------------------------------------------------- gallery */}
      {galleryImages.length > 0 ? (
        <section className="container-page py-20 md:py-28">
          <Reveal y={0} duration={0.5}>
            <div className="flex items-center gap-4 pb-8">
              <span className="text-meta text-accent">Interface</span>
              <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
              <span className="text-meta text-fg-faint">
                {`${galleryImages.length} screen${galleryImages.length === 1 ? "" : "s"}`}
              </span>
            </div>
          </Reveal>

          {/* Full width, one per row. These are dense product screenshots and
              the reader is already committed at this point — width is what
              makes them readable, and it keeps galleries with mismatched
              aspect ratios from looking accidental. */}
          <div className="space-y-10 md:space-y-14">
            {galleryImages.map((image, i) => (
              <Reveal
                key={image.src}
                variant="mask"
                duration={duration.editorial}
                amount={viewport.early.amount}
              >
                <Screenshot
                  image={image}
                  sizes="(min-width: 1440px) 1280px, 100vw"
                  priority={false}
                  quality={i === 0 ? 92 : 90}
                />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------ challenge + outcome */}
      <section className="container-page pb-20 md:pb-28">
        <div className="grid gap-x-14 gap-y-12 border-t border-line pt-12 md:grid-cols-2">
          <Block eyebrow="The challenge" body={project.challenge} />
          <Block eyebrow="Outcome" body={project.outcome} accent />
        </div>
      </section>

      {/* -------------------------------------------------------- next project */}
      <nav aria-label="Project navigation" className="border-t border-line">
        <Link href={`/work/${next.slug}`} className="group/n block">
          <div className="container-page py-16 md:py-24">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="text-meta text-fg-faint">Next project</span>
                <p className="text-display mt-4 text-[clamp(1.75rem,1rem+2.6vw,3.25rem)] text-fg transition-colors duration-500 group-hover/n:text-accent">
                  {next.title}
                </p>
                <p className="mt-3 max-w-md text-[0.9375rem] text-fg-subtle">{next.tagline}</p>
              </div>

              <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full border border-line-strong text-fg transition-all duration-500 [transition-timing-function:var(--ease-expo)] group-hover/n:border-accent group-hover/n:bg-accent group-hover/n:text-accent-fg">
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-5 transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover/n:translate-x-0.5 group-hover/n:-translate-y-0.5"
                  strokeWidth={1.5}
                />
              </span>
            </div>
          </div>
        </Link>
      </nav>
    </article>
  );
}

function Block({
  eyebrow,
  body,
  accent = false,
}: {
  eyebrow: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <Reveal variant="fade" duration={duration.reveal}>
      <div>
        <h2 className="text-meta text-fg-faint">{eyebrow}</h2>
        <p
          className={
            accent
              ? "mt-4 text-[1.0625rem] leading-[1.7] text-fg md:text-[1.125rem]"
              : "mt-4 text-[0.9375rem] leading-[1.75] text-fg-muted md:text-base"
          }
        >
          {body}
        </p>
      </div>
    </Reveal>
  );
}
