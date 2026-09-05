import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Tag({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "accent";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[0.6875rem] leading-none tracking-[0.04em] whitespace-nowrap",
        tone === "accent"
          ? "border-accent/30 bg-accent-soft text-accent"
          : "border-line-strong bg-surface-2/40 text-fg-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
