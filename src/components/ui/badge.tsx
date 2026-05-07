import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ring-1 ring-inset transition",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary-soft)] text-[var(--primary)] ring-[var(--primary)]/20",
        accent:
          "bg-[color-mix(in_oklab,var(--accent-soft)_70%,transparent)] text-[var(--accent)] ring-[var(--accent)]/25",
        outline:
          "bg-transparent text-[var(--fg-soft)] ring-[var(--border-strong)]",
        success: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400",
        warn: "bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400",
        danger: "bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-400",
        solid:
          "bg-[image:linear-gradient(135deg,#7c3aed_0%,#06b6d4_100%)] text-white ring-transparent shadow-sm",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props}>
      {children}
    </span>
  );
}

export { badgeVariants };
