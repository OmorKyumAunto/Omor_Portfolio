import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { portfolio } from "@/data/portfolio";
import { absoluteUrl } from "@/lib/utils";
import { JsonLd } from "@/components/layout/json-ld";
import { breadcrumbSchema, projectSchema } from "@/lib/schema";
import { CaseStudy } from "./case-study";

type Params = { slug: string };

/**
 * The project set is fully known at build time. Without this, an unknown slug
 * is rendered on demand and `notFound()` returns the 404 *body* with a 200
 * status — a soft 404 that search engines will happily index.
 */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return portfolio.projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = portfolio.projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };

  const url = absoluteUrl(portfolio.seo.siteUrl, `/work/${project.slug}`);

  return {
    title: project.title,
    description: project.tagline,
    keywords: [...project.technologies, ...project.capabilities],
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      url,
      title: `${project.title} — ${portfolio.personal.name}`,
      description: project.summary,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${portfolio.personal.name}`,
      description: project.tagline,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const index = portfolio.projects.findIndex((p) => p.slug === slug);
  const project = portfolio.projects[index];

  if (!project) notFound();

  const next =
    portfolio.projects[(index + 1) % portfolio.projects.length] ?? portfolio.projects[0]!;

  return (
    <>
      <CaseStudy project={project} next={next} />
      <JsonLd data={projectSchema(project)} />
      <JsonLd data={breadcrumbSchema(project)} />
    </>
  );
}
