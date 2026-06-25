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
        className="absolute -left-32 top-0 h-[34rem] w-[34rem] rounded-full bg-accent/25 blur-[120px]"
        animate={{ x: [0, 60, -20, 0], y: [0, 40, 80, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-10rem] top-1/3 h-[30rem] w-[30rem] rounded-full bg-ember/20 blur-[130px]"
        animate={{ x: [0, -50, 30, 0], y: [0, 60, -30, 0], scale: [1, 0.9, 1.15, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-12rem] left-1/3 h-[28rem] w-[28rem] rounded-full bg-gold/20 blur-[120px]"
        animate={{ x: [0, 40, -40, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
