import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * The single source of truth for CTA styling.
 *
 * Most call-to-actions on the site are `next/link` elements rather than
 * buttons, so `buttonVariants` is applied directly via `cn()` in those places.
 * The `Button` component is for genuine `<button>` elements.
 */
export const buttonVariants = cva(
  [
    "group/btn relative inline-flex items-center justify-center gap-2.5 whitespace-nowrap",
    "font-medium tracking-[-0.01em] select-none",
    "transition-[background-color,border-color,color,opacity,transform] duration-400",
    "[transition-timing-function:var(--ease-expo)]",
    // Press feedback: transform only, so it never reflows the row.
    "active:scale-[0.985] active:duration-75",
    "disabled:pointer-events-none disabled:opacity-65",
  ],
  {
    variants: {
      variant: {
        primary: "rounded-full bg-fg text-bg hover:bg-accent hover:text-accent-fg",
        outline:
          "rounded-full border border-line-strong text-fg hover:border-fg/35 hover:bg-surface-2/60",
        soft:
          "rounded-full border border-line-strong text-fg hover:border-accent/45 hover:bg-accent-soft",
        ghost: "rounded-full text-fg-muted hover:bg-surface-2/60 hover:text-fg",
        quiet:
          "text-fg-subtle underline decoration-line-strong decoration-1 underline-offset-[6px] hover:text-fg hover:decoration-accent",
      },
      size: {
        sm: "h-9 px-4 text-[0.8125rem]",
        md: "h-11 px-6 text-sm",
        lg: "h-13 pl-7 pr-6 text-[0.9375rem]",
        icon: "size-10 rounded-full p-0",
        none: "",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
