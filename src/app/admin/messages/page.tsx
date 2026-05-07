import { DeleteButton, VisibilityButton } from "@/components/admin/admin-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { initials } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminMessagesPage() {
  await requireAdmin();
  const messages = await prisma.message.findMany({
    include: { author: true, filiere: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Moderation des messages · {messages.length}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4 transition hover:border-[var(--primary)]/30"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[image:linear-gradient(135deg,#7c3aed,#06b6d4)] text-xs font-bold text-white">
                {initials(m.author.firstName, m.author.lastName)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--fg)]">
                    {m.author.firstName} {m.author.lastName}
                  </span>
                  <Badge variant="outline">{m.filiere.code}</Badge>
                  <Badge variant={m.isVisible ? "success" : "warn"}>
                    {m.isVisible ? "Visible" : "Cache"}
                  </Badge>
                </div>
                <p className="my-2 text-sm leading-relaxed text-[var(--fg-soft)]">
                  {m.content}
                </p>
                <div className="flex gap-2">
                  <VisibilityButton
                    id={m.id}
                    visible={m.isVisible}
                    kind="messages"
                  />
                  <DeleteButton id={m.id} kind="messages" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
