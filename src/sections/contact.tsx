"use client";

import { ArrowUpRight, Briefcase, Check, Copy, ExternalLink, Mail } from "lucide-react";
import { motion } from "motion/react";
import { portfolio } from "@/data/portfolio";
import { activeSocials, hasEmail, mailtoHref, webmailComposeHref } from "@/lib/site";
import { useCopy } from "@/hooks/use-copy";
import { useReducedMotion } from "@/hooks/use-media-query";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/signal";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SocialKey } from "@/types/portfolio";
import { ease } from "@/lib/motion";

const CHANNEL_COPY: Record<
  SocialKey,
  { title: string; description: string; cta: string }
> = {
  email: {
    title: "Email",
    description: "The fastest route. Tell me what the system needs to do.",
    cta: "Send an email",
  },
  upwork: {
    title: "Upwork",
    description: "Prefer contracting through a platform? Message me there.",
    cta: "Message on Upwork",
  },
  linkedin: {
    title: "LinkedIn",
    description: "Connect, or start the conversation there.",
    cta: "Connect on LinkedIn",
  },
  github: {
    title: "GitHub",
    description: "Code, commits and what I'm working on.",
    cta: "View GitHub",
  },
};

const ORDER: SocialKey[] = ["email", "upwork", "linkedin", "github"];

/**
 * Direct contact. No form.
 *
 * Every channel is one click to a real destination — a mail client, Upwork,
 * LinkedIn or GitHub — with a copy-email affordance for people who'd rather
 * paste the address somewhere else.
 */
export function Contact() {
  const { contact, personal } = portfolio;
  const { copied, copy } = useCopy();
  const reduced = useReducedMotion();

  const channels = ORDER.map((key) => activeSocials.find((s) => s.key === key)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s),
  );

  return (
    <Section id="contact" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/4 size-[560px] rounded-full bg-accent/[0.08] blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="tech-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(80%_60%_at_50%_50%,black,transparent)]"
      />

      <div className="relative">
        {/* Statement */}
        <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
          <div>
            <SectionLabel index="09" label={contact.eyebrow} className="pb-6" />

            <Reveal y={22}>
              <h2 className="text-display text-[clamp(2.25rem,1.2rem+4vw,4.25rem)] text-fg">
                {contact.heading}{" "}
                <span className="text-serif-accent text-accent">{contact.headingAccent}</span>
              </h2>
            </Reveal>
          </div>

          <Reveal y={18} delay={0.08}>
            <div className="lg:pb-3">
              <p className="border-l border-line-strong pl-5 text-[1.0625rem] leading-relaxed text-fg-muted">
                {contact.lead}
              </p>
              <p className="mt-4 pl-5 text-[0.875rem] leading-relaxed text-fg-subtle">
                {contact.responseNote}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Primary action — the address itself is the interface. It is set at
            display scale because it is the single thing this section exists to
            hand over; the buttons underneath are the fallbacks for it. */}
        {hasEmail ? (
          <Reveal y={20} delay={0.12}>
            <div className="mt-16 border-y border-line py-10 md:mt-20 md:py-14">
              <div className="flex items-baseline gap-4">
                <span className="text-meta text-accent">Direct</span>
                <span aria-hidden="true" className="h-px flex-1 bg-line" />
              </div>

              <a
                href={mailtoHref}
                className="group/mail mt-6 block focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent"
              >
                <span className="block font-mono text-[clamp(1.15rem,0.2rem+3.5vw,3.25rem)] leading-[1.05] tracking-[-0.035em] break-all text-fg transition-colors duration-500 [transition-timing-function:var(--ease-expo)] group-hover/mail:text-accent">
                  {personal.email}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-3 block h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-700 [transition-timing-function:var(--ease-expo)] group-hover/mail:scale-x-100 group-focus-visible/mail:scale-x-100"
                />
              </a>

              <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-4 md:mt-10">
                <Magnetic>
                  <a
                    href={mailtoHref}
                    className={cn(buttonVariants({ variant: "primary", size: "lg" }), "group/em")}
                  >
                    <Mail aria-hidden="true" className="size-4" strokeWidth={2} />
                    Email me
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover/em:translate-x-0.5 group-hover/em:-translate-y-0.5"
                      strokeWidth={2}
                    />
                  </a>
                </Magnetic>

                <a
                  href={webmailComposeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-6")}
                >
                  <ExternalLink aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  Gmail
                </a>

                <button
                  type="button"
                  onClick={() => void copy(personal.email)}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-6")}
                >
                  <span className="relative grid size-4 place-items-center">
                    <Copy
                      aria-hidden="true"
                      className={cn(
                        "absolute size-4 transition-all duration-300",
                        copied ? "scale-50 opacity-0" : "scale-100 opacity-100",
                      )}
                      strokeWidth={1.75}
                    />
                    <Check
                      aria-hidden="true"
                      className={cn(
                        "absolute size-4 text-positive transition-all duration-300",
                        copied ? "scale-100 opacity-100" : "scale-50 opacity-0",
                      )}
                      strokeWidth={2}
                    />
                  </span>
                  <motion.span
                    key={copied ? "copied" : "copy"}
                    initial={{ opacity: 0, y: reduced ? 0 : 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: ease.out }}
                  >
                    {copied ? "Copied" : "Copy"}
                  </motion.span>
                  <span aria-live="polite" className="sr-only">
                    {copied ? "Email address copied to clipboard" : ""}
                  </span>
                </button>

                {/* mailto: only works with a mail client installed, so say which
                    button does what rather than leaving a dead click. */}
                <p className="ml-auto max-w-xs text-[0.75rem] leading-relaxed text-fg-faint md:text-right">
                  <span className="text-fg-subtle">Email me</span> opens your mail app.
                  No mail app? Use <span className="text-fg-subtle">Gmail</span> or copy the
                  address.
                </p>
              </div>
            </div>
          </Reveal>
        ) : null}

        {/* Channels */}
        {channels.length > 0 ? (
          <div className="mt-12 grid border-b border-line sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((social, i) => {
              const meta = CHANNEL_COPY[social.key];
              const isMail = social.key === "email";
              const href = isMail ? mailtoHref : social.url;
              const Icon =
                social.key === "github"
                  ? GithubIcon
                  : social.key === "linkedin"
                    ? LinkedinIcon
                    : social.key === "email"
                      ? Mail
                      : Briefcase;

              return (
                <motion.a
                  key={social.key}
                  href={href}
                  {...(isMail
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  initial={{ opacity: 0, y: reduced ? 0 : 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: ease.out }}
                  className="group/ch relative flex flex-col justify-between gap-8 border-t border-line py-7 pr-6 transition-colors duration-400 [transition-timing-function:var(--ease-expo)] sm:[&:nth-child(n+2)]:pl-6 lg:[&:nth-child(n+2)]:border-l"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-accent transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover/ch:scale-x-100"
                  />

                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <Icon
                        aria-hidden="true"
                        className="size-4 text-fg-subtle transition-colors duration-400 group-hover/ch:text-accent"
                        strokeWidth={1.75}
                      />
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-3.5 text-fg-faint transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover/ch:translate-x-0.5 group-hover/ch:-translate-y-0.5"
                        strokeWidth={1.75}
                      />
                    </div>
                    <h3 className="mt-5 text-[1.0625rem] tracking-[-0.02em] text-fg">
                      {meta.title}
                    </h3>
                    <p className="mt-2 text-[0.8125rem] leading-relaxed text-fg-subtle">
                      {meta.description}
                    </p>
                  </div>

                  <span className="font-mono text-[0.6875rem] tracking-[0.06em] text-fg-faint">
                    {social.handle || meta.cta}
                  </span>
                </motion.a>
              );
            })}
          </div>
        ) : null}

        <Reveal y={16} delay={0.1}>
          <p className="mt-8 font-mono text-[0.6875rem] tracking-[0.08em] text-fg-faint">
            {personal.location}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
