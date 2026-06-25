/* =====================================================================
 *  SINGLE SOURCE OF TRUTH FOR ALL PORTFOLIO CONTENT
 *  ---------------------------------------------------------------------
 *  Everything on the site reads from this file. Update content here —
 *  never the components.
 * ===================================================================== */

export const profile = {
  name: "Shikhar Raj",
  firstName: "Shikhar",
  // Hero typewriter roles.
  roles: [
    "Tech Lead",
    "AI Product Engineer",
    "Full-Stack Developer",
    "Future Engineering Manager",
  ],
  tagline:
    "Tech Lead & AI Product Engineer with 3.6 years building and scaling AI-powered, full-stack products. I lead teams, align stakeholders, and turn business problems into high-impact technical solutions — now moving toward management and consulting-oriented roles.",
  location: "Mumbai, India",
  email: "shikhar132020@gmail.com",
  phone: "+91 84336 21805",
  availability: "Open to leadership, management & consulting roles",
  resumeUrl: "/resume.pdf",
  // Replace with a real Cal.com / Calendly link when available.
  meetingUrl: "mailto:shikhar132020@gmail.com?subject=Let%27s%20schedule%20a%20meeting",
  // Drop a square headshot at /public/avatar.jpg (used in the hero card).
  avatar: "/avatar.jpg",
  // IANA timezone — powers the live "local time" indicator.
  timezone: "Asia/Kolkata",
  socials: [
    { label: "GitHub", href: "https://github.com/shikhar-rsp", handle: "@shikhar-rsp" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/shikhar-raj-80271312b/", handle: "Shikhar Raj" },
    { label: "Email", href: "mailto:shikhar132020@gmail.com", handle: "shikhar132020@gmail.com" },
    { label: "Phone", href: "tel:+918433621805", handle: "+91 84336 21805" },
  ],
} as const;

export type Stat = {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
};

export const stats: Stat[] = [
  { label: "Years of Experience", value: 3.6, decimals: 1 },
  { label: "Enterprise Products Shipped", value: 9, suffix: "+" },
  { label: "Technologies Worked On", value: 25, suffix: "+" },
  { label: "Peak Performance Gain", value: 36, suffix: "%" },
];

export const about = {
  heading: "From engineering depth to product leadership.",
  paragraphs: [
    "I'm a Tech Lead and AI Product Engineer with 3.6 years across full-stack development and AI product engineering. I've shipped enterprise platforms in banking, wealth and insurance — owning everything from pixel-perfect frontends to scalable NestJS/Node backends and frontend deployments.",
    "My edge is combining strong engineering with leadership: driving architecture decisions, code reviews and sprint planning, mentoring teammates, and aligning closely with stakeholders and clients to deliver on time in fast-paced environments.",
    "Lately I've gone deep on AI-assisted engineering — building automation pipelines (including a Claude × Figma design-to-code pipeline) that meaningfully lift team productivity. I'm now focused on roles that blend technology, leadership, strategy and business problem-solving.",
  ],
  principles: [
    {
      title: "Leadership",
      body: "Architecture decisions, code reviews and sprint planning that improved team delivery consistency by 15–20%.",
    },
    {
      title: "Craft",
      body: "Partnering with designers for pixel-perfect, high-performance UI — cutting UI rework by ~15%.",
    },
    {
      title: "AI Velocity",
      body: "AI-assisted workflows and automation pipelines that raised development productivity by 25–30%.",
    },
    {
      title: "Stakeholders",
      body: "Translating business requirements into scalable solutions and managing client expectations end-to-end.",
    },
  ],
} as const;

export type Education = {
  degree: string;
  field: string;
  school: string;
  period: string;
};

export const education: Education[] = [
  {
    degree: "Bachelor of Engineering",
    field: "Electronics & Telecommunication Engineering",
    school: "University of Mumbai, India",
    period: "Aug 2018 — May 2022",
  },
];

export type ExperienceClient = { name: string; project: string; description: string };

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  impact: string[];
  stack: string[];
  clients?: ExperienceClient[];
};

export const experiences: Experience[] = [
  {
    company: "Rock Paper Scissors Studio",
    role: "Tech Lead & AI Product Engineer (Full-Stack)",
    period: "Oct 2025 — Present",
    location: "Mumbai, India",
    summary:
      "Leading full-stack delivery and AI-assisted engineering across multiple enterprise client projects in a fast-paced agency environment.",
    impact: [
      "Driving architecture decisions, code reviews and sprint planning — improving team delivery consistency by 15–20%.",
      "Built a Claude × Figma design-to-code pipeline that increased development productivity and efficiency by 25–30%.",
      "Collaborating with designers for pixel-perfect, high-performance UI, reducing UI rework by ~15%.",
      "Delivering multiple client projects with ~20–25% faster turnaround time.",
      "Translating business requirements into scalable solutions, cutting iteration cycles by ~15–18%.",
      "Mentoring teammates and maintaining code-quality standards, reducing production issues by ~15–20%.",
      "Owning frontend deployments end-to-end.",
    ],
    stack: ["Angular", "TypeScript", "React Native", "Tailwind CSS", "Git", "Claude", "Figma MCP"],
    clients: [
      {
        name: "Nuvama Wealth",
        project: "Nuvama RTA",
        description: "Web app for HNI (High Net-worth Individual) tracking.",
      },
      {
        name: "Bajaj",
        project: "Bajaj BGIL",
        description: "Web app to track insurance for agents and Relationship Managers.",
      },
      {
        name: "Bajaj",
        project: "Bajaj Insurcraft",
        description: "Web app for insurance tracking for customers.",
      },
      {
        name: "Bajaj",
        project: "Bajaj EKYC",
        description: "Web app for the eKYC process for customers.",
      },
    ],
  },
  {
    company: "Axis Bank, Airoli",
    role: "Deputy Manager (IT — Full-Stack Developer)",
    period: "Dec 2022 — Aug 2025",
    location: "Navi Mumbai, India",
    summary:
      "Led frontend and backend delivery on Axis Neo, the corporate banking platform — across Payments (Maker/Checker), Payvantage, GIFT City and NCRP fraud systems.",
    impact: [
      "Improved UI interaction and workflow efficiency by 12–33% across key modules.",
      "Led scalable backend development (NestJS) and API integrations, improving performance by up to 36%.",
      "Managed cross-functional teams and aligned with stakeholders from requirements to delivery.",
      "Collaborated with product, design and business teams to refine user flows and system efficiency.",
      "Drove automation-testing initiatives, optimizing CI/CD (Jenkins) and improving testing efficiency by 18%.",
    ],
    stack: ["React", "NestJS", "TypeScript", "JavaScript", "Jenkins", "CI/CD"],
    clients: [
      {
        name: "Axis Bank",
        project: "Axis Neo — Corporate Banking Platform",
        description:
          "Payments (Maker/Checker), Payvantage, GIFT City and NCRP fraud systems.",
      },
    ],
  },
];

export type Project = {
  title: string;
  category: string;
  client?: string;
  year: string;
  tagline: string;
  problem: string;
  solution: string;
  impact: string;
  stack: string[];
  accent: [string, string];
  github?: string;
  demo?: string;
  confidential?: boolean;
};

export const projectCategories = [
  "All",
  "Fintech",
  "AI & Automation",
  "Full-Stack",
  "Machine Learning",
] as const;

export const projects: Project[] = [
  {
    title: "Nuvama RTA",
    category: "Fintech",
    client: "Nuvama Wealth",
    year: "2025",
    tagline: "HNI tracking platform for a leading wealth manager.",
    problem:
      "Relationship teams needed a fast, reliable way to track High Net-worth Individual portfolios and activity.",
    solution:
      "A responsive web app with high-performance, pixel-perfect UI built in a tight design-engineering loop, deployed from the frontend.",
    impact: "Faster turnaround and reduced UI rework in a fast-paced agency delivery.",
    stack: ["Angular", "TypeScript", "Tailwind CSS"],
    accent: ["#4f46e5", "#38bdf8"],
    confidential: true,
  },
  {
    title: "Bajaj BGIL",
    category: "Fintech",
    client: "Bajaj",
    year: "2025",
    tagline: "Insurance tracking for agents & Relationship Managers.",
    problem:
      "Agents and RMs lacked a unified view to track insurance across their book of business.",
    solution:
      "A web application streamlining insurance tracking workflows for agents and Relationship Managers.",
    impact: "Improved workflow efficiency for distribution teams.",
    stack: ["Angular", "TypeScript", "Tailwind CSS"],
    accent: ["#3b82f6", "#6366f1"],
    confidential: true,
  },
  {
    title: "Bajaj Insurcraft",
    category: "Fintech",
    client: "Bajaj",
    year: "2025",
    tagline: "Customer-facing insurance tracking.",
    problem: "Customers needed transparency into their insurance status and details.",
    solution:
      "A clean, customer-facing web app for self-serve insurance tracking.",
    impact: "Reduced support load via self-service visibility.",
    stack: ["Angular", "TypeScript", "Tailwind CSS"],
    accent: ["#6366f1", "#38bdf8"],
    confidential: true,
  },
  {
    title: "Bajaj EKYC",
    category: "Fintech",
    client: "Bajaj",
    year: "2025",
    tagline: "Frictionless customer eKYC journey.",
    problem: "Customer onboarding required a fast, compliant digital KYC flow.",
    solution:
      "A guided eKYC web experience optimizing the customer onboarding process.",
    impact: "Smoother onboarding with fewer drop-offs.",
    stack: ["Angular", "TypeScript", "Tailwind CSS"],
    accent: ["#4f46e5", "#3b82f6"],
    confidential: true,
  },
  {
    title: "Axis Neo",
    category: "Fintech",
    client: "Axis Bank",
    year: "2024",
    tagline: "Enterprise corporate banking platform.",
    problem:
      "Corporate banking needed scalable, reliable modules for payments, fraud and cross-border flows.",
    solution:
      "Led frontend and backend delivery across Payments (Maker/Checker), Payvantage, GIFT City and NCRP fraud systems, with NestJS APIs and Jenkins CI/CD.",
    impact:
      "UI/workflow efficiency up 12–33%, backend performance up to 36%, testing efficiency up 18%.",
    stack: ["React", "NestJS", "TypeScript", "Jenkins"],
    accent: ["#1e3a8a", "#4f46e5"],
    confidential: true,
  },
  {
    title: "Claude × Figma Pipeline",
    category: "AI & Automation",
    year: "2025",
    tagline: "Design-to-code automation that ships faster.",
    problem:
      "Translating Figma designs to production code was slow and repetitive across client projects.",
    solution:
      "Built an AI pipeline integrating Claude with Figma (MCP) to automate design-to-code and accelerate delivery.",
    impact: "Increased development productivity and efficiency by 25–30%.",
    stack: ["Claude", "Figma MCP", "TypeScript", "Automation"],
    accent: ["#38bdf8", "#818cf8"],
  },
  {
    title: "Employee Management System",
    category: "Full-Stack",
    year: "2023",
    tagline: "Role-based full-stack EMS with microservices.",
    problem:
      "Organizations needed secure, role-based management of employee records.",
    solution:
      "A full-stack app with user and admin roles: secure registration, full CRUD for admins, a Spring Boot microservices backend and a responsive React frontend.",
    impact: "Clean separation of roles with a scalable microservices backend.",
    stack: ["Java", "Spring Boot", "React", "MySQL"],
    accent: ["#4338ca", "#3b82f6"],
    github: "https://github.com/shikhar-rsp",
  },
  {
    title: "Bulk Payment Processing System",
    category: "Full-Stack",
    year: "2023",
    tagline: "Configurable bulk payments for retail customers.",
    problem:
      "Processing bulk payments required flexible handling of varied input file formats.",
    solution:
      "A system accepting configurable CSV/XLSX inputs with a Template Module to define and manage expected field ordering, backed by Java and a React frontend.",
    impact: "Reliable bulk processing with user-defined templates.",
    stack: ["Java", "React", "JavaScript", "MySQL"],
    accent: ["#3b82f6", "#38bdf8"],
    github: "https://github.com/shikhar-rsp",
  },
  {
    title: "Green Corridor — Adaptive Traffic ML",
    category: "Machine Learning",
    year: "2022",
    tagline: "Real-time traffic regulation & emergency green corridors.",
    problem:
      "Emergency vehicles lose critical time in congested, statically-timed traffic.",
    solution:
      "An ML + image-processing system that adapts signals in real time and creates green corridors, using YOLOv4 object detection and a Python data/ML stack.",
    impact:
      "Selected by CIIA (Institution's Innovation Council, MHRD, Govt. of India) as an innovation model.",
    stack: ["Python", "YOLOv4", "OpenCV", "scikit-learn", "NumPy"],
    accent: ["#22d3ee", "#4f46e5"],
    github: "https://github.com/shikhar-rsp",
  },
];

export type SkillCategory = {
  name: string;
  icon: string;
  skills: { name: string; level: number }[]; // level 0-100
};

export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    icon: "✦",
    skills: [
      { name: "React / ReactJS", level: 94 },
      { name: "JavaScript", level: 95 },
      { name: "TypeScript", level: 92 },
      { name: "Angular", level: 85 },
      { name: "Tailwind CSS / CSS", level: 93 },
    ],
  },
  {
    name: "Backend",
    icon: "◆",
    skills: [
      { name: "Node.js", level: 88 },
      { name: "NestJS", level: 86 },
      { name: "Java", level: 84 },
      { name: "Spring Boot", level: 80 },
      { name: "MySQL", level: 85 },
    ],
  },
  {
    name: "Mobile",
    icon: "▲",
    skills: [
      { name: "React Native", level: 82 },
      { name: "Responsive UI", level: 92 },
    ],
  },
  {
    name: "AI & Automation",
    icon: "✶",
    skills: [
      { name: "Claude", level: 92 },
      { name: "Figma MCP pipelines", level: 88 },
      { name: "GitHub Copilot / Codex", level: 88 },
      { name: "Cursor", level: 90 },
      { name: "LLM workflow design", level: 85 },
    ],
  },
  {
    name: "Cloud & DevOps",
    icon: "❖",
    skills: [
      { name: "AWS", level: 80 },
      { name: "Kubernetes", level: 75 },
      { name: "Jenkins / CI-CD", level: 85 },
      { name: "Git", level: 92 },
      { name: "Bash / Linux", level: 82 },
    ],
  },
  {
    name: "Data & Analytics",
    icon: "❮❯",
    skills: [
      { name: "Power BI", level: 80 },
      { name: "Tableau", level: 78 },
      { name: "Excel", level: 85 },
      { name: "Python (ML / CV)", level: 80 },
    ],
  },
];

// Flat list for the orbiting "Tech Universe" constellation.
export const techUniverse = [
  "JavaScript",
  "TypeScript",
  "React",
  "Angular",
  "React Native",
  "Node.js",
  "NestJS",
  "Java",
  "Spring Boot",
  "MySQL",
  "Tailwind",
  "Jenkins",
  "Kubernetes",
  "AWS",
  "Git",
  "Linux",
  "Claude",
  "Cursor",
  "Figma MCP",
  "Python",
] as const;

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

/* NOTE: Replace these with real LinkedIn recommendations / quotes.
 * They are written generically (role-based, no invented names) so the
 * section looks complete until you paste in genuine endorsements. */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Combines strong full-stack engineering with real ownership — drove architecture, reviews and delivery while keeping the team aligned and shipping.",
    name: "Engineering Manager",
    role: "Axis Bank (placeholder — replace with a real quote)",
  },
  {
    quote:
      "Brings AI-assisted workflows that genuinely speed up delivery, and partners closely with design to keep the UI pixel-perfect.",
    name: "Design Lead",
    role: "Rock Paper Scissors Studio (placeholder)",
  },
  {
    quote:
      "Reliable under pressure, clear with stakeholders, and consistently translates business needs into scalable technical solutions.",
    name: "Product Stakeholder",
    role: "Enterprise client (placeholder)",
  },
];

export type Achievement = {
  type: "Certification" | "Award" | "Speaking" | "Open Source";
  title: string;
  org: string;
  year: string;
};

export const achievements: Achievement[] = [
  {
    type: "Award",
    title: "Prompt Wars — 98.93/100 AI evaluation score (top-ranked build)",
    org: "Hack2skill × Google for Developers",
    year: "2026",
  },
  {
    type: "Award",
    title: "Green Corridor selected as an Innovation Model",
    org: "CIIA — Institution's Innovation Council, MHRD, Govt. of India",
    year: "2022",
  },
  {
    type: "Certification",
    title: "Full Stack Development",
    org: "Manipal Global Skills Academy",
    year: "—",
  },
  {
    type: "Certification",
    title: "DevOps Beginners to Advanced with Projects",
    org: "Udemy",
    year: "—",
  },
  {
    type: "Certification",
    title: "Deep Learning and Computer Vision A-Z",
    org: "Udemy",
    year: "—",
  },
  {
    type: "Certification",
    title: "Artificial Intelligence A-Z 2024: Build 7 AI + LLM & ChatGPT",
    org: "Udemy",
    year: "2024",
  },
  {
    type: "Open Source",
    title: "Projects & contributions on GitHub",
    org: "github.com/shikhar-rsp",
    year: "Ongoing",
  },
];

// Mission-based navigation. `label` is the concise nav chip; `title` is the
// full "Leadership Journey" name used in section headings + command palette.
export const navLinks = [
  { label: "Mission", title: "Mission Briefing", href: "#about" },
  { label: "Journey", title: "Leadership Journey", href: "#experience" },
  { label: "Products", title: "Products Built", href: "#projects" },
  { label: "Expertise", title: "Engineering Expertise", href: "#skills" },
  { label: "Architecture", title: "Architecture Lab", href: "#architecture" },
  { label: "Connect", title: "Let's Build Together", href: "#contact" },
] as const;

/* ---------------------------------------------------------------------
 *  Hero impact metrics (leadership framing)
 * ------------------------------------------------------------------- */
export const heroMetrics = [
  { value: "3.6+", label: "Years Experience" },
  { value: "Tech Lead", label: "Current Role" },
  { value: "9+", label: "Products Shipped" },
  { value: "AI", label: "Pipelines Built" },
] as const;

/* ---------------------------------------------------------------------
 *  Leadership ladder — career progression (Developer → Future CTO)
 * ------------------------------------------------------------------- */
export type LadderStage = {
  level: string;
  title: string;
  period: string;
  focus: string;
  responsibilities: string[];
  impact: string[];
  lesson: string;
  current?: boolean;
  future?: boolean;
};

export const careerLadder: LadderStage[] = [
  {
    level: "01",
    title: "Developer",
    period: "2022",
    focus: "Foundations — shipping real features in production.",
    responsibilities: [
      "Built responsive UIs and core CRUD services.",
      "Learned production discipline: testing, reviews, releases.",
    ],
    impact: ["Delivered first full-stack apps end-to-end (Java, React, MySQL)."],
    lesson: "Quality is a habit, not a phase — it compounds.",
  },
  {
    level: "02",
    title: "Full-Stack Engineer",
    period: "2022 — 2025",
    focus: "Owning high-impact modules on an enterprise banking platform.",
    responsibilities: [
      "Led frontend + backend delivery across Payments, Payvantage, GIFT City & NCRP.",
      "Built scalable NestJS APIs and integrations; drove CI/CD on Jenkins.",
    ],
    impact: [
      "Backend performance up to +36%; UI/workflow efficiency +12–33%.",
      "Testing efficiency +18% via automation.",
    ],
    lesson: "At scale, the architecture is the product. Design for change.",
  },
  {
    level: "03",
    title: "Tech Lead",
    period: "2025 — Present",
    focus: "Leading delivery across multiple enterprise client products.",
    responsibilities: [
      "Drive architecture decisions, code reviews and sprint planning.",
      "Mentor engineers and align stakeholders end-to-end.",
    ],
    impact: [
      "Team delivery consistency +15–20%; production issues −15–20%.",
      "Turnaround time −20–25% in a fast-paced agency.",
    ],
    lesson: "Leverage > output. Multiply the team, don't just ship more.",
    current: true,
  },
  {
    level: "04",
    title: "AI Product Engineer",
    period: "2025 — Present",
    focus: "Building AI-assisted engineering pipelines as a force multiplier.",
    responsibilities: [
      "Designed a Claude × Figma (MCP) design-to-code pipeline.",
      "Embedded AI workflows into day-to-day delivery.",
    ],
    impact: ["Development productivity & efficiency +25–30% across the team."],
    lesson: "AI shifts the bottleneck from typing to taste and judgment.",
    current: true,
  },
  {
    level: "05",
    title: "Future CTO",
    period: "Next",
    focus: "Scaling AI-native products and the teams that build them.",
    responsibilities: [
      "Set technical vision and engineering culture.",
      "Build high-performing, product-minded teams.",
    ],
    impact: ["Turning engineering excellence into durable business outcomes."],
    lesson: "Vision without execution is a hallucination — ship the future.",
    future: true,
  },
];

/* ---------------------------------------------------------------------
 *  Tech clusters — interactive Tech Universe (years / projects / impact)
 * ------------------------------------------------------------------- */
export type TechNode = {
  name: string;
  years: number;
  projects: number;
  impact: string;
};

export type TechCluster = {
  name: string;
  icon: string;
  nodes: TechNode[];
};

export const techClusters: TechCluster[] = [
  {
    name: "Frontend",
    icon: "✦",
    nodes: [
      { name: "React", years: 3, projects: 12, impact: "Core of most product UIs shipped." },
      { name: "TypeScript", years: 3, projects: 14, impact: "Type-safe delivery across the stack." },
      { name: "Angular", years: 1, projects: 4, impact: "Enterprise client apps at RPS." },
      { name: "Tailwind CSS", years: 3, projects: 12, impact: "Design-system-driven, pixel-perfect UI." },
    ],
  },
  {
    name: "Backend",
    icon: "◆",
    nodes: [
      { name: "Node.js", years: 3, projects: 10, impact: "APIs and services for web platforms." },
      { name: "NestJS", years: 2, projects: 5, impact: "Scalable banking APIs (+36% perf)." },
      { name: "Java / Spring Boot", years: 2, projects: 4, impact: "Microservices for full-stack apps." },
      { name: "MySQL", years: 3, projects: 9, impact: "Transactional data for fintech systems." },
    ],
  },
  {
    name: "Cloud",
    icon: "❖",
    nodes: [
      { name: "AWS", years: 2, projects: 5, impact: "Hosting & services for production apps." },
      { name: "Linux", years: 3, projects: 8, impact: "Runtime + scripting for deployments." },
    ],
  },
  {
    name: "AI",
    icon: "✶",
    nodes: [
      { name: "Claude", years: 1, projects: 6, impact: "Core of the design-to-code pipeline." },
      { name: "Figma MCP", years: 1, projects: 4, impact: "Automated design-to-code (+25–30%)." },
      { name: "Cursor / Copilot", years: 2, projects: 10, impact: "AI-assisted everyday delivery." },
      { name: "Python (ML/CV)", years: 2, projects: 3, impact: "YOLOv4 traffic ML (CIIA award)." },
    ],
  },
  {
    name: "DevOps",
    icon: "▲",
    nodes: [
      { name: "Jenkins / CI-CD", years: 2, projects: 6, impact: "Automated pipelines (+18% testing)." },
      { name: "Kubernetes", years: 1, projects: 2, impact: "Containerized service orchestration." },
      { name: "Git", years: 3, projects: 14, impact: "Trunk-based, review-driven workflow." },
    ],
  },
  {
    name: "Leadership",
    icon: "✷",
    nodes: [
      { name: "Tech Leadership", years: 1, projects: 4, impact: "+15–20% team delivery consistency." },
      { name: "Mentoring", years: 2, projects: 6, impact: "−15–20% production issues." },
      { name: "Stakeholder Mgmt", years: 2, projects: 8, impact: "Aligned business ↔ engineering." },
      { name: "Agile / Scrum", years: 3, projects: 12, impact: "Predictable, fast delivery cadence." },
    ],
  },
];

/* ---------------------------------------------------------------------
 *  Architecture Lab — system designs & technical decisions
 * ------------------------------------------------------------------- */
export type ArchNode = { id: string; label: string; detail: string };

export type ArchCase = {
  id: string;
  title: string;
  domain: string;
  context: string;
  scale: string;
  nodes: ArchNode[];
  decisions: string[];
  tradeoffs: string[];
};

export const architecture: ArchCase[] = [
  {
    id: "banking",
    title: "Corporate Banking Payments",
    domain: "Fintech · Axis Neo",
    context:
      "High-stakes corporate payments needing strict controls, auditability and reliability across multiple modules.",
    scale: "Enterprise · maker/checker controls · up to +36% backend perf",
    nodes: [
      { id: "client", label: "Web Client", detail: "React UI for Maker/Checker, Payvantage & GIFT City flows." },
      { id: "gateway", label: "API Gateway", detail: "Auth, routing and rate control for all module traffic." },
      { id: "service", label: "NestJS Services", detail: "Modular payment services with validation & idempotency." },
      { id: "core", label: "Core Banking", detail: "Integrations to downstream banking & settlement systems." },
      { id: "audit", label: "Audit & Fraud (NCRP)", detail: "Immutable trails + fraud checks for compliance." },
    ],
    decisions: [
      "Maker/Checker as a first-class workflow primitive, not an afterthought.",
      "Modular NestJS services for independent scaling and ownership.",
      "Idempotent APIs to make retries safe under network failure.",
    ],
    tradeoffs: [
      "Stronger controls add latency — mitigated with async validation.",
      "Module isolation increases ops surface but improves blast-radius control.",
    ],
  },
  {
    id: "wealth",
    title: "Wealth & Insurance Platforms",
    domain: "Fintech · Nuvama & Bajaj",
    context:
      "Multiple client-facing web apps (HNI tracking, insurance for agents/RMs/customers, eKYC) delivered fast without sacrificing polish.",
    scale: "Multi-client · shared design system · −20–25% turnaround",
    nodes: [
      { id: "ds", label: "Design System", detail: "Shared, type-safe components for pixel-perfect UI." },
      { id: "apps", label: "Angular Apps", detail: "RTA, BGIL, Insurcraft & EKYC built on one foundation." },
      { id: "api", label: "Service Layer", detail: "Domain APIs for portfolios, policies and KYC." },
      { id: "deploy", label: "Frontend Deploy", detail: "Owned release pipeline from the frontend." },
    ],
    decisions: [
      "One design system across apps to cut rework (~15%) and keep consistency.",
      "Composable feature modules so new client apps spin up fast.",
    ],
    tradeoffs: [
      "Shared system needs governance — worth it for velocity at scale.",
      "Per-client customization balanced against a common core.",
    ],
  },
  {
    id: "ai-pipeline",
    title: "AI Design-to-Code Pipeline",
    domain: "AI · Claude × Figma MCP",
    context:
      "Translating Figma designs into production code was slow and repetitive — so the workflow itself became the product.",
    scale: "Team-wide · +25–30% productivity",
    nodes: [
      { id: "figma", label: "Figma (MCP)", detail: "Designs exposed to tools via the Figma MCP server." },
      { id: "claude", label: "Claude", detail: "Reasons over design context to generate componentized code." },
      { id: "gen", label: "Codegen", detail: "Type-safe components matching the design system." },
      { id: "review", label: "Human Review", detail: "Engineer-in-the-loop for taste, correctness & polish." },
    ],
    decisions: [
      "Keep a human in the loop — AI accelerates, engineers decide.",
      "Generate against the design system, not freeform markup.",
    ],
    tradeoffs: [
      "Pipeline upkeep vs. raw speed — pays off across many screens.",
      "Model output needs guardrails; review stage is non-negotiable.",
    ],
  },
];

/* ---------------------------------------------------------------------
 *  Future Vision
 * ------------------------------------------------------------------- */
export const futureVision = {
  statement:
    "I'm building toward a CTO seat — where engineering excellence, AI leverage and product taste compound into outcomes that move the business.",
  pillars: [
    {
      title: "AI-Native Products",
      body: "Ship products with AI at the core, not bolted on — pipelines, copilots and automation that change the economics of building.",
    },
    {
      title: "High-Performing Teams",
      body: "Grow engineers, set a high bar, and build a culture where great people do their best work.",
    },
    {
      title: "Architecture for Scale",
      body: "Design systems that stay fast, reliable and simple as they grow by orders of magnitude.",
    },
    {
      title: "Business-Aligned Engineering",
      body: "Translate vision into roadmaps and roadmaps into measurable, durable impact.",
    },
  ],
} as const;

/* ---------------------------------------------------------------------
 *  Gamification — sections to track + discovery badges
 * ------------------------------------------------------------------- */
// Ordered list of section ids that count toward exploration progress.
export const journeySections = [
  { id: "about", title: "Mission Briefing" },
  { id: "experience", title: "Leadership Journey" },
  { id: "projects", title: "Products Built" },
  { id: "skills", title: "Engineering Expertise" },
  { id: "architecture", title: "Architecture Lab" },
  { id: "achievements", title: "Achievements" },
  { id: "future", title: "Future Vision" },
  { id: "contact", title: "Let's Build Together" },
] as const;

export type Badge = {
  id: string;
  label: string;
  icon: string; // lucide icon name
  // section id that unlocks it; "*" means "all sections explored"
  section: string;
  hint: string;
};

export const badges: Badge[] = [
  { id: "leadership", label: "Leadership Journey", icon: "Compass", section: "experience", hint: "Explore the leadership journey" },
  { id: "product", label: "Product Explorer", icon: "Boxes", section: "projects", hint: "Review the products built" },
  { id: "fullstack", label: "Full-Stack Expert", icon: "Layers", section: "skills", hint: "Open engineering expertise" },
  { id: "architect", label: "Architecture Enthusiast", icon: "Network", section: "architecture", hint: "Step into the architecture lab" },
  { id: "ai", label: "AI Innovator", icon: "Sparkles", section: "future", hint: "Read the future vision" },
  { id: "explorer", label: "Portfolio Explorer", icon: "Trophy", section: "*", hint: "Explore the entire journey" },
];

