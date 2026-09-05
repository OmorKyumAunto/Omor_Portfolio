import { ImageResponse } from "next/og";
import { portfolio } from "@/data/portfolio";
import { loadGoogleFont } from "@/lib/og";
import { loadLogoDataUri } from "@/lib/og-logo";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = { slug: string };

export async function generateImageMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = portfolio.projects.find((p) => p.slug === slug);
  return [
    {
      id: "og",
      size,
      contentType,
      alt: project ? `${project.title} — ${portfolio.personal.name}` : portfolio.personal.name,
    },
  ];
}

export default async function ProjectOgImage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = portfolio.projects.find((p) => p.slug === slug) ?? portfolio.projects[0]!;

  const glyphs = `${project.title}${project.tagline}${project.technologies.join(" · ")}${project.index}${portfolio.personal.name}`;

  const [display, mono, logo] = await Promise.all([
    loadGoogleFont("Inter Tight", 600, glyphs),
    loadGoogleFont("JetBrains Mono", 500, glyphs),
    loadLogoDataUri(),
  ]);

  const fonts = [
    ...(display ? [{ name: "Display", data: display, weight: 600 as const, style: "normal" as const }] : []),
    ...(mono ? [{ name: "Mono", data: mono, weight: 500 as const, style: "normal" as const }] : []),
  ];

  const monoFamily = fonts.length > 1 ? "Mono" : "monospace";

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
          backgroundImage: `radial-gradient(70% 55% at 84% 10%, hsla(${project.hue}, 90%, 58%, 0.22), transparent 62%), radial-gradient(50% 45% at 4% 96%, hsla(${project.hue + 40}, 85%, 62%, 0.14), transparent 60%)`,
          padding: 76,
          fontFamily: fonts.length ? "Display" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", fontFamily: monoFamily, fontSize: 20, letterSpacing: 4, color: `hsl(${project.hue}, 90%, 68%)` }}>
            {project.index}
          </div>
          <div style={{ display: "flex", width: 44, height: 1, background: "rgba(180,200,230,0.24)" }} />
          <div style={{ display: "flex", fontFamily: monoFamily, fontSize: 20, letterSpacing: 4, color: "#7d8b9e" }}>
            {project.category.toUpperCase()}
          </div>
          <div style={{ display: "flex", flex: 1, height: 1, background: "rgba(180,200,230,0.14)" }} />
          <div style={{ display: "flex", fontFamily: monoFamily, fontSize: 20, letterSpacing: 4, color: "#7d8b9e" }}>
            {project.year ?? "Selected Work"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 74, lineHeight: 1.04, letterSpacing: -2.6, color: "#f2f5f9", maxWidth: 940 }}>
            {project.title}
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 30, letterSpacing: -0.6, color: "#9fb0c4", maxWidth: 880 }}>
            {project.tagline}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", height: 1, width: "100%", background: "rgba(180,200,230,0.14)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 40 }}>
            <div
              style={{
                display: "flex",
                fontFamily: monoFamily,
                fontSize: 19,
                letterSpacing: 0.6,
                color: "#c3d0de",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {project.technologies.join("  ·  ")}
            </div>
            <div style={{ display: "flex", flexShrink: 0, alignItems: "center", gap: 14 }}>
              {logo ? (
                <img src={logo} width={34} height={34} alt="" style={{ display: "flex" }} />
              ) : null}
              <div
                style={{
                  display: "flex",
                  fontSize: 23,
                  letterSpacing: -0.4,
                  color: "#7d8b9e",
                  whiteSpace: "nowrap",
                }}
              >
                {portfolio.personal.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
