/**
 * Strongly typed shape of every piece of editable portfolio content.
 * Edit values in `src/data/portfolio.ts` -- never in UI components.
 */

export type NavItem = {
  label: string;
  /** In-page anchor id on the homepage, e.g. "about". */
  id: string;
  href: string;
};

export type SocialKey = "email" | "github" | "linkedin" | "upwork";

export type SocialLink = {
  key: SocialKey;
  label: string;
  /** Leave empty to hide this link everywhere. */
  url: string;
  /** Displayed handle. Falls back to the label when empty. */
  handle?: string;
};

export type PersonalInfo = {
  name: string;
  shortName: string;
  role: string;
  positioning: string;
  location: string;
  /** Leave empty ("") to hide every direct-email action across the site. */
  email: string;
  /** Path to the resume in /public. Leave empty to hide the download action. */
  resumeUrl: string;
  /** Portrait shown in the About section. Public path, never a local filesystem path. */
  photo: {
    src: string;
    alt: string;
    /** CSS object-position, tuned so the face stays framed at every crop. */
    objectPosition: string;
    width: number;
    height: number;
    /** Small mono caption rendered beside the portrait frame. */
    caption: string;
  };
  availability: {
    /** When false the availability indicator is not rendered. */
    enabled: boolean;
    label: string;
  };
};

export type AboutContent = {
  eyebrow: string;
  heading: string;
  /** Rendered as separate paragraphs, in order. */
  paragraphs: string[];
  /** Short editorial pull-quote shown beside the copy. */
  pullQuote: string;
  principles: { title: string; description: string }[];
};

export type Education = {
  degree: string;
  institution: string;
  field: string;
  note?: string;
};

export type ExpertiseArea = {
  index: string;
  title: string;
  summary: string;
  points: string[];
};

/**
 * A masked region over a screenshot, expressed in percentages of the rendered
 * image box so it stays correct at every size.
 *
 * Source files in /public are never modified -- masking happens at render time,
 * which keeps the originals intact and the reason for each mask auditable.
 */
export type RedactionRegion = {
  /** All values are percentages (0-100) of the image box. */
  x: number;
  y: number;
  w: number;
  h: number;
  /**
   * "frost" = heavy backdrop blur + tint (brand marks, business unit names).
   * "solid" = opaque panel (names, emails, phone numbers, tokens, serials) --
   * use this for anything a blur could plausibly be reversed on.
   */
  mode?: "frost" | "solid";
  /** Why this region is masked. Kept in the data for review before publishing. */
  reason: string;
};

/**
 * Percentage crop applied at render time. The image and its redaction layer are
 * scaled together inside a clipping window, so masks stay aligned to the pixels
 * they cover regardless of cropping.
 */
export type ImageCrop = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export type ProjectImage = {
  src: string;
  alt: string;
  caption?: string;
  /** Trim edges (percentages) to remove third-party logos or dead space. */
  crop?: ImageCrop;
  /** Render-time privacy masks. See RedactionRegion. */
  redactions?: RedactionRegion[];
  /**
   * Set when the screenshot should still be re-captured with demo data before
   * the site goes public. Surfaced in the README review list.
   */
  reviewNote?: string;
  /** Intrinsic pixel size, used to size the lightbox correctly. */
  width: number;
  height: number;
};

export type Project = {
  slug: string;
  index: string;
  title: string;
  /** Compact label for dense listings. Falls back to `title`. */
  shortTitle?: string;
  /** Domain label shown above the title, e.g. "Internal IT Operations". */
  category: string;
  /**
   * The project's primary marketing visual. Used as the homepage cover, the
   * case-study hero and the social preview. Posters are not zoomable — they are
   * covers, not detail screenshots.
   */
  poster: ProjectImage;
  /** Larger homepage presentation. Non-featured projects appear in the index. */
  featured: boolean;
  /** Ordering within the featured block. Lower comes first. */
  featuredOrder?: number;
  /** Set only when the project genuinely ships a non-English interface. */
  multilingual?: {
    languages: string[];
    /** Only true when the UI actually renders right-to-left. */
    rtl: boolean;
    note: string;
  };
  /** One-line positioning used in listings and metadata. */
  tagline: string;
  summary: string;
  /**
   * Only set this when the real year is known. Leave undefined and the UI shows
   * a neutral label instead of inventing a date.
   */
  year?: string;
  problem: string;
  approach: string;
  solution: string;
  role: string;
  challenge: string;
  outcome: string;
  capabilities: string[];
  features: { title: string; description: string }[];
  technologies: string[];
  /** Empty array -> generated fallback mockups are shown instead. */
  images: ProjectImage[];
  /** Empty string -> the action is not rendered at all. Never use "#". */
  liveUrl: string;
  repoUrl: string;
  /** Accent hue (degrees), used to tint the generated social preview image. */
  hue: number;
};

export type SkillGroup = {
  id: string;
  label: string;
  description: string;
  items: string[];
};

export type Service = {
  index: string;
  title: string;
  description: string;
  deliverables: string[];
};

export type ProcessStep = {
  index: string;
  title: string;
  description: string;
};

export type AiCapability = {
  title: string;
  description: string;
};

export type AiSection = {
  eyebrow: string;
  heading: string;
  lead: string;
  body: string;
  capabilities: AiCapability[];
  note: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  title: string;
  company?: string;
};

export type TrustItem = {
  label: string;
  description: string;
};

export type SeoConfig = {
  siteUrl: string;
  titleDefault: string;
  titleTemplate: string;
  description: string;
  keywords: string[];
  locale: string;
  twitterHandle?: string;
};

export type MultilingualSection = {
  eyebrow: string;
  heading: string;
  headingAccent: string;
  lead: string;
  points: { title: string; description: string }[];
  /** Slugs of the projects used as visual proof, in display order. */
  projectSlugs: string[];
};

export type ContactChannel = {
  key: SocialKey;
  label: string;
  value: string;
  href: string;
  description: string;
  primary?: boolean;
};

export type ContactConfigDirect = {
  eyebrow: string;
  heading: string;
  headingAccent: string;
  lead: string;
  responseNote: string;
};

export type AiFeature = {
  enabled: boolean;
  eyebrow: string;
  heading: string;
  headingAccent: string;
  lead: string;
  /** Shown under the assistant identity chip. */
  disclosure: string;
  inputLabel: string;
  placeholder: string;
  submitLabel: string;
  analyzingLabel: string;
  examples: { label: string; prompt: string }[];
};

export type PortfolioData = {
  personal: PersonalInfo;
  navigation: NavItem[];
  hero: {
    headline: { text: string; accent?: boolean }[];
    lead: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  trust: TrustItem[];
  about: AboutContent;
  education: Education[];
  expertise: ExpertiseArea[];
  projects: Project[];
  skills: SkillGroup[];
  ai: AiSection;
  services: Service[];
  process: ProcessStep[];
  /** Intentionally empty. The section hides itself until real quotes exist. */
  testimonials: Testimonial[];
  socials: SocialLink[];
  contact: ContactConfigDirect;
  multilingual: MultilingualSection;
  aiAssistant: AiFeature;
  seo: SeoConfig;
};
