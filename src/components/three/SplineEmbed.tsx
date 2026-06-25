"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

// Lazy-load so the heavy Spline runtime stays out of the initial bundle and
// is only fetched when this component is actually rendered.
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-full bg-accent/10 blur-2xl" />
  ),
});

/**
 * Drop-in wrapper for a Spline 3D scene.
 *
 * Usage: create/export a scene at https://spline.design, copy its
 * "production" .splinecode URL, then render:
 *
 *   <SplineEmbed scene="https://prod.spline.design/XXXX/scene.splinecode" />
 *
 * To use it as the hero object, swap the dynamic <HeroScene /> import in
 * src/components/sections/Hero.tsx for this component.
 */
export function SplineEmbed({
  scene,
  className,
}: {
  scene: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Suspense fallback={null}>
        <Spline scene={scene} />
      </Suspense>
    </div>
  );
}
