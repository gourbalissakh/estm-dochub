import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-soft)] px-4 text-sm text-[var(--fg)] outline-none transition-all duration-200 placeholder:text-[var(--fg-muted)] focus:border-[var(--primary)] focus:ring-[3px] focus:ring-[var(--ring)] hover:border-[var(--primary)]/60 disabled:opacity-60",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
