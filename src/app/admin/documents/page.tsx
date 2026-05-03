import { DeleteButton, VisibilityButton } from "@/components/admin/admin-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDocumentsPage({ searchParams }: { searchParams: { q?: string } }) {
  await requireAdmin();
  const docs = await prisma.document.findMany({
    where: searchParams.q ? { title: { contains: searchParams.q, mode: "insensitive" } } : {},
    include: { filiere: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <Card>
      <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left"><th className="py-2">Titre</th><th>Filiere</th><th>Visible</th><th>Actions</th></tr></thead>
          <tbody>{docs.map((doc) => <tr className="border-t border-violet-100" key={doc.id}><td className="py-3">{doc.title}</td><td>{doc.filiere.code}</td><td>{doc.isVisible ? "Oui" : "Non"}</td><td className="flex gap-2 py-2"><VisibilityButton id={doc.id} visible={doc.isVisible} kind="documents" /><DeleteButton id={doc.id} kind="documents" /></td></tr>)}</tbody>
        </table>
      </CardContent>
    </Card>
  );
}
