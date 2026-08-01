"use client";

/* Command bar — ⌘K (PRD R9).
 *
 * One input reaches every surface, case file, decision and external profile.
 * Fully keyboard-operable, and reachable by tap on touch devices where no
 * keyboard exists.
 */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { caseFiles, journal, modes, surfaceMeta, type ModeId, type SurfaceId } from "@/data/os";
import { profile } from "@/data/portfolio";
import { useOs } from "./OsContext";

type Item = {
  id: string;
  label: string;
  group: string;
  hint?: string;
  run: () => void;
};

export function CommandBar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setMode, order } = useOs();
  const reduce = useReducedMotion();

  const go = (id: SurfaceId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    setOpen(false);
  };

  const items = useMemo<Item[]>(() => {
    const out: Item[] = [];
    for (const id of order) {
      out.push({
        id: `s:${id}`,
        label: surfaceMeta[id].title,
        group: "Surfaces",
        hint: surfaceMeta[id].index,
        run: () => go(id),
      });
    }
    for (const c of caseFiles) {
      out.push({
        id: `c:${c.id}`,
        label: c.title,
        group: "Case files",
        hint: c.classification,
        run: () => go("cases"),
      });
    }
    for (const d of journal) {
      out.push({ id: `d:${d.tech}`, label: d.question, group: "Decisions", hint: d.tech, run: () => go("journal") });
    }
    for (const m of modes) {
      out.push({
        id: `m:${m.id}`,
        label: `Re-sort for ${m.label}`,
        group: "Lens",
        hint: "mode",
        run: () => {
          setMode(m.id as ModeId);
          setOpen(false);
          window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        },
      });
    }
    for (const s of profile.socials) {
      out.push({
        id: `l:${s.label}`,
        label: s.label,
        group: "Elsewhere",
        hint: s.handle,
        run: () => {
          window.open(s.href, "_blank", "noopener,noreferrer");
          setOpen(false);
        },
      });
    }
    out.push({
      id: "l:resume",
      label: "Résumé",
      group: "Elsewhere",
      hint: "PDF",
      run: () => {
        window.open(profile.resumeUrl, "_blank", "noopener,noreferrer");
        setOpen(false);
      },
    });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, setMode, reduce]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(needle) ||
        i.group.toLowerCase().includes(needle) ||
        (i.hint ?? "").toLowerCase().includes(needle),
    );
  }, [items, q]);

  useEffect(() => setCursor(0), [q]);

  // ⌘K / Ctrl-K toggles; Escape always exits.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 20);
    else setQ("");
  }, [open]);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[cursor]?.run();
    }
  };

  return (
    <>
      {/* Touch-reachable trigger — ⌘K is not discoverable without a keyboard. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 border border-line/15 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-faint transition-colors hover:border-accent/40 hover:text-accent-soft focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
      >
        Search <kbd className="not-italic text-muted">⌘K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-bg/80 p-4 pt-[12vh] backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Search the OS"
              initial={reduce ? false : { opacity: 0, y: -8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, y: -8, scale: 0.99 }}
              transition={{ duration: 0.2, ease: [0.2, 0.7, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl border border-line/15 bg-elevated shadow-2xl"
            >
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onListKey}
                placeholder="Search surfaces, case files, decisions…"
                aria-label="Search"
                className="w-full border-b border-line/10 bg-transparent px-5 py-4 text-sm text-ink outline-none placeholder:text-faint"
              />
              <ul className="max-h-[50vh] overflow-y-auto py-2">
                {results.length === 0 && (
                  <li className="px-5 py-6 text-sm text-muted">
                    Nothing matches “{q}”. Try a surface name, a client, or a technology.
                  </li>
                )}
                {results.map((r, i) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setCursor(i)}
                      onClick={r.run}
                      className={`flex w-full items-center justify-between gap-4 px-5 py-2.5 text-left text-sm transition-colors ${
                        i === cursor ? "bg-surface text-ink" : "text-muted hover:bg-surface/60"
                      }`}
                    >
                      <span className="truncate">{r.label}</span>
                      <span className="flex shrink-0 items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
                        {r.hint && <span>{r.hint}</span>}
                        <span className="text-accent/70">{r.group}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
