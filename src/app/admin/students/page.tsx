import { StudentStatusButton } from "@/components/admin/admin-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { initials } from "@/lib/utils";

const statusVariant: Record<string, "success" | "warn" | "danger"> = {
  VALIDATED: "success",
  PENDING: "warn",
  BLOCKED: "danger",
};

export default async function AdminStudentsPage() {
  await requireAdmin();
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: { filiere: true },
    orderBy: { createdAt: "desc" },
  });
  const counts = students.reduce<Record<string, number>>(
    (acc, s) => ({ ...acc, [s.status]: (acc[s.status] ?? 0) + 1 }),
    {},
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Etudiants · {students.length}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="success">Valides {counts.VALIDATED ?? 0}</Badge>
          <Badge variant="warn">En attente {counts.PENDING ?? 0}</Badge>
          <Badge variant="danger">Bloques {counts.BLOCKED ?? 0}</Badge>
        </div>
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-soft)] text-[11px] uppercase tracking-wider text-[var(--fg-muted)]">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Etudiant</th>
                <th className="px-3 py-3 text-left font-semibold">Email</th>
                <th className="px-3 py-3 text-left font-semibold">Filiere</th>
                <th className="px-3 py-3 text-left font-semibold">Statut</th>
                <th className="px-6 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-[var(--border)] transition hover:bg-[var(--primary-soft)]/40"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-[image:linear-gradient(135deg,#7c3aed,#06b6d4)] text-[11px] font-bold text-white">
                        {initials(s.firstName, s.lastName)}
                      </span>
                      <span className="font-medium text-[var(--fg)]">
                        {s.firstName} {s.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[var(--fg-soft)]">{s.email}</td>
                  <td className="px-3 py-3 text-[var(--fg-soft)]">
                    {s.filiere?.code ?? "-"}
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant={statusVariant[s.status] ?? "default"}>
                      {s.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      <StudentStatusButton
                        id={s.id}
                        status="VALIDATED"
                        label="Valider"
                      />
                      <StudentStatusButton
                        id={s.id}
                        status="BLOCKED"
                        label="Bloquer"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
