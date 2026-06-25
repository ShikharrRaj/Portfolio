"use client";

import { useEffect, useState } from "react";
import {
  ArrowUp,
  ArrowRight,
  Sun,
  Moon,
  Download,
  Copy,
  Check,
  ExternalLink,
  Network,
  CalendarClock,
  TerminalSquare,
} from "lucide-react";
import { navLinks, profile } from "@/data/portfolio";
import { scrollToSection } from "@/components/providers/SmoothScrollProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Terminal } from "@/components/ui/Terminal";

/**
 * ⌘K / Ctrl-K command palette built on cmdk + Radix Dialog (shadcn pattern).
 * Includes navigation, actions, scheduling and a hidden terminal mode for
 * technical visitors. Opens with ⌘K, "/", or the navbar button event.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [terminal, setTerminal] = useState(false);
  const [copied, setCopied] = useState(false);
  const { theme, toggle } = useTheme();

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
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpenEvent);
    };
  }, [open]);

  // reset terminal mode whenever the palette closes
  useEffect(() => {
    if (!open) setTerminal(false);
  }, [open]);

  const iconBox =
    "grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-line/[0.05] text-muted [[data-selected=true]_&]:bg-accent/20 [[data-selected=true]_&]:text-accent-soft";

  const run = (fn: () => void, keepOpen = false) => () => {
    fn();
    if (!keepOpen) setOpen(false);
  };

  const copyEmail = () => {
    navigator.clipboard?.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={terminal ? "p-0" : "p-0"}>
        {terminal ? (
          <Terminal onExit={() => setOpen(false)} />
        ) : (
          <Command
            className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-faint"
          >
            <CommandInput placeholder="Type a command or search…" autoFocus />
            <CommandList>
              <CommandEmpty>No matching commands.</CommandEmpty>

              <CommandGroup heading="Navigate">
                <CommandItem value="go to top home" onSelect={run(() => scrollToSection("#top"))}>
                  <span className={iconBox}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </span>
                  Go to Top
                </CommandItem>
                {navLinks.map((l) => (
                  <CommandItem
                    key={l.href}
                    value={`go to ${l.title} ${l.label}`}
                    onSelect={run(() => scrollToSection(l.href))}
                  >
                    <span className={iconBox}>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                    Go to {l.title}
                  </CommandItem>
                ))}
                <CommandItem
                  value="view architecture lab system design"
                  onSelect={run(() => scrollToSection("#architecture"))}
                >
                  <span className={iconBox}>
                    <Network className="h-3.5 w-3.5" />
                  </span>
                  View Architecture
                </CommandItem>
              </CommandGroup>

              <CommandGroup heading="Actions">
                <CommandItem
                  value="schedule meeting call book"
                  onSelect={run(() => window.open(profile.meetingUrl, "_blank"))}
                >
                  <span className={iconBox}>
                    <CalendarClock className="h-3.5 w-3.5" />
                  </span>
                  Schedule a Meeting
                </CommandItem>
                <CommandItem value="toggle theme dark light" onSelect={run(toggle, true)}>
                  <span className={iconBox}>
                    {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                  </span>
                  Switch to {theme === "dark" ? "Light" : "Dark"} mode
                </CommandItem>
                <CommandItem
                  value="download resume cv pdf"
                  onSelect={run(() => window.open(profile.resumeUrl, "_blank"))}
                >
                  <span className={iconBox}>
                    <Download className="h-3.5 w-3.5" />
                  </span>
                  Download Résumé
                  <span className="ml-auto text-xs text-faint">PDF</span>
                </CommandItem>
                <CommandItem value="copy email address" onSelect={run(copyEmail, true)}>
                  <span className={iconBox}>
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </span>
                  {copied ? "Copied!" : "Copy email address"}
                  <span className="ml-auto truncate text-xs text-faint">{profile.email}</span>
                </CommandItem>
                <CommandItem
                  value="terminal mode developer console hidden"
                  onSelect={() => setTerminal(true)}
                >
                  <span className={iconBox}>
                    <TerminalSquare className="h-3.5 w-3.5" />
                  </span>
                  Open Terminal mode
                  <span className="ml-auto text-xs text-faint">for devs</span>
                </CommandItem>
              </CommandGroup>

              <CommandGroup heading="Connect">
                {profile.socials.map((s) => (
                  <CommandItem
                    key={s.label}
                    value={`open ${s.label} ${s.handle}`}
                    onSelect={run(() =>
                      window.open(s.href, s.href.startsWith("http") ? "_blank" : "_self"),
                    )}
                  >
                    <span className={iconBox}>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                    Open {s.label}
                    <span className="ml-auto truncate text-xs text-faint">{s.handle}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </DialogContent>
    </Dialog>
  );
}
