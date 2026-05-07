import { FiliereCard } from '@/components/filieres/filiere-card'
import { prisma } from '@/lib/prisma'
import { cn } from '@/lib/utils'
import { Layers } from 'lucide-react'
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
        orderBy: { name: 'asc' },
    })
    const tabs = [
        ['Toutes', '/filieres', !sector],
        ['Technique', '/filieres?sector=TECH', sector === 'TECH'],
        ['Gestion', '/filieres?sector=MGMT', sector === 'MGMT'],
    ] as const

    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-mesh opacity-60" />
            <div className="mx-auto max-w-7xl px-4 py-12">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-elev)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                            <Layers size={12} /> Filieres
                        </span>
                        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--fg)] sm:text-5xl">
                            Filieres <span className="text-gradient">ESTM</span>
                        </h1>
                        <p className="mt-2 max-w-xl text-sm text-[var(--fg-soft)]">
                            Selectionnez une filiere pour acceder a tous les
                            documents associes.
                        </p>
                    </div>
                    <span className="rounded-full border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-1 text-xs font-semibold text-[var(--fg-soft)]">
                        {filieres.length} {filieres.length > 1 ? 'filieres' : 'filiere'}
                    </span>
                </div>

                <div className="my-8 inline-flex flex-wrap gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-elev)] p-1 shadow-[var(--shadow-sm)]">
                    {tabs.map(([label, href, active]) => (
                        <Link
                            key={href}
                            className={cn(
                                'rounded-full px-4 py-2 text-sm font-semibold transition',
                                active
                                    ? 'bg-[image:linear-gradient(135deg,#7c3aed,#06b6d4)] text-white shadow-sm'
                                    : 'text-[var(--fg-soft)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]',
                            )}
                            href={href}
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filieres.map((f, i) => (
                        <div
                            key={f.id}
                            className="animate-fade-in"
                            style={{ animationDelay: `${i * 40}ms` }}
                        >
                            <FiliereCard filiere={f} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
