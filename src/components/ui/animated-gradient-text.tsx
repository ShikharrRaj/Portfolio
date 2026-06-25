import { cn } from "@/lib/utils";

/**
 * Magic UI-style animated gradient text. The gradient pans continuously via
 * the `gradient-pan` keyframe (defined in tailwind.config).
 */
export function AnimatedGradientText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "animate-gradient-pan bg-clip-text text-transparent [background-size:200%_auto]",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgb(var(--accent)), rgb(var(--gold)), rgb(var(--ember)), rgb(var(--accent)))",
      }}
    >
      {children}
    </span>
  );
}
