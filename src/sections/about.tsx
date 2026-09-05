import { GraduationCap } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Portrait } from "@/components/ui/portrait";

export function About() {
  const { about, education, personal } = portfolio;

  return (
    <Section id="about">
      <SectionHeader
        eyebrow={about.eyebrow}
        index="01"
        title={about.heading}
        align="between"
        lead={
          <p className="text-serif-accent text-xl leading-snug text-fg/85 md:text-[1.375rem]">
            “{about.pullQuote}”
          </p>
        }
      />

      <div className="mt-16 grid gap-x-14 gap-y-14 lg:mt-20 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        {/* Portrait rail — the photo plus the credentials that sit with it */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Portrait className="mx-auto max-w-sm lg:mx-0 lg:max-w-none" />

          <Reveal variant="fade" delay={0.1}>
            <div className="mx-auto mt-8 flex max-w-sm items-start gap-4 border-t border-line pt-6 lg:mx-0 lg:max-w-none">
              <GraduationCap
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-fg-faint"
                strokeWidth={1.5}
              />
              <div>
                <p className="text-meta text-fg-faint">Education</p>
                {education.map((entry) => (
                  <p key={entry.institution} className="mt-2 text-sm leading-relaxed text-fg-muted">
                    <span className="text-fg">{entry.degree}</span> in {entry.field}
                    <span className="mx-1.5 text-fg-faint">·</span>
                    {entry.institution}
                  </p>
                ))}
                <p className="mt-1 text-[0.8125rem] text-fg-subtle">{personal.location}</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Editorial copy + principles */}
        <div>
          <div className="max-w-2xl">
            {about.paragraphs.map((paragraph, i) => (
              <Reveal key={i} variant="fade" delay={i * 0.05}>
                <p
                  className={
                    i === 0
                      ? "text-[1.125rem] leading-[1.65] text-fg md:text-[1.25rem]"
                      : "mt-6 text-[0.9375rem] leading-[1.75] text-fg-muted md:text-base"
                  }
                >
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          <Stagger className="mt-12" amount={0.12}>
            <ul className="grid gap-x-10 border-t border-line sm:grid-cols-2">
              {about.principles.map((principle, i) => (
                <StaggerItem key={principle.title}>
                  <li className="group/pr flex gap-5 border-b border-line py-5">
                    <span className="text-meta mt-1 w-6 shrink-0 tabular-nums text-fg-faint transition-colors duration-300 group-hover/pr:text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-[0.9375rem] font-medium tracking-[-0.01em] text-fg">
                        {principle.title}
                      </h3>
                      <p className="mt-1.5 text-[0.875rem] leading-relaxed text-fg-subtle">
                        {principle.description}
                      </p>
                    </div>
                  </li>
                </StaggerItem>
              ))}
            </ul>
          </Stagger>
        </div>
      </div>
    </Section>
  );
}
