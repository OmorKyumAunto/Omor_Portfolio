"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { ProjectImage } from "@/types/portfolio";
import { useReducedMotion } from "@/hooks/use-media-query";
import { RedactionLayer, hasRedactions } from "./redaction";
import { cropGeometry } from "./screenshot";
import { ease } from "@/lib/motion";

/**
 * Accessible full-size screenshot viewer.
 *
 * - Rendered in a portal so it escapes any transformed/overflow ancestor.
 * - Escape closes; focus is trapped while open and returned to the trigger.
 * - The full-resolution image is only requested once the lightbox opens, so a
 *   gallery page never downloads every screenshot at full size up front.
 */
export function Lightbox({
  image,
  open,
  onClose,
}: {
  image: ProjectImage;
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const { aspectRatio, innerStyle } = cropGeometry(image.width, image.height, image.crop);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      // Minimal focus trap: the panel only ever holds the close button.
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    const raf = requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreRef.current?.focus?.();
    };
  }, [open, onKeyDown]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: ease.out }}
        >
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-zoom-out bg-bg-deep/92 backdrop-blur-xl"
          />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={image.alt}
            className="relative flex min-h-0 flex-1 flex-col p-4 sm:p-6 md:p-10"
          >
            <div className="flex shrink-0 items-start justify-between gap-6 pb-4">
              <p className="max-w-2xl text-[0.8125rem] leading-relaxed text-fg-muted">
                {image.caption ?? image.alt}
                {hasRedactions(image.redactions) ? (
                  <span className="mt-1 block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-fg-faint">
                    Regions masked for client privacy
                  </span>
                ) : null}
              </p>

              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="grid size-10 shrink-0 place-items-center rounded-full border border-line-strong bg-surface/70 text-fg backdrop-blur-md transition-colors duration-300 hover:bg-surface-2"
              >
                <X aria-hidden="true" className="size-4" strokeWidth={1.75} />
                <span className="sr-only">Close</span>
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: reduced ? 1 : 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduced ? 1 : 0.99 }}
              transition={{ duration: reduced ? 0.2 : 0.45, ease: ease.out }}
              className="relative min-h-0 flex-1 overflow-auto rounded-xl border border-line-strong bg-surface-2"
            >
              <div
                className="relative mx-auto overflow-hidden"
                style={{ aspectRatio, maxWidth: image.width }}
              >
                <div style={innerStyle}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="100vw"
                    quality={95}
                    className="object-cover"
                  />
                  <RedactionLayer regions={image.redactions} />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
