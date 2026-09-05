import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { Section, SectionHeader } from "@/components/ui/section";
import { ProjectCard } from "@/components/ui/project-card";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const featured = portfolio.projects
  .filter((p) => p.featured)
  .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));

const more = portfolio.projects.filter((p) => !p.featured);

/**
 * Selected Work.
 *
 * Poster-led and deliberately asymmetric: the first project runs wide, the next
 * two pair up, and the remainder appear as a compact index. The homepage sells
 * the body of work; the case studies explain it.
 */
export function Work() {
  const [lead, ...rest] = featured;

  return (
    <Section id="work">
      <SectionHeader
        eyebrow="Selected Work"
        index="03"
        title="Production systems, not portfolio pieces."
        align="between"
        lead={
          <p>
            Enterprise applications, business workflows and multilingual products —
            built end to end, from data model to interface and deployment.
          </p>
        }
      />

      {/* Lead project — widest presentation */}
      {lead ? (
        <div className="mt-16 lg:mt-20">
          {/* Not `priority`: this sits several screens down, and the page's
              above-fold content is text and inline SVG. */}
          <ProjectCard
            project={lead}
            size="feature"
            sizes="(min-width: 1280px) 1160px, (min-width: 768px) 92vw, 100vw"
          />
        </div>
      ) : null}

      {/* Remaining featured — paired */}
      {rest.length > 0 ? (
        <div className="mt-16 grid gap-x-10 gap-y-16 lg:mt-24 lg:grid-cols-2">
          {rest.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              size="feature"
              sizes="(min-width: 1024px) 46vw, 100vw"
            />
          ))}
        </div>
      ) : null}

      {/* More systems — compact, still poster-led */}
      {more.length > 0 ? (
        <div className="mt-24 lg:mt-32">
          <Reveal y={0} duration={0.6}>
            <div className="flex items-center gap-4 pb-10">
              <h3 className="text-eyebrow text-accent">More systems I&apos;ve built</h3>
              <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
              <span className="text-eyebrow tabular-nums text-fg-faint">
                {String(more.length).padStart(2, "0")}
              </span>
            </div>
          </Reveal>

          <div className="grid gap-x-10 gap-y-14 md:grid-cols-2">
            {more.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                sizes="(min-width: 768px) 46vw, 100vw"
              />
            ))}
          </div>
        </div>
      ) : null}

      <Reveal y={18} className="mt-16 lg:mt-20">
        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
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
