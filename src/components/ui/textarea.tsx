import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-28 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-soft)] px-4 py-3 text-sm text-[var(--fg)] outline-none transition-all duration-200 placeholder:text-[var(--fg-muted)] focus:border-[var(--primary)] focus:ring-[3px] focus:ring-[var(--ring)] hover:border-[var(--primary)]/60 disabled:opacity-60 resize-y",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
