import { Badge } from '@/components/ui/badge'
import { getCurrentSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { initials } from '@/lib/utils'
import { Download, FileText, Heart, Mail } from 'lucide-react'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ProfilePage() {
    const session = await getCurrentSession()
    if (!session?.user) redirect('/login')
    const [downloads, favorites] = await Promise.all([
        prisma.download.findMany({
            where: { userId: session.user.id },
            include: { document: true },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.favorite.findMany({
            where: { userId: session.user.id },
            include: { document: true },
            orderBy: { createdAt: 'desc' },
        }),
    ])

    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            {/* HEADER */}
            <div className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)]">
                <div className="border-b border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3">
                    <p data-mono className="text-xs text-[var(--fg-muted)]">/profile</p>
                </div>
                <div className="flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center">
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-md border border-[var(--border)] bg-[var(--bg-soft)] text-lg font-semibold text-[var(--fg)]">
                        {initials(session.user.firstName, session.user.lastName)}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl font-semibold tracking-tight text-[var(--fg)]">
                            {session.user.firstName} {session.user.lastName}
                        </h1>
                        <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-[var(--fg-soft)]" data-mono>
                            <Mail size={12} />
                            {session.user.email}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        <Badge variant={session.user.role === 'ADMIN' ? 'solid' : 'primary'}>
                            {session.user.role}
                        </Badge>
                        <Badge variant="success">{session.user.status}</Badge>
                    </div>
                </div>
            </div>

            {/* STATS */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <StatCard icon={<Download size={14} />} label="Téléchargements" value={downloads.length} />
                <StatCard icon={<Heart size={14} />} label="Favoris" value={favorites.length} />
            </div>

            {/* LISTS */}
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <ProfileList
                    title="downloads"
                    items={downloads.map((d) => ({ id: d.id, title: d.document.title }))}
                    empty="Aucun téléchargement"
                />
                <ProfileList
                    title="favorites"
                    items={favorites.map((f) => ({ id: `${f.userId}-${f.documentId}`, title: f.document.title }))}
                    empty="Aucun favori"
                />
            </div>
        </div>
    )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
    return (
        <div className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-4 py-3">
            <div>
                <div data-mono className="text-xs text-[var(--fg-muted)]">{label.toLowerCase()}</div>
                <div className="mt-0.5 text-2xl font-semibold tabular-nums text-[var(--fg)]">{value}</div>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-md border border-[var(--border)] bg-[var(--bg-soft)] text-[var(--fg-soft)]">
                {icon}
            </span>
        </div>
    )
}

function ProfileList({ title, items, empty }: { title: string; items: Array<{ id: string; title: string }>; empty: string }) {
    return (
        <div className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg-elev)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2">
                <span data-mono className="text-xs text-[var(--fg-muted)]">{title}</span>
                <span data-mono className="text-[10px] text-[var(--fg-muted)]">{items.length}</span>
            </div>
            <div>
                {items.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[var(--fg-muted)]" data-mono>
                        {empty}
                    </div>
                ) : (
                    items.slice(0, 10).map((item) => (
                        <Link
                            key={item.id}
                            href="/documents"
                            className="flex items-center gap-2 border-b border-[var(--border)] px-3 py-2 text-sm text-[var(--fg)] transition-colors last:border-b-0 hover:bg-[var(--bg-soft)]"
                        >
                            <FileText size={12} className="shrink-0 text-[var(--fg-muted)]" />
                            <span className="truncate">{item.title}</span>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}
