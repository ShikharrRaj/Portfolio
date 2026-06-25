"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  /** delay before the first word */
  delay?: number;
  /** stagger per word */
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

const container = (delay: number, stagger: number) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const word = {
  hidden: { y: "110%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/**
 * Word-by-word masked text reveal. Each word slides up from behind an
 * overflow-clip mask for a premium "type setting" feel.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  as = "h2",
}: TextRevealProps) {
  const MotionTag = motion[as];
  const words = text.split(" ");

  return (
    <MotionTag
      className={cn("flex flex-wrap", className)}
      variants={container(delay, stagger)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={i} className="mr-[0.25em] inline-block overflow-hidden py-[0.05em]">
          <motion.span className="inline-block" variants={word} aria-hidden>
            {w}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
