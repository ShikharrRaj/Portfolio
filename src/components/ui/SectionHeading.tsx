"use client";

import { TextReveal } from "./TextReveal";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/** Consistent section header: eyebrow chip, masked title reveal, subtext. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <Reveal>
        <span className="eyebrow">
          <span aria-hidden className="font-mono font-semibold text-accent">&gt;</span>
          {eyebrow}
        </span>
      </Reveal>
      <TextReveal
        as="h2"
        text={title}
        className={cn(
          "max-w-3xl font-display text-fluid-md font-semibold leading-[1.05] tracking-tight",
          align === "center" && "justify-center",
        )}
      />
      {description && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "max-w-2xl text-base leading-relaxed text-muted md:text-lg",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
