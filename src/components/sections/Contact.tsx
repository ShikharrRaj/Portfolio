"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";
import { LiveClock } from "@/components/ui/LiveClock";

type Status = "idle" | "sending" | "sent";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Placeholder: wire this to your API route / email service.
    // For now we open the user's mail client with a prefilled message.
    setTimeout(() => {
      setStatus("sent");
      const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`);
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    }, 900);
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-36">
      {/* interactive map/globe-style backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-grid-fade bg-[size:40px_40px] opacity-[0.12] [mask-image:radial-gradient(circle,black,transparent_70%)]" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/[0.06]"
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="container-page">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* left: invitation */}
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Let's build something exceptional."
              description="Have a role, a project, or just an idea? My inbox is always open."
            />

            <Reveal delay={0.1} className="mt-8">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-3 rounded-full glass px-5 py-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
                  </span>
                  <span className="text-sm font-medium text-ink">{profile.availability}</span>
                </div>
                <LiveClock className="rounded-full glass px-5 py-3 text-sm text-ink" />
              </div>
            </Reveal>

            <div className="mt-8 space-y-3">
              {profile.socials.map((s, i) => (
                <Reveal key={s.label} delay={0.15 + i * 0.06}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    data-cursor="Open"
                    className="group flex items-center justify-between rounded-2xl glass px-5 py-4 transition-all hover:border-accent/30 hover:shadow-glow"
                  >
                    <span className="font-medium text-ink">{s.label}</span>
                    <span className="flex items-center gap-2 text-sm text-muted transition-colors group-hover:text-accent-soft">
                      {s.handle}
                      <span className="transition-transform group-hover:translate-x-1">↗</span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          {/* right: futuristic form */}
          <Reveal direction="left" delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="rounded-4xl glass-strong p-8 md:p-10"
            >
              <div className="space-y-5">
                <Field label="Name">
                  <input
                    required
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Ada Lovelace"
                    className="peer w-full bg-transparent text-ink outline-none placeholder:text-faint"
                  />
                </Field>
                <Field label="Email">
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="ada@example.com"
                    className="w-full bg-transparent text-ink outline-none placeholder:text-faint"
                  />
                </Field>
                <Field label="Message">
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Tell me about the opportunity…"
                    className="w-full resize-none bg-transparent text-ink outline-none placeholder:text-faint"
                  />
                </Field>
              </div>

              <div className="mt-8">
                <MagneticButton
                  variant="primary"
                  cursorLabel="Send"
                  className="w-full justify-center"
                >
                  {status === "idle" && "Send Message"}
                  {status === "sending" && "Sending…"}
                  {status === "sent" && "Opening mail ✓"}
                </MagneticButton>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Floating-label glass field wrapper. */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block rounded-2xl border border-line/10 bg-line/[0.03] px-4 py-3 transition-colors focus-within:border-accent/40">
      <span className="mb-1 block text-xs uppercase tracking-wider text-faint">
        {label}
      </span>
      {children}
    </label>
  );
}
