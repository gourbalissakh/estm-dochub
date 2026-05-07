import { requireValidatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { messageSchema } from '@/lib/validators'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const filiereId = request.nextUrl.searchParams.get('filiere') || undefined
    const q = request.nextUrl.searchParams.get('q') || undefined
    const messages = await prisma.message.findMany({
        where: {
            isVisible: true,
            ...(filiereId ? { filiereId } : {}),
            ...(q ? { content: { contains: q, mode: 'insensitive' } } : {}),
        },
        include: {
            author: {
                select: { firstName: true, lastName: true, avatarUrl: true },
            },
            filiere: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
    })
    return NextResponse.json({ messages })
}

export async function POST(request: NextRequest) {
    const limited = rateLimit(request, 'messages')
    if (limited) return limited
    const session = await requireValidatedUser()
    if (!session)
        return NextResponse.json(
            { error: 'Compte valide requis.' },
            { status: 401 },
        )
    const parsed = messageSchema.safeParse(await request.json())
    if (!parsed.success)
        return NextResponse.json(
            { error: parsed.error.flatten() },
            { status: 400 },
        )
    const message = await prisma.message.create({
        data: {
            content: parsed.data.content,
            filiereId: parsed.data.filiereId,
            authorId: session.user.id,
        },
        include: {
            author: { select: { firstName: true, lastName: true } },
            filiere: true,
        },
    })
    return NextResponse.json({ message }, { status: 201 })
}
