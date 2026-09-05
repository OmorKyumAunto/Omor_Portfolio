import type { Project } from "@/types/portfolio";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/**
 * Per-project stack diagram.
 *
 * This is a *restatement* of `project.technologies`, not an architecture claim.
 * Each declared technology is placed in the layer it belongs to and nothing is
 * added — if a project declares no database, no data layer is drawn. That rule
 * is what keeps the diagram truthful across nine very different systems: it can
 * only ever show what the data already says.
 *
 * Rendered as plain HTML and SVG. No chart library, no canvas.
 */

type LayerId = "interface" | "api" | "data" | "ai" | "platform";

const LAYERS: { id: LayerId; label: string; note: string }[] = [
  { id: "interface", label: "Interface", note: "What people use" },
  { id: "api", label: "Application", note: "Rules and endpoints" },
  { id: "data", label: "Data", note: "Where state lives" },
  { id: "ai", label: "Intelligence", note: "Model-assisted steps" },
  { id: "platform", label: "Platform", note: "Runtime and delivery" },
];

/**
 * Keyword routing. Ordered: the first pattern that matches wins, so
 * "AI Integration" reaches the AI rule before the generic integration rule.
 */
const ROUTES: [RegExp, LayerId][] = [
  [/\bai\b|llm|gemini|openai|model/i, "ai"],
  [/react|next\.?js|tailwind|typescript|javascript|html|css|rtl|ui\b|frontend/i, "interface"],
  [/postgres|mysql|sql|supabase|database|prisma|mongo/i, "data"],
  [/node|express|rest|api|auth|rbac|webhook|real-?time|socket|backend/i, "api"],
  [/docker|pm2|linux|cloudflare|vercel|deploy|ci\/?cd|git\b|nginx/i, "platform"],
];

function layerFor(tech: string): LayerId {
  for (const [pattern, layer] of ROUTES) {
    if (pattern.test(tech)) return layer;
  }
  // Anything unrecognised sits with the application layer rather than being
  // dropped: the diagram must account for every declared technology.
  return "api";
}

export function StackDiagram({ project, className }: { project: Project; className?: string }) {
  const grouped = LAYERS.map((layer) => ({
    ...layer,
    items: project.technologies.filter((tech) => layerFor(tech) === layer.id),
  })).filter((layer) => layer.items.length > 0);

  if (grouped.length < 2) return null;

  return (
    <div className={cn("relative", className)}>
      <Reveal variant="fade" duration={0.5}>
        <div className="flex items-center gap-4 pb-8">
          <span className="text-meta text-accent">System layers</span>
          <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
          <span className="text-meta tabular-nums text-fg-faint">
            {String(grouped.length).padStart(2, "0")}
          </span>
        </div>
      </Reveal>

      <Reveal y={16}>
        <ol className="relative">
          {grouped.map((layer, i) => (
            <li
              key={layer.id}
              className="group/layer relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 border-t border-line py-6 last:border-b sm:grid-cols-[2.5rem_11rem_minmax(0,1fr)] sm:gap-x-8"
            >
              {/* Connector: a node on a spine that runs the height of the stack,
                  which is what makes it read as one system rather than a list. */}
              <span aria-hidden="true" className="relative">
                {/* The spine is drawn per row and chains across the gaps: each
                    segment reaches into its own py-6 padding on both sides, so
                    consecutive rows meet. The first starts at its node and the
                    last stops at its node (node centre sits 0.625rem down). */}
                <span
                  className={cn(
                    "absolute left-[0.3125rem] w-px bg-line-strong",
                    i === 0
                      ? "top-[0.625rem] -bottom-6"
                      : i === grouped.length - 1
                        ? "-top-6 h-[calc(1.5rem+0.625rem)]"
                        : "-top-6 -bottom-6",
                  )}
                />
                <span className="absolute top-[0.3125rem] left-0 size-2.5 rounded-full border border-accent/60 bg-bg" />
                <span className="absolute top-[0.5625rem] left-[0.1875rem] size-1 rounded-full bg-accent" />
              </span>

              <div className="min-w-0">
                <h3 className="text-[0.9375rem] font-medium tracking-[-0.015em] text-fg">
                  {layer.label}
                </h3>
                <p className="text-meta mt-1 text-fg-faint">{layer.note}</p>
              </div>

              <ul className="col-span-2 mt-4 flex flex-wrap gap-x-2 gap-y-2 sm:col-span-1 sm:mt-0">
                {layer.items.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-line bg-surface/40 px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.04em] text-fg-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Reveal>

      <p className="text-meta mt-5 text-fg-faint">
        Layers derived from the technologies declared for this project.
      </p>
    </div>
  );
}
