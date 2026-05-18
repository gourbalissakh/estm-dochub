import { DocumentUploadForm } from '@/components/docs/document-upload-form'
import { Button } from '@/components/ui/button'
import { requireValidatedUser } from '@/lib/auth'
import Link from 'next/link'

export default async function DocumentUploadPage() {
    const session = await requireValidatedUser()

    if (!session) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-16">
                <div className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)]">
                    <div className="border-b border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3">
                        <p data-mono className="text-xs text-[var(--fg-muted)]">$ documents.upload</p>
                        <h1 className="mt-1 text-base font-semibold tracking-tight text-[var(--fg)]">
                            Connexion requise
                        </h1>
                    </div>
                    <div className="p-4 space-y-3">
                        <p className="text-sm text-[var(--fg-soft)]">
                            Connecte-toi avec un compte validé pour déposer un document.
                        </p>
                        <Button asChild>
                            <Link href="/login?callbackUrl=/documents/upload">
                                Se connecter
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <div className="mb-5">
                <p data-mono className="text-xs text-[var(--fg-muted)]">/documents/upload</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--fg)]">
                    Déposer un document
                </h1>
                <p className="mt-1 text-sm text-[var(--fg-soft)]">
                    PDF uniquement · max 4.5 MB sur le plan gratuit Vercel.
                </p>
            </div>
            <DocumentUploadForm />
        </div>
    )
}
