import {
  ArrowRight,
  BookOpen,
  Download,
  FileText,
  GraduationCap,
  MessageCircle,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { DocCard } from "@/components/docs/doc-card";
import { FiliereCard } from "@/components/filieres/filiere-card";
import { MessageCard } from "@/components/messages/message-card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [filieres, documents, messages, counts] = await Promise.all([
    prisma.filiere.findMany({
      include: { _count: { select: { documents: true, users: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.document.findMany({
      where: { isVisible: true },
      include: { filiere: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.message.findMany({
      where: { isVisible: true },
      include: { author: true, filiere: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    Promise.all([
      prisma.document.count(),
      prisma.user.count(),
      prisma.download.count(),
      prisma.message.count(),
    ]),
  ]);

  const kpis = [
    { label: "Documents", value: counts[0], Icon: FileText, tone: "from-violet-500 to-fuchsia-500" },
    { label: "Etudiants", value: counts[1], Icon: Users, tone: "from-cyan-500 to-blue-500" },
    { label: "Telechargements", value: counts[2], Icon: Download, tone: "from-emerald-500 to-teal-500" },
    { label: "Messages", value: counts[3], Icon: MessageCircle, tone: "from-rose-500 to-pink-500" },
  ];

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative isolate">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh" />
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[640px] w-[1100px] -translate-x-1/2 opacity-60 dark:opacity-50"
          aria-hidden
        >
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-violet-500/40 blur-3xl animate-blob" />
          <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-cyan-400/40 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
          <div className="absolute left-1/3 top-40 h-72 w-72 rounded-full bg-fuchsia-400/30 blur-3xl animate-blob" style={{ animationDelay: "6s" }} />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:pt-24 lg:pt-28">
          <div className="mx-auto max-w-4xl text-center animate-fade-in-slow">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-elev)]/70 px-3.5 py-1.5 text-xs font-semibold text-[var(--fg-soft)] shadow-sm backdrop-blur">
              <Sparkles size={13} className="text-[var(--accent)]" />
              <span className="text-gradient">ESTM Dakar</span>
              <span className="text-[var(--fg-muted)]">· Plateforme communautaire</span>
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-[var(--fg)] sm:text-6xl lg:text-7xl">
              Toutes vos ressources <br className="hidden sm:block" />
              <span className="text-gradient">academiques au meme endroit.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--fg-soft)] sm:text-lg">
              Cours, TP, TD et anciens sujets, organises par filiere et niveau.
              Telecharger, partager et echanger entre etudiants, simplement.
            </p>

            <form
              action="/documents"
              className="mx-auto mt-10 flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-elev)] p-2 shadow-[var(--shadow-md)] focus-within:border-[var(--primary)] focus-within:shadow-glow transition"
            >
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--fg-muted)]"
                />
                <input
                  name="q"
                  className="h-12 w-full bg-transparent pl-11 pr-3 text-base text-[var(--fg)] placeholder:text-[var(--fg-muted)] outline-none"
                  placeholder="Rechercher un cours, un TP, un ancien sujet..."
                />
              </div>
              <Button type="submit" size="lg" className="shrink-0">
                Rechercher
                <ArrowRight size={16} />
              </Button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-[var(--fg-muted)]">Populaire :</span>
              {["Algorithmique", "Comptabilite", "Reseaux", "Marketing"].map((tag) => (
                <Link
                  key={tag}
                  href={`/documents?q=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-1 text-xs font-medium text-[var(--fg-soft)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* KPIs */}
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map(({ label, value, Icon, tone }, i) => (
              <div
                key={label}
                className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--primary)]/30 hover:shadow-[var(--shadow-md)] animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div
                  className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${tone} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`}
                />
                <div className="flex items-center gap-3">
                  <div
                    className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${tone} text-white shadow-md`}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold tabular-nums text-[var(--fg)]">
                      {value.toLocaleString("fr-FR")}
                    </div>
                    <div className="text-xs font-medium text-[var(--fg-muted)]">
                      {label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FILIERES */}
      <section className="relative mx-auto max-w-7xl px-4 py-16">
        <SectionHeader
          eyebrow="Explorer"
          title="Filieres ESTM"
          subtitle="Choisissez votre filiere pour acceder aux ressources."
          href="/filieres"
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filieres.map((f, i) => (
            <div
              key={f.id}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <FiliereCard filiere={f} />
            </div>
          ))}
        </div>
      </section>

      {/* DOCUMENTS */}
      <section className="relative mx-auto max-w-7xl px-4 py-16">
        <SectionHeader
          eyebrow="Recents"
          title="Documents recemment ajoutes"
          subtitle="Les derniers cours, TP et sujets partages par la communaute."
          href="/documents"
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc, i) => (
            <div
              key={doc.id}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <DocCard document={doc} />
            </div>
          ))}
        </div>
      </section>

      {/* MESSAGES */}
      <section className="relative mx-auto max-w-7xl px-4 py-16">
        <SectionHeader
          eyebrow="Communaute"
          title="Derniers messages"
          subtitle="Echanges, questions et entraide entre etudiants."
          href="/messages"
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {messages.map((message, i) => (
            <div
              key={message.id}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <MessageCard message={message} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-grad-primary p-10 text-white shadow-[var(--shadow-lg)] sm:p-14">
          <div className="pointer-events-none absolute inset-0 dotted-grid opacity-20" />
          <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
                <GraduationCap size={13} /> Rejoindre
              </span>
              <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Pret a partager vos ressources ?
              </h2>
              <p className="mt-2 max-w-xl text-white/85">
                Inscrivez-vous gratuitement, deposez vos documents et aidez vos
                camarades a reussir leur annee.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="secondary" className="bg-white text-violet-700 hover:bg-white/90">
                <Link href="/register">
                  Creer un compte <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="bg-white/10 text-white hover:bg-white/20">
                <Link href="/documents">
                  <BookOpen size={16} /> Explorer
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  href,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  href: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--accent)]">
          {eyebrow}
        </p>
        <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-[var(--fg)] sm:text-4xl">
          {title}
        </h2>
        <p className="mt-2 max-w-xl text-sm text-[var(--fg-soft)]">{subtitle}</p>
      </div>
      <Link
        href={href}
        className="group inline-flex items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-elev)] px-4 py-2 text-sm font-semibold text-[var(--fg-soft)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
      >
        Tout voir
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
