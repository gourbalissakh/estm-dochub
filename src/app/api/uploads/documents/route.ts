import { requireValidatedUser } from '@/lib/auth'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const body = (await request.json()) as HandleUploadBody

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async () => {
                const session = await requireValidatedUser()
                if (!session) {
                    throw new Error('Connexion validee requise.')
                }

                return {
                    allowedContentTypes: [
                        'application/pdf',
                        'application/octet-stream',
                    ],
                    addRandomSuffix: true,
                }
            },
        })

        return NextResponse.json(jsonResponse)
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error ? error.message : 'Upload refuse.',
            },
            { status: 400 },
        )
    }
}
