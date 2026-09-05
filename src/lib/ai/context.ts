import { portfolio } from "@/data/portfolio";

/**
 * The single grounding document for the AI assistant.
 *
 * Built entirely from src/data/portfolio.ts, so portfolio facts are never
 * duplicated by hand and the model can never drift from what the site actually
 * says. Server-only: this string is never sent to the browser.
 */
let cached: string | null = null;

export function buildPortfolioContext(): string {
  if (cached) return cached;

  const { personal, about, education, expertise, projects, skills, services, process, ai } =
    portfolio;

  const lines: string[] = [];
  const push = (value: string) => lines.push(value);

  push("## IDENTITY");
  push(`Name: ${personal.name}`);
  push(`Role: ${personal.role}`);
  push(`Positioning: ${personal.positioning}`);
  push(`Location: ${personal.location}`);
  push(
    `Availability: ${
      personal.availability.enabled ? personal.availability.label : "Not stated"
    }`,
  );

  push("\n## ABOUT");
  about.paragraphs.forEach(push);
  push(`Working principle quote: ${about.pullQuote}`);
  about.principles.forEach((p) => push(`- ${p.title}: ${p.description}`));

  push("\n## EDUCATION");
  education.forEach((e) => push(`- ${e.degree} in ${e.field}, ${e.institution}`));

  push("\n## CAPABILITY AREAS (these are areas of work, NOT employers or job titles)");
  expertise.forEach((area) => {
    push(`- ${area.title}: ${area.summary} (${area.points.join("; ")})`);
  });

  push("\n## TECHNOLOGY SKILLS (grouped)");
  skills.forEach((group) => {
    push(`- ${group.label}: ${group.items.join(", ")}. ${group.description}`);
  });

  push("\n## SELECTED PROJECTS");
  projects.forEach((project) => {
    push(`\n### ${project.title}`);
    push(`slug: ${project.slug}`);
    push(`category: ${project.category}`);
    push(`summary: ${project.summary}`);
    push(`problem: ${project.problem}`);
    push(`approach: ${project.approach}`);
    push(`solution: ${project.solution}`);
    push(`role: ${project.role}`);
    push(`challenge: ${project.challenge}`);
    push(`outcome: ${project.outcome}`);
    push(`capabilities: ${project.capabilities.join(", ")}`);
    push(`technologies: ${project.technologies.join(", ")}`);
    push(
      `features: ${project.features.map((f) => `${f.title} (${f.description})`).join("; ")}`,
    );
    if (project.multilingual) {
      push(
        `multilingual: ships in ${project.multilingual.languages.join(", ")}${
          project.multilingual.rtl ? " with a right-to-left layout" : ""
        }. ${project.multilingual.note}`,
      );
    }
    push(`featured: ${project.featured ? "yes" : "no"}`);
  });

  push("\n## SERVICES OFFERED");
  services.forEach((service) => {
    push(`- ${service.title}: ${service.description} (${service.deliverables.join(", ")})`);
  });

  push("\n## AI INTEGRATION EXPERIENCE");
  push(ai.lead);
  push(ai.body);
  ai.capabilities.forEach((c) => push(`- ${c.title}: ${c.description}`));
  push(`Stance: ${ai.note}`);

  push("\n## WORKING PROCESS");
  process.forEach((step) => push(`${step.index} ${step.title}: ${step.description}`));

  push("\n## EXPLICITLY NOT DOCUMENTED");
  push(
    [
      "Years of professional experience, employer names, client names, team sizes,",
      "pricing, rates, hourly costs, project timelines, delivery dates, project start",
      "or end years, certifications, awards, testimonials, user counts, revenue figures,",
      "performance percentages, and any quantitative business metrics.",
      "None of these appear in this portfolio. Never state or estimate them.",
    ].join(" "),
  );

  cached = lines.join("\n");
  return cached;
}

/** Slugs the model is allowed to reference, used in the prompt and validation. */
export function allowedProjectSlugs(): string[] {
  return portfolio.projects.map((p) => p.slug);
}
