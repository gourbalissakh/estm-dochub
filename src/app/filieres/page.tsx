import { FiliereCard } from "@/components/filieres/filiere-card";
import { prisma } from "@/lib/prisma";

export default async function FilieresPage({ searchParams }: { searchParams: { sector?: string } }) {
  const sector = searchParams.sector;
  const filieres = await prisma.filiere.findMany({
    where: sector === "TECH" || sector === "MGMT" ? { sector } : {},
    include: { _count: { select: { documents: true, users: true } } },
    orderBy: { name: "asc" },
  });
  const tabs = [["Toutes", "/filieres"], ["Tech", "/filieres?sector=TECH"], ["Management", "/filieres?sector=MGMT"]];
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">Filieres ESTM</h1>
      <div className="my-6 flex flex-wrap gap-2">{tabs.map(([label, href]) => <a key={href} className="rounded-md bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-950 dark:bg-violet-950 dark:text-violet-50" href={href}>{label}</a>)}</div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filieres.map((f) => <FiliereCard key={f.id} filiere={f} />)}</div>
    </div>
  );
}
