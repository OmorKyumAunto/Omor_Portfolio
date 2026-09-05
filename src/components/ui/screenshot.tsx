"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { Maximize2 } from "lucide-react";
import type { ImageCrop, ProjectImage } from "@/types/portfolio";
import { useReducedMotion } from "@/hooks/use-media-query";
import { RedactionLayer, hasRedactions } from "./redaction";
import { Lightbox } from "./lightbox";
import { cn } from "@/lib/utils";

/**
 * Geometry for a percentage crop.
 *
 * The trick that keeps privacy masks correct: the image and its redaction layer
 * live together inside one oversized, offset wrapper, and the visible window
 * clips it. Both are scaled and shifted identically, so a mask expressed in
 * percentages of the *original* image still lands on the pixels it covers.
 */
export function cropGeometry(width: number, height: number, crop?: ImageCrop) {
  const top = crop?.top ?? 0;
  const right = crop?.right ?? 0;
  const bottom = crop?.bottom ?? 0;
  const left = crop?.left ?? 0;

  const visibleW = Math.max(1, 100 - left - right);
  const visibleH = Math.max(1, 100 - top - bottom);

  return {
    /** Aspect ratio of the cropped window. */
    aspectRatio: (width * visibleW) / (height * visibleH),
    innerStyle: {
      position: "absolute",
      width: `${(100 / visibleW) * 100}%`,
      height: `${(100 / visibleH) * 100}%`,
      left: `${-(left / visibleW) * 100}%`,
      top: `${-(top / visibleH) * 100}%`,
    } as CSSProperties,
  };
}

/**
 * A real product screenshot in a Signal-system frame.
 *
 * The frame takes the screenshot's own (cropped) aspect ratio, so dashboards
 * are never cut off and masks stay aligned. Dense screenshots open in an
 * accessible lightbox for inspection.
 */
export function Screenshot({
  image,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className,
  enableZoom = true,
  quality = 90,
  showNote = true,
}: {
  image: ProjectImage;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Posters are covers, not detail views — zoom is disabled for them. */
  enableZoom?: boolean;
  quality?: number;
  /**
   * The masking disclosure. Shown where a reader can actually inspect the
   * image; suppressed in dense listings where it would just repeat.
   */
  showNote?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const masked = showNote && hasRedactions(image.redactions);
  const { aspectRatio, innerStyle } = cropGeometry(image.width, image.height, image.crop);

  return (
    <>
      <figure className={cn("group/shot relative w-full", className)}>
        <div
          className="relative overflow-hidden rounded-xl border border-line-strong bg-surface-2"
          style={{ aspectRatio }}
        >
          <div style={innerStyle}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={priority}
              loading={priority ? undefined : "lazy"}
              sizes={sizes}
              quality={quality}
              className={cn(
                "object-cover transition-transform duration-700 [transition-timing-function:var(--ease-expo)]",
                enableZoom && !reduced && "group-hover/shot:scale-[1.01]",
              )}
            />
            <RedactionLayer regions={image.redactions} />
          </div>

          {/* Frame inner highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-[hsl(var(--line)/0.14)]"
          />

          {enableZoom ? (
            <>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="absolute inset-0 h-full w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-accent"
              >
                <span className="sr-only">Enlarge: {image.alt}</span>
              </button>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-bg/80 px-2.5 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-fg-muted opacity-0 backdrop-blur-md transition-opacity duration-400 group-hover/shot:opacity-100 group-focus-within/shot:opacity-100"
              >
                <Maximize2 className="size-3" strokeWidth={1.75} />
                Enlarge
              </span>
            </>
          ) : null}
        </div>

        {image.caption || masked ? (
          <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            {image.caption ? (
              <span className="text-[0.8125rem] text-fg-subtle">{image.caption}</span>
            ) : null}
            {masked ? (
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-fg-faint">
                Regions masked for client privacy
              </span>
            ) : null}
          </figcaption>
        ) : null}
      </figure>

      {enableZoom ? (
        <Lightbox image={image} open={open} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}

/**
 * The project's primary marketing visual. Rendered without zoom: a poster is a
 * cover, not a detail view, and keeping it un-zoomable also means the micro-type
 * inside its embedded mockups is never rendered at a legible size.
 */
export function Poster({
  image,
  priority = false,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  className,
  showNote = true,
}: {
  image: ProjectImage;
  priority?: boolean;
  sizes?: string;
  className?: string;
  showNote?: boolean;
}) {
  return (
    <Screenshot
      image={image}
      priority={priority}
      sizes={sizes}
      className={className}
      enableZoom={false}
      quality={88}
      showNote={showNote}
    />
  );
}
