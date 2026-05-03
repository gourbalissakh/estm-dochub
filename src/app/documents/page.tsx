import { DocumentsClient } from "@/components/docs/documents-client";
import { prisma } from "@/lib/prisma";

export default async function DocumentsPage() {
  const filieres = await prisma.filiere.findMany({ orderBy: { name: "asc" } });
  return <DocumentsClient filieres={filieres} />;
}
