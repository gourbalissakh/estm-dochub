import { DeleteButton, VisibilityButton } from "@/components/admin/admin-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminMessagesPage() {
  await requireAdmin();
  const messages = await prisma.message.findMany({ include: { author: true, filiere: true }, orderBy: { createdAt: "desc" } });
  return (
    <Card>
      <CardHeader><CardTitle>Moderation des messages</CardTitle></CardHeader>
      <CardContent className="grid gap-3">
        {messages.map((m) => <div className="rounded-lg border border-violet-100 p-3" key={m.id}><div className="font-semibold">{m.author.firstName} · {m.filiere.code}</div><p className="my-2 text-sm text-[#4B3F6B]">{m.content}</p><div className="flex gap-2"><VisibilityButton id={m.id} visible={m.isVisible} kind="messages" /><DeleteButton id={m.id} kind="messages" /></div></div>)}
      </CardContent>
    </Card>
  );
}
