import { portfolio } from "@/data/portfolio";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";

/**
 * Renders nothing while `portfolio.testimonials` is empty. The architecture is
 * here so real quotes can be added later — no placeholder people, no invented
 * companies, no stock avatars.
 */
export function Testimonials() {
  const items = portfolio.testimonials;
  if (items.length === 0) return null;

  return (
    <Section id="testimonials">
      <SectionHeader eyebrow="Testimonials" title="What clients say." align="between" />

      <ul className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:mt-20">
        {items.map((testimonial, i) => (
          <li key={`${testimonial.author}-${i}`}>
            <Reveal y={18} delay={(i % 2) * 0.08}>
              <figure className="border-t border-line pt-6">
                <blockquote className="text-[1.0625rem] leading-relaxed text-fg-muted">
                  <p>“{testimonial.quote}”</p>
                </blockquote>
                <figcaption className="mt-5 text-[0.8125rem]">
                  <span className="text-fg">{testimonial.author}</span>
                  <span className="text-fg-subtle">
                    {" · "}
                    {testimonial.title}
                    {testimonial.company ? `, ${testimonial.company}` : ""}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
