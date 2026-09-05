"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useReducedMotion } from "@/hooks/use-media-query";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { Magnetic } from "@/components/motion/magnetic";
import { ease } from "@/lib/motion";

export function Header({ aiEnabled = true }: { aiEnabled?: boolean }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const reduced = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const { scrollY } = useScroll();
  // Guarded so React state is touched only when the threshold is crossed,
  // rather than once per scroll frame.
  const scrolledRef = useRef(false);
  useMotionValueEvent(scrollY, "change", (v) => {
    const next = v > 24;
    if (next !== scrolledRef.current) {
      scrolledRef.current = next;
      setScrolled(next);
    }
  });

  // The AI Fit entry points at a section that only exists when the assistant is
  // configured. Dropping it keeps the nav free of dead anchors.
  const navigation = useMemo(
    () => portfolio.navigation.filter((item) => aiEnabled || item.id !== "project-fit"),
    [aiEnabled],
  );
  const sectionIds = useMemo(() => navigation.map((item) => item.id), [navigation]);
  const active = useActiveSection(sectionIds, isHome);

  // The sheet closes from its own links, the overlay and Escape -- no
  // route-change effect needed. Lock body scroll while it is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[padding] duration-500",
          "[transition-timing-function:var(--ease-expo)]",
          scrolled ? "py-2" : "py-4 md:py-5",
        )}
      >
        <div className="container-page">
          <nav
            aria-label="Primary"
            className={cn(
              "relative flex items-center justify-between gap-6 rounded-full transition-all duration-500",
              "[transition-timing-function:var(--ease-expo)]",
              scrolled
                ? "border border-line bg-bg/72 px-3 py-2 backdrop-blur-xl md:px-4"
                : "border border-transparent px-1 py-2 md:px-2",
            )}
          >
            {/* Brand */}
            <Link
              href="/"
              className="group/brand flex shrink-0 items-center gap-2.5 rounded-full pr-2"
              aria-label={`${portfolio.personal.name} — home`}
            >
              {/* Monogram only. The supplied logo bakes in the wordmark and
                  taglines, which are illegible at this size — and the wordmark
                  is already set as text beside it. */}
              <Image
                src="/assets/logo-mark.png"
                alt=""
                width={512}
                height={512}
                priority
                sizes="28px"
                className="size-7 shrink-0 transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover/brand:scale-105"
              />
              <span className="text-[0.9375rem] font-semibold tracking-[-0.02em] text-fg">
                OMOR
                <span className="hidden text-fg-faint sm:inline"> KYUM AUNTO</span>
              </span>
            </Link>

            {/* Desktop links */}
            <ul className="hidden items-center gap-0.5 lg:flex">
              {navigation.map((item) => {
                const isActive = isHome && active === item.id;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative block rounded-full px-3.5 py-2 text-[0.8125rem] transition-colors duration-300",
                        isActive ? "text-fg" : "text-fg-subtle hover:text-fg",
                      )}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="nav-active"
                          aria-hidden="true"
                          transition={
                            reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }
                          }
                          className="absolute inset-0 rounded-full bg-surface-2/80 ring-1 ring-line"
                        />
                      ) : null}
                      <span className="relative">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2">
              <ThemeToggle className="hidden sm:flex" />
              <Magnetic className="hidden lg:inline-flex">
                <Link
                  href="/#contact"
                  className="group/cta inline-flex h-9 items-center gap-1.5 rounded-full bg-fg px-4 text-[0.8125rem] font-medium text-bg transition-colors duration-300 hover:bg-accent hover:text-accent-fg"
                >
                  Start a project
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-3.5 transition-transform duration-300 [transition-timing-function:var(--ease-expo)] group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                  />
                </Link>
              </Magnetic>

              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                aria-controls="mobile-nav"
                className="grid size-9 place-items-center rounded-full border border-line-strong text-fg transition-colors duration-300 hover:bg-surface-2 lg:hidden"
              >
                <Menu aria-hidden="true" className="size-4" strokeWidth={1.75} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <MobileNav
        open={open}
        onClose={() => setOpen(false)}
        activeId={isHome ? active : ""}
        navigation={navigation}
      />
    </>
  );
}

function MobileNav({
  open,
  onClose,
  activeId,
  navigation,
}: {
  open: boolean;
  onClose: () => void;
  activeId: string;
  navigation: typeof portfolio.navigation;
}) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-nav"
          className="fixed inset-0 z-[60] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: ease.out }}
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-bg-deep/80 backdrop-blur-xl"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="tech-grid absolute inset-x-0 top-0 origin-top border-b border-line bg-bg/95 pb-8 pt-5 shadow-[0_40px_120px_-40px_hsl(var(--bg-deep))]"
            initial={{ y: reduced ? 0 : "-4%", opacity: reduced ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduced ? 0 : "-4%", opacity: 0 }}
            transition={{ duration: 0.42, ease: ease.out }}
          >
            <div className="container-page">
              <div className="flex items-center justify-between pb-6">
                <span className="text-meta text-fg-faint">Menu</span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  autoFocus
                  className="grid size-9 place-items-center rounded-full border border-line-strong text-fg transition-colors duration-300 hover:bg-surface-2"
                >
                  <X aria-hidden="true" className="size-4" strokeWidth={1.75} />
                </button>
              </div>

              <ul className="divide-y divide-[color:var(--color-line)] border-y border-line">
                {navigation.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: reduced ? 0 : 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: reduced ? 0 : 0.05 + i * 0.045, ease: ease.out }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-baseline justify-between py-3.5"
                    >
                      <span
                        className={cn(
                          "text-2xl tracking-[-0.03em]",
                          activeId === item.id ? "text-fg" : "text-fg-muted",
                        )}
                      >
                        {item.label}
                      </span>
                      <span className="text-meta text-fg-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduced ? 0 : 0.34, duration: 0.4 }}
                className="mt-7 flex items-center justify-between gap-4"
              >
                <ThemeToggle />
                <Link
                  href="/#contact"
                  onClick={onClose}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-fg px-5 text-sm font-medium text-bg"
                >
                  Start a project
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
