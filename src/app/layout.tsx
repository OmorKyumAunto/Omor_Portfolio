import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { portfolio } from "@/data/portfolio";
import { fontVariables } from "@/lib/fonts";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { JsonLd } from "@/components/layout/json-ld";
import { personSchema, webSiteSchema } from "@/lib/schema";
import { resumeAvailable } from "@/lib/assets.server";
import { isAiEnabled } from "@/lib/ai/provider";
import "./globals.css";

const { seo, personal } = portfolio;

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: {
    default: seo.titleDefault,
    template: seo.titleTemplate,
  },
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: personal.name, url: seo.siteUrl }],
  creator: personal.name,
  applicationName: seo.titleDefault,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: seo.siteUrl,
    siteName: personal.name,
    title: seo.titleDefault,
    description: seo.description,
    locale: seo.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.titleDefault,
    description: seo.description,
    ...(seo.twitterHandle ? { creator: seo.twitterHandle } : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  manifest: "/manifest.webmanifest",
  // Icons come from the app-directory file conventions: `icon.svg` and
  // `apple-icon.tsx`. Next injects the link tags automatically.
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07090c" },
    { media: "(prefers-color-scheme: light)", color: "#f7f5f1" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <body className="grain min-h-svh antialiased">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[100] focus:rounded-full focus:bg-fg focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-bg"
          >
            Skip to content
          </a>

          <ScrollProgress />
          <Header aiEnabled={isAiEnabled()} />
          <main id="main">{children}</main>
          <Footer resumeAvailable={resumeAvailable()} aiEnabled={isAiEnabled()} />
        </ThemeProvider>

        <JsonLd data={personSchema()} />
        <JsonLd data={webSiteSchema()} />
        {/* Only mounted on Vercel. Elsewhere the script 404s and logs console
            errors, so analytics stays genuinely optional. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
