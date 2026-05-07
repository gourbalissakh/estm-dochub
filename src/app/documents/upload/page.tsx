import { DocumentUploadForm } from '@/components/docs/document-upload-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { requireValidatedUser } from '@/lib/auth'
import { Upload } from 'lucide-react'
import Link from 'next/link'

export default async function DocumentUploadPage() {
    const session = await requireValidatedUser()

    if (!session) {
        return (
            <div className="relative">
                <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-mesh opacity-60" />
                <div className="mx-auto max-w-3xl px-4 py-16">
                    <Card>
                        <CardHeader>
                            <CardTitle>Deposer un document</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-[var(--fg-soft)]">
                                Connectez-vous avec un compte valide pour
                                proposer un document academique.
                            </p>
                            <Button asChild>
                                <Link href="/login?callbackUrl=/documents/upload">
                                    Connexion
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-mesh opacity-60" />
            <div className="mx-auto max-w-6xl px-4 py-12">
                <div className="mb-8 max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-elev)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                        <Upload size={12} /> Contribuer
                    </span>
                    <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--fg)] sm:text-5xl">
                        Deposer un <span className="text-gradient">document</span>
                    </h1>
                    <p className="mt-2 text-sm text-[var(--fg-soft)]">
                        Votre contribution aide toute la communaute ESTM a
                        trouver plus vite des cours, TD, TP et anciens sujets.
                    </p>
                </div>
                <DocumentUploadForm />
            </div>
        </div>
    )
}
