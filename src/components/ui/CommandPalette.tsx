"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks, profile } from "@/data/portfolio";
import { scrollToSection } from "@/components/providers/SmoothScrollProvider";
import { useTheme } from "@/components/providers/ThemeProvider";

type Command = {
  id: string;
  label: string;
  hint?: string;
  group: "Navigate" | "Actions" | "Connect";
  icon: string;
  run: () => void;
};

/**
 * A ⌘K / Ctrl-K command palette for instant navigation and actions — a
 * detail rarely found on portfolios. Fully keyboard-driven (↑ ↓ Enter Esc),
 * searchable, and accessible. Also opens with "/".
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme, toggle } = useTheme();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = [
      {
        id: "home",
        label: "Go to Top",
        group: "Navigate",
        icon: "↑",
        run: () => scrollToSection("#top"),
      },
      ...navLinks.map((l) => ({
        id: l.href,
        label: `Go to ${l.label}`,
        group: "Navigate" as const,
        icon: "→",
        run: () => scrollToSection(l.href),
      })),
    ];

    const actions: Command[] = [
      {
        id: "theme",
        label: `Switch to ${theme === "dark" ? "Light" : "Dark"} mode`,
        group: "Actions",
        icon: theme === "dark" ? "☀" : "☾",
        run: toggle,
      },
      {
        id: "resume",
        label: "Download Résumé",
        hint: "PDF",
        group: "Actions",
        icon: "⤓",
        run: () => window.open(profile.resumeUrl, "_blank"),
      },
      {
        id: "copy-email",
        label: "Copy email address",
        hint: profile.email,
        group: "Actions",
        icon: "⎘",
        run: () => {
          navigator.clipboard?.writeText(profile.email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        },
      },
    ];

    const connect: Command[] = profile.socials.map((s) => ({
      id: s.label,
      label: `Open ${s.label}`,
      hint: s.handle,
      group: "Connect" as const,
      icon: "↗",
      run: () => window.open(s.href, s.href.startsWith("http") ? "_blank" : "_self"),
    }));

    return [...nav, ...actions, ...connect];
  }, [theme, toggle]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.hint?.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q),
    );
  }, [query, commands]);

  // global open/close shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";
      if (!open && e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      }
      if (open && e.key === "Escape") close();
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpenEvent);
    };
  }, [open, close]);

  // focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 40);
  }, [open]);

  // keep active index in range
  useEffect(() => {
    setActive((a) => Math.min(a, Math.max(0, filtered.length - 1)));
  }, [filtered.length]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[active];
      if (cmd) {
        cmd.run();
        if (cmd.id !== "copy-email" && cmd.id !== "theme") close();
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9000] flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={close}
        >
          <div className="absolute inset-0 bg-bg/70 backdrop-blur-md" />
          <motion.div
            role="dialog"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl overflow-hidden rounded-3xl glass-strong shadow-glow-lg"
          >
            <div className="flex items-center gap-3 border-b border-line/10 px-5 py-4">
              <span className="text-muted">⌘</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Type a command or search…"
                className="w-full bg-transparent text-ink outline-none placeholder:text-faint"
              />
              <kbd className="rounded-md border border-line/15 px-1.5 py-0.5 text-[10px] text-faint">
                ESC
              </kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2 no-scrollbar">
              {filtered.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-muted">
                  No matching commands.
                </p>
              )}
              {(["Navigate", "Actions", "Connect"] as const).map((group) => {
                const items = filtered.filter((c) => c.group === group);
                if (!items.length) return null;
                return (
                  <div key={group} className="mb-1">
                    <p className="px-3 pb-1 pt-2 text-[10px] font-medium uppercase tracking-wider text-faint">
                      {group}
                    </p>
                    {items.map((cmd) => {
                      const idx = filtered.indexOf(cmd);
                      const isActive = idx === active;
                      return (
                        <button
                          key={cmd.id}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => {
                            cmd.run();
                            if (cmd.id !== "copy-email" && cmd.id !== "theme") close();
                          }}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                            isActive ? "bg-accent/15 text-ink" : "text-muted"
                          }`}
                        >
                          <span
                            className={`grid h-7 w-7 place-items-center rounded-lg text-xs ${
                              isActive ? "bg-accent/20 text-accent-soft" : "bg-line/[0.05]"
                            }`}
                          >
                            {cmd.icon}
                          </span>
                          <span className="flex-1">
                            {cmd.id === "copy-email" && copied
                              ? "Copied!"
                              : cmd.label}
                          </span>
                          {cmd.hint && (
                            <span className="truncate text-xs text-faint">
                              {cmd.hint}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
