"use client";

import { useEffect } from "react";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-svh items-center overflow-hidden pt-28 pb-20">
      <div
        aria-hidden="true"
        className="tech-grid pointer-events-none absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(80%_60%_at_50%_40%,black,transparent)]"
      />
      <div className="container-page">
        <p className="text-meta text-danger">Unexpected error</p>
        <h1 className="text-display mt-6 max-w-3xl text-[clamp(2rem,1.2rem+3.4vw,3.75rem)] text-fg">
          Something broke on the way to this page.
        </h1>
        <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-fg-muted">
          The error has been logged. Reloading usually clears it.
        </p>
        {error.digest ? (
          <p className="mt-4 font-mono text-[0.6875rem] tracking-[0.08em] text-fg-faint">
            Reference: {error.digest}
          </p>
        ) : null}

        <Button type="button" onClick={reset} size="lg" className="group/rt mt-10">
          Try again
          <RotateCw
            aria-hidden="true"
            className="size-4 transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover/rt:rotate-90"
            strokeWidth={2}
          />
        </Button>
      </div>
    </div>
  );
}
