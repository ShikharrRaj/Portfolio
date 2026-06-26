"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Floating, slowly-drifting gradient blobs used as ambient background.
 * Pointer-events disabled and heavily blurred so they never interfere.
 */
export function GradientBlobs({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <motion.div
        className="absolute -left-32 top-0 h-[34rem] w-[34rem] rounded-full bg-accent/[0.1] blur-[160px]"
        animate={{ x: [0, 40, -10, 0], y: [0, 30, 60, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-10rem] top-1/3 h-[30rem] w-[30rem] rounded-full bg-ember/[0.08] blur-[170px]"
        animate={{ x: [0, -36, 20, 0], y: [0, 44, -20, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
