"use client";

import { cn } from "@/lib/utils";
import { BarChart3, FileText, Upload, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["dashboard", "/admin", BarChart3],
  ["documents", "/admin/documents", FileText],
  ["etudiants", "/admin/students", Users],
  ["upload", "/admin/upload", Upload],
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] lg:sticky lg:top-16 lg:h-fit">
      <div className="border-b border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2">
        <p data-mono className="text-xs text-[var(--fg-muted)]">/admin</p>
      </div>
      <nav className="p-1">
        {links.map(([label, href, Icon]) => {
          const active =
            pathname === href || (href !== "/admin" && pathname?.startsWith(href));
          return (
            <Link
              className={cn(
                "flex items-center gap-2 rounded-sm px-2.5 py-1.5 text-sm transition-colors",
                active
                  ? "bg-[var(--bg-soft)] text-[var(--fg)] font-medium"
                  : "text-[var(--fg-soft)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)]",
              )}
              href={href}
              key={href}
              data-mono
            >
              <Icon size={13} /> {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
