import { StudentStatusButton } from "@/components/admin/admin-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminStudentsPage() {
  await requireAdmin();
  const students = await prisma.user.findMany({ where: { role: "STUDENT" }, include: { filiere: true }, orderBy: { createdAt: "desc" } });
  const counts = students.reduce<Record<string, number>>((acc, s) => ({ ...acc, [s.status]: (acc[s.status] ?? 0) + 1 }), {});
  return (
    <Card>
      <CardHeader><CardTitle>Etudiants</CardTitle></CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2"><Badge>Valides {counts.VALIDATED ?? 0}</Badge><Badge>En attente {counts.PENDING ?? 0}</Badge><Badge>Bloques {counts.BLOCKED ?? 0}</Badge></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left"><th className="py-2">Nom</th><th>Email</th><th>Filiere</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>{students.map((s) => <tr className="border-t border-violet-100" key={s.id}><td className="py-3">{s.firstName} {s.lastName}</td><td>{s.email}</td><td>{s.filiere?.code ?? "-"}</td><td>{s.status}</td><td className="flex gap-2 py-2"><StudentStatusButton id={s.id} status="VALIDATED" label="Valider" /><StudentStatusButton id={s.id} status="BLOCKED" label="Bloquer" /><StudentStatusButton id={s.id} status="VALIDATED" label="Debloquer" /></td></tr>)}</tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
