import type { RedactionRegion } from "@/types/portfolio";
import { cn } from "@/lib/utils";

/**
 * Render-time privacy masking.
 *
 * Masks are a fixed light neutral in both themes: they sit on top of light
 * application UI, so they blend with the screenshot rather than with the site.
 *
 * Source screenshots in /public are never modified. Each mask is positioned in
 * percentages of the image box, so it stays aligned at every size — thumbnail,
 * case-study gallery and full-size lightbox alike.
 *
 * `solid` is used for anything a blur could plausibly be reversed on (names,
 * emails, phone numbers, serials, link tokens); `frost` is used for brand marks
 * and business-unit names where a heavy backdrop blur is enough.
 */
export function RedactionLayer({
  regions,
  className,
}: {
  regions?: RedactionRegion[];
  className?: string;
}) {
  if (!regions || regions.length === 0) return null;

  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      {regions.map((region, i) => {
        const solid = region.mode !== "frost";
        return (
          <span
            key={i}
            className={cn(
              "absolute rounded-[2px]",
              solid
                ? // Fully opaque. No backdrop dependency, so it can never fail
                  // open and reveal what it covers.
                  "bg-[hsl(220_16%_93%)]"
                : // Heavy frost. The tint alone still obscures if a browser
                  // does not support backdrop-filter.
                  "bg-[hsl(220_16%_94%)]/70 backdrop-blur-xl",
            )}
            style={{
              left: `${region.x}%`,
              top: `${region.y}%`,
              width: `${region.w}%`,
              height: `${region.h}%`,
            }}
          />
        );
      })}
    </div>
  );
}

/** True when an image carries any mask, used to render the disclosure note. */
export function hasRedactions(regions?: RedactionRegion[]): boolean {
  return Boolean(regions && regions.length > 0);
}
