import { FiliereCard } from '@/components/filieres/filiere-card'
import { prisma } from '@/lib/prisma'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default async function FilieresPage({
    searchParams,
}: {
    searchParams: { sector?: string }
}) {
    const sector = searchParams.sector
    const filieres = await prisma.filiere.findMany({
        where: sector === 'TECH' || sector === 'MGMT' ? { sector } : {},
        include: { _count: { select: { documents: true, users: true } } },
        orderBy: { code: 'asc' },
    })
    const tabs = [
        ['all', '/filieres', !sector],
        ['tech', '/filieres?sector=TECH', sector === 'TECH'],
        ['mgmt', '/filieres?sector=MGMT', sector === 'MGMT'],
    ] as const

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
                <div>
                    <p data-mono className="text-xs text-[var(--fg-muted)]">/filieres</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--fg)]">
                        Filières ESTM
                    </h1>
                    <p className="mt-1 text-sm text-[var(--fg-soft)]">
                        {filieres.length} filière{filieres.length > 1 ? 's' : ''} {sector === 'TECH' ? 'techniques' : sector === 'MGMT' ? 'de gestion' : 'officielles ESTM Dakar'}
                    </p>
                </div>

                <div className="inline-flex rounded-md border border-[var(--border)] bg-[var(--bg-elev)] p-0.5">
                    {tabs.map(([label, href, active]) => (
                        <Link
                            key={href}
                            data-mono
                            className={cn(
                                'rounded px-2.5 py-1 text-xs transition-colors',
                                active
                                    ? 'bg-[var(--fg)] text-[var(--bg)]'
                                    : 'text-[var(--fg-soft)] hover:text-[var(--fg)]',
                            )}
                            href={href}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filieres.map((f) => (
                    <FiliereCard key={f.id} filiere={f} />
                ))}
            </div>
        </div>
    )
}
