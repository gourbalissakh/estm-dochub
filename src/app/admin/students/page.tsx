import { StudentStatusButton } from "@/components/admin/admin-actions";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { initials, relativeTime } from "@/lib/utils";

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
    orderBy: [{ lastLoginAt: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
  });
  const activeCount = students.filter((s) => s.lastLoginAt).length;
  const counts = students.reduce<Record<string, number>>(
    (acc, s) => ({ ...acc, [s.status]: (acc[s.status] ?? 0) + 1 }),
    {},
  );
  return (
    <div>
      <div className="mb-5">
        <p data-mono className="text-xs text-[var(--fg-muted)]">/admin/students</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--fg)]">
          Étudiants
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-soft)]">
          {students.length} compte{students.length > 1 ? 's' : ''} étudiant{students.length > 1 ? 's' : ''}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge variant="success">ACTIFS · {activeCount}</Badge>
          <Badge variant="warn">JAMAIS CONNECTÉS · {students.length - activeCount}</Badge>
          <Badge variant="danger">BLOQUÉS · {counts.BLOCKED ?? 0}</Badge>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg-elev)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-soft)] text-xs text-[var(--fg-muted)]" data-mono>
                <th className="px-3 py-2 text-left font-medium">étudiant</th>
                <th className="px-3 py-2 text-left font-medium">email</th>
                <th className="px-3 py-2 text-left font-medium">filière</th>
                <th className="px-3 py-2 text-left font-medium">niv.</th>
                <th className="px-3 py-2 text-left font-medium">dernière connexion</th>
                <th className="px-3 py-2 text-left font-medium">connexions</th>
                <th className="px-3 py-2 text-left font-medium">status</th>
                <th className="px-3 py-2 text-right font-medium">actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-[var(--border)] transition-colors last:border-b-0 hover:bg-[var(--bg-soft)]"
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-md border border-[var(--border)] bg-[var(--bg-soft)] text-[10px] font-semibold text-[var(--fg)]">
                        {initials(s.firstName, s.lastName)}
                      </span>
                      <span className="font-medium text-[var(--fg)]">
                        {s.firstName} {s.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs text-[var(--fg-soft)]" data-mono>{s.email}</td>
                  <td className="px-3 py-2">
                    {s.filiere?.code ? <span className="code-chip">{s.filiere.code}</span> : <span className="text-xs text-[var(--fg-muted)]">-</span>}
                  </td>
                  <td className="px-3 py-2 text-xs text-[var(--fg-muted)]" data-mono>{s.niveau ?? '-'}</td>
                  <td className="px-3 py-2 text-xs text-[var(--fg-soft)]" data-mono>
                    {relativeTime(s.lastLoginAt)}
                  </td>
                  <td className="px-3 py-2 text-xs text-[var(--fg-muted)] tabular-nums" data-mono>{s.loginCount}</td>
                  <td className="px-3 py-2">
                    <Badge variant={statusVariant[s.status] ?? "default"}>
                      {s.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {s.status === "BLOCKED" ? (
                        <StudentStatusButton id={s.id} status="VALIDATED" label="Débloquer" />
                      ) : (
                        <StudentStatusButton id={s.id} status="BLOCKED" label="Bloquer" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
