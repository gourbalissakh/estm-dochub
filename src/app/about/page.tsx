import { Button } from '@/components/ui/button'
import {
    ArrowUpRight,
    BookOpen,
    Code2,
    Heart,
    Mail,
    Users,
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
    title: 'À propos · ESTM DocHub',
    description:
        "Amicale des étudiants Tchadiens à l'ESTM Dakar. Présentation, mission et contact.",
}

export default function AboutPage() {
    const values = [
        {
            label: 'partage',
            description:
                "Rendre accessibles les cours, TP et anciens sujets à toute la promotion qui suit.",
        },
        {
            label: 'entraide',
            description:
                "Favoriser la réussite collective entre étudiants tchadiens et l'ensemble de la communauté ESTM.",
        },
        {
            label: 'identite',
            description:
                "Préserver les liens entre les étudiants tchadiens loin du pays, à Dakar.",
        },
    ]

    const team = [
        {
            role: 'developpement',
            name: '@Gourbal2026',
            link: 'https://github.com/gourbalissakh',
        },
        {
            role: 'amicale',
            name: 'Amicale des étudiants Tchadiens',
            link: null,
        },
        {
            role: 'institution',
            name: 'ESTM Dakar',
            link: 'https://www.estm.sn',
        },
    ]

    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            {/* HEADER */}
            <div className="border-b border-[var(--border)] pb-6">
                <p data-mono className="text-xs text-[var(--fg-muted)]">/about</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--fg)] sm:text-4xl">
                    Amicale des étudiants Tchadiens
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--fg-soft)] sm:text-base">
                    ESTM DocHub est une initiative de l&apos;Amicale des étudiants Tchadiens à
                    l&apos;École Supérieure de Technologie et de Management de Dakar. Une plateforme
                    construite par et pour les étudiants pour partager les ressources
                    pédagogiques entre filières et promotions.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild>
                        <Link href="/documents">
                            <BookOpen size={13} /> Explorer le catalogue
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/register">
                            <Users size={13} /> Rejoindre
                        </Link>
                    </Button>
                </div>
            </div>

            {/* MISSION */}
            <section className="mt-10">
                <div className="mb-5">
                    <p data-mono className="text-xs text-[var(--fg-muted)]">{'// 01'}</p>
                    <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--fg)]">
                        Notre mission
                    </h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                    {values.map((v) => (
                        <div
                            key={v.label}
                            className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] p-4"
                        >
                            <p data-mono className="text-xs text-[var(--accent)]">
                                {v.label}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-[var(--fg-soft)]">
                                {v.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* PROJET */}
            <section className="mt-10">
                <div className="mb-5">
                    <p data-mono className="text-xs text-[var(--fg-muted)]">{'// 02'}</p>
                    <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--fg)]">
                        Le projet ESTM DocHub
                    </h2>
                </div>
                <div className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)]">
                    <div className="border-b border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2">
                        <p data-mono className="text-xs text-[var(--fg-muted)]">
                            README.md
                        </p>
                    </div>
                    <div className="space-y-4 p-5 text-sm leading-relaxed text-[var(--fg-soft)]">
                        <p>
                            <strong className="text-[var(--fg)]">ESTM DocHub</strong> est une
                            plateforme communautaire et gratuite pour les étudiants de l&apos;ESTM
                            Dakar. Elle organise les ressources académiques par
                            <span className="code-chip mx-1">filière</span>,
                            <span className="code-chip mx-1">niveau</span> et
                            <span className="code-chip mx-1">type</span> (cours, TP, TD, anciens
                            sujets).
                        </p>
                        <p>
                            La plateforme couvre les{' '}
                            <strong className="text-[var(--fg)]">13 filières officielles</strong>{' '}
                            de l&apos;ESTM, réparties en deux secteurs : Sciences &amp;
                            Technologies (TECH) et Management &amp; Communication (MGMT).
                        </p>
                        <p>
                            Chaque étudiant peut consulter et télécharger les documents
                            librement, mais doit créer un compte (validé par un administrateur de
                            l&apos;Amicale) pour déposer ses propres ressources.
                        </p>
                    </div>
                </div>
            </section>

            {/* EQUIPE */}
            <section className="mt-10">
                <div className="mb-5">
                    <p data-mono className="text-xs text-[var(--fg-muted)]">{'// 03'}</p>
                    <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--fg)]">
                        Équipe &amp; partenaires
                    </h2>
                </div>
                <div className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg-elev)]">
                    {team.map((member, i) => (
                        <div
                            key={member.role}
                            className={`flex items-center gap-3 px-4 py-3 text-sm ${
                                i < team.length - 1 ? 'border-b border-[var(--border)]' : ''
                            }`}
                        >
                            <span data-mono className="w-32 shrink-0 text-xs text-[var(--fg-muted)]">
                                {member.role}
                            </span>
                            {member.link ? (
                                <a
                                    href={member.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex flex-1 items-center gap-1.5 font-medium text-[var(--fg)] hover:text-[var(--primary)]"
                                >
                                    {member.name}
                                    <ArrowUpRight
                                        size={12}
                                        className="text-[var(--fg-muted)]"
                                    />
                                </a>
                            ) : (
                                <span className="flex-1 font-medium text-[var(--fg)]">
                                    {member.name}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* CONTACT */}
            <section className="mt-10">
                <div className="mb-5">
                    <p data-mono className="text-xs text-[var(--fg-muted)]">{'// 04'}</p>
                    <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--fg)]">
                        Contact
                    </h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    <a
                        href="mailto:contact@estm.sn"
                        className="group flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--bg-elev)] p-4 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-soft)]"
                    >
                        <span className="grid h-9 w-9 place-items-center rounded-md border border-[var(--border)] bg-[var(--bg-soft)] text-[var(--fg-soft)]">
                            <Mail size={15} />
                        </span>
                        <div className="flex-1">
                            <p data-mono className="text-xs text-[var(--fg-muted)]">
                                email
                            </p>
                            <p className="text-sm font-medium text-[var(--fg)]">
                                contact@estm.sn
                            </p>
                        </div>
                        <ArrowUpRight
                            size={14}
                            className="text-[var(--fg-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </a>
                    <a
                        href="https://github.com/gourbalissakh/estm-dochub"
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--bg-elev)] p-4 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-soft)]"
                    >
                        <span className="grid h-9 w-9 place-items-center rounded-md border border-[var(--border)] bg-[var(--bg-soft)] text-[var(--fg-soft)]">
                            <Code2 size={15} />
                        </span>
                        <div className="flex-1">
                            <p data-mono className="text-xs text-[var(--fg-muted)]">
                                github
                            </p>
                            <p className="text-sm font-medium text-[var(--fg)]">
                                gourbalissakh/estm-dochub
                            </p>
                        </div>
                        <ArrowUpRight
                            size={14}
                            className="text-[var(--fg-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </a>
                </div>
            </section>

            <p data-mono className="mt-10 flex items-center justify-center gap-1.5 text-xs text-[var(--fg-muted)]">
                made with <Heart size={11} className="fill-red-500 text-red-500" /> par l&apos;Amicale des étudiants Tchadiens · ESTM 2026
            </p>
        </div>
    )
}
