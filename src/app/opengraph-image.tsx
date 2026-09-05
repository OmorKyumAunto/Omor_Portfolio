import { ImageResponse } from "next/og";
import { portfolio } from "@/data/portfolio";
import { loadGoogleFont } from "@/lib/og";
import { loadLogoDataUri } from "@/lib/og-logo";

export const runtime = "nodejs";
export const alt = `${portfolio.personal.name} — ${portfolio.personal.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const name = portfolio.personal.name.toUpperCase();
  const role = portfolio.personal.role;
  const stack = "React · Next.js · Node.js · AI Integration";
  const glyphs = `${name}${role}${stack}Selected Work`;

  const [display, mono, logo] = await Promise.all([
    loadGoogleFont("Inter Tight", 600, glyphs),
    loadGoogleFont("JetBrains Mono", 500, glyphs),
    loadLogoDataUri(),
  ]);

  const fonts = [
    ...(display ? [{ name: "Display", data: display, weight: 600 as const, style: "normal" as const }] : []),
    ...(mono ? [{ name: "Mono", data: mono, weight: 500 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07090c",
          backgroundImage:
            "radial-gradient(70% 55% at 82% 8%, rgba(56,132,255,0.20), transparent 62%), radial-gradient(55% 50% at 6% 96%, rgba(150,110,255,0.16), transparent 60%)",
          padding: 76,
          fontFamily: fonts.length ? "Display" : "sans-serif",
          position: "relative",
        }}
      >
        {/* Top rule + eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {logo ? (
            <img src={logo} width={40} height={40} alt="" style={{ display: "flex" }} />
          ) : (
            <div style={{ display: "flex", width: 10, height: 10, borderRadius: 999, background: "#3d8bff" }} />
          )}
          <div
            style={{
              fontFamily: fonts.length > 1 ? "Mono" : "monospace",
              fontSize: 20,
              letterSpacing: 4,
              color: "#7d8b9e",
              display: "flex",
            }}
          >
            PORTFOLIO
          </div>
          <div style={{ display: "flex", flex: 1, height: 1, background: "rgba(180,200,230,0.16)" }} />
          <div
            style={{
              fontFamily: fonts.length > 1 ? "Mono" : "monospace",
              fontSize: 20,
              letterSpacing: 4,
              color: "#7d8b9e",
              display: "flex",
            }}
          >
            2026
          </div>
        </div>

        {/* Name + role */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              lineHeight: 1,
              letterSpacing: -3.5,
              color: "#f2f5f9",
            }}
          >
            {name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 40,
              letterSpacing: -1,
              color: "#9fb0c4",
            }}
          >
            {role}
          </div>
        </div>

        {/* Stack line */}
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ display: "flex", height: 1, width: "100%", background: "rgba(180,200,230,0.16)" }} />
          <div
            style={{
              display: "flex",
              fontFamily: fonts.length > 1 ? "Mono" : "monospace",
              fontSize: 25,
              letterSpacing: 1.2,
              color: "#c3d0de",
            }}
          >
            {stack}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
