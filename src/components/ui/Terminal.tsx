"use client";

import { useEffect, useRef, useState } from "react";
import {
  profile,
  experiences,
  projects,
  techClusters,
} from "@/data/portfolio";
import { scrollToSection } from "@/components/providers/SmoothScrollProvider";

type Line = { type: "in" | "out" | "sys"; text: string };

const BANNER = "shikhar@portfolio:~$ type 'help' to begin · 'exit' to leave";

/**
 * Hidden terminal mode inside the command palette — a treat for technical
 * visitors. Supports a small set of commands that print info or navigate.
 */
export function Terminal({ onExit }: { onExit: () => void }) {
  const [lines, setLines] = useState<Line[]>([{ type: "sys", text: BANNER }]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const print = (text: string) => setLines((l) => [...l, { type: "out", text }]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    setLines((l) => [...l, { type: "in", text: cmd }]);
    if (!cmd) return;
    setHistory((h) => [cmd, ...h]);
    setHIdx(-1);

    const [base, ...rest] = cmd.toLowerCase().split(/\s+/);
    const arg = rest.join(" ");

    switch (base) {
      case "help":
        print(
          "commands: help · whoami · skills · experience · projects · architecture · resume · github · linkedin · email · goto <section> · clear · exit",
        );
        break;
      case "whoami":
        print(`${profile.name} — ${profile.roles[0]} · ${profile.location}`);
        print(profile.tagline);
        break;
      case "skills":
      case "stack":
        techClusters.forEach((c) =>
          print(`${c.name.padEnd(12)} ${c.nodes.map((n) => n.name).join(", ")}`),
        );
        break;
      case "experience":
      case "journey":
        experiences.forEach((e) => print(`${e.period}  ${e.role} @ ${e.company}`));
        break;
      case "projects":
      case "ls":
        projects.forEach((p) => print(`• ${p.title} — ${p.tagline}`));
        break;
      case "architecture":
        print("Opening Architecture Lab…");
        scrollToSection("#architecture");
        setTimeout(onExit, 300);
        break;
      case "resume":
      case "cv":
        print("Opening Resume…");
        window.open(profile.resumeUrl, "_blank");
        break;
      case "github":
        window.open("https://github.com/shikhar-rsp", "_blank");
        print("→ github.com/shikhar-rsp");
        break;
      case "linkedin":
        window.open(profile.socials[1].href, "_blank");
        print("→ LinkedIn");
        break;
      case "email":
      case "contact":
        print(profile.email);
        break;
      case "goto": {
        const map: Record<string, string> = {
          mission: "#about",
          about: "#about",
          journey: "#experience",
          experience: "#experience",
          products: "#projects",
          projects: "#projects",
          expertise: "#skills",
          skills: "#skills",
          architecture: "#architecture",
          future: "#future",
          contact: "#contact",
          connect: "#contact",
        };
        const target = map[arg];
        if (target) {
          print(`Navigating to ${arg}…`);
          scrollToSection(target);
          setTimeout(onExit, 300);
        } else {
          print(`unknown section: ${arg || "(none)"}`);
        }
        break;
      }
      case "sudo":
        print("Nice try. Leadership isn't granted with sudo — it's earned. 😉");
        break;
      case "clear":
        setLines([{ type: "sys", text: BANNER }]);
        break;
      case "exit":
      case "q":
        onExit();
        break;
      default:
        print(`command not found: ${base} — try 'help'`);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHIdx((i) => {
        const ni = Math.min(i + 1, history.length - 1);
        if (history[ni]) setValue(history[ni]);
        return ni;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHIdx((i) => {
        const ni = Math.max(i - 1, -1);
        setValue(ni === -1 ? "" : history[ni]);
        return ni;
      });
    }
  };

  return (
    <div
      className="flex h-[60vh] max-h-[460px] flex-col font-mono text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 border-b border-line/10 px-5 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-ember/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-line/30" />
        <span className="ml-2 text-xs text-faint">terminal — zsh</span>
        <button
          onClick={onExit}
          className="ml-auto text-xs text-muted hover:text-ink"
        >
          esc
        </button>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-5 no-scrollbar">
        {lines.map((line, i) => (
          <div key={i} className="leading-relaxed">
            {line.type === "in" && (
              <span>
                <span className="text-accent-soft">❯</span>{" "}
                <span className="text-ink">{line.text}</span>
              </span>
            )}
            {line.type === "out" && (
              <span className="whitespace-pre-wrap text-muted">{line.text}</span>
            )}
            {line.type === "sys" && (
              <span className="text-faint">{line.text}</span>
            )}
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="text-accent-soft">❯</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoComplete="off"
            className="flex-1 bg-transparent text-ink caret-accent outline-none"
          />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
}
