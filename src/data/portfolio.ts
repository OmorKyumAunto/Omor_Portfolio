import type { PortfolioData } from "@/types/portfolio";

/**
 * ---------------------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH FOR ALL PORTFOLIO CONTENT
 * ---------------------------------------------------------------------------
 * Everything a visitor reads lives here. You should never need to open a UI
 * component to change ordinary content.
 *
 * Rules the UI enforces for you:
 *  - Empty `liveUrl` / `repoUrl` -> the button is not rendered (no dead "#").
 *  - Empty `personal.email`      -> every direct-email action disappears.
 *  - Empty `personal.resumeUrl`  -> the resume action disappears.
 *  - Empty `socials[].url`       -> that social link disappears.
 *  - Empty `images` on a project -> a designed fallback mockup is rendered.
 *  - Empty `testimonials`        -> the whole testimonials section disappears.
 * ---------------------------------------------------------------------------
 */

/**
 * Canonical origin. No domain is hardcoded: set NEXT_PUBLIC_SITE_URL once you
 * have one. On Vercel the project's production URL is used automatically, and
 * locally it falls back to localhost — so canonical URLs, the sitemap and
 * robots.txt never point at a domain that isn't yours.
 */
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : "") ||
  "http://localhost:3000"
).replace(/\/$/, "");

export const portfolio: PortfolioData = {
  /* ---------------------------------------------------------------- personal */
  personal: {
    name: "Omor Kyum Aunto",
    shortName: "Omor",
    role: "Full-Stack Engineer",
    positioning: "Full-Stack Engineer · React · Next.js · Node.js · AI Integration",
    location: "Dhaka, Bangladesh · Working remotely",
    email: "Omorkyumaunto16@gmail.com",
    // Drop resume.pdf into /public to enable the download action. The build
    // checks the file exists, so nothing links to a 404 until you add it.
    resumeUrl: "/resume.pdf",
    photo: {
      src: "/assets/my-image.webp",
      alt: "Omor Kyum Aunto — Full-Stack Engineer",
      // Face sits in the upper third of the frame; keep it visible when cropped.
      objectPosition: "50% 26%",
      width: 1587,
      height: 2245,
      caption: "Dhaka, Bangladesh",
    },
    availability: {
      enabled: true,
      label: "Available for selected freelance projects",
    },
  },

  /* -------------------------------------------------------------- navigation */
  navigation: [
    { label: "Home", id: "top", href: "/#top" },
    { label: "About", id: "about", href: "/#about" },
    { label: "Work", id: "work", href: "/#work" },
    { label: "AI Fit", id: "project-fit", href: "/#project-fit" },
    { label: "Capabilities", id: "capabilities", href: "/#capabilities" },
    { label: "Services", id: "services", href: "/#services" },
    { label: "Contact", id: "contact", href: "/#contact" },
  ],

  /* -------------------------------------------------------------------- hero */
  hero: {
    headline: [
      { text: "I build software that moves" },
      { text: "businesses", accent: true },
      { text: "forward." },
    ],
    lead: "Full-Stack Engineer building scalable web applications, intelligent business systems and AI-powered workflows.",
    primaryCta: { label: "View My Work", href: "#work" },
    secondaryCta: { label: "Let's Talk", href: "#contact" },
  },

  /* ------------------------------------------------------------------- trust */
  trust: [
    { label: "Full-Stack Development", description: "React and Node.js, one owner end to end." },
    { label: "Business Systems", description: "Workflows, roles, approvals, reporting." },
    { label: "API Architecture", description: "REST design, integrations, webhooks." },
    { label: "AI Integration", description: "LLM features inside real processes." },
    { label: "Production Deployment", description: "Shipped, monitored, kept fast." },
  ],

  /* ------------------------------------------------------------------- about */
  about: {
    eyebrow: "About",
    heading: "Business requirements, translated into software that holds up.",
    paragraphs: [
      "I'm a Computer Science & Engineering graduate from Daffodil International University and a full-stack developer focused on turning real business requirements into reliable software.",
      "Most of what I build is operational: helpdesk and asset systems, recruitment and approval workflows, complaint lifecycles, dashboards that people actually depend on during a working day. The interesting part is rarely the framework. It's the roles, the edge cases, the approval chain nobody documented, and the reporting someone needs on Monday morning.",
      "I work across the whole stack, which means I can take a requirement from data model to interface without handing it off. I'm equally comfortable extending an existing codebase — adding a feature, integrating an API, fixing what's slow — as I am starting from an empty repository.",
    ],
    pullQuote: "The goal is software someone can still maintain, extend and trust twelve months from now.",
    principles: [
      {
        title: "Own the full stack",
        description:
          "Frontend, backend, data model and deployment handled by one person, so nothing gets lost between layers.",
      },
      {
        title: "Start from the process",
        description:
          "Understand the operational problem and the people using it before choosing an implementation.",
      },
      {
        title: "Build for the next developer",
        description:
          "Readable structure, predictable patterns and typed boundaries over clever one-off solutions.",
      },
      {
        title: "Extend, don't rewrite",
        description:
          "Most valuable work happens inside systems that already exist and cannot be paused.",
      },
    ],
  },

  /* --------------------------------------------------------------- education */
  education: [
    {
      degree: "Bachelor of Science",
      field: "Computer Science & Engineering",
      institution: "Daffodil International University",
    },
  ],

  /* --------------------------------------------------------------- expertise */
  expertise: [
    {
      index: "01",
      title: "Enterprise Application Development",
      summary:
        "Multi-user business applications with role-based interfaces, structured data models and reporting built in from the start.",
      points: ["Role-based interfaces", "Structured data modelling", "Reporting and exports"],
    },
    {
      index: "02",
      title: "Helpdesk & Asset Management Systems",
      summary:
        "Ticketing, assignment, lifecycle states and asset tracking connected to the teams and inventory behind them.",
      points: ["Ticket lifecycle", "Asset registry and assignment", "Operational dashboards"],
    },
    {
      index: "03",
      title: "HR & Recruitment Automation",
      summary:
        "Requisition approvals, candidate pipelines and organisational hierarchies expressed as software instead of spreadsheets.",
      points: ["Requisition and approval chains", "Candidate pipelines", "Org-aware permissions"],
    },
    {
      index: "04",
      title: "Workflow & Complaint Management",
      summary:
        "Multi-role lifecycles with SLA timers, escalation paths, notifications and an audit trail that survives review.",
      points: ["SLA and escalation rules", "Notifications", "Audit trails"],
    },
    {
      index: "05",
      title: "AI & API Integration",
      summary:
        "LLM APIs and third-party services wired into existing workflows with validation, fallbacks and human review.",
      points: ["LLM API integration", "Third-party services", "Human-in-the-loop review"],
    },
    {
      index: "06",
      title: "Deployment & Performance Optimization",
      summary:
        "Getting applications onto servers safely, then measuring and removing whatever makes them slow.",
      points: ["Linux, Docker, PM2", "Query and payload optimisation", "Frontend performance"],
    },
  ],

  /* ----------------------------------------------------------------- projects
   * Screenshots and posters are real, unmodified files under /public/projects.
   * Privacy masking and cropping are applied at RENDER time (see
   * RedactionRegion / ImageCrop in src/types/portfolio.ts) so source files are
   * never altered and every mask records why it exists.
   * --------------------------------------------------------------------- */
  projects: [
    /* ---------------------------------------------------------------- 01 */
    {
      slug: "it-asset-helpdesk-platform",
      index: "01",
      title: "IT Asset & Helpdesk Platform",
      shortTitle: "IT Asset Platform",
      category: "Internal IT Operations",
      featured: true,
      featuredOrder: 1,
      tagline: "Centralised asset lifecycle, support workflows and AI-assisted responses.",
      summary:
        "A centralised platform to manage IT assets from procurement through disbursement, support, repair and disposal — with dashboards, role-based access, reporting and AI-assisted support.",
      problem:
        "IT support requests and hardware records were handled separately. There was no single place to answer routine operational questions: what is open, who holds a device, how long a request has waited, and which asset it concerns.",
      approach:
        "I modelled the asset registry and the support lifecycle as one connected domain rather than two products glued together. Roles, states and transitions were defined first, then every interface was built on that model so each screen reads from the same source of truth.",
      solution:
        "One platform covering stock, disbursement, support loans, repairs and disposal, with expiry and overdue alerts, multi-unit asset management, spreadsheet export and an AI-assisted layer that drafts support responses for an agent to review.",
      role:
        "Full-stack. Data model, REST API design, role-based access control, React interface, dashboards and reporting, AI integration and deployment.",
      challenge:
        "Role-based access had to be genuinely granular — the same record looks different to a requester, an agent and a manager — without turning every query into a special case. Solved with a permission layer applied at the data-access boundary rather than scattered through the UI.",
      outcome:
        "Centralised IT support and asset records in one interface with a clear owner and state for every item, and improved operational visibility through dashboards, expiry alerts and exportable reporting.",
      capabilities: [
        "Asset Lifecycle Management",
        "Disbursement Tracking",
        "Support & Repair Management",
        "Expiry & Overdue Alerts",
        "Dashboards & Reporting",
        "Role-Based Access",
        "Multi-Unit Management",
        "AI-Assisted Responses",
      ],
      features: [
        { title: "Centralised inventory", description: "Every device tracked from procurement through stock, use, repair and disposal." },
        { title: "Disbursement tracking", description: "Who holds what, since when, and when it is due back." },
        { title: "Support & repair", description: "Loan periods, return dates and repair states with overdue escalation." },
        { title: "Expiry & overdue alerts", description: "Automated notice before a support period lapses, not after." },
        { title: "Operational dashboards", description: "Stock versus disbursement, category distribution and current load at a glance." },
        { title: "Export & reporting", description: "Filterable reports with spreadsheet export for recurring management questions." },
      ],
      technologies: ["React", "TypeScript", "Node.js", "REST APIs", "SQL", "AI Integration"],
      poster: {
        src: "/projects/helpdesk/helpdesk_poster.webp",
        alt: "IT Asset Management System — product overview showing the dashboard, assets-on-support view and stock list",
        width: 1536,
        height: 1024,
        redactions: [
          { x: 32, y: 67.5, w: 4.5, h: 16, mode: "solid", reason: "Hardware serial numbers in the embedded screenshot" },
          { x: 36, y: 67.5, w: 7.5, h: 16, mode: "solid", reason: "Employee names and client company names" },
          { x: 71.5, y: 63.5, w: 5.5, h: 20, mode: "solid", reason: "Hardware serial numbers" },
          { x: 84, y: 63.5, w: 9, h: 20, mode: "solid", reason: "Internal business unit names" },
        ],
      },
      images: [
        {
          src: "/projects/helpdesk/helpdesk-dashboard.webp",
          alt: "Asset platform dashboard with total asset, employee and disbursement counters above a stock-versus-disbursement chart and category breakdown",
          caption: "Operational dashboard",
          width: 2560,
          height: 1370,
          redactions: [
            { x: 2, y: 3, w: 10, h: 10, mode: "frost", reason: "Employer logo" },
            { x: 83.5, y: 87.5, w: 17, h: 13, mode: "frost", reason: "Employer name in the AI assistant badge" },
          ],
        },
        {
          src: "/projects/helpdesk/stock.webp",
          alt: "Asset stock register listing devices with model, status and buying unit, filtered by category",
          caption: "Asset stock register",
          width: 2560,
          height: 1370,
          redactions: [
            { x: 2, y: 3, w: 10, h: 10, mode: "frost", reason: "Employer logo" },
            { x: 30.5, y: 33.5, w: 12.5, h: 66.5, mode: "solid", reason: "Hardware serial numbers" },
            { x: 67.3, y: 33.5, w: 18, h: 66.5, mode: "solid", reason: "Internal business unit names" },
            { x: 83.5, y: 87.5, w: 17, h: 13, mode: "frost", reason: "Employer name in the AI assistant badge" },
          ],
        },
        {
          src: "/projects/helpdesk/support.webp",
          alt: "Assets on support view with issued, expiring and overdue counters above a table of loaned devices and return dates",
          caption: "Support loans and return tracking",
          width: 2560,
          height: 1370,
          redactions: [
            { x: 2, y: 3, w: 10, h: 10, mode: "frost", reason: "Employer logo" },
            { x: 29.5, y: 54.5, w: 8, h: 45.5, mode: "solid", reason: "Hardware serial numbers" },
            { x: 41.8, y: 54.5, w: 11.5, h: 45.5, mode: "solid", reason: "Employee names, employee IDs and client company names" },
            { x: 83.5, y: 87.5, w: 17, h: 13, mode: "frost", reason: "Employer name in the AI assistant badge" },
          ],
        },
      ],
      liveUrl: "",
      repoUrl: "",
      hue: 214,
    },

    /* ---------------------------------------------------------------- 02 */
    {
      slug: "ai-recruitment-hr-platform",
      index: "02",
      title: "AI Recruitment & HR Platform",
      shortTitle: "HRM Recruitment Suite",
      category: "HR Operations",
      featured: true,
      featuredOrder: 2,
      tagline: "Requisition to onboarding as one governed, auditable workflow.",
      summary:
        "An end-to-end recruitment suite covering requisition approvals, organogram-aware workforce planning, a staged candidate pipeline, AI CV screening, and onboarding with document verification.",
      problem:
        "Hiring began as an informal request and moved through several approvers before anything could happen. Requisitions stalled without anyone noticing, candidate information was scattered across inboxes and drives, and there was no reliable record of who approved what.",
      approach:
        "I treated the organisational structure as the backbone of the system. Approval routing is derived from that hierarchy rather than hard-coded, so a requisition finds its approvers automatically and the audit trail is a by-product of the workflow rather than an extra feature.",
      solution:
        "A platform where a requisition moves through requisition, approvals, role profile, job posting, candidates, assessment and onboarding as explicit stages. Candidates apply through a shared collection link, AI screening ranks incoming CVs for a recruiter to review, and onboarding runs document collection and verification before completion.",
      role:
        "Full-stack. Workflow and approval engine, PostgreSQL schema design, REST API, React interface, LLM integration and reporting.",
      challenge:
        "Approval chains vary by department and seniority, and they change. Encoding them as data resolved from the org structure at runtime kept the logic in one place instead of spreading conditionals across the codebase.",
      outcome:
        "Requisitions now move along a visible, auditable approval path, and candidate progress is tracked in structured stages instead of email threads and attachments. AI screening handles the first pass over incoming CVs while the hiring decision stays with a person.",
      capabilities: [
        "End-to-End Recruitment",
        "Requisition Approval",
        "Organogram & Workforce Planning",
        "Candidate Management",
        "AI CV Screening",
        "Onboarding & Verification",
        "Analytics & Reporting",
      ],
      features: [
        { title: "Requisition workflow", description: "Structured hiring requests routed automatically to the right approvers." },
        { title: "Approval chains", description: "Multi-level, org-aware approval derived from hierarchy rather than hard-coded rules." },
        { title: "Candidate pipeline", description: "Applied, shortlisted, interview, final and selected stages with history at each step." },
        { title: "AI CV screening", description: "Incoming CVs auto-screened and ranked so reviewers spend time on judgement, not transcription." },
        { title: "Onboarding & verification", description: "Document collection with automated checks that flag discrepancies for manual sign-off." },
        { title: "Workforce reporting", description: "Headcount, capacity and requisition throughput reporting for HR management." },
      ],
      technologies: ["React", "Node.js", "PostgreSQL", "REST APIs", "AI/LLM Integration"],
      poster: {
        src: "/projects/hr-platform/hrm_poster.webp",
        alt: "HRM Recruitment Suite — product overview showing the workforce dashboard, onboarding workflow and candidate pipeline",
        width: 1672,
        height: 941,
        redactions: [
          { x: 36.5, y: 8.5, w: 4.5, h: 6, mode: "frost", reason: "Employer logo" },
          { x: 34, y: 14, w: 8, h: 3.5, mode: "frost", reason: "Employer product name" },
          { x: 75.5, y: 2.5, w: 3.5, h: 5.5, mode: "frost", reason: "Photograph of a real account holder" },
          { x: 23.5, y: 44, w: 3.5, h: 5.5, mode: "frost", reason: "Employer logo" },
          { x: 22.5, y: 49, w: 6.5, h: 3.5, mode: "frost", reason: "Employer product name" },
          { x: 52, y: 42.5, w: 3.5, h: 5, mode: "frost", reason: "Photograph of a real account holder" },
          { x: 29.5, y: 46.5, w: 27, h: 7.5, mode: "solid", reason: "Candidate name and internal business unit name" },
          { x: 28.5, y: 69, w: 17.5, h: 4.5, mode: "solid", reason: "Internal hostname and a live onboarding link token" },
          { x: 58.5, y: 46.5, w: 3.5, h: 5.5, mode: "frost", reason: "Employer logo" },
          { x: 57.5, y: 51.5, w: 6.5, h: 3.5, mode: "frost", reason: "Employer product name" },
          { x: 87, y: 41.5, w: 3.5, h: 5, mode: "frost", reason: "Photograph of a real account holder" },
          { x: 69, y: 49.5, w: 8, h: 3.5, mode: "solid", reason: "Internal business unit name" },
          { x: 63.5, y: 69, w: 11.5, h: 4.5, mode: "solid", reason: "Internal hostname and a live application link token" },
        ],
      },
      images: [
        {
          src: "/projects/hr-platform/hrm-dash.webp",
          alt: "HR platform dashboard showing workforce totals, latest requisitions, workforce capacity and recent hires",
          caption: "Recruitment overview",
          width: 2560,
          height: 1375,
          redactions: [
            { x: 0.5, y: 3, w: 16.5, h: 15.5, mode: "frost", reason: "Employer logo and product name" },
            { x: 88.6, y: 1, w: 3, h: 5, mode: "frost", reason: "Photograph of a real account holder" },
            { x: 25.8, y: 41, w: 9.5, h: 44.5, mode: "solid", reason: "Internal business unit names" },
            { x: 76, y: 91.6, w: 13, h: 7, mode: "solid", reason: "Employee name and job title of a recent hire" },
            { x: 0.5, y: 95.8, w: 8.5, h: 4, mode: "frost", reason: "Employer name in the footer" },
          ],
        },
        {
          src: "/projects/hr-platform/requisition.webp",
          alt: "Requisition detail view with a seven-stage recruitment stepper, candidate pipeline counters and AI screening controls",
          caption: "Requisition pipeline and AI screening",
          width: 2560,
          height: 1375,
          redactions: [
            { x: 0.5, y: 3, w: 16.5, h: 15.5, mode: "frost", reason: "Employer logo and product name" },
            { x: 88.6, y: 1, w: 3, h: 5, mode: "frost", reason: "Photograph of a real account holder" },
            { x: 25.7, y: 15.3, w: 10, h: 3.4, mode: "solid", reason: "Internal business unit name" },
            { x: 20.8, y: 62.6, w: 29, h: 4.2, mode: "solid", reason: "Internal hostname and a live application link token" },
            { x: 0.5, y: 95.8, w: 8.5, h: 4, mode: "frost", reason: "Employer name in the footer" },
          ],
        },
        {
          src: "/projects/hr-platform/onboard.webp",
          alt: "Onboarding workflow with a five-step progress bar, document collection and an automated verification result flagging a discrepancy",
          caption: "Onboarding and document verification",
          width: 2560,
          height: 1375,
          reviewNote:
            "Contains real candidate PII (name, personal email, phone number) and a live onboarding token. Masked at render time, but re-capture with demo data before publishing.",
          redactions: [
            { x: 0.5, y: 3, w: 16.5, h: 15.5, mode: "frost", reason: "Employer logo and product name" },
            { x: 88.6, y: 1, w: 3, h: 5, mode: "frost", reason: "Photograph of a real account holder" },
            { x: 21.5, y: 12, w: 28, h: 8, mode: "solid", reason: "Candidate name and internal business unit name" },
            { x: 21.9, y: 56.9, w: 35, h: 4.4, mode: "solid", reason: "Internal hostname and a live onboarding link token" },
            { x: 76.6, y: 55.2, w: 14, h: 7, mode: "solid", reason: "Candidate personal email address and phone number" },
            { x: 84.9, y: 67.2, w: 11, h: 3.8, mode: "solid", reason: "Internal business unit name" },
          ],
        },
      ],
      liveUrl: "",
      repoUrl: "",
      hue: 268,
    },

    /* ---------------------------------------------------------------- 03 */
    {
      slug: "complaint-management-system",
      index: "03",
      title: "Complaint Management System",
      shortTitle: "Complaint Management",
      category: "Workflow & Governance",
      featured: true,
      featuredOrder: 3,
      tagline: "A workplace complaint lifecycle with SLA control and role-based handling.",
      summary:
        "A workspace for submitting, tracking and closing workplace complaints — with anonymous submission, role-based access across unit, admin and support teams, SLA policies, zone and group configuration, and reporting.",
      problem:
        "Complaints arrived through informal channels and were handled case by case. Response commitments existed on paper but nothing enforced them, and there was no record a reviewer could trust after the fact.",
      approach:
        "I made time and accountability first-class parts of the data model. Every complaint carries its SLA clock and its handling chain, so progress, ownership and escalation are properties of the record rather than something someone has to remember.",
      solution:
        "A platform covering submission through resolution: anonymous or identified intake, inquiry and community complaint streams, configurable zones and groups, SLA policies, a case timeline with a resolution tab, and dashboards showing pending, in-process, solved and rejected load.",
      role:
        "Full-stack. Lifecycle and SLA engine, MySQL schema, REST API, real-time updates, React interface, dashboards and reporting.",
      challenge:
        "The same complaint has to be visible to a complainant, a handling team and an authority reviewer without any of them seeing more than they should — including keeping anonymous submissions genuinely anonymous while still routable. Scoping every read through the permission layer kept that intact.",
      outcome:
        "Complaints follow one enforced lifecycle with visible ownership and time remaining, and a case history that survives review. Reduced the manual follow-up needed to know where anything stood.",
      capabilities: [
        "Complaint Lifecycle",
        "Anonymous Submission",
        "Role-Based Access",
        "SLA Policies",
        "Zone & Group Configuration",
        "Real-Time Status Tracking",
        "Reports & Insights",
      ],
      features: [
        { title: "Easy submission", description: "Raise a complaint quickly, identified or anonymously, with a tracked reference." },
        { title: "Track & manage", description: "Real-time status from submission to closure with a full case timeline." },
        { title: "Role-based access", description: "Unit, admin and support teams each see and act on their own scope." },
        { title: "SLA control", description: "Per-case response clocks with a health and risk overview across open cases." },
        { title: "Configurable structure", description: "Zones, groups and complaint categories defined as configuration, not code." },
        { title: "Reports & insights", description: "Distribution and throughput reporting for continuous improvement." },
      ],
      technologies: ["React", "Node.js", "MySQL", "REST APIs", "Real-Time Communication"],
      poster: {
        src: "/projects/cms/cms_poster.webp",
        alt: "Complaint Management System — product overview showing sign-in, the complaint dashboard and a complaint detail view",
        width: 1536,
        height: 1024,
        redactions: [
          { x: 24.5, y: 42.5, w: 4, h: 5, mode: "frost", reason: "Employer logo" },
          { x: 30.5, y: 62.5, w: 28, h: 21.5, mode: "solid", reason: "Employee names, employee IDs and phone numbers" },
          { x: 67.5, y: 46.5, w: 26, h: 4, mode: "solid", reason: "Employee names and internal business unit name" },
          { x: 87.5, y: 60.5, w: 11, h: 15, mode: "solid", reason: "Complainant name, employee ID and phone number" },
          { x: 87.5, y: 77.5, w: 11, h: 7, mode: "solid", reason: "Named individual in a complaint record" },
        ],
      },
      images: [
        {
          src: "/projects/cms/dasboard.webp",
          alt: "Complaint dashboard with pending, in-process, solved and rejected counters, a recent complaints list and SLA control panel",
          caption: "Complaint dashboard and SLA control",
          width: 2560,
          height: 1375,
          redactions: [
            { x: 4, y: 1.5, w: 8, h: 10, mode: "frost", reason: "Employer logo" },
            { x: 21.5, y: 56.5, w: 13, h: 38, mode: "solid", reason: "Employee names, employee IDs and phone numbers" },
            { x: 3, y: 92.5, w: 11, h: 7, mode: "frost", reason: "Employer name in the footer" },
          ],
        },
        {
          src: "/projects/cms/details.webp",
          alt: "Complaint detail view with status badges, elapsed and closed timestamps, case summary and complainant panel",
          caption: "Case detail and resolution timeline",
          width: 2560,
          height: 1375,
          reviewNote:
            "Contains a complainant name, employee ID, phone number and the name of the person complained about. Masked at render time — re-capture with demo data before publishing.",
          redactions: [
            { x: 4, y: 1.5, w: 8, h: 10, mode: "frost", reason: "Employer logo" },
            { x: 20, y: 23, w: 27, h: 3.2, mode: "solid", reason: "Named individuals and internal business unit name" },
            { x: 86, y: 57, w: 11, h: 13.5, mode: "solid", reason: "Complainant name, employee ID and phone number" },
            { x: 88, y: 91.5, w: 9, h: 5, mode: "solid", reason: "Named individual in a complaint record" },
            { x: 3, y: 92.5, w: 11, h: 7, mode: "frost", reason: "Employer name in the footer" },
          ],
        },
        {
          src: "/projects/cms/loginpage.webp",
          alt: "Secure sign-in screen using an employee ID, with role-based access and reporting highlighted alongside",
          caption: "Employee-ID sign-in",
          width: 2560,
          height: 1375,
          redactions: [
            { x: 64.5, y: 13, w: 8, h: 14, mode: "frost", reason: "Employer logo" },
            { x: 63.5, y: 88, w: 9.5, h: 6, mode: "frost", reason: "Employer name in the footer" },
          ],
        },
      ],
      liveUrl: "",
      repoUrl: "",
      hue: 190,
    },

    /* ---------------------------------------------------------------- 04 */
    {
      slug: "enterprise-ticketing-system",
      index: "04",
      title: "Enterprise Ticketing System",
      shortTitle: "Ticketing System",
      category: "Support Operations",
      featured: false,
      tagline: "Ticket capture, routing and SLA monitoring across every unit.",
      summary:
        "A ticket management platform for creating, prioritising, routing, monitoring and resolving support requests, with SLA visibility, category analytics and exportable reporting.",
      problem:
        "Support requests arrived from multiple units with no shared queue, no priority model and no way to see whether a response commitment had been met.",
      approach:
        "Tickets were modelled as a lifecycle with explicit states, an owner at every point and an SLA clock attached from creation. Reporting was designed alongside the model rather than bolted on, so the same records answer both the daily queue and the monthly review.",
      solution:
        "A platform with a super-admin ticket list, on-behalf creation, forwarding, four priority levels with an urgency overview, archived tickets, twelve-month trend analytics and a report query builder with spreadsheet and PDF export.",
      role:
        "Full-stack. Ticket lifecycle and SLA model, REST API, role-based views, React interface, analytics and reporting.",
      challenge:
        "SLA reporting had to stay meaningful when tickets are raised on behalf of someone else, forwarded between units, or archived mid-cycle. Anchoring the clock to the record rather than the assignee kept the numbers honest.",
      outcome:
        "One queue with a visible owner, priority and remaining time for every request, and SLA reporting that management can filter by unit, admin, category and date range.",
      capabilities: [
        "Ticket Management",
        "Priority Management",
        "SLA Monitoring",
        "Ticket Lifecycle",
        "Advanced Filtering",
        "Analytics",
        "Reporting & Export",
        "Role-Based Workflows",
      ],
      features: [
        { title: "Centralised capture", description: "Capture, assign and resolve issues across all units in one queue." },
        { title: "Priority model", description: "Urgent, high, medium and low with a live urgency overview." },
        { title: "On-behalf & forwarding", description: "Raise a ticket for someone else, or forward it to the right unit." },
        { title: "SLA monitoring", description: "Solved-within-SLA, overdue and break-time tracked per ticket." },
        { title: "Category analytics", description: "Distribution by issue type and a twelve-month ticket trend." },
        { title: "Report queries", description: "Filter by unit, admin, category, status, priority and date, then export." },
      ],
      technologies: ["React", "TypeScript", "Node.js", "REST APIs", "SQL"],
      poster: {
        src: "/projects/ticketing/ticketing_poster.webp",
        alt: "Ticketing System — product overview showing the ticket dashboard, ticket list and SLA report query",
        width: 1536,
        height: 1024,
        redactions: [
          { x: 75.5, y: 22.5, w: 14.5, h: 19.5, mode: "solid", reason: "Employee names and client company names in the leaderboard" },
          { x: 26.5, y: 53.5, w: 20, h: 35, mode: "solid", reason: "Employee names and employee IDs on ticket cards" },
          { x: 54.5, y: 61, w: 9.5, h: 4, mode: "solid", reason: "Internal building and floor location" },
          { x: 54.5, y: 75, w: 9.5, h: 4, mode: "solid", reason: "Internal building and floor location" },
          { x: 75.5, y: 77.5, w: 12, h: 3.5, mode: "solid", reason: "Employee name and employee ID in the admin filter" },
          { x: 75.5, y: 88.5, w: 11, h: 3.5, mode: "solid", reason: "Employee name and employee ID in the report footer" },
        ],
      },
      images: [
        {
          src: "/projects/ticketing/ticket-dashboard.webp",
          alt: "Ticketing dashboard with total, solved, in-progress and unsolved counters, a priority overview and category breakdown",
          caption: "Ticket dashboard and priority overview",
          width: 2560,
          height: 1498,
          redactions: [
            { x: 73.8, y: 38, w: 23, h: 36.5, mode: "solid", reason: "Employee names and client company names in the leaderboard" },
            { x: 81.8, y: 87.5, w: 17.5, h: 13, mode: "frost", reason: "Employer name in the AI assistant badge" },
          ],
        },
        {
          src: "/projects/ticketing/report.webp",
          alt: "Ticket report query panel showing solved rate, SLA performance metrics and filter controls",
          caption: "SLA reporting and report query builder",
          width: 1400,
          height: 1636,
          redactions: [
            { x: 36.5, y: 68.9, w: 29, h: 4, mode: "solid", reason: "Employee name and employee ID in the admin filter" },
            { x: 36.5, y: 90.5, w: 18, h: 3.5, mode: "solid", reason: "Employee name and employee ID in the report footer" },
          ],
        },
      ],
      liveUrl: "",
      repoUrl: "",
      hue: 24,
    },


    /* ---------------------------------------------------------------- 05 */
    {
      slug: "bengali-ecommerce-storefront",
      index: "05",
      title: "Bengali E-Commerce Storefront",
      shortTitle: "E-Commerce Storefront",
      category: "E-Commerce",
      featured: false,
      multilingual: {
        languages: ["Bengali"],
        rtl: false,
        note: "Interface, product content, checkout and order flow are entirely in Bengali, with the address hierarchy and payment methods people in Bangladesh actually use.",
      },
      tagline: "A complete Bengali storefront — catalogue, cart, checkout and local payments.",
      summary:
        "An end-to-end e-commerce storefront built entirely in Bengali: a filterable product catalogue with weight variants, AI-assisted search, a cart, and a checkout matched to Bangladeshi addressing and payment methods.",
      problem:
        "Selling online locally means more than translating a template. Customers search in Bengali, expect prices in taka, enter addresses as division / district / upazila rather than a flat address line, and pay cash on delivery or through bKash and Nagad. A generic storefront gets all of that wrong.",
      approach:
        "Built the interface in Bengali from the first component rather than translating afterwards, and modelled the checkout around the Bangladeshi address hierarchy and payment options instead of bending a Western checkout into shape.",
      solution:
        "A storefront covering the browse-to-order path: a catalogue filtered by category and segment with per-weight variants and pricing, AI-assisted product search, a cart, and a checkout with cascading division / district / upazila selection, cash-on-delivery plus bKash and Nagad, order tracking and a direct WhatsApp contact route.",
      role:
        "Full-stack. Product and catalogue data model, REST API, React storefront, cart and checkout flow, AI search integration and responsive layout.",
      challenge:
        "The address hierarchy is genuinely dependent — district options depend on division, upazila on district — so it had to be driven by data with each level gating the next, rather than three unrelated dropdowns that let a customer submit an impossible address.",
      outcome:
        "A storefront a Bengali-speaking customer can use end to end without switching language, with an address and payment flow that matches how orders are actually placed and delivered locally.",
      capabilities: [
        "Product Catalogue",
        "Filtering & Segmentation",
        "Product Variants",
        "AI-Assisted Search",
        "Cart & Checkout",
        "Local Payment Methods",
        "Order Tracking",
        "Bengali Interface",
      ],
      features: [
        { title: "Filterable catalogue", description: "Category and segment facets over a product set with per-weight variants and pricing." },
        { title: "AI-assisted search", description: "Natural-language product search alongside the standard keyword field." },
        { title: "Variant pricing", description: "100g through 1kg options priced independently on the same product." },
        { title: "Localised checkout", description: "Cascading division, district and upazila selection matching Bangladeshi addressing." },
        { title: "Local payment methods", description: "Cash on delivery, bKash and Nagad presented as first-class options." },
        { title: "Order tracking", description: "A dedicated tracking route so customers can follow an order after placing it." },
      ],
      technologies: ["React", "Next.js", "Node.js", "REST APIs", "AI Integration"],
      poster: {
        src: "/projects/ecommerce/urbanshopPoster.webp",
        alt: "E-commerce storefront product overview showing the shop homepage, product cards and secure checkout",
        width: 1672,
        height: 941,
      },
      images: [
        {
          src: "/projects/ecommerce/home.webp",
          alt: "Bengali storefront homepage with the product hero, search, cart and category navigation",
          caption: "Storefront homepage",
          width: 2560,
          height: 1368,
          redactions: [
            { x: 51.5, y: 0.3, w: 8, h: 2.8, mode: "solid", reason: "Client business contact phone number" },
          ],
        },
        {
          src: "/projects/ecommerce/products.webp",
          alt: "Product catalogue with category and segment filters, AI search, and product cards showing weight variants and prices",
          caption: "Catalogue, filters and AI search",
          width: 2560,
          height: 1368,
        },
        {
          src: "/projects/ecommerce/checkout.webp",
          alt: "Checkout with a Bengali billing form using division, district and upazila selection, an order summary and cash-on-delivery, bKash and Nagad payment options",
          caption: "Localised checkout and payment methods",
          width: 2560,
          height: 1368,
        },
      ],
      liveUrl: "",
      repoUrl: "",
      hue: 142,
    },
    /* ---------------------------------------------------------------- 06 */
    {
      slug: "drive-document-management",
      index: "06",
      title: "Drive & Document Management",
      shortTitle: "Drive System",
      category: "Document Management",
      featured: false,
      tagline: "Centralised file storage, sharing and access control for teams.",
      summary:
        "A file management system to store, organise, share and access documents — with type-based organisation, folder hierarchy, shared and personal spaces, filtering and a recycle bin.",
      problem:
        "Working documents were scattered across personal drives and message threads, so finding the current version of anything depended on knowing who last touched it.",
      approach:
        "One storage model with explicit ownership and sharing scopes, so a file's location and who can reach it are properties of the record rather than a convention people have to follow.",
      solution:
        "A drive with type-grouped views for PDF, Word, Excel, PowerPoint, images and video, recent folders and files, shared versus personal spaces, in-app document creation, filtering by type and date, and a recycle bin for recovery.",
      role: "Full-stack. Storage and permission model, REST API, React interface, upload handling and filtering.",
      challenge:
        "Sharing had to be genuinely scoped — a shared space that quietly exposes everything is worse than no sharing at all — which meant resolving visibility at the data layer for every listing, not just hiding entries in the UI.",
      outcome:
        "One place to store and find working documents, with a clear owner, modification date and sharing scope on every file.",
      capabilities: [
        "Centralised Storage",
        "Folder & Type Organisation",
        "Shared & Personal Spaces",
        "File Upload & Creation",
        "Search & Filtering",
        "Recycle Bin & Recovery",
      ],
      features: [
        { title: "Type-grouped views", description: "PDF, Word, Excel, PowerPoint, image and video collections at the top level." },
        { title: "Folders & recents", description: "Folder hierarchy alongside recent folders and recently touched files." },
        { title: "Shared vs personal", description: "Separate shared-team and my-files spaces with distinct visibility." },
        { title: "Create in place", description: "Start a Word, Excel, PDF or PowerPoint document without leaving the drive." },
        { title: "Filter & search", description: "Narrow by file type and date range, or search across files and folders." },
        { title: "Recycle bin", description: "Deleted items recoverable rather than immediately destroyed." },
      ],
      technologies: ["React", "Node.js", "REST APIs", "SQL"],
      poster: {
        src: "/projects/drive/Drive_poster.webp",
        alt: "Drive System — product overview showing type-grouped file storage, recent files and the upload menu",
        width: 1536,
        height: 1024,
        redactions: [
          { x: 37.5, y: 40.5, w: 45, h: 11.5, mode: "solid", reason: "Document filenames containing a company name, and a username" },
          { x: 65.5, y: 65, w: 17, h: 8, mode: "solid", reason: "Document filenames containing a company name" },
        ],
      },
      images: [
        {
          src: "/projects/drive/drivedash.webp",
          alt: "Drive home showing file-type collections, recent folders and a recent files table with size, owner and modified date",
          caption: "Drive home and recent files",
          width: 2560,
          height: 1375,
          redactions: [
            { x: 2.5, y: 0.5, w: 8, h: 10, mode: "frost", reason: "Employer logo" },
            { x: 16.5, y: 53.5, w: 14, h: 15, mode: "solid", reason: "Document filename containing a company name" },
            { x: 83.5, y: 53.5, w: 5, h: 15, mode: "solid", reason: "Username of a real account holder" },
            { x: 2, y: 92, w: 9.5, h: 6, mode: "frost", reason: "Employer name in the footer" },
            { x: 46.5, y: 94.5, w: 20, h: 4.5, mode: "frost", reason: "Employer name in the copyright line" },
          ],
        },
        {
          src: "/projects/drive/details.webp",
          alt: "Shared files view with the upload menu open, offering file upload and in-place Word, Excel, PDF and PowerPoint creation",
          caption: "Shared files and in-place document creation",
          width: 2560,
          height: 1375,
          redactions: [
            { x: 2.5, y: 0.5, w: 8, h: 10, mode: "frost", reason: "Employer logo" },
            { x: 58.5, y: 25.5, w: 19.5, h: 10, mode: "solid", reason: "Document filename containing a company name, and a username" },
            { x: 2, y: 92, w: 9.5, h: 6, mode: "frost", reason: "Employer name in the footer" },
          ],
        },
      ],
      liveUrl: "",
      repoUrl: "",
      hue: 158,
    },

    /* ---------------------------------------------------------------- 07 */
    {
      slug: "telecom-corporate-platform",
      index: "07",
      title: "Telecom Corporate Platform",
      shortTitle: "Telecom Platform",
      category: "Corporate Web",
      featured: false,
      tagline: "A corporate presence for an international voice-traffic operator.",
      summary:
        "A corporate website for an international gateway telecom operator, presenting voice services, points of presence, network security and company information in a structured, responsive layout.",
      problem:
        "A technical B2B service — international voice routing, points of presence, interconnect — had to be explained clearly to carrier and enterprise audiences without turning into a wall of jargon.",
      approach:
        "Structure first: each service given its own defined block with a consistent shape, so a visitor can scan the offering and drill into the one that matters instead of reading everything.",
      solution:
        "A responsive corporate site covering incoming and outgoing international voice services, distributed points of presence, network security, mission and vision, management information and contact routes.",
      role: "Frontend. Layout system, component structure, responsive behaviour and content integration.",
      challenge:
        "Corporate sites accumulate sections. Keeping a consistent component vocabulary meant new content could be added later without the layout drifting.",
      outcome:
        "A structured, responsive corporate presence that presents a technical service offering in terms a non-specialist buyer can follow.",
      capabilities: [
        "Corporate Site Architecture",
        "Service Presentation",
        "Responsive Layout",
        "Component System",
        "Content Structure",
      ],
      features: [
        { title: "Service blocks", description: "Incoming voice, outgoing voice, points of presence and network security as consistent units." },
        { title: "Company sections", description: "About, mission and vision, and management information in a shared layout." },
        { title: "Responsive system", description: "One component vocabulary that holds from mobile through wide desktop." },
        { title: "Clear contact routes", description: "Enquiry paths surfaced from every section rather than buried in a footer." },
      ],
      technologies: ["React", "Next.js", "Responsive UI"],
      poster: {
        src: "/projects/telecom/telecom_poster.webp",
        alt: "Telecom corporate platform — product overview showing the hero, global connectivity map and service summary",
        width: 1672,
        height: 941,
        // Bottom band carries third-party partner logos; cropped rather than masked.
        crop: { bottom: 24 },
        redactions: [
          { x: 3.5, y: 1, w: 13, h: 7, mode: "frost", reason: "Client brand mark" },
        ],
      },
      images: [
        {
          src: "/projects/telecom/telecomhome.webp",
          alt: "Telecom homepage hero with the service positioning and four service cards over a data-centre backdrop",
          caption: "Homepage hero",
          width: 2560,
          height: 1375,
          redactions: [
            { x: 11.5, y: 1, w: 11, h: 7, mode: "frost", reason: "Client brand mark" },
          ],
        },
        {
          src: "/projects/telecom/details.webp",
          alt: "Service detail section describing international incoming and outgoing voice services, points of presence and network security",
          caption: "Service detail section",
          width: 2560,
          height: 1375,
          // Top of this screenshot is a third-party partner logo carousel.
          crop: { top: 44 },
        },
      ],
      liveUrl: "",
      repoUrl: "",
      hue: 42,
    },

    /* ---------------------------------------------------------------- 08 */
    {
      slug: "arabic-service-business-platform",
      index: "08",
      title: "Arabic Service Business Platform",
      shortTitle: "Arabic Service Platform",
      category: "Multilingual Web",
      featured: false,
      multilingual: {
        languages: ["Arabic"],
        rtl: true,
        note: "Interface, content and layout are fully Arabic and render right-to-left — navigation, typography, form controls and floating actions all mirror.",
      },
      tagline: "A fully Arabic, right-to-left platform for a local service business.",
      summary:
        "A service business platform built entirely in Arabic with a right-to-left layout — service catalogue, location and directions, and direct call and WhatsApp contact routes designed for mobile-first local search.",
      problem:
        "A local service business needed to be findable and contactable by customers searching in Arabic, on phones, who expect to reach someone in one tap rather than fill in a form.",
      approach:
        "Built RTL-first rather than translating an English layout afterwards. Direction affects more than text alignment: navigation order, icon placement, number formatting and the reading path through each section all mirror, so the result reads as native rather than flipped.",
      solution:
        "A fully Arabic platform with a service catalogue, per-service detail sections, an embedded map with directions, and persistent call, WhatsApp and location actions pinned within thumb reach on mobile.",
      role: "Frontend. RTL layout system, Arabic typography, component structure, map integration and responsive behaviour.",
      challenge:
        "RTL is not a stylesheet flag. Getting mixed Arabic and Latin content, embedded third-party widgets and directional icons to behave consistently took deliberate handling at the component level.",
      outcome:
        "A platform that reads as native Arabic rather than a translated layout, with contact actions reachable in one tap from any point on the page.",
      capabilities: [
        "Right-to-Left Layout",
        "Arabic Typography",
        "Localised Content Structure",
        "Map & Directions Integration",
        "Direct Contact Actions",
        "Mobile-First Responsive UI",
      ],
      features: [
        { title: "RTL-first layout", description: "Navigation, reading order and component direction built for right-to-left, not mirrored after the fact." },
        { title: "Arabic typography", description: "Type scale and line height tuned for Arabic script rather than inherited from a Latin scale." },
        { title: "Service catalogue", description: "Each service given its own block with description and a direct action." },
        { title: "Map & directions", description: "Embedded map with a direct hand-off to the device's maps application." },
        { title: "One-tap contact", description: "Persistent call, WhatsApp and location actions within thumb reach on mobile." },
        { title: "Mixed-script handling", description: "Latin product names and numerals sitting correctly inside Arabic text." },
      ],
      technologies: ["React", "Next.js", "Responsive UI", "Maps Integration"],
      poster: {
        src: "/projects/others/Khamis_poster.webp",
        alt: "Arabic service platform — product overview showing the right-to-left homepage, mobile view and service cards",
        width: 1672,
        height: 941,
      },
      images: [
        {
          src: "/projects/others/home.webp",
          alt: "Arabic right-to-left homepage with the service headline, description and call, WhatsApp and map actions",
          caption: "Right-to-left homepage",
          width: 2560,
          height: 1375,
          redactions: [
            { x: 35.5, y: 60, w: 6.5, h: 4, mode: "solid", reason: "Business contact phone number" },
          ],
        },
        {
          src: "/projects/others/details.webp",
          alt: "Arabic service detail cards, each with a description and a direct booking action, alternating image and text",
          caption: "Service catalogue",
          width: 2560,
          height: 1375,
        },
        {
          src: "/projects/others/maps.webp",
          alt: "Arabic location section with an embedded map and a direct link to open directions",
          caption: "Location and directions",
          width: 2560,
          height: 1375,
        },
      ],
      liveUrl: "",
      repoUrl: "",
      hue: 286,
    },

    /* ---------------------------------------------------------------- 09 */
    {
      slug: "portfolio-brand-websites",
      index: "09",
      title: "Portfolio & Personal Brand Websites",
      shortTitle: "Portfolio Websites",
      category: "Personal Brand",
      featured: false,
      tagline: "Editorial personal sites that present expertise, not just a CV.",
      summary:
        "Personal brand websites built as editorial products — a full-stack engineering portfolio with an AI project-fit analyzer, and an executive leadership site structured around expertise, impact and sustainability.",
      problem:
        "A CV lists roles. It does not show how someone works, what they have actually built, or why a stranger should start a conversation. Most personal sites are a template with a headshot dropped in, which reads the same as everyone else's.",
      approach:
        "Treat each site as a product with one job: get a specific reader to a specific action. That means a distinct visual system rather than a theme, content structured around evidence instead of adjectives, and an interaction that does something useful rather than decorating the page.",
      solution:
        "Two builds sharing an approach and nothing else visually. The engineering portfolio uses a dark editorial system, case-study pages driven from one typed content file, and an AI analyzer that compares a visitor's requirement against documented work. The executive site uses a light editorial system organised around expertise, leadership, impact and sustainability commitments.",
      role:
        "Design and full-stack build. Visual system, component architecture, content model, responsive behaviour, accessibility, AI integration and deployment.",
      challenge:
        "Personal sites drift toward self-description. Keeping each one grounded in evidence — real screenshots, documented capabilities, an assistant that refuses to overstate — meant building content structures that make unsupported claims awkward to add in the first place.",
      outcome:
        "Two distinct sites that read as products rather than templates, each pointing its own audience at a clear next step.",
      capabilities: [
        "Editorial Design Systems",
        "Component Architecture",
        "Content Modelling",
        "AI Integration",
        "Responsive Layout",
        "Accessibility",
        "SEO & Metadata",
        "Deployment",
      ],
      features: [
        { title: "Distinct visual systems", description: "Each site gets its own type scale, palette and motion language rather than a shared theme." },
        { title: "Typed content model", description: "All copy and project data in one typed file, so content changes never touch components." },
        { title: "AI project-fit analyzer", description: "Grounded assistant that compares a visitor's brief against documented work and names the gaps." },
        { title: "Case-study architecture", description: "Per-project pages generated from data, with dynamic metadata and social images." },
        { title: "Accessibility built in", description: "Keyboard navigation, visible focus, reduced-motion support and AA contrast in both themes." },
        { title: "Editorial structure", description: "Expertise, leadership, impact and sustainability presented as sections, not a wall of prose." },
      ],
      technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "AI Integration"],
      poster: {
        src: "/projects/portfolios/portfolios_poster.webp",
        alt: "Portfolio website development overview showing two personal brand sites across desktop and mobile",
        width: 1536,
        height: 1024,
      },
      images: [
        {
          src: "/projects/portfolios/landingone.webp",
          alt: "Dark editorial portfolio homepage with an animated system diagram showing interface, API, data, AI and automation layers",
          caption: "Engineering portfolio — homepage",
          width: 2560,
          height: 1368,
        },
        {
          src: "/projects/portfolios/onedetails.webp",
          alt: "Capabilities section presenting frontend, backend, database, AI and DevOps layers as a connected fan-out diagram",
          caption: "Engineering portfolio — capabilities",
          width: 2560,
          height: 1368,
        },
        {
          src: "/projects/portfolios/landingtwo.webp",
          alt: "Light editorial executive portfolio homepage with a leadership positioning statement and portrait",
          caption: "Executive portfolio — homepage",
          width: 2560,
          height: 1368,
        },
        {
          src: "/projects/portfolios/twodetails.webp",
          alt: "Sustainable Development Goals section mapping utility leadership to the seventeen global goals, above a contact block",
          caption: "Executive portfolio — impact and sustainability",
          width: 2560,
          height: 1368,
        },
      ],
      liveUrl: "",
      repoUrl: "",
      hue: 250,
    },
  ],

  /* ------------------------------------------------------------------ skills */
  skills: [
    {
      id: "frontend",
      label: "Frontend",
      description: "Interfaces built as systems — typed, composable and responsive from the first breakpoint.",
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Tailwind CSS",
        "Responsive UI",
        "Component Architecture",
        "RTL / Multilingual UI",
      ],
    },
    {
      id: "backend",
      label: "Backend",
      description: "APIs and application logic designed around the business rules they enforce.",
      items: [
        "Node.js",
        "Express.js",
        "REST APIs",
        "Webhooks",
        "Authentication",
        "Role-Based Access Control",
        "Real-Time Features",
      ],
    },
    {
      id: "database",
      label: "Database",
      description: "Relational modelling that keeps the domain honest as requirements grow.",
      items: ["PostgreSQL", "MySQL", "Supabase"],
    },
    {
      id: "ai",
      label: "AI & Automation",
      description: "Language models and automation wired into workflows that already matter.",
      items: [
        "LLM Integration",
        "OpenAI APIs",
        "Gemini APIs",
        "AI-Assisted Workflows",
        "Business Automation",
        "Third-Party AI APIs",
      ],
    },
    {
      id: "devops",
      label: "DevOps",
      description: "Getting it deployed, keeping it up, and knowing when something changed.",
      items: ["Docker", "PM2", "Git", "Cloudflare", "Linux", "Deployment", "CI/CD Fundamentals"],
    },
  ],

  /* ---------------------------------------------------------------------- ai */
  ai: {
    eyebrow: "AI Integration",
    heading: "AI where it creates actual value.",
    lead: "Adding a chatbot to a product is the easy part. The useful part is putting a language model inside a workflow that already exists and letting it remove the repetitive step.",
    body: "I integrate LLM APIs into business applications as one step in a larger process — drafting a response an agent then edits, extracting structured fields from unstructured input, classifying an incoming request so it routes correctly. The model does the tedious work. A person keeps the decision.",
    capabilities: [
      { title: "LLM API integration", description: "OpenAI and Gemini APIs connected to application logic with validation and fallbacks." },
      { title: "AI-assisted workflows", description: "Model output embedded as a step inside an existing process, not a separate feature." },
      { title: "Response generation", description: "Drafted replies and summaries produced in context, edited before they are sent." },
      { title: "Information extraction", description: "Structured fields pulled from unstructured documents and free text." },
      { title: "Classification & routing", description: "Incoming items categorised so they reach the correct queue or owner." },
      { title: "Human-in-the-loop", description: "Review and override built into the flow, because model output is a proposal." },
    ],
    note: "AI is a component, not the architecture. Everything around it still needs to be correct.",
  },

  /* ---------------------------------------------------------------- services */
  services: [
    {
      index: "01",
      title: "Full-Stack Web Development",
      description: "Complete applications from data model to interface, built and deployed by one engineer.",
      deliverables: ["Data modelling", "API + interface", "Deployment"],
    },
    {
      index: "02",
      title: "React / Next.js Development",
      description: "Typed, component-driven frontends — dashboards, portals and business interfaces that stay maintainable.",
      deliverables: ["Component architecture", "State and data fetching", "Responsive layout"],
    },
    {
      index: "03",
      title: "Node.js Backend Development",
      description: "REST APIs, authentication, role-based access and business logic that matches how the organisation actually works.",
      deliverables: ["REST API design", "Auth + RBAC", "Business logic"],
    },
    {
      index: "04",
      title: "API Integration",
      description: "Connecting third-party services and internal systems, including webhooks, retries and the failure cases.",
      deliverables: ["Third-party services", "Webhooks", "Error handling"],
    },
    {
      index: "05",
      title: "AI & LLM Integration",
      description: "Language-model features added to existing products where they remove real manual work.",
      deliverables: ["LLM API integration", "Prompt + validation layer", "Human review flow"],
    },
    {
      index: "06",
      title: "Existing System Feature Development",
      description: "New functionality inside a codebase that is already running, without destabilising what works.",
      deliverables: ["Codebase review", "Incremental delivery", "Regression care"],
    },
    {
      index: "07",
      title: "Bug Fixing & Performance Optimization",
      description: "Diagnosing what is broken or slow, fixing the cause, and confirming the fix under real conditions.",
      deliverables: ["Root-cause diagnosis", "Query + payload tuning", "Frontend performance"],
    },
    {
      index: "08",
      title: "Deployment & Server Setup",
      description: "Linux servers, Docker, process management and domains configured so releases stop being an event.",
      deliverables: ["Server configuration", "Docker / PM2", "Domain + TLS"],
    },
    {
      index: "09",
      title: "Multilingual Web Development",
      description: "Interfaces built for non-English markets, including right-to-left layouts designed from the first component rather than mirrored later.",
      deliverables: ["RTL layout systems", "Script-aware typography", "Localised structure"],
    },
  ],

  /* ----------------------------------------------------------------- process */
  process: [
    { index: "01", title: "Discover", description: "Understand the business problem, requirements and existing architecture." },
    { index: "02", title: "Architect", description: "Define the technical approach, data flow and implementation strategy." },
    { index: "03", title: "Build", description: "Develop maintainable frontend and backend functionality." },
    { index: "04", title: "Test", description: "Validate functionality, responsiveness, edge cases and performance." },
    { index: "05", title: "Deploy", description: "Prepare and deploy the application safely." },
    { index: "06", title: "Improve", description: "Measure, refine and extend the product as requirements evolve." },
  ],

  /* ------------------------------------------------------------ testimonials */
  // Intentionally empty. The section renders nothing until real quotes exist.
  // Add objects of shape { quote, author, title, company? } to enable it.
  testimonials: [],

  /* ----------------------------------------------------------------- socials */
  // Leave `url` empty to hide a link completely. Do not invent URLs.
  socials: [
    {
      key: "email",
      label: "Email",
      url: "Omorkyumaunto16@gmail.com",
      handle: "Omorkyumaunto16@gmail.com",
    },
    {
      key: "github",
      label: "GitHub",
      url: "https://github.com/OmorKyumAunto",
      handle: "OmorKyumAunto",
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/omor-kyum-aunto-131452193/",
      handle: "omor-kyum-aunto",
    },
    {
      key: "upwork",
      label: "Upwork",
      url: "https://www.upwork.com/freelancers/omorkyumaunto",
      handle: "omorkyumaunto",
    },
  ],

  /* ----------------------------------------------------------------- contact */
  // No form. Direct channels only -- one click to reach a real inbox.
  contact: {
    eyebrow: "Contact",
    heading: "Have a project worth",
    headingAccent: "building?",
    lead: "Tell me what the system needs to do. I'll reply with an honest read on scope, approach and whether I'm the right person for it.",
    responseNote:
      "Email is the fastest route. If you'd rather work through a platform, Upwork works just as well.",
  },

  /* ------------------------------------------------------------- multilingual */
  multilingual: {
    eyebrow: "Multilingual Delivery",
    heading: "Software should work for the people using it —",
    headingAccent: "whatever language they read in.",
    lead: "Language and direction are architectural decisions, not a translation pass at the end. I've shipped production interfaces in Arabic — built right-to-left from the first component — and a complete Bengali storefront, addressing and payment methods included.",
    points: [
      {
        title: "RTL-first, not mirrored",
        description:
          "Navigation order, icon direction, reading path and form controls designed for right-to-left rather than flipped afterwards.",
      },
      {
        title: "Script-aware typography",
        description:
          "Type scale, line height and weight tuned for the script in use instead of inherited from a Latin scale.",
      },
      {
        title: "Mixed-script content",
        description:
          "Latin product names, numerals and embedded third-party widgets sitting correctly inside non-Latin text.",
      },
      {
        title: "Localised structure",
        description:
          "Addressing, payment methods, contact routes and calls to action shaped around how people in that market actually transact.",
      },
    ],
    projectSlugs: ["arabic-service-business-platform", "bengali-ecommerce-storefront"],
  },

  /* ------------------------------------------------------------ ai assistant */
  // Copy and example prompts for the AI Project Fit Analyzer. The assistant is
  // grounded entirely in this file -- see src/lib/ai/context.ts. Set
  // `enabled: false` to remove the section and disable the API route.
  aiAssistant: {
    enabled: true,
    eyebrow: "See if we're a technical match",
    heading: "Have a project in mind? Let AI compare it with my",
    headingAccent: "actual work.",
    lead: "Paste a project requirement or job description. The analyzer compares it against my documented projects, technologies and capabilities — and tells you plainly where the gaps are.",
    disclosure:
      "AI-generated analysis grounded in Omor's documented portfolio. Not written by Omor, and not a commitment to take on work.",
    inputLabel: "Project requirements or job description",
    placeholder: "Paste your project requirements or job description...",
    submitLabel: "Analyze project fit",
    analyzingLabel: "Comparing your requirements with selected work",
    // Client-voiced, and chosen so each one exercises a different part of the
    // documented portfolio: dashboards, existing-codebase work, AI, workflow
    // systems and multilingual delivery.
    examples: [
      {
        label: "React dashboard + auth",
        prompt:
          "I need a React dashboard with authentication, role-based permissions and a PostgreSQL backend, plus reporting and CSV export.",
      },
      {
        label: "Feature in an existing app",
        prompt:
          "We have an existing Node.js application in production. I need new features added without destabilising what already works.",
      },
      {
        label: "AI in a business app",
        prompt:
          "I need an AI-powered internal business application that automates a manual workflow, with a human review step before anything is sent.",
      },
      {
        label: "Ticketing & workflow",
        prompt:
          "I need a ticketing and workflow management system with role-based routing, SLA tracking and exportable reports.",
      },
      {
        label: "Multilingual app",
        prompt:
          "I need a multilingual web application, including right-to-left layout support for Arabic users.",
      },
    ],
  },

  /* --------------------------------------------------------------------- seo */
  seo: {
    siteUrl,
    titleDefault: "Omor Kyum Aunto — Full-Stack Engineer",
    titleTemplate: "%s — Omor Kyum Aunto",
    description:
      "Full-Stack Engineer building scalable web applications, business systems and AI-powered workflows with React, Next.js, Node.js and TypeScript.",
    keywords: [
      "Full-Stack Engineer",
      "React Developer",
      "Next.js Developer",
      "Node.js Developer",
      "TypeScript",
      "AI Integration",
      "Business Applications",
      "Dashboard Development",
      "API Integration",
      "Omor Kyum Aunto",
    ],
    locale: "en_US",
  },
};

export default portfolio;
