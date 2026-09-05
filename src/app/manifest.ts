import type { MetadataRoute } from "next";
import { portfolio } from "@/data/portfolio";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: portfolio.seo.titleDefault,
    short_name: portfolio.personal.shortName,
    description: portfolio.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#07090c",
    theme_color: "#07090c",
    icons: [
      { src: "/assets/logo-mark.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/assets/logo-badge.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
