import { requireValidatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { assembleChunks, saveChunk, saveSingleFile } from '@/lib/upload'
import { documentMetaSchema, documentQuerySchema } from '@/lib/validators'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const query = documentQuerySchema.parse(
        Object.fromEntries(request.nextUrl.searchParams),
    )
    const where = {
        isVisible: true,
        ...(query.filiere ? { filiereId: query.filiere } : {}),
        ...(query.type ? { type: query.type } : {}),
        ...(query.niveau ? { niveau: query.niveau } : {}),
        ...(query.annee ? { anneeAcademique: query.annee } : {}),
        ...(query.q
            ? {
                  OR: [
                      {
                          title: {
                              contains: query.q,
                              mode: 'insensitive' as const,
                          },
                      },
                      {
                          matiere: {
                              contains: query.q,
                              mode: 'insensitive' as const,
                          },
                      },
                      {
                          description: {
                              contains: query.q,
                              mode: 'insensitive' as const,
                          },
                      },
                  ],
              }
            : {}),
    }
    const take = 12
    const skip = (query.page - 1) * take
    const orderBy =
        query.sort === 'popular'
            ? { downloadCount: 'desc' as const }
            : query.sort === 'title'
              ? { title: 'asc' as const }
              : { createdAt: 'desc' as const }
    const [documents, total] = await Promise.all([
        prisma.document.findMany({
            where,
            include: {
                filiere: true,
                uploader: { select: { firstName: true, lastName: true } },
            },
            orderBy,
            skip,
            take,
        }),
        prisma.document.count({ where }),
    ])
    return NextResponse.json({
        documents,
        pagination: { page: query.page, total, pages: Math.ceil(total / take) },
    })
}

export async function POST(request: NextRequest) {
    const session = await requireValidatedUser()
    if (!session)
        return NextResponse.json(
            { error: 'Connexion validee requise.' },
            { status: 403 },
        )

    const contentType = request.headers.get('content-type') ?? ''
    let formData: FormData | null = null
    const payload = contentType.includes('application/json')
        ? await request.json()
        : ((formData = await request.formData()), Object.fromEntries(formData))

    const parsed = documentMetaSchema.safeParse(payload)
    if (!parsed.success)
        return NextResponse.json(
            { error: parsed.error.flatten() },
            { status: 400 },
        )

    const data = parsed.data
    let filePath: string | null = data.blobUrl ?? null

    if (!filePath && formData) {
        const file = formData.get('file')
        if (file instanceof File) {
            if (
                data.uploadId &&
                data.chunkIndex !== undefined &&
                data.totalChunks
            ) {
                await saveChunk(data.uploadId, data.chunkIndex, file)
                if (data.chunkIndex === data.totalChunks - 1)
                    filePath = await assembleChunks(
                        data.uploadId,
                        data.totalChunks,
                        data.fileName,
                    )
                else
                    return NextResponse.json({
                        ok: true,
                        received: data.chunkIndex,
                    })
            } else {
                filePath = await saveSingleFile(file, data.fileName)
            }
        }
    }

    if (!filePath)
        return NextResponse.json(
            { error: 'Fichier manquant.' },
            { status: 400 },
        )

    try {
        const document = await prisma.document.create({
            data: {
                title: data.title,
                description: data.description,
                filePath,
                fileSize: data.fileSize,
                fileType: data.fileType,
                filiereId: data.filiereId,
                type: data.type,
                niveau: data.niveau,
                anneeAcademique: data.anneeAcademique,
                matiere: data.matiere,
                uploaderId: session.user.id,
            },
        })
        return NextResponse.json({ document }, { status: 201 })
    } catch (error: any) {
        if (error?.code === 'P2003') {
            return NextResponse.json(
                {
                    error:
                        'Session expiree ou utilisateur introuvable. Deconnectez-vous et reconnectez-vous.',
                },
                { status: 401 },
            )
        }
        return NextResponse.json(
            {
                error:
                    'Impossible d enregistrer le document. ' +
                    (error?.message ?? ''),
            },
            { status: 500 },
        )
    }
}
