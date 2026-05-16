import { ActivityChart } from "@/components/admin/activity-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Download, FileText, Heart, Sparkles, Users } from "lucide-react";

export default async function AdminPage() {
  await requireAdmin();
  const [documents, students, downloads, favorites, lastDocs] =
    await Promise.all([
      prisma.document.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.download.count(),
      prisma.favorite.count(),
      prisma.document.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    ]);
  const activity = Array.from({ length: 7 }).map((_, i) => ({
    day: `J-${6 - i}`,
    downloads: Math.max(0, downloads - i),
  }));

  const stats = [
    { label: "Documents", value: documents, Icon: FileText, tone: "from-violet-500 to-fuchsia-500" },
    { label: "Etudiants", value: students, Icon: Users, tone: "from-cyan-500 to-blue-500" },
    { label: "Telechargements", value: downloads, Icon: Download, tone: "from-emerald-500 to-teal-500" },
    { label: "Favoris", value: favorites, Icon: Heart, tone: "from-rose-500 to-pink-500" },
  ];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">
            <Sparkles size={11} /> Espace admin
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--fg)] sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--fg-soft)]">
            Vue d&apos;ensemble de la plateforme et de l&apos;activite recente.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, Icon, tone }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--primary)]/30 hover:shadow-[var(--shadow-md)]"
          >
            <div
              className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${tone} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`}
            />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold tabular-nums text-[var(--fg)]">
                  {value.toLocaleString("fr-FR")}
                </div>
                <div className="mt-0.5 text-xs font-medium text-[var(--fg-muted)]">
                  {label}
                </div>
              </div>
              <div
                className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${tone} text-white shadow-md`}
              >
                <Icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activite des 7 derniers jours</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityChart data={activity} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dernieres activites</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          {lastDocs.length === 0 ? (
            <p className="rounded-lg border border-dashed border-[var(--border-strong)] py-6 text-center text-sm text-[var(--fg-muted)]">
              Aucun document recent.
            </p>
          ) : (
            lastDocs.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm transition hover:border-[var(--primary)]/40"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
                  <FileText size={14} />
                </span>
                <span className="flex-1 truncate font-medium text-[var(--fg)]">
                  {d.title}
                </span>
                <span className="text-xs text-[var(--fg-muted)]">
                  {new Date(d.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
