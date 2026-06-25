import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full bg-transparent text-ink outline-none placeholder:text-faint",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
