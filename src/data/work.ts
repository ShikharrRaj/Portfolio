/* =====================================================================
 *  WORK — the portfolio's content layer
 *  ---------------------------------------------------------------------
 *  Every claim below traces to src/data/portfolio.ts, which traces to the
 *  real record. Nothing here is invented.
 * ===================================================================== */

export type TimelineEntry = {
  year: string;
  title: string;
  decision: string;
  tradeoff: string;
  outcome: string;
};

export const timeline: TimelineEntry[] = [
  {
    year: "2022",
    title: "Entered banking technology first",
    decision:
      "Joined Axis Bank as Deputy Manager (IT) to learn large-scale, regulated systems before going near a startup.",
    tradeoff:
      "Slower innovation cycles and heavier process, deliberately accepted in exchange for fundamentals under real stakes.",
    outcome:
      "Shipped corporate banking modules where correctness and auditability are non-negotiable — Payments Maker/Checker, Payvantage, GIFT City, NCRP fraud.",
  },
  {
    year: "2023",
    title: "Crossed into the backend",
    decision:
      "Refused to stay a frontend specialist; took ownership of NestJS services and API integrations on Axis Neo.",
    tradeoff:
      "Gave up depth-in-one-thing for range, at the point where specialising would have been the easier career move.",
    outcome: "Backend performance improved by up to 36%; full-stack ownership of the platform.",
  },
  {
    year: "2024",
    title: "Automated the delivery path",
    decision:
      "Invested in automation testing and Jenkins CI/CD instead of shipping more features that quarter.",
    tradeoff:
      "Upfront pipeline cost paid from feature time — an unpopular trade in the moment.",
    outcome: "Testing efficiency up 18%; releases became routine rather than events.",
  },
  {
    year: "2025",
    title: "Left the bank for the agency floor",
    decision:
      "Moved to Rock Paper Scissors Studio as Tech Lead — from one large platform to many clients at speed.",
    tradeoff:
      "Traded institutional stability for delivery pressure across concurrent enterprise clients.",
    outcome:
      "Led delivery for Nuvama Wealth and Bajaj; team delivery consistency up 15–20%, turnaround 20–25% faster.",
  },
  {
    year: "2025",
    title: "Bet on AI as leverage, not replacement",
    decision:
      "Built a Claude × Figma MCP design-to-code pipeline rather than adopting AI tools ad hoc.",
    tradeoff:
      "Ongoing pipeline maintenance instead of one-off speed — only pays back across many screens.",
    outcome:
      "Development productivity up 25–30%, with engineers kept in the loop for correctness.",
  },
  {
    year: "Now",
    title: "Building toward engineering leadership",
    decision:
      "Moving deliberately from leading delivery to designing the organisation that delivers.",
    tradeoff:
      "Less time writing the hardest code personally; leverage measured through other people.",
    outcome: "In progress — this is the decision currently being made.",
  },
];

export type CaseFile = {
  id: string;
  title: string;
  client?: string;
  year: string;
  classification: "NDA" | "OPEN";
  tagline: string;
  problem: string;
  constraints: string;
  architecture: string;
  decision: string;
  /** Only where it is genuinely known — never invented to fill the shape. */
  failed?: string;
  worked?: string;
  impact: string;
  today?: string;
  stack: string[];
};

export const caseFiles: CaseFile[] = [
  {
    id: "axis-neo",
    title: "Axis Neo",
    client: "Axis Bank",
    year: "2022–2025",
    classification: "NDA",
    tagline: "Corporate banking platform — payments, cross-border and fraud.",
    problem:
      "Corporate banking needed scalable, reliable modules for payments, fraud and cross-border flows, where a wrong number is not a bug but an incident.",
    constraints:
      "Regulated environment. Correctness, auditability and reliability non-negotiable. Multiple concurrent modules, small team, continuous release pressure.",
    architecture:
      "Modular NestJS services mapped onto payment domains rather than technical layers. Idempotent APIs so retries are safe. Maker/checker modelled as a first-class primitive, not a UI convention. Jenkins CI/CD across every module.",
    decision:
      "Structure over speed. NestJS is heavier than a bare Express service, and that weight was the point — dependency injection and hard module boundaries let several people work on payment domains without colliding.",
    failed:
      "Pipeline investment was made later than it should have been. Releases were treated as events before they were treated as routine, and the cost of that showed up as manual verification time.",
    worked:
      "Domain-shaped module boundaries. When new requirements arrived, they landed inside an existing boundary instead of cutting across all of them.",
    impact:
      "Backend performance up to +36%. UI and workflow efficiency +12–33% across key modules. Testing efficiency +18%.",
    today:
      "Standardise the CI/CD pipelines as reusable templates from day one so every new service inherits them, rather than each module earning its pipeline separately.",
    stack: ["React", "NestJS", "TypeScript", "Jenkins", "CI/CD"],
  },
  {
    id: "claude-figma",
    title: "Claude × Figma Pipeline",
    year: "2025",
    classification: "OPEN",
    tagline: "Design-to-code automation across concurrent client projects.",
    problem:
      "Translating Figma designs into production code was the repetitive bottleneck across every client project — high volume, low judgment, expensive in engineer hours.",
    constraints:
      "Agency delivery pressure. Multiple clients in parallel. Output had to be production-grade, not a demo, and engineers had to stay accountable for what shipped.",
    architecture:
      "Claude integrated with Figma over MCP, automating the design-to-code path while holding engineers in the loop at the review boundary — the pipeline drafts, humans decide.",
    decision:
      "Automate the bottleneck, not the interesting part. The repetitive translation step was targeted deliberately; architecture and taste stayed human.",
    failed:
      "Pipeline maintenance is a real, ongoing cost. On a project with few screens it does not pay back — the economics only work across volume, which was not obvious at the start.",
    worked:
      "The 'AI accelerates, humans decide' boundary. Keeping review with engineers meant velocity rose without correctness falling.",
    impact: "Development productivity and efficiency up 25–30%.",
    today:
      "Extend the same pattern further across the SDLC rather than stopping at design-to-code — the boundary generalises better than the specific integration does.",
    stack: ["Claude", "Figma MCP", "TypeScript", "Automation"],
  },
  {
    id: "bajaj-bgil",
    title: "Bajaj BGIL",
    client: "Bajaj",
    year: "2025",
    classification: "NDA",
    tagline: "Insurance tracking for agents and relationship managers.",
    problem:
      "Agents and RMs had no unified view of insurance across their book of business, so tracking meant stitching together separate systems by hand.",
    constraints:
      "Enterprise insurance client, agency delivery timelines, and a distribution audience who live in the tool all day — so workflow speed mattered more than visual novelty.",
    architecture:
      "Angular application built around the daily workflow of a distribution team: a single unified view of the book, with the tracking actions that follow it reachable without leaving that view.",
    decision:
      "Optimised for the repeat user, not the first-time visitor. Distribution teams open this every morning, so density and speed beat onboarding polish.",
    impact: "Improved workflow efficiency for Bajaj's distribution teams.",
    stack: ["Angular", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "bajaj-insurcraft",
    title: "Bajaj Insurcraft",
    client: "Bajaj",
    year: "2025",
    classification: "NDA",
    tagline: "Customer-facing insurance tracking, self-serve.",
    problem:
      "Customers had no transparency into their own insurance status and details, which pushed routine questions into the support queue.",
    constraints:
      "Public-facing surface for a regulated insurer: it had to be clear enough for a first-time user with no product knowledge, and correct enough to be relied on.",
    architecture:
      "A deliberately plain self-serve web app — status and policy detail surfaced directly rather than buried behind navigation, so the common question answers itself.",
    decision:
      "Cut the interface back rather than add to it. Every element that did not answer 'what is the state of my policy' was removed.",
    impact: "Reduced support load by making the routine question self-serve.",
    stack: ["Angular", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "bajaj-ekyc",
    title: "Bajaj EKYC",
    client: "Bajaj",
    year: "2025",
    classification: "NDA",
    tagline: "Compliant digital onboarding, with fewer drop-offs.",
    problem:
      "Customer onboarding needed a digital KYC flow that was fast enough not to lose people, while staying compliant at every step.",
    constraints:
      "Regulatory requirements fix what must be captured and verified. The only variable left is how much friction each step costs — and every extra step loses customers.",
    architecture:
      "A guided step-by-step eKYC journey where each stage does one thing, state survives interruption, and the customer always knows what remains.",
    decision:
      "Treated drop-off as the primary metric rather than completion time. A flow that is fast but abandons people mid-way is worse than one that is patient and finishes.",
    impact: "Smoother customer onboarding with fewer drop-offs.",
    stack: ["Angular", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "dark-software-factory",
    title: "Dark Software Factory",
    year: "2026",
    classification: "OPEN",
    tagline: "An autonomous engineering org that ships software with minimal human input.",
    problem:
      "AI coding tools generate code but do not run an engineering organisation. Nobody owns the architecture decision, nobody rejects defective work back to its author, and nobody holds the release gate — so output scales while judgment does not.",
    constraints:
      "A 'dark factory' runs without the lights on: no human in the loop for routine steps. That only works if the boundaries are mechanical rather than advisory — an agent that can be persuaded to write outside its domain is not a boundary at all.",
    architecture:
      "22 specialist roles (Engineering Manager, Staff Architect, leads, and cross-cutting reviewers) over a 15-stage pipeline from PRD to release. Ownership lives in a machine-readable role matrix and is enforced by pre-tool-use hooks, not by prompt instructions — a role that tries to write outside its glob is blocked before the edit happens. 19 procedure skills, 205 numbered rules across 7 standards, and two linters that prove no role overlaps another and every consumed artefact has a producer.",
    decision:
      "Enforcement over instruction. Every earlier attempt asked agents nicely to respect boundaries; this one makes the boundary a precondition of the tool call. Roles also validate their own inputs and can reject defective work back to its owner rather than silently patching it downstream.",
    impact:
      "Runs an entire delivery pipeline — requirements, architecture, build, review, release — with the human acting as CEO rather than as an engineer.",
    stack: ["Claude Agent SDK", "TypeScript", "Node", "MCP", "Shell hooks"],
  },
  {
    id: "nuvama-rta",
    title: "Nuvama RTA",
    client: "Nuvama Wealth",
    year: "2025",
    classification: "NDA",
    tagline: "HNI portfolio tracking for a leading wealth manager.",
    problem:
      "Relationship teams needed a fast, reliable way to track High Net-worth Individual portfolios and activity, where latency directly costs client trust.",
    constraints:
      "Enterprise wealth client. Pixel-precision expectations from the design side, agency turnaround expectations from the delivery side, simultaneously.",
    architecture:
      "Responsive Angular application with a tight design-engineering loop and frontend deployment owned end-to-end by the engineering side.",
    decision:
      "Angular over React. For a large, long-lived app with multiple contributors and enterprise governance, opinionated structure and strong typing were worth more than iteration speed.",
    failed:
      "Early rounds still produced UI rework — the design-engineering loop was tightened reactively rather than being designed in from the first sprint.",
    worked:
      "Partnering with designers directly instead of receiving handoffs. Once the loop closed, rework dropped ~15%.",
    impact: "~20–25% faster turnaround; UI rework reduced by ~15%.",
    today:
      "Set up the design system and the review loop before the first screen, not after the first round of rework.",
    stack: ["Angular", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "green-corridor",
    title: "Green Corridor",
    year: "2022",
    classification: "OPEN",
    tagline: "Adaptive traffic regulation and emergency green corridors.",
    problem:
      "Emergency vehicles lose critical time in congested, statically-timed traffic — a scheduling problem with a human cost.",
    constraints:
      "Final-year project with no computer-vision curriculum behind it. Real-time inference on constrained hardware.",
    architecture:
      "YOLOv4 object detection over live traffic feeds, driving signal timing adaptively and clearing corridors on demand; Python data and ML stack.",
    decision:
      "Chose a genuinely hard, unfamiliar domain over a safe academic exercise — the point of the project was to learn something that was not being taught.",
    failed:
      "Real-time inference on unconstrained road footage was substantially harder than the controlled test cases implied. Detection quality degraded exactly where it mattered most.",
    worked:
      "The core insight — adapt signal timing to observed demand rather than to a fixed schedule — held up, and carried the project.",
    impact:
      "Selected by CIIA (Institution's Innovation Council, MHRD, Government of India) as an innovation model.",
    today:
      "Validate on messy real-world input before optimising the model. The gap between test footage and real roads was the whole problem.",
    stack: ["Python", "YOLOv4", "OpenCV", "scikit-learn", "NumPy"],
  },
];
