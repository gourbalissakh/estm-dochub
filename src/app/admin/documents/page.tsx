import { DeleteButton, VisibilityButton } from "@/components/admin/admin-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type AdminDocument = Prisma.DocumentGetPayload<{
  include: { filiere: true };
}>;

export default async function AdminDocumentsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  await requireAdmin();
  const docs: AdminDocument[] = await prisma.document.findMany({
    where: searchParams.q
      ? { title: { contains: searchParams.q, mode: "insensitive" } }
      : {},
    include: { filiere: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents · {docs.length}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-soft)] text-[11px] uppercase tracking-wider text-[var(--fg-muted)]">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">Titre</th>
              <th className="px-3 py-3 text-left font-semibold">Filiere</th>
              <th className="px-3 py-3 text-left font-semibold">Visibilite</th>
              <th className="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr
                key={doc.id}
                className="border-t border-[var(--border)] transition hover:bg-[var(--primary-soft)]/40"
              >
                <td className="px-5 py-3 font-medium text-[var(--fg)]">
                  {doc.title}
                </td>
                <td className="px-3 py-3 text-[var(--fg-soft)]">
                  {doc.filiere.code}
                </td>
                <td className="px-3 py-3">
                  <Badge variant={doc.isVisible ? "success" : "warn"}>
                    {doc.isVisible ? "Visible" : "Cache"}
                  </Badge>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <VisibilityButton
                      id={doc.id}
                      visible={doc.isVisible}
                      kind="documents"
                    />
                    <DeleteButton id={doc.id} kind="documents" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
