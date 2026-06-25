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
    accent: ["#f5b042", "#ff6b4a"],
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
    accent: ["#ff6b4a", "#ffd27a"],
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
    accent: ["#ffb347", "#ff5e62"],
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
    accent: ["#f59e42", "#ff6b4a"],
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
    accent: ["#ff6b4a", "#f5b042"],
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
    accent: ["#ffd27a", "#ff6b4a"],
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
    accent: ["#f5b042", "#e2574a"],
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
    accent: ["#ff6b4a", "#ffb347"],
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
    accent: ["#34d399", "#f5b042"],
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

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;
