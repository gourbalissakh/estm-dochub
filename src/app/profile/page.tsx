import { BadgeCheck, Download, Heart, MessageCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { initials } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await getCurrentSession();
  if (!session?.user) redirect("/login");
  const [downloads, favorites, messages] = await Promise.all([
    prisma.download.findMany({ where: { userId: session.user.id }, include: { document: true }, orderBy: { createdAt: "desc" } }),
    prisma.favorite.findMany({ where: { userId: session.user.id }, include: { document: true }, orderBy: { createdAt: "desc" } }),
    prisma.message.findMany({ where: { authorId: session.user.id }, include: { filiere: true }, orderBy: { createdAt: "desc" } }),
  ]);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center gap-4 rounded-xl bg-violet-100 p-5 dark:bg-violet-950">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-white text-xl font-bold text-violet-900">{initials(session.user.firstName, session.user.lastName)}</div>
        <div>
          <h1 className="text-2xl font-bold">{session.user.firstName} {session.user.lastName}</h1>
          <div className="mt-2 flex gap-2"><Badge><BadgeCheck size={14} /> Verifie</Badge><Badge>{session.user.role}</Badge></div>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <ProfileList title="Telecharges" icon={<Download />} items={downloads.map((d) => d.document.title)} />
        <ProfileList title="Favoris" icon={<Heart />} items={favorites.map((f) => f.document.title)} />
        <ProfileList title="Messages" icon={<MessageCircle />} items={messages.map((m) => `${m.filiere.code}: ${m.content}`)} />
      </div>
    </div>
  );
}

function ProfileList({ title, icon, items }: { title: string; icon: React.ReactNode; items: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2">{icon}{title}</CardTitle></CardHeader>
      <CardContent className="grid gap-2 text-sm text-[#4B3F6B] dark:text-violet-200">
        {items.length ? items.map((item) => <div key={item} className="rounded-md bg-violet-50 p-2 dark:bg-[#14101F]">{item}</div>) : <p>Aucune activite.</p>}
      </CardContent>
    </Card>
  );
}
