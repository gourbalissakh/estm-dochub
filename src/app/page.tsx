import {
  ArrowRight,
  BookOpen,
  Download,
  FileText,
  GraduationCap,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DocCard } from "@/components/docs/doc-card";
import { FiliereCard } from "@/components/filieres/filiere-card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [filieres, documents, counts] = await Promise.all([
    prisma.filiere.findMany({
      include: { _count: { select: { documents: true, users: true } } },
      orderBy: { name: "asc" },
      take: 8,
    }),
    prisma.document.findMany({
      where: { isVisible: true },
      include: { filiere: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    Promise.all([
      prisma.document.count(),
      prisma.user.count(),
      prisma.download.count(),
    ]),
  ]);

  const kpis = [
    { label: "Documents", value: counts[0], Icon: FileText, tone: "from-violet-500 to-fuchsia-500" },
    { label: "Etudiants", value: counts[1], Icon: Users, tone: "from-cyan-500 to-blue-500" },
    { label: "Telechargements", value: counts[2], Icon: Download, tone: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative isolate">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh opacity-50" />
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:pt-16 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
            {/* LEFT: text + search */}
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-elev)]/80 px-3.5 py-1.5 text-xs font-semibold text-[var(--fg-soft)] shadow-sm backdrop-blur">
                <Sparkles size={13} className="text-[var(--accent)]" />
                <span className="text-gradient">ESTM Dakar</span>
                <span className="text-[var(--fg-muted)]">· Plateforme etudiante</span>
              </span>

              <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-[var(--fg)] sm:text-5xl lg:text-6xl">
                Tes cours, TP et sujets <br className="hidden sm:block" />
                <span className="text-gradient">en un seul clic.</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--fg-soft)] sm:text-lg">
                La bibliotheque numerique des etudiants de l&apos;ESTM Dakar.
                Telecharge, partage, reussis.
              </p>

              <form
                action="/documents"
                className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-elev)] p-2 shadow-[var(--shadow-md)] focus-within:border-[var(--primary)] focus-within:shadow-glow transition"
              >
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--fg-muted)]"
                  />
                  <input
                    name="q"
                    className="h-12 w-full bg-transparent pl-11 pr-3 text-base text-[var(--fg)] placeholder:text-[var(--fg-muted)] outline-none"
                    placeholder="Rechercher un cours, un TP..."
                  />
                </div>
                <Button type="submit" size="lg" className="shrink-0">
                  <Search size={16} />
                  <span className="hidden sm:inline">Rechercher</span>
                </Button>
              </form>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
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

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link href="/documents">
                    <BookOpen size={16} /> Voir les documents
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/register">
                    <GraduationCap size={16} /> Creer un compte
                  </Link>
                </Button>
              </div>
            </div>

            {/* RIGHT: image */}
            <div className="relative animate-fade-in" style={{ animationDelay: "120ms" }}>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-[var(--border)] shadow-[var(--shadow-lg)] sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image
                  src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=70"
                  alt="Etudiants ESTM"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/40 via-transparent to-transparent" />
              </div>
              {/* Floating stat */}
              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4 shadow-[var(--shadow-md)] sm:block">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md">
                    <FileText size={18} />
                  </span>
                  <div>
                    <div className="text-xl font-bold tabular-nums text-[var(--fg)]">
                      {counts[0].toLocaleString("fr-FR")}
                    </div>
                    <div className="text-xs text-[var(--fg-muted)]">Documents partages</div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 -top-4 hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4 shadow-[var(--shadow-md)] sm:block">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md">
                    <Download size={18} />
                  </span>
                  <div>
                    <div className="text-xl font-bold tabular-nums text-[var(--fg)]">
                      {counts[2].toLocaleString("fr-FR")}
                    </div>
                    <div className="text-xs text-[var(--fg-muted)]">Telechargements</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {kpis.map(({ label, value, Icon, tone }) => (
              <div
                key={label}
                className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--primary)]/30 hover:shadow-[var(--shadow-md)]"
              >
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
      <section className="relative mx-auto max-w-7xl px-4 py-14">
        <SectionHeader
          eyebrow="Explorer"
          title="Choisis ta filiere"
          subtitle="13 filieres officielles de l'ESTM Dakar, en sciences et en management."
          href="/filieres"
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filieres.map((f) => (
            <FiliereCard key={f.id} filiere={f} />
          ))}
        </div>
      </section>

      {/* DOCUMENTS */}
      <section className="relative mx-auto max-w-7xl px-4 py-14">
        <SectionHeader
          eyebrow="Recents"
          title="Derniers documents"
          subtitle="Les derniers cours, TP et sujets partages."
          href="/documents"
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <DocCard key={doc.id} document={doc} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-grad-primary p-8 text-white shadow-[var(--shadow-lg)] sm:p-12">
          <div className="pointer-events-none absolute inset-0 dotted-grid opacity-20" />
          <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                Pret a partager tes ressources ?
              </h2>
              <p className="mt-2 max-w-xl text-white/85">
                Cree ton compte, depose tes documents et aide tes camarades a reussir.
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
