/**
 * Deliberately minimal. No fake loading screen — just a quiet progress hairline
 * while a route segment streams in.
 */
export default function Loading() {
  return (
    <div className="fixed inset-x-0 top-0 z-[65] h-px overflow-hidden" aria-hidden="true">
      <div className="h-full w-1/3 bg-linear-to-r from-transparent via-accent to-transparent [animation:rule-sweep_1.1s_var(--ease-inout)_infinite]" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
