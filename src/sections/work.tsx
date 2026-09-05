import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { Section } from "@/components/ui/section";
import { ProjectExhibit } from "@/components/ui/project-exhibit";
import { ProjectIndexRow } from "@/components/ui/project-index-row";
import { SectionLabel } from "@/components/ui/signal";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const featured = portfolio.projects
  .filter((p) => p.featured)
  .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));

const more = portfolio.projects.filter((p) => !p.featured);

/**
 * Selected Work — V2 exhibition.
 *
 * Two distinct modes rather than one card grid at two sizes: the three featured
 * systems get full exhibit rows with a dossier of technical metadata beside a
 * dominant poster, and the rest form an editorial index. The change of mode is
 * itself the signal that the featured three are the argument and the index is
 * the evidence behind it.
 */
export function Work() {
  return (
    <Section id="work">
      <SectionLabel
        index="03"
        label="Selected Work"
        trailing={`${portfolio.projects.length} systems`}
      />

      <div className="mt-8 grid gap-x-16 gap-y-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
        <Reveal variant="mask">
          <h2 className="text-[clamp(2rem,1.2rem+3vw,4rem)] leading-[1.02] tracking-[-0.04em] text-fg">
            Production systems,
            <br />
            not portfolio pieces.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="max-w-md text-[0.9375rem] leading-relaxed text-fg-muted lg:pb-2">
            Enterprise applications, business workflows and multilingual products —
            built end to end, from data model to interface and deployment.
          </p>
        </Reveal>
      </div>

      {/* Featured exhibits. Generous separation: each one should own its screen. */}
      <div className="mt-20 space-y-28 md:mt-28 md:space-y-36 lg:space-y-44">
        {featured.map((project, i) => (
          <ProjectExhibit key={project.slug} project={project} position={i} />
        ))}
      </div>

      {/* The rest, as an index. */}
      {more.length > 0 ? (
        <div className="mt-32 lg:mt-44">
          <SectionLabel
            index="03.2"
            label="System Index"
            tone="muted"
            trailing={String(more.length).padStart(2, "0")}
          />
          <div className="mt-8 border-b border-line">
            {more.map((project) => (
              <ProjectIndexRow key={project.slug} project={project} />
            ))}
          </div>
        </div>
      ) : null}

      <Reveal y={18} className="mt-14">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-md text-[0.9375rem] leading-relaxed text-fg-muted">
            Every project has a full case study — the problem, the approach, the
            architecture and what it actually does.
          </p>
          <Link
            href="/work"
            className={cn(buttonVariants({ variant: "outline", size: "md" }), "group/all")}
          >
            View all work
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover/all:translate-x-1"
              strokeWidth={1.75}
            />
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
