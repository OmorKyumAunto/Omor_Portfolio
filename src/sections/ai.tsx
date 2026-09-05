import { portfolio } from "@/data/portfolio";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/signal";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

/**
 * The AI section is deliberately the one place with a darker, denser treatment
 * — a change of register that breaks the page rhythm without adding a gradient.
 */
export function AiIntegration() {
  const { ai } = portfolio;

  return (
    <Section id="ai" bleed className="relative overflow-hidden border-y border-line bg-bg-deep">
      <div
        aria-hidden="true"
        className="tech-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(90%_70%_at_50%_50%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-accent-2/[0.09] blur-[120px]"
      />

      <div className="container-page relative">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionLabel index="06" label={ai.eyebrow} tone="violet" className="pb-6" />

            <Reveal y={20}>
              <h2 className="text-display text-[clamp(2rem,1.2rem+3.4vw,3.75rem)] text-fg">
                AI where it creates{" "}
                <span className="text-serif-accent text-accent-2">actual</span> value.
              </h2>
            </Reveal>

            <Reveal variant="fade" delay={0.08}>
              <p className="mt-7 max-w-lg text-[1.0625rem] leading-relaxed text-fg-muted">
                {ai.lead}
              </p>
            </Reveal>

            <Reveal variant="fade" delay={0.14}>
              <p className="mt-5 max-w-lg text-[0.9375rem] leading-[1.75] text-fg-subtle">
                {ai.body}
              </p>
            </Reveal>

            <Reveal y={16} delay={0.2}>
              <p className="text-serif-accent mt-9 max-w-sm border-l border-accent-2/40 pl-5 text-lg leading-snug text-fg/85">
                {ai.note}
              </p>
            </Reveal>
          </div>

          <Stagger className="lg:pt-20" amount={0.1}>
            <ul className="divide-y divide-[color:var(--color-line)] border-y border-line">
              {ai.capabilities.map((capability, i) => (
                <StaggerItem key={capability.title}>
                  <li className="group/ai grid gap-1 py-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-6">
                    <span className="text-meta pt-1 tabular-nums text-fg-faint transition-colors duration-400 group-hover/ai:text-accent-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-base font-medium tracking-[-0.015em] text-fg">
                        {capability.title}
                      </h3>
                      <p className="mt-1.5 text-[0.875rem] leading-relaxed text-fg-subtle">
                        {capability.description}
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
