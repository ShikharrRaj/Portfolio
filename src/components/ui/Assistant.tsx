"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, ArrowUp } from "lucide-react";
import {
  assistantKB,
  assistantSuggestions,
  profile,
} from "@/data/portfolio";
import { cn } from "@/lib/utils";

type Msg = { from: "user" | "bot"; text: string };

const GREETING = `Hi — I'm ${profile.firstName}'s assistant. Ask me about his system-design approach, leadership, biggest challenges, or why AI. I only answer questions about ${profile.firstName}.`;

/** Deterministic match: score each KB entry by keyword hits in the query. */
function answer(query: string): string {
  const q = query.toLowerCase();
  let best: { score: number; a: string } | null = null;
  for (const entry of assistantKB) {
    let score = entry.keywords.reduce((s, k) => (q.includes(k) ? s + 1 : s), 0);
    if (q.includes(entry.q.toLowerCase().slice(0, 12))) score += 2;
    if (!best || score > best.score) best = { score, a: entry.a };
  }
  if (!best || best.score === 0) {
    return `I focus on questions about ${profile.firstName} — his engineering approach, leadership, projects, stack, or career direction. Try one of the suggestions below.`;
  }
  return best.a;
}

/**
 * "Ask about Shikhar" — a curated assistant (not an LLM). Opens from a floating
 * button or the ⌘K command palette ("open-assistant" event). Professional,
 * scoped, no cartoon chrome.
 */
export function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ from: "bot", text: GREETING }]);
  const [value, setValue] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-assistant", onOpen);
    return () => window.removeEventListener("open-assistant", onOpen);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking]);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q || thinking) return;
    setMessages((m) => [...m, { from: "user", text: q }]);
    setValue("");
    setThinking(true);
    // small deliberate delay so it feels considered, not instant
    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: answer(q) }]);
      setThinking(false);
    }, 550);
  };

  return (
    <>
      {/* launcher */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        data-cursor="Ask"
        aria-label="Ask about Shikhar"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full glass-strong px-4 py-2.5 shadow-glow transition-shadow hover:shadow-glow-lg"
      >
        <Sparkles className="h-4 w-4 text-accent-soft" />
        <span className="hidden text-sm font-medium text-ink sm:inline">Ask about me</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 right-5 z-40 flex h-[70vh] max-h-[560px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl glass-strong shadow-glow-lg"
          >
            {/* header */}
            <div className="flex items-center gap-3 border-b border-line/10 px-5 py-4">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-accent/15">
                <Sparkles className="h-4 w-4 text-accent-soft" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">Ask about {profile.firstName}</p>
                <p className="text-[11px] text-faint">Curated · answers only about {profile.firstName}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-muted hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4 no-scrollbar">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      m.from === "user"
                        ? "bg-accent text-white"
                        : "border border-line/10 bg-line/[0.03] text-ink",
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl border border-line/10 bg-line/[0.03] px-3.5 py-3">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-muted"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* suggestions */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                {assistantSuggestions.slice(0, 4).map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="rounded-full border border-line/10 bg-line/[0.03] px-2.5 py-1 text-[11px] text-muted transition-colors hover:text-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(value);
              }}
              className="flex items-center gap-2 border-t border-line/10 p-3"
            >
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`Ask about ${profile.firstName}…`}
                className="flex-1 bg-transparent px-2 text-sm text-ink outline-none placeholder:text-faint"
              />
              <button
                type="submit"
                aria-label="Send"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-white transition-opacity disabled:opacity-40"
                disabled={!value.trim() || thinking}
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
