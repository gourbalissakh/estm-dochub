import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCurrentSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { initials } from '@/lib/utils'
import {
    BadgeCheck,
    Download,
    Heart,
    Mail,
    MessageCircle,
    Sparkles,
} from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
    const session = await getCurrentSession()
    if (!session?.user) redirect('/login')
    const [downloads, favorites, messages] = await Promise.all([
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
        prisma.message.findMany({
            where: { authorId: session.user.id },
            include: { filiere: true },
            orderBy: { createdAt: 'desc' },
        }),
    ])

    const stats = [
        { label: 'Telechargements', value: downloads.length, Icon: Download },
        { label: 'Favoris', value: favorites.length, Icon: Heart },
        { label: 'Messages', value: messages.length, Icon: MessageCircle },
    ]

    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-mesh opacity-60" />
            <div className="mx-auto max-w-6xl px-4 py-10">
                {/* HEADER */}
                <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-elev)] shadow-[var(--shadow-md)]">
                    <div className="h-32 w-full bg-grad-primary relative">
                        <div className="absolute inset-0 dotted-grid opacity-30" />
                    </div>
                    <div className="relative -mt-12 flex flex-col items-start gap-5 px-6 pb-6 sm:-mt-14 sm:flex-row sm:items-end sm:px-8">
                        <div className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl border-4 border-[var(--bg-elev)] bg-[image:linear-gradient(135deg,#7c3aed,#06b6d4)] text-2xl font-bold text-white shadow-md">
                            {initials(
                                session.user.firstName,
                                session.user.lastName,
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-[var(--fg)] sm:text-3xl">
                                    {session.user.firstName} {session.user.lastName}
                                </h1>
                                <Badge variant="success">
                                    <BadgeCheck size={11} /> Verifie
                                </Badge>
                                <Badge variant={session.user.role === 'ADMIN' ? 'solid' : 'default'}>
                                    {session.user.role === 'ADMIN' && (
                                        <Sparkles size={11} />
                                    )}
                                    {session.user.role}
                                </Badge>
                            </div>
                            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-[var(--fg-soft)]">
                                <Mail size={13} />
                                {session.user.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* STATS */}
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {stats.map(({ label, value, Icon }) => (
                        <Card key={label}>
                            <CardContent className="flex items-center gap-4 pt-5">
                                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold tabular-nums text-[var(--fg)]">
                                        {value}
                                    </div>
                                    <div className="text-xs font-medium text-[var(--fg-muted)]">
                                        {label}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* LISTS */}
                <div className="mt-6 grid gap-5 lg:grid-cols-3">
                    <ProfileList
                        title="Telecharges"
                        icon={<Download size={16} />}
                        items={downloads.map((d) => d.document.title)}
                    />
                    <ProfileList
                        title="Favoris"
                        icon={<Heart size={16} />}
                        items={favorites.map((f) => f.document.title)}
                    />
                    <ProfileList
                        title="Messages"
                        icon={<MessageCircle size={16} />}
                        items={messages.map(
                            (m) => `${m.filiere.code}: ${m.content}`,
                        )}
                    />
                </div>
            </div>
        </div>
    )
}

function ProfileList({
    title,
    icon,
    items,
}: {
    title: string
    icon: React.ReactNode
    items: string[]
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
                        {icon}
                    </span>
                    {title}
                    <span className="ml-auto text-xs font-medium text-[var(--fg-muted)]">
                        {items.length}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-[var(--fg-soft)]">
                {items.length ? (
                    items.slice(0, 8).map((item, index) => (
                        <div
                            key={`${item}-${index}`}
                            className="line-clamp-1 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-[var(--fg)] transition hover:border-[var(--primary)]/40"
                        >
                            {item}
                        </div>
                    ))
                ) : (
                    <p className="rounded-lg border border-dashed border-[var(--border-strong)] py-6 text-center text-xs text-[var(--fg-muted)]">
                        Aucune activite pour le moment.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
