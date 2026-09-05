"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-media-query";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/** Never emits -- the store value is constant per environment. */
const subscribeNever = () => () => {};

const MODES = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "system", label: "System", Icon: Monitor },
  { value: "dark", label: "Dark", Icon: Moon },
] as const;

/**
 * Three-state segmented toggle. Renders a neutral skeleton until mounted so the
 * server and client markup match exactly.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const reduced = useReducedMotion();
  // Hydration flag without an effect: false on the server and on the first
  // client render, true afterwards, so the markup always matches.
  const mounted = useSyncExternalStore(subscribeNever, () => true, () => false);

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={cn(
        "relative flex items-center gap-0.5 rounded-full border border-line-strong bg-surface/60 p-0.5 backdrop-blur-sm",
        className,
      )}
    >
      {MODES.map(({ value, label, Icon }) => {
        const selected = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${label} theme`}
            onClick={() => setTheme(value)}
            className="relative grid size-7 place-items-center rounded-full text-fg-subtle transition-colors duration-300 hover:text-fg"
          >
            {selected ? (
              <motion.span
                layoutId="theme-pill"
                aria-hidden="true"
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 420, damping: 34 }
                }
                className="absolute inset-0 rounded-full bg-surface-3"
              />
            ) : null}
            <Icon
              aria-hidden="true"
              className={cn(
                "relative size-3.5 transition-colors duration-300",
                selected && "text-fg",
              )}
              strokeWidth={1.75}
            />
          </button>
        );
      })}
    </div>
  );
}
