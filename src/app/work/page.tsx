import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { ProjectCard } from "@/components/ui/project-card";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Enterprise applications, business workflow systems, dashboards and multilingual products built end to end with React, Next.js, Node.js and TypeScript.",
  alternates: { canonical: "/work" },
  openGraph: {
    type: "website",
    url: `${portfolio.seo.siteUrl}/work`,
    title: `Work — ${portfolio.personal.name}`,
    description:
      "Enterprise applications, business workflow systems, dashboards and multilingual products.",
    // Declared explicitly: an `openGraph` object here would otherwise replace
    // the root segment's file-based image instead of merging with it.
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: portfolio.seo.titleDefault }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Work — ${portfolio.personal.name}`,
    description:
      "Enterprise applications, business workflow systems, dashboards and multilingual products.",
  },
};

const projects = [...portfolio.projects].sort((a, b) => a.index.localeCompare(b.index));

/** The archive: every project, poster-first, in one place. */
export default function WorkIndexPage() {
  const multilingualCount = projects.filter((p) => p.multilingual).length;

  return (
    <div className="pb-24 pt-32 md:pt-40">
      {/* Header */}
      <header className="relative overflow-hidden pb-16 md:pb-20">
        <div
          aria-hidden="true"
          className="tech-grid pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(110%_70%_at_50%_0%,black,transparent_72%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-linear-to-r from-transparent via-accent/30 to-transparent"
        />

        <div className="container-page">
          <Reveal y={0} duration={0.6}>
            <div className="flex items-center gap-4 pb-6">
              <span className="text-eyebrow text-accent">Archive</span>
              <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
              <span className="text-eyebrow tabular-nums text-fg-faint">
                {String(projects.length).padStart(2, "0")} projects
              </span>
            </div>
          </Reveal>

          <div className="grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
            <Reveal y={22}>
              <h1 className="text-display text-[clamp(2.25rem,1.2rem+4.2vw,4.5rem)] text-fg">
                Everything I&apos;ve built.
              </h1>
            </Reveal>

            <Reveal y={18} delay={0.08}>
              <div className="lg:pb-2">
                <p className="border-l border-line-strong pl-5 text-[1.0625rem] leading-relaxed text-fg-muted">
                  Enterprise applications, workflow platforms, dashboards, document
                  systems and multilingual products — each with a full case study.
                </p>
                <p className="mt-5 pl-5 font-mono text-[0.6875rem] leading-relaxed tracking-[0.06em] text-fg-faint">
                  {projects.length} projects
                  <span className="mx-2 text-fg-faint/60">·</span>
                  {multilingualCount} multilingual
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      {/* Grid */}
      <div className="container-page">
        <div className="grid gap-x-10 gap-y-16 md:grid-cols-2 md:gap-y-20">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              priority={i === 0}
              size={i === 0 ? "feature" : "regular"}
              className={i === 0 ? "md:col-span-2" : ""}
              sizes={
                i === 0
                  ? "(min-width: 1280px) 1160px, (min-width: 768px) 92vw, 100vw"
                  : "(min-width: 768px) 46vw, 100vw"
              }
            />
          ))}
        </div>

        <Reveal y={18} className="mt-20">
          <div className="flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
            <p className="max-w-md text-[0.9375rem] leading-relaxed text-fg-muted">
              Something here close to what you need building?
            </p>
            <Link
              href="/#contact"
              className={cn(buttonVariants({ variant: "primary", size: "md" }), "group/c")}
            >
              Start a project
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover/c:translate-x-1"
                strokeWidth={2}
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
