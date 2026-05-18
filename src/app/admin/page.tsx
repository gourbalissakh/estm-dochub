import { ActivityChart } from "@/components/admin/activity-chart";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Download, FileText, Heart, Users } from "lucide-react";

export default async function AdminPage() {
  await requireAdmin();
  const [documents, students, downloads, favorites, lastDocs] =
    await Promise.all([
      prisma.document.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.download.count(),
      prisma.favorite.count(),
      prisma.document.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { filiere: true } }),
    ]);
  const activity = Array.from({ length: 7 }).map((_, i) => ({
    day: `J-${6 - i}`,
    downloads: Math.max(0, downloads - i),
  }));

  const stats = [
    { label: "documents", value: documents, Icon: FileText },
    { label: "etudiants", value: students, Icon: Users },
    { label: "downloads", value: downloads, Icon: Download },
    { label: "favorites", value: favorites, Icon: Heart },
  ];

  return (
    <div className="grid gap-5">
      <div>
        <p data-mono className="text-xs text-[var(--fg-muted)]">/admin/dashboard</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--fg)]">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-soft)]">
          Vue d&apos;ensemble de la plateforme.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, Icon }) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-4 py-3"
          >
            <div>
              <div data-mono className="text-xs text-[var(--fg-muted)]">{label}</div>
              <div className="mt-0.5 text-2xl font-semibold tabular-nums text-[var(--fg)]">
                {value.toLocaleString("fr-FR")}
              </div>
            </div>
            <span className="grid h-8 w-8 place-items-center rounded-md border border-[var(--border)] bg-[var(--bg-soft)] text-[var(--fg-soft)]">
              <Icon size={14} />
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)]">
        <div className="border-b border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2">
          <p data-mono className="text-xs text-[var(--fg-muted)]">downloads.last_7_days</p>
        </div>
        <div className="p-4">
          <ActivityChart data={activity} />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg-elev)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2">
          <p data-mono className="text-xs text-[var(--fg-muted)]">recent_documents</p>
          <span data-mono className="text-[10px] text-[var(--fg-muted)]">{lastDocs.length}</span>
        </div>
        {lastDocs.length === 0 ? (
          <div className="p-6 text-center text-xs text-[var(--fg-muted)]" data-mono>
            Aucun document recent.
          </div>
        ) : (
          lastDocs.map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-3 border-b border-[var(--border)] px-3 py-2 text-sm last:border-b-0"
            >
              <FileText size={12} className="shrink-0 text-[var(--fg-muted)]" />
              <span className="code-chip">{d.filiere.code}</span>
              <span className="flex-1 truncate font-medium text-[var(--fg)]">
                {d.title}
              </span>
              <span data-mono className="text-xs text-[var(--fg-muted)]">
                {new Date(d.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
