"use client";

import { useState } from "react";
import { profile } from "@/data/portfolio";
import { cn } from "@/lib/utils";

interface AvatarProps {
  className?: string;
  rounded?: string;
  /** object-position, e.g. "center 20%" to bias toward the face */
  position?: string;
}

const initials = profile.name
  .split(" ")
  .map((w) => w[0])
  .slice(0, 2)
  .join("");

/**
 * Profile photo with a graceful fallback to a gradient monogram if the
 * image is missing (e.g. before /public/avatar.jpg is added).
 */
export function Avatar({ className, rounded = "rounded-2xl", position = "center 25%" }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "grid place-items-center bg-gradient-to-br from-accent to-ember font-display font-semibold text-white",
          rounded,
          className,
        )}
      >
        {initials}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={profile.avatar}
      alt={profile.name}
      onError={() => setFailed(true)}
      className={cn("h-full w-full object-cover", rounded, className)}
      style={{ objectPosition: position }}
    />
  );
}
