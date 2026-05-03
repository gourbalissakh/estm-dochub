import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border border-violet-200 bg-white px-3 text-sm text-[#1A1033] outline-none transition placeholder:text-[#8B7FA8] focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:border-violet-800 dark:bg-[#14101F] dark:text-violet-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
