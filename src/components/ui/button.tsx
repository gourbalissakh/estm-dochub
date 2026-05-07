import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          "text-white shadow-md bg-[image:linear-gradient(135deg,#7c3aed_0%,#6d28d9_60%,#06b6d4_140%)] hover:shadow-glow hover:brightness-110",
        secondary:
          "bg-[var(--primary-soft)] text-[var(--primary)] hover:bg-[color-mix(in_oklab,var(--primary-soft)_80%,var(--primary))] dark:hover:text-white",
        ghost:
          "text-[var(--fg-soft)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]",
        outline:
          "border border-[var(--border-strong)] bg-[var(--bg-soft)] text-[var(--fg)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-sm",
        danger:
          "bg-[image:linear-gradient(135deg,#ef4444_0%,#dc2626_100%)] text-white shadow-md hover:brightness-110 hover:shadow-lg",
        accent:
          "bg-[image:linear-gradient(135deg,#06b6d4_0%,#0891b2_100%)] text-white shadow-md hover:brightness-110",
        link:
          "text-[var(--primary)] underline-offset-4 hover:underline px-0",
      },
      size: {
        sm: "h-9 px-3.5 text-xs",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-base",
        icon: "h-10 w-10",
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
