import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    const session = await requireAdmin()
    if (!session)
        return NextResponse.json(
            { error: 'Acces admin requis.' },
            { status: 403 },
        )
    const [documents, downloads] = await Promise.all([
        prisma.document.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { title: true, createdAt: true },
        }),
        prisma.download.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { document: { select: { title: true } } },
        }),
    ])
    const activity = [
        ...documents.map((item) => ({
            type: 'Document',
            label: item.title,
            createdAt: item.createdAt,
        })),
        ...downloads.map((item) => ({
            type: 'Telechargement',
            label: item.document.title,
            createdAt: item.createdAt,
        })),
    ]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5)
    return NextResponse.json({ activity })
}
