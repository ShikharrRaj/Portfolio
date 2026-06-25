"use client";

import { motion } from "framer-motion";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ExplorationProvider } from "@/components/providers/ExplorationProvider";
import { JourneyTracker } from "@/components/providers/JourneyTracker";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Loader } from "@/components/ui/Loader";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { ProgressTracker } from "@/components/ui/ProgressTracker";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { Navbar } from "@/components/layout/Navbar";

/**
 * Client shell that wires up global providers, the loader, custom cursor,
 * navbar, journey/exploration tracking and a soft page-entrance transition.
 */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ExplorationProvider>
        <SmoothScrollProvider>
          <Loader />
          <CustomCursor />
          <ScrollProgress />
          <CommandPalette />
          <Navbar />
          <JourneyTracker />
          <ProgressTracker />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            {children}
          </motion.main>
        </SmoothScrollProvider>
      </ExplorationProvider>
    </ThemeProvider>
  );
}
