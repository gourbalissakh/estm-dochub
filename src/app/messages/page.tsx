import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MessageForm } from "@/components/messages/message-form";
import { MessageCard } from "@/components/messages/message-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { filiere?: string; q?: string };
}) {
  const [session, filieres, messages] = await Promise.all([
    getCurrentSession(),
    prisma.filiere.findMany({ orderBy: { name: "asc" } }),
    prisma.message.findMany({
      where: {
        isVisible: true,
        ...(searchParams.filiere ? { filiereId: searchParams.filiere } : {}),
        ...(searchParams.q
          ? {
              content: {
                contains: searchParams.q,
                mode: "insensitive" as const,
              },
            }
          : {}),
      },
      include: { author: true, filiere: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-mesh opacity-60" />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-col gap-2">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-elev)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
            <MessageCircle size={12} /> Communaute
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--fg)] sm:text-5xl">
            Messages <span className="text-gradient">communaute</span>
          </h1>
          <p className="max-w-xl text-sm text-[var(--fg-soft)]">
            Questions rapides, demandes de supports et entraide entre etudiants
            par filiere.
          </p>
        </div>

        <div className="my-8 flex flex-wrap items-center gap-1 overflow-x-auto rounded-full border border-[var(--border)] bg-[var(--bg-elev)] p-1 shadow-[var(--shadow-sm)] no-scrollbar">
          {[
            { label: "Toutes", href: "/messages", active: !searchParams.filiere },
            ...filieres.map((f) => ({
              label: f.code,
              href: `/messages?filiere=${f.id}`,
              active: searchParams.filiere === f.id,
            })),
          ].map(({ label, href, active }) => (
              <Link
                key={href}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition whitespace-nowrap",
                  active
                    ? "bg-[image:linear-gradient(135deg,#7c3aed,#06b6d4)] text-white shadow-sm"
                    : "text-[var(--fg-soft)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]",
                )}
                href={href}
              >
                {label}
              </Link>
            ))}
        </div>

        {session ? (
          <MessageForm filieres={filieres} />
        ) : (
          <div className="mb-8 flex flex-col items-start justify-between gap-3 rounded-2xl border border-[var(--border)] bg-grad-soft p-5 sm:flex-row sm:items-center">
            <div>
              <p className="font-semibold text-[var(--fg)]">
                Rejoignez la conversation
              </p>
              <p className="mt-0.5 text-sm text-[var(--fg-soft)]">
                Connectez-vous avec un compte valide pour publier un message.
              </p>
            </div>
            <Button asChild>
              <Link href="/login">Connexion</Link>
            </Button>
          </div>
        )}

        <div className="grid gap-4">
          {messages.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-elev)] p-10 text-center">
              <p className="text-sm font-medium text-[var(--fg-soft)]">
                Aucun message pour le moment.
              </p>
            </div>
          )}
          {messages.map((message, i) => (
            <div
              key={message.id}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <MessageCard message={message} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
