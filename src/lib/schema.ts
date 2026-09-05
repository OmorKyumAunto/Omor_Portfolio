import { portfolio } from "@/data/portfolio";
import { activeSocials } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";
import type { Project } from "@/types/portfolio";

const { seo, personal, skills } = portfolio;

/** JSON-LD Person schema. Only includes fields that are actually configured. */
export function personSchema() {
  const sameAs = activeSocials
    .filter((s) => s.key !== "email")
    .map((s) => s.url);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${seo.siteUrl}/#person`,
    name: personal.name,
    url: seo.siteUrl,
    jobTitle: personal.role,
    description: seo.description,
    knowsAbout: skills.flatMap((group) => group.items),
    alumniOf: portfolio.education.map((entry) => ({
      "@type": "CollegeOrUniversity",
      name: entry.institution,
    })),
    ...(personal.email ? { email: personal.email } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${seo.siteUrl}/#website`,
    url: seo.siteUrl,
    name: seo.titleDefault,
    description: seo.description,
    inLanguage: "en",
    publisher: { "@id": `${seo.siteUrl}/#person` },
  };
}

export function projectSchema(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: absoluteUrl(seo.siteUrl, `/work/${project.slug}`),
    author: { "@id": `${seo.siteUrl}/#person` },
    keywords: [...project.technologies, ...project.capabilities].join(", "),
    ...(project.liveUrl ? { sameAs: [project.liveUrl] } : {}),
  };
}

export function breadcrumbSchema(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: seo.siteUrl },
      { "@type": "ListItem", position: 2, name: "Work", item: `${seo.siteUrl}/#work` },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: absoluteUrl(seo.siteUrl, `/work/${project.slug}`),
      },
    ],
  };
}
