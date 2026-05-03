import Link from "next/link";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MessageForm } from "@/components/messages/message-form";
import { MessageCard } from "@/components/messages/message-card";
import { Button } from "@/components/ui/button";

export default async function MessagesPage({ searchParams }: { searchParams: { filiere?: string; q?: string } }) {
  const [session, filieres, messages] = await Promise.all([
    getCurrentSession(),
    prisma.filiere.findMany({ orderBy: { name: "asc" } }),
    prisma.message.findMany({
      where: {
        isVisible: true,
        ...(searchParams.filiere ? { filiereId: searchParams.filiere } : {}),
        ...(searchParams.q ? { content: { contains: searchParams.q, mode: "insensitive" as const } } : {}),
      },
      include: { author: true, filiere: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">Messages communaute</h1>
      <p className="mt-2 text-[#4B3F6B] dark:text-violet-200">Questions rapides, demandes de supports et entraide par filiere.</p>
      <div className="my-6 flex flex-wrap gap-2">
        <a className="rounded-md bg-violet-100 px-3 py-2 text-sm font-semibold dark:bg-violet-950" href="/messages">Toutes</a>
        {filieres.map((f) => <a key={f.id} className="rounded-md bg-violet-100 px-3 py-2 text-sm font-semibold dark:bg-violet-950" href={`/messages?filiere=${f.id}`}>{f.code}</a>)}
      </div>
      {session ? <MessageForm filieres={filieres} /> : (
        <div className="mb-8 flex items-center justify-between rounded-xl bg-violet-100 p-4 dark:bg-violet-950">
          <span>Connectez-vous avec un compte valide pour publier.</span>
          <Button asChild><Link href="/login">Connexion</Link></Button>
        </div>
      )}
      <div className="grid gap-4">{messages.map((message) => <MessageCard key={message.id} message={message} />)}</div>
    </div>
  );
}
