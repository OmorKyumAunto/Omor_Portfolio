"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-media-query";
import { portfolio } from "@/data/portfolio";
import { activeSocials } from "@/lib/site";
import { SocialLinks } from "@/components/ui/social-links";
import { ease } from "@/lib/motion";

export function Footer({
  resumeAvailable = false,
  aiEnabled = true,
}: {
  resumeAvailable?: boolean;
  aiEnabled?: boolean;
}) {
  const reduced = useReducedMotion();
  const year = new Date().getFullYear();
  const { personal } = portfolio;

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="container-page relative pt-20 pb-10 md:pt-24">
        <div className="grid gap-y-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-12">
          {/* Identity */}
          <div className="max-w-sm">
            <p className="text-xl tracking-[-0.02em] text-fg">{personal.name}</p>
            <p className="mt-1 text-sm text-fg-muted">{personal.role}</p>
            <p className="mt-5 max-w-xs text-[0.875rem] leading-relaxed text-fg-subtle">
              {portfolio.seo.description}
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer">
            <p className="text-meta mb-5 text-fg-faint">Sitemap</p>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2.5">
              {portfolio.navigation
                .filter((item) => aiEnabled || item.id !== "project-fit")
                .map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="text-[0.875rem] text-fg-subtle transition-colors duration-300 hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Status + reach */}
          <div>
            <p className="text-meta mb-5 text-fg-faint">Status</p>

            {personal.availability.enabled ? (
              <p className="flex items-start gap-2.5 text-[0.875rem] leading-relaxed text-fg-muted">
                <span aria-hidden="true" className="relative mt-1.5 flex size-1.5 shrink-0">
                  <span className="absolute inline-flex size-full rounded-full bg-positive/60 [animation:pulse-ring_2.6s_var(--ease-expo)_infinite]" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-positive" />
                </span>
                {personal.availability.label}
              </p>
            ) : null}

            <p className="mt-3 text-[0.875rem] text-fg-subtle">{personal.location}</p>

            {activeSocials.length > 0 ? <SocialLinks className="mt-6" /> : null}

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                href="/#contact"
                className="text-[0.875rem] text-fg underline decoration-line-strong decoration-1 underline-offset-[6px] transition-colors duration-300 hover:decoration-accent"
              >
                Start a project
              </Link>
              {resumeAvailable ? (
                <a
                  href={personal.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.875rem] text-fg-subtle underline decoration-line-strong decoration-1 underline-offset-[6px] transition-colors duration-300 hover:text-fg hover:decoration-accent"
                >
                  Resume
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-6 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-fg-faint">
            © {year} {personal.name}. All rights reserved.
          </p>

          <a
            href="#top"
            className="group/top inline-flex items-center gap-2 rounded-full border border-line-strong px-3.5 py-2 text-xs text-fg-muted transition-colors duration-300 hover:border-fg/30 hover:text-fg"
          >
            Back to top
            <ArrowUp
              aria-hidden="true"
              className="size-3.5 transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover/top:-translate-y-0.5"
              strokeWidth={1.75}
            />
          </a>
        </div>
      </div>

      {/* Closing wordmark. Drawn as SVG with a forced text length so it fits the
          container exactly at every viewport width instead of being clipped. */}
      <div aria-hidden="true" className="container-page select-none pb-4 md:pb-6">
        <motion.svg
          viewBox="0 0 1000 108"
          className="w-full"
          initial={{ opacity: 0, y: reduced ? 0 : 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease: ease.out }}
        >
          <text
            x="0"
            y="86"
            textLength="1000"
            lengthAdjust="spacing"
            className="fill-fg/[0.06] font-sans text-[100px] font-medium"
          >
            OMOR KYUM AUNTO
          </text>
        </motion.svg>
      </div>
    </footer>
  );
}
