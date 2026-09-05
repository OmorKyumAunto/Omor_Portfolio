import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { LostSignal } from "@/components/ui/lost-signal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This route does not exist.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-svh items-center overflow-hidden pt-28 pb-20">
      <div
        aria-hidden="true"
        className="tech-grid pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(90%_70%_at_50%_40%,black,transparent)]"
      />

      <div className="container-page">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <div>
            <p className="text-eyebrow text-accent">Error 404</p>

            <h1 className="text-display mt-6 text-[clamp(2.25rem,1.2rem+4vw,4.5rem)] text-fg">
              Looks like this route went somewhere{" "}
              <span className="text-serif-accent text-accent">unexpected.</span>
            </h1>

            <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-fg-muted">
              The page you asked for isn&apos;t here. It may have moved, or the link may be
              incomplete.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "primary", size: "lg" }), "group/h pl-6 pr-7")}
              >
                <ArrowLeft
                  aria-hidden="true"
                  className="size-4 transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover/h:-translate-x-1"
                  strokeWidth={2}
                />
                Back Home
              </Link>

              <Link
                href="/#work"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-7")}
              >
                Selected Work
              </Link>
            </div>

            <nav aria-label="Suggested pages" className="mt-12 border-t border-line pt-6">
              <p className="text-eyebrow mb-4 text-fg-faint">Try one of these</p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {portfolio.navigation.slice(1).map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={cn(buttonVariants({ variant: "quiet", size: "none" }), "text-sm")}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <LostSignal />
        </div>
      </div>
    </div>
  );
}
