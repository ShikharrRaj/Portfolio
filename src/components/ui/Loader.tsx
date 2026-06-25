"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/data/portfolio";

/**
 * Cinematic loading screen with an animated monogram and a counter that
 * runs to 100 before revealing the page. Shows once per session.
 */
export function Loader() {
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("loaded")) {
      setDone(true);
      return;
    }
    document.body.style.overflow = "hidden";

    let current = 0;
    const interval = setInterval(() => {
      // ease toward 100 with a little randomness for a natural feel
      current += Math.max(1, Math.round((100 - current) * 0.06));
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          sessionStorage.setItem("loaded", "1");
          document.body.style.overflow = "";
        }, 450);
      }
      setCount(current);
    }, 90);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, []);

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-bg"
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* animated monogram */}
          <motion.div
            className="relative flex h-28 w-28 items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              className="absolute inset-0 rounded-full border border-accent/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <motion.span
              className="absolute inset-2 rounded-full border-t border-ember/60"
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <span className="font-display text-3xl font-semibold text-gradient">
              {initials}
            </span>
          </motion.div>

          <motion.div
            className="mt-8 flex items-baseline gap-1 font-mono text-sm text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="tabular-nums text-ink">{count}</span>
            <span>/ 100</span>
          </motion.div>

          <div className="mt-4 h-px w-48 overflow-hidden bg-line/10">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-ember"
              animate={{ width: `${count}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
