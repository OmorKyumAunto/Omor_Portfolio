import type { MetadataRoute } from "next";
import { portfolio } from "@/data/portfolio";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${portfolio.seo.siteUrl}/sitemap.xml`,
    host: portfolio.seo.siteUrl,
  };
}
