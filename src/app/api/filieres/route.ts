import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    const filieres = await prisma.filiere.findMany({
        orderBy: [{ sector: 'desc' }, { name: 'asc' }],
        include: { _count: { select: { documents: true, users: true } } },
    })
    return NextResponse.json({ filieres })
}
