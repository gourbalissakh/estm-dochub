import { GraduationCap, Heart, Mail } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
    const columns: Array<
        [string, [string, string], [string, string], [string, string]]
    > = [
        [
            'Plateforme',
            ['Documents', '/documents'],
            ['Filieres', '/filieres'],
            ['Deposer', '/documents/upload'],
        ],
        [
            'Ressources',
            ['Cours', '/documents?type=COURS'],
            ['TP', '/documents?type=TP'],
            ['Anciens sujets', '/documents?type=ANCIEN_SUJET'],
        ],
        [
            'ESTM Dakar',
            ['Filiere technique', '/filieres?sector=TECH'],
            ['Filiere gestion', '/filieres?sector=MGMT'],
            ['Travaux Diriges', '/documents?type=TD'],
        ],
        [
            'Support',
            ['Profil', '/profile'],
            ['Connexion', '/login'],
            ['Inscription', '/register'],
        ],
    ]
    return (
        <footer className="relative mt-auto overflow-hidden border-t border-[var(--border)] bg-[var(--bg-soft)]">
            <div className="pointer-events-none absolute inset-x-0 -top-32 h-64 bg-mesh opacity-50" />
            <div className="relative mx-auto max-w-7xl px-4 py-14">
                <div className="grid gap-10 lg:grid-cols-[1.4fr_3fr]">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2.5 text-lg font-bold text-[var(--fg)]"
                        >
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[image:linear-gradient(135deg,#7c3aed,#6d28d9_50%,#06b6d4)] text-white shadow-md">
                                <GraduationCap size={20} />
                            </span>
                            ESTM <span className="text-gradient">DocHub</span>
                        </Link>
                        <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--fg-soft)]">
                            La plateforme communautaire des etudiants de l&apos;ESTM Dakar.
                            Cours, TP, TD et anciens sujets organises par filiere et niveau.
                        </p>
                        <div className="mt-5 flex items-center gap-3">
                            <a
                                href="mailto:contact@estm.sn"
                                className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--fg-soft)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                                aria-label="Email"
                            >
                                <Mail size={15} />
                            </a>
                        </div>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {columns.map(([title, ...items]) => (
                            <div key={title}>
                                <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--fg-muted)]">
                                    {title}
                                </h3>
                                <div className="grid gap-2.5 text-sm text-[var(--fg-soft)]">
                                    {items.map(([label, href]) => (
                                        <Link
                                            key={label}
                                            href={href}
                                            className="w-fit transition-colors hover:text-[var(--primary)]"
                                        >
                                            {label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-[var(--border)] pt-6 text-xs text-[var(--fg-muted)] sm:flex-row">
                    <p className="flex items-center gap-1.5">
                        <span>&copy; 2026 ESTM DocHub.</span>
                        <span className="hidden sm:inline">Cree avec</span>
                        <Heart
                            size={12}
                            className="hidden fill-rose-500 text-rose-500 sm:inline animate-pulse-soft"
                        />
                        <span className="hidden sm:inline">par l&apos;Amicale des etudiants Tchadiens.</span>
                    </p>
                    <p>
                        Developpe par{' '}
                        <span className="font-semibold text-[var(--fg-soft)]">
                            @Gourbal2026
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    )
}
