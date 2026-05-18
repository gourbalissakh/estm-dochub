import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg)] disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap border",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--fg)] text-[var(--bg)] border-[var(--fg)] hover:bg-[var(--fg-soft)] hover:border-[var(--fg-soft)]",
        secondary:
          "bg-[var(--bg-soft)] text-[var(--fg)] border-[var(--border)] hover:bg-[var(--bg-code)] hover:border-[var(--border-strong)]",
        ghost:
          "bg-transparent text-[var(--fg-soft)] border-transparent hover:bg-[var(--bg-code)] hover:text-[var(--fg)]",
        outline:
          "bg-[var(--bg)] text-[var(--fg)] border-[var(--border)] hover:bg-[var(--bg-soft)] hover:border-[var(--border-strong)]",
        danger:
          "bg-[var(--danger)] text-white border-[var(--danger)] hover:opacity-90",
        accent:
          "bg-[var(--accent)] text-white border-[var(--accent)] hover:bg-[var(--accent-hover)] hover:border-[var(--accent-hover)]",
        primary:
          "bg-[var(--primary)] text-white border-[var(--primary)] hover:bg-[var(--primary-hover)] hover:border-[var(--primary-hover)]",
        link:
          "text-[var(--primary)] underline-offset-2 hover:underline border-transparent bg-transparent px-0",
      },
      size: {
        sm: "h-7 px-2.5 text-xs",
        md: "h-8 px-3 text-sm",
        lg: "h-10 px-4 text-sm",
        xl: "h-11 px-5 text-base",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { buttonVariants };
