import { PageShell } from "@/components/layout/PageShell";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { TechUniverse } from "@/components/sections/TechUniverse";
import { Architecture } from "@/components/sections/Architecture";
import { Testimonials } from "@/components/sections/Testimonials";
import { Achievements } from "@/components/sections/Achievements";
import { FutureVision } from "@/components/sections/FutureVision";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <PageShell>
      {/* 1. Mission Briefing → 8. Connect — the Leadership Journey */}
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <TechUniverse />
      <Architecture />
      <Testimonials />
      <Achievements />
      <FutureVision />
      <Contact />
      <Footer />
    </PageShell>
  );
}
