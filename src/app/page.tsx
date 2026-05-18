import { ArrowRight, ArrowUpRight, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [filieres, documents, counts] = await Promise.all([
    prisma.filiere.findMany({
      include: { _count: { select: { documents: true } } },
      orderBy: { code: "asc" },
    }),
    prisma.document.findMany({
      where: { isVisible: true },
      include: { filiere: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    Promise.all([
      prisma.document.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.download.count(),
      prisma.filiere.count(),
    ]),
  ]);

  const [docCount, studentCount, downloadCount, filiereCount] = counts;
  const techFilieres = filieres.filter((f) => f.sector === "TECH");
  const mgmtFilieres = filieres.filter((f) => f.sector === "MGMT");

  return (
    <div>
      {/* HERO */}
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <p data-mono className="mb-3 text-xs text-[var(--fg-muted)]">
                Plateforme · ESTM Dakar / 2026
              </p>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[var(--fg)] sm:text-4xl lg:text-5xl">
                Documents académiques par filière,
                <br />
                niveau et type.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--fg-soft)] sm:text-base">
                Cours, TP, TD et anciens sujets de l&apos;École Supérieure de Technologie et de Management.
                Téléchargement direct, partage communautaire, organisation par filière.
              </p>

              <form
                action="/documents"
                className="mt-7 flex w-full max-w-lg items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--bg-elev)] p-1 focus-within:border-[var(--primary)]"
              >
                <div className="relative flex-1">
                  <Search
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)]"
                  />
                  <input
                    name="q"
                    className="h-8 w-full bg-transparent pl-8 pr-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] outline-none"
                    placeholder="Rechercher un document..."
                    data-mono
                  />
                </div>
                <Button type="submit" size="sm" data-mono>
                  rechercher
                </Button>
              </form>

              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-[var(--fg-muted)]">
                <span data-mono>tags:</span>
                {["algorithmique", "comptabilite", "reseaux", "marketing", "cybersecurite"].map((tag) => (
                  <Link
                    key={tag}
                    href={`/documents?q=${encodeURIComponent(tag)}`}
                    data-mono
                    className="rounded border border-[var(--border)] bg-[var(--bg-soft)] px-1.5 py-0.5 text-[11px] text-[var(--fg-soft)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--fg)]"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* RIGHT: stats panel */}
            <div className="rounded-md border border-[var(--border)] bg-[var(--bg-soft)] p-1">
              <div className="rounded-sm border border-[var(--border)] bg-[var(--bg-elev)]">
                <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2">
                  <span data-mono className="text-xs text-[var(--fg-muted)]">stats.json</span>
                  <span data-mono className="text-[10px] text-[var(--fg-muted)]">live</span>
                </div>
                <div className="divide-y divide-[var(--border)] font-mono text-sm">
                  <StatRow label="filieres" value={filiereCount} accent />
                  <StatRow label="documents" value={docCount} />
                  <StatRow label="etudiants" value={studentCount} />
                  <StatRow label="downloads" value={downloadCount} />
                </div>
              </div>
              <Link
                href="/about"
                data-mono
                className="mt-1 flex items-center justify-between rounded-sm px-3 py-2 text-xs text-[var(--fg-muted)] transition-colors hover:bg-[var(--bg-elev)] hover:text-[var(--fg)]"
              >
                <span>about/amicale-tchadienne</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FILIERES — dense list */}
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p data-mono className="text-xs text-[var(--fg-muted)]">{'// 01'}</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--fg)]">
                Filières
              </h2>
              <p className="mt-1 text-sm text-[var(--fg-soft)]">
                {filiereCount} filières officielles ESTM · Sciences & Technologies (TECH) · Management & Communication (MGMT)
              </p>
            </div>
            <Link
              href="/filieres"
              data-mono
              className="inline-flex items-center gap-1 text-xs text-[var(--fg-soft)] hover:text-[var(--fg)]"
            >
              tout voir <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <FiliereGroup title="TECH" subtitle="Sciences & Technologies" filieres={techFilieres} />
            <FiliereGroup title="MGMT" subtitle="Management & Communication" filieres={mgmtFilieres} />
          </div>
        </div>
      </section>

      {/* DOCUMENTS — dense list */}
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p data-mono className="text-xs text-[var(--fg-muted)]">{'// 02'}</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--fg)]">
                Documents récents
              </h2>
              <p className="mt-1 text-sm text-[var(--fg-soft)]">
                Dernières ressources partagées par la communauté
              </p>
            </div>
            <Link
              href="/documents"
              data-mono
              className="inline-flex items-center gap-1 text-xs text-[var(--fg-soft)] hover:text-[var(--fg)]"
            >
              tout voir <ArrowRight size={12} />
            </Link>
          </div>

          <div className="overflow-hidden rounded-md border border-[var(--border)]">
            <div className="grid grid-cols-12 gap-2 border-b border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-xs text-[var(--fg-muted)]" data-mono>
              <span className="col-span-6">titre</span>
              <span className="col-span-2 hidden sm:inline">filière</span>
              <span className="col-span-1 hidden sm:inline">niv.</span>
              <span className="col-span-1 hidden sm:inline">type</span>
              <span className="col-span-6 text-right sm:col-span-2">matière</span>
            </div>
            {documents.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-[var(--fg-muted)]">
                Aucun document pour le moment.
              </div>
            ) : (
              documents.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/documents?q=${encodeURIComponent(doc.title)}`}
                  className="grid grid-cols-12 gap-2 border-b border-[var(--border)] px-3 py-2.5 text-sm transition-colors last:border-b-0 hover:bg-[var(--bg-soft)]"
                >
                  <span className="col-span-12 truncate font-medium text-[var(--fg)] sm:col-span-6">
                    {doc.title}
                  </span>
                  <span data-mono className="col-span-6 text-xs text-[var(--fg-soft)] sm:col-span-2">
                    {doc.filiere.code}
                  </span>
                  <span data-mono className="col-span-2 text-xs text-[var(--fg-muted)] sm:col-span-1">
                    {doc.niveau}
                  </span>
                  <span data-mono className="col-span-4 text-xs text-[var(--fg-muted)] sm:col-span-1">
                    {doc.type.replace("_", " ")}
                  </span>
                  <span className="col-span-12 truncate text-right text-xs text-[var(--fg-muted)] sm:col-span-2">
                    {doc.matiere}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-6 rounded-md border border-[var(--border)] bg-[var(--bg-soft)] p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p data-mono className="text-xs text-[var(--fg-muted)]">$ contribute</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--fg)] sm:text-2xl">
                Partage tes ressources avec tes camarades
              </h2>
              <p className="mt-1 max-w-xl text-sm text-[var(--fg-soft)]">
                Crée ton compte étudiant, dépose tes cours et anciens sujets, aide la promo suivante à réussir.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild size="lg">
                <Link href="/register">
                  Créer un compte <ArrowRight size={14} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/documents">Parcourir</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatRow({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 text-xs">
      <span className="text-[var(--fg-muted)]">{label}</span>
      <span className={accent ? "tabular-nums font-semibold text-[var(--accent)]" : "tabular-nums text-[var(--fg)]"}>
        {value.toLocaleString("fr-FR")}
      </span>
    </div>
  );
}

function FiliereGroup({
  title,
  subtitle,
  filieres,
}: {
  title: string;
  subtitle: string;
  filieres: Array<{ id: string; code: string; name: string; description: string; _count?: { documents?: number } }>;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-[var(--border)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2">
        <span data-mono className="text-xs font-medium text-[var(--fg)]">{title}</span>
        <span className="text-xs text-[var(--fg-muted)]">{subtitle}</span>
      </div>
      <div>
        {filieres.map((f) => (
          <Link
            key={f.id}
            href={`/documents?filiere=${f.id}`}
            className="group flex items-center gap-3 border-b border-[var(--border)] px-3 py-2.5 transition-colors last:border-b-0 hover:bg-[var(--bg-soft)]"
          >
            <span className="code-chip shrink-0">{f.code}</span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-[var(--fg)]">{f.name}</div>
              <div className="truncate text-xs text-[var(--fg-muted)]">{f.description}</div>
            </div>
            <span data-mono className="hidden text-xs text-[var(--fg-muted)] sm:inline">
              {f._count?.documents ?? 0} docs
            </span>
            <ChevronRight size={14} className="text-[var(--fg-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--fg-soft)]" />
          </Link>
        ))}
      </div>
    </div>
  );
}
