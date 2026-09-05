"use client";

/**
 * Last-resort boundary. It replaces the root layout, so it ships its own
 * html/body and minimal inline styling — no design tokens are available here.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          background: "#07090c",
          color: "#f2f5f9",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: 640, padding: "0 24px" }}>
          <p
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#e0596a",
              margin: 0,
            }}
          >
            Application error
          </p>
          <h1 style={{ fontSize: 40, letterSpacing: "-0.035em", lineHeight: 1.05, margin: "22px 0 0" }}>
            The application failed to load.
          </h1>
          <p style={{ color: "#9fb0c4", fontSize: 16, lineHeight: 1.6, margin: "18px 0 0" }}>
            Please reload the page. If it keeps happening, the issue is on my side.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 32,
              height: 48,
              padding: "0 28px",
              borderRadius: 999,
              border: "none",
              background: "#f2f5f9",
              color: "#07090c",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
