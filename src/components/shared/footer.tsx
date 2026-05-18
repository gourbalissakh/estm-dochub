import Link from 'next/link'

export function Footer() {
    const columns: Array<[string, Array<[string, string]>]> = [
        [
            'plateforme',
            [
                ['documents', '/documents'],
                ['filieres', '/filieres'],
                ['deposer', '/documents/upload'],
            ],
        ],
        [
            'ressources',
            [
                ['cours', '/documents?type=COURS'],
                ['tp', '/documents?type=TP'],
                ['td', '/documents?type=TD'],
                ['anciens-sujets', '/documents?type=ANCIEN_SUJET'],
            ],
        ],
        [
            'estm',
            [
                ['filieres tech', '/filieres?sector=TECH'],
                ['filieres gestion', '/filieres?sector=MGMT'],
                ['estm.sn', 'https://www.estm.sn'],
            ],
        ],
        [
            'compte',
            [
                ['connexion', '/login'],
                ['inscription', '/register'],
                ['profil', '/profile'],
                ['a propos', '/about'],
            ],
        ],
    ]
    return (
        <footer className="mt-auto border-t border-[var(--border)] bg-[var(--bg-soft)]">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="grid gap-8 lg:grid-cols-[1.5fr_3fr]">
                    <div>
                        <Link
                            href="/"
                            data-mono
                            className="text-sm font-semibold text-[var(--fg)]"
                        >
                            ESTM/dochub
                        </Link>
                        <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--fg-soft)]">
                            Plateforme de partage de cours, TP, TD et anciens sujets pour les étudiants de l&apos;École Supérieure de Technologie et de Management de Dakar.
                        </p>
                        <p data-mono className="mt-4 text-xs text-[var(--fg-muted)]">
                            v0.1.0 · 2026
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {columns.map(([title, items]) => (
                            <div key={title}>
                                <h3 data-mono className="mb-3 text-xs font-medium text-[var(--fg-muted)]">
                                    {title}
                                </h3>
                                <div className="grid gap-1.5 text-sm text-[var(--fg-soft)]">
                                    {items.map(([label, href]) => (
                                        <Link
                                            key={label}
                                            data-mono
                                            href={href}
                                            className="w-fit text-xs transition-colors hover:text-[var(--fg)]"
                                        >
                                            {label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-[var(--border)] pt-5 text-xs text-[var(--fg-muted)] sm:flex-row sm:items-center">
                    <p data-mono>
                        © 2026 ESTM DocHub · Amicale des étudiants Tchadiens
                    </p>
                    <p data-mono>
                        dev{' '}
                        <a
                            href="https://github.com/gourbalissakh"
                            target="_blank"
                            rel="noreferrer"
                            className="text-[var(--fg-soft)] hover:text-[var(--fg)] underline-offset-2 hover:underline"
                        >
                            @Gourbal2026
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}
