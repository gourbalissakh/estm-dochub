import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium border whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--bg-code)] text-[var(--fg-soft)] border-[var(--border)]",
        accent:
          "bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]/30",
        outline:
          "bg-transparent text-[var(--fg-soft)] border-[var(--border-strong)]",
        primary:
          "bg-[var(--primary-soft)] text-[var(--primary)] border-[var(--primary)]/30",
        success: "bg-[var(--accent-soft)] text-[var(--ok)] border-[var(--ok)]/30",
        warn: "bg-amber-500/10 text-[var(--warn)] border-amber-500/30",
        danger: "bg-red-500/10 text-[var(--danger)] border-red-500/30",
        solid:
          "bg-[var(--fg)] text-[var(--bg)] border-[var(--fg)]",
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
