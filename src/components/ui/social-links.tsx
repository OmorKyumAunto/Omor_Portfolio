"use client";

import { Briefcase, Check, Copy, Mail } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { GithubIcon, LinkedinIcon } from "./brand-icons";
import { activeSocials, hasEmail } from "@/lib/site";
import { portfolio } from "@/data/portfolio";
import { useCopy } from "@/hooks/use-copy";
import { cn } from "@/lib/utils";
import type { SocialKey } from "@/types/portfolio";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const ICONS: Record<SocialKey, IconComponent> = {
  email: Mail,
  github: GithubIcon,
  linkedin: LinkedinIcon,
  upwork: Briefcase,
};

/**
 * Renders only socials that have a URL configured. If none do, nothing is
 * rendered at all — no placeholder icons, no dead links.
 */
export function SocialLinks({ className }: { className?: string }) {
  if (activeSocials.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {activeSocials.map((social) => {
        const Icon = ICONS[social.key];
        const isMail = social.key === "email";
        return (
          <li key={social.key}>
            <a
              href={isMail && !social.url.startsWith("mailto:") ? `mailto:${social.url}` : social.url}
              target={isMail ? undefined : "_blank"}
              rel={isMail ? undefined : "noopener noreferrer"}
              className="group/social inline-flex items-center gap-2 rounded-full border border-line-strong px-3.5 py-2 text-[0.8125rem] text-fg-muted transition-colors duration-300 hover:border-fg/30 hover:bg-surface-2/70 hover:text-fg"
            >
              <Icon aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
              {social.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** Copy-to-clipboard email chip. Renders nothing when no email is configured. */
export function CopyEmail({ className }: { className?: string }) {
  const { copied, copy } = useCopy();
  const email = portfolio.personal.email;

  if (!hasEmail) return null;

  return (
    <button
      type="button"
      onClick={() => void copy(email)}
      aria-live="polite"
      className={cn(
        "group/copy inline-flex items-center gap-2.5 rounded-full border border-line-strong px-4 py-2.5 font-mono text-[0.8125rem] text-fg-muted transition-colors duration-300 hover:border-accent/40 hover:text-fg",
        className,
      )}
    >
      {email}
      <span className="relative grid size-3.5 place-items-center">
        <Copy
          aria-hidden="true"
          className={cn("absolute size-3.5 transition-all duration-300", copied ? "scale-50 opacity-0" : "scale-100 opacity-100")}
          strokeWidth={1.75}
        />
        <Check
          aria-hidden="true"
          className={cn("absolute size-3.5 text-positive transition-all duration-300", copied ? "scale-100 opacity-100" : "scale-50 opacity-0")}
          strokeWidth={2}
        />
      </span>
      <span className="sr-only">{copied ? "Email copied" : "Copy email address"}</span>
    </button>
  );
}
