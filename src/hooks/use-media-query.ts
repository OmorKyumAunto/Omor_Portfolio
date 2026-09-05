"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Hydration-safe media query hook.
 *
 * The server snapshot is always `false`, and React uses it for the initial
 * client render too, so server and client markup are identical. The real value
 * arrives on the render immediately after hydration.
 *
 * This matters most for `prefers-reduced-motion`: reading it during the first
 * render would make every animated component's initial style differ from the
 * server HTML and blow up hydration.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True on pointer-precise, reasonably wide viewports. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px) and (pointer: fine)");
}

/**
 * Prefer this over motion's own `useReducedMotion`, which reads the media query
 * during the first client render and therefore causes hydration mismatches.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
