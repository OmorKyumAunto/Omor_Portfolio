import { portfolio } from "@/data/portfolio";
import { Reveal } from "@/components/motion/reveal";

/**
 * Credibility strip. No fake client logos — a plain statement of what I do,
 * set as an editorial index row.
 */
export function Trust() {
  return (
    <section aria-label="Areas of work" className="relative border-y border-line">
      <div className="container-page">
        <ul className="grid grid-cols-1 divide-y divide-[color:var(--color-line)] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-5">
          {portfolio.trust.map((item, i) => (
            <li
              key={item.label}
              className="group/t relative py-6 sm:py-8 lg:border-l lg:border-line lg:px-6 lg:py-10 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
            >
              <Reveal y={14} delay={i * 0.05} amount={0.4}>
                <span className="text-meta block text-fg-faint tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-2.5 block text-[0.9375rem] font-medium tracking-[-0.01em] text-fg">
                  {item.label}
                </span>
                <span className="mt-1.5 block text-[0.8125rem] leading-relaxed text-fg-subtle">
                  {item.description}
                </span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
