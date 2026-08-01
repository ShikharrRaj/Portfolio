# Raw request — CEO brief, 2026-08-01

> Verbatim source for `PRD.approved.md`. Unedited. Any interpretation lives in the PRD, not here.
> External input type: `ceo-request` (per `.claude/role-matrix.json` → `externalInputs`).

---

# Redesign my portfolio from scratch — create an interactive operating system, not a portfolio website

I want to completely restructure my portfolio. Do not iterate on the current UI. I want a radical redesign that feels like a **living product**, an **engineering operating system**, and a **conversation with the visitor**.

The portfolio should break the fourth wall. It should feel aware that someone is exploring me. The interface should react to curiosity, hesitation, scrolling patterns, clicks, and exploration. The goal is not to impress with flashy animations; the goal is to create an experience that makes people remember me after closing the tab.

## The feeling I want

* Future CTO
* Product-minded engineer
* Technical leader
* Systems thinker
* Builder
* Someone who designs organizations and products, not just code
* Premium, cinematic, and intentional
* Memorable enough that recruiters and founders send it to other people

## Do NOT build

* A traditional portfolio
* A landing page
* A resume website
* An AI startup clone
* A cyberpunk or neon gaming UI
* Generic glassmorphism
* Purple/blue AI gradients
* Particle spheres
* Floating code snippets
* Overused developer portfolio patterns

## Build this instead

A **Personal Operating System**.

The visitor is not navigating sections; they are **investigating a person**.

The interface should feel somewhere between:

* Arc Browser
* Linear
* Apple
* Notion
* Interstellar HUDs
* Mission control software
* A beautifully designed engineering dashboard

## Core Concept

When the website loads, do NOT show a hero section.

Instead show a screen that says something like:

"Connection established."

"Initializing Shikhar OS…"

"Choose how you want to know me."

The visitor can choose a mode:

* Recruiter
* Founder
* CTO
* Engineer
* Investor
* Curious Human

Each mode subtly changes the interface and the order of information.

Example:

Recruiter sees impact, experience, and resume first.

CTO sees architecture, leadership, and decision making first.

Founder sees products, execution, and ownership first.

Engineer sees systems, code, tools, and technical depth first.

## Break the Fourth Wall

The website should acknowledge the visitor.

Examples:

* "You've spent 28 seconds here. Most people leave before they discover the architecture lab."
* "You skipped my projects. Bold move."
* "You seem interested in leadership. Let me show you the mistakes I made."
* "This section is usually opened by engineering managers."

These interactions must be subtle, intelligent, and never cringe.

## Replace Sections With Experiences

### Instead of About Me

Create **Mission Control**

A dynamic dashboard containing:

* Current role
* Current obsession
* What I'm building this week
* What I'm learning
* Energy level
* Coffee consumed
* Open to opportunities
* Latest shipped project

Make it feel alive.

### Instead of Experience

Create **Timeline of Decisions**

Every career step should be presented as a major engineering decision.

Example:

2022 — Entered Banking Tech

Decision: Learn large-scale systems before startups

Trade-off: Slower innovation, stronger fundamentals

Outcome: Built production financial systems

Continue this throughout my career.

### Instead of Skills

Create **Mental Models**

Do not list technologies.

Organize by how I think.

For example:

Build

Scale

Lead

Automate

Simplify

Ship

Each expands into technologies, projects, and real examples.

### Instead of Projects

Create **Case Files**

Each project opens like a confidential engineering document.

Structure:

* Problem
* Constraints
* Architecture
* Decisions
* What failed
* What worked
* Business impact
* What I would do differently today

Include interactive diagrams.

### Instead of Contact

Create **Start a Collaboration**

Ask questions first.

"What are we building?"

Then adapt the contact experience.

## Interactive Features

### Command Palette

Cmd + K opens everything.

Search projects, technologies, architecture, leadership, resume, GitHub, LinkedIn, and hidden pages.

### Interactive Terminal

Not a gimmick.

Useful commands:

about

projects

architecture

leadership

resume

contact

ai

systems

mistakes

books

### Architecture Lab

A dedicated interactive area where visitors explore systems I've designed.

Include animated architecture diagrams.

Allow components to be clicked.

Explain trade-offs.

### Decision Journal

A collection of real engineering decisions.

Examples:

Why Angular instead of React?

Why monolith before microservices?

Why Docker?

Why Supabase?

Why Claude?

Why not Kubernetes?

Show the reasoning process.

### Failure Archive

One of the most memorable sections.

Document projects, bugs, leadership mistakes, architecture mistakes, and what I learned.

This builds credibility.

### AI Reflection Mode

A built-in AI assistant that only knows me.

People can ask:

"How does Shikhar lead teams?"

"What is his strongest technical skill?"

"What kind of company would he thrive in?"

"What does he believe about AI?"

The AI should answer using my actual portfolio content.

## Microinteractions

Every interaction should feel handcrafted.

Examples:

* Magnetic buttons
* Context-aware cursor
* Dynamic breadcrumbs
* Scroll velocity effects
* Ambient lighting
* Panels that rearrange themselves
* Cards that reveal hidden layers
* Hover states that tell stories
* Subtle sound design (optional)

## Color Direction

Avoid AI colors.

Use a timeless executive palette.

Background: #0F1115

Surface: #1A1D24

Elevated Surface: #232833

Primary Text: #F8F7F4

Secondary Text: #9CA3AF

Muted: #6B7280

Primary Accent: #2F855A

Secondary Accent: #68D391

Warm Accent: #C08A5B

Use gradients very sparingly.

The interface should feel like precision software, not marketing.

## Typography

Use a combination of:

* A modern grotesk for UI
* A refined serif for storytelling moments
* Monospace for engineering content

Typography should carry emotion.

## Motion

Use Framer Motion, GSAP, and Lenis.

Animations should feel:

* cinematic
* intentional
* restrained
* premium

No excessive particles.

No random floating elements.

Every animation should communicate state.

## The Ending

The website should not end with "Contact Me."

It should end with a statement.

Something like:

"This portfolio is a snapshot.

The real product is what we could build together."

Then provide a simple way to start a conversation.

## Final Goal

Build a portfolio that feels like a product worthy of a CTO interview.

A portfolio that people explore for 5–10 minutes.

A portfolio that gets shared internally.

A portfolio that demonstrates how I think, make decisions, lead, and build systems—not just what technologies I know.

Challenge every conventional portfolio pattern.

Invent interactions that don't usually exist in portfolios.

Optimize for memorability, clarity, and leadership.

---

## Clarifications supplied by the CEO in the same session

Collected before PRD approval. Recorded as decisions D1, D4, D5 in `PRD.approved.md` §7.

| Question | CEO answer |
|---|---|
| Which codebase should the Personal OS be built on? | Rebuild directly on `main` |
| What is the AI Reflection Mode, technically? | Client-side retrieval, already built |
| How should the interface-reacts-to-you behaviour be scoped? | Full: modes + behavioural observations |
| Which branch should the work land on? | `4th--Wall`, not `main` (given after the above) |
