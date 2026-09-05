/**
 * Font loading for OG image generation.
 *
 * Satori needs raw font data. We fetch it from Google Fonts at build time and
 * fall back to the default face if the network is unavailable, so a build never
 * fails because of an OG image.
 */
export async function loadGoogleFont(
  family: string,
  weight: number,
  text: string,
): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      family,
    )}:wght@${weight}&text=${encodeURIComponent(text)}`;

    const css = await fetch(cssUrl, {
      headers: {
        // Ask for the TTF/OTF variant Satori can parse.
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    }).then((r) => (r.ok ? r.text() : ""));

    const match = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype)'\)/);
    if (!match?.[1]) return null;

    const response = await fetch(match[1]);
    if (!response.ok) return null;
    return await response.arrayBuffer();
  } catch {
    return null;
  }
}
