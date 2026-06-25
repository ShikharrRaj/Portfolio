"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Variant = "primary" | "secondary" | "ghost";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  download?: boolean;
  cursorLabel?: string;
  /** strength of the magnetic pull in px */
  strength?: number;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-glow hover:shadow-glow-lg border border-accent/40",
  secondary:
    "glass text-ink hover:bg-line/[0.07] border border-line/10",
  ghost: "text-muted hover:text-ink",
};

/**
 * A button/link that magnetically follows the cursor while hovered, with a
 * subtle inner-label shift. Degrades to a plain button under reduced motion.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  download,
  cursorLabel,
  strength = 22,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduced = usePrefersReducedMotion();

  const handleMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    setPos({
      x: (relX / rect.width) * strength,
      y: (relY / rect.height) * strength,
    });
  };

  const reset = () => setPos({ x: 0, y: 0 });

  const classes = cn(
    "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-colors duration-300 will-change-transform",
    variants[variant],
    className,
  );

  const inner = (
    <motion.span
      className="relative z-10 flex items-center gap-2"
      animate={{ x: pos.x * 0.4, y: pos.y * 0.4 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      {children}
    </motion.span>
  );

  const motionProps = {
    onMouseMove: handleMove,
    onMouseLeave: reset,
    animate: { x: pos.x, y: pos.y },
    transition: { type: "spring" as const, stiffness: 200, damping: 15 },
    "data-cursor": cursorLabel,
    className: classes,
  };

  if (href) {
    const external = href.startsWith("http");
    return (
      <motion.a
        ref={ref}
        href={href}
        download={download}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        {...motionProps}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button ref={ref} onClick={onClick} {...motionProps}>
      {inner}
    </motion.button>
  );
}
