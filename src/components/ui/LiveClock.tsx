"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/portfolio";

/**
 * Live local time in the owner's timezone — a small "I'm a real person in a
 * real place" touch. Renders nothing until mounted to avoid hydration drift.
 */
export function LiveClock({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: profile.timezone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <span className={className}>
      <span className="font-mono tabular-nums">{time}</span>
      <span className="text-faint"> · {profile.location}</span>
    </span>
  );
}
