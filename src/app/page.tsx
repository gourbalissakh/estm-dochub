import { MessageCircle, Search, Users, FileText, Download } from "lucide-react";
import Link from "next/link";
import { DocCard } from "@/components/docs/doc-card";
import { FiliereCard } from "@/components/filieres/filiere-card";
import { MessageCard } from "@/components/messages/message-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [filieres, documents, messages, counts] = await Promise.all([
    prisma.filiere.findMany({ include: { _count: { select: { documents: true, users: true } } }, orderBy: { name: "asc" } }),
    prisma.document.findMany({ where: { isVisible: true }, include: { filiere: true }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.message.findMany({ where: { isVisible: true }, include: { author: true, filiere: true }, orderBy: { createdAt: "desc" }, take: 3 }),
    Promise.all([prisma.document.count(), prisma.user.count(), prisma.download.count(), prisma.message.count()]),
  ]);
  const kpis = [
    ["Documents", counts[0], FileText],
    ["Etudiants", counts[1], Users],
    ["Telechargements", counts[2], Download],
    ["Messages", counts[3], MessageCircle],
  ];
  return (
    <div>
      <section className="bg-[#F5F3FF] dark:bg-[#14101F]">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="max-w-3xl">
            <p className="font-semibold text-cyan-600">ESTM Dakar</p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal text-[#1A1033] sm:text-5xl dark:text-violet-50">Toutes vos ressources academiques, organisees et partagees.</h1>
            <div className="relative mt-8 max-w-2xl">
              <Search className="absolute left-4 top-4 text-[#8B7FA8]" />
              <Input className="h-14 rounded-xl pl-12 text-base" placeholder="Rechercher cours, TP, TD, ancien sujet..." />
              <div className="absolute left-0 right-0 top-16 rounded-lg border border-violet-100 bg-white p-2 text-sm shadow-lg dark:border-violet-900 dark:bg-[#1E1830]">
                {documents.slice(0, 3).map((doc) => <Link className="block rounded-md px-3 py-2 hover:bg-violet-50 dark:hover:bg-violet-950" href={`/documents?q=${doc.title}`} key={doc.id}>{doc.title}</Link>)}
              </div>
            </div>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map(([label, value, Icon]: any) => (
              <Card key={label}><CardContent className="flex items-center gap-4 pt-5"><Icon className="text-cyan-500" /><div><div className="text-2xl font-bold">{value}</div><div className="text-sm text-[#4B3F6B] dark:text-violet-200">{label}</div></div></CardContent></Card>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-5 text-2xl font-bold">Filieres</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filieres.map((f) => <FiliereCard key={f.id} filiere={f} />)}</div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-5 text-2xl font-bold">Documents recents</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{documents.map((doc) => <DocCard key={doc.id} document={doc} />)}</div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-5 text-2xl font-bold">Derniers messages</h2>
        <div className="grid gap-4 lg:grid-cols-3">{messages.map((message) => <MessageCard key={message.id} message={message} />)}</div>
      </section>
    </div>
  );
}
