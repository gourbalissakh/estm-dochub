"use client";

import { cn } from "@/lib/utils";
import { BarChart3, FileText, Sparkles, Upload, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["Dashboard", "/admin", BarChart3],
  ["Documents", "/admin/documents", FileText],
  ["Etudiants", "/admin/students", Users],
  ["Ajouter document", "/admin/upload", Upload],
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-3 shadow-[var(--shadow-sm)] lg:sticky lg:top-24 lg:h-fit">
      <div className="mb-3 flex items-center gap-2 px-3 py-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[image:linear-gradient(135deg,#7c3aed,#06b6d4)] text-white shadow-md">
          <Sparkles size={14} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
            Espace
          </p>
          <p className="text-sm font-bold text-[var(--fg)]">Admin</p>
        </div>
      </div>
      <nav className="grid gap-1">
        {links.map(([label, href, Icon]) => {
          const active =
            pathname === href || (href !== "/admin" && pathname?.startsWith(href));
          return (
            <Link
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                active
                  ? "bg-[var(--primary-soft)] text-[var(--primary)] shadow-sm"
                  : "text-[var(--fg-soft)] hover:bg-[var(--primary-soft)]/60 hover:text-[var(--primary)]",
              )}
              href={href}
              key={href}
            >
              <Icon size={16} /> {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
