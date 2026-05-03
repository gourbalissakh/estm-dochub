import { Suspense } from "react";
import { DocumentsClient } from "@/components/docs/documents-client";
import { prisma } from "@/lib/prisma";

export default async function DocumentsPage() {
  const filieres = await prisma.filiere.findMany({ orderBy: { name: "asc" } });
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10">Chargement des documents...</div>}>
      <DocumentsClient filieres={filieres} />
    </Suspense>
  );
}
