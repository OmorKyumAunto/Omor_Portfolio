/**
 * Motion tokens.
 *
 * Before this existed the same expo-out curve and the same 0.75s / 22px reveal
 * were copy-pasted into twelve files, so every section on a 16,000px page
 * animated identically. These tokens exist to give motion a hierarchy: the hero
 * is expressive, work is immersive, capabilities are technical, body copy is
 * almost still.
 *
 * Scroll performance was never the problem here (the page holds 60fps at 4x CPU
 * throttle), so nothing in this file tries to smooth scrolling. It tunes *when*
 * and *how far* things move, which is what actually reads as sluggish.
 */

/** Cubic-bezier curves. `out` is the Signal house curve. */
export const ease = {
  /** Expo-out. Fast departure, long settle — the default for entrances. */
  out: [0.16, 1, 0.3, 1],
  /** Symmetric. For things that move and come back, like a sweep. */
  inOut: [0.65, 0, 0.35, 1],
  /** Slight overshoot. Only for small, deliberate confirmations. */
  snap: [0.34, 1.32, 0.64, 1],
} as const;

export const duration = {
  /** Hover, press, focus. Must feel instant. */
  micro: 0.18,
  /** Toggles, chips, state swaps. */
  ui: 0.32,
  /** Scroll entrances. Short enough to finish before it is read. */
  reveal: 0.55,
  /** Hero lines, poster reveals. Earn this one. */
  editorial: 0.85,
} as const;

export const spring = {
  /** Pointer parallax. Loose, so it trails the cursor without feeling heavy. */
  pointer: { stiffness: 90, damping: 20, mass: 0.6 },
  /** Magnetic buttons and layout pills. */
  snappy: { stiffness: 380, damping: 32 },
  /** Scroll-linked rails and progress. */
  rail: { stiffness: 120, damping: 30, restDelta: 0.001 },
} as const;

/**
 * Viewport triggers.
 *
 * The old value was `amount: 0.35`, which meant an element had to be a third
 * visible before it began moving — so it animated upward while the reader was
 * already scrolling down onto it, and read as lag. Firing at 0.12 lets content
 * settle *before* it reaches reading position.
 */
export const viewport = {
  standard: { once: true, amount: 0.12 },
  /** Tall blocks (posters, galleries) where 12% is still most of a screen. */
  early: { once: true, amount: 0.02 },
  /** Small inline items that should not pre-fire. */
  late: { once: true, amount: 0.4 },
} as const;

/** Travel distances. Short: motion should suggest arrival, not commute. */
export const travel = { xs: 6, sm: 10, md: 14, lg: 20 } as const;

/** Stagger steps. */
export const stagger = { tight: 0.04, normal: 0.06, loose: 0.09 } as const;
