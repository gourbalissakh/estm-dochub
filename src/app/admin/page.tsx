import { ActivityChart } from "@/components/admin/activity-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  await requireAdmin();
  const [documents, students, downloads, messages, lastDocs] = await Promise.all([
    prisma.document.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.download.count(),
    prisma.message.count(),
    prisma.document.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
  ]);
  const activity = Array.from({ length: 7 }).map((_, i) => ({ day: `J-${6 - i}`, downloads: Math.max(0, downloads - i) }));
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Dashboard admin</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[["Documents", documents], ["Etudiants", students], ["Telechargements", downloads], ["Messages", messages]].map(([label, value]) => <Card key={label}><CardContent className="pt-5"><div className="text-3xl font-bold">{value}</div><div className="text-sm text-[#4B3F6B]">{label}</div></CardContent></Card>)}
      </div>
      <Card><CardHeader><CardTitle>Activite 7 jours</CardTitle></CardHeader><CardContent><ActivityChart data={activity} /></CardContent></Card>
      <Card><CardHeader><CardTitle>Dernieres activites</CardTitle></CardHeader><CardContent>{lastDocs.map((d) => <div className="border-b border-violet-100 py-2 text-sm" key={d.id}>Document ajoute: {d.title}</div>)}</CardContent></Card>
    </div>
  );
}
