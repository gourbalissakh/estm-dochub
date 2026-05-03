import { BarChart3, FileText, MessageSquare, Upload, Users } from "lucide-react";
import Link from "next/link";

const links = [
  ["Dashboard", "/admin", BarChart3],
  ["Documents", "/admin/documents", FileText],
  ["Messages", "/admin/messages", MessageSquare],
  ["Etudiants", "/admin/students", Users],
  ["Ajouter document", "/admin/upload", Upload],
];

export function AdminSidebar() {
  return (
    <aside className="rounded-lg border border-violet-100 bg-white p-3 dark:border-violet-900 dark:bg-[#1E1830] lg:sticky lg:top-24 lg:h-fit">
      <nav className="grid gap-1">
        {links.map(([label, href, Icon]: any) => (
          <Link className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:bg-violet-100 dark:hover:bg-violet-950" href={href} key={href}>
            <Icon size={16} /> {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
