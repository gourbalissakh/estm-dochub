'use client'

import { DocCard } from '@/components/docs/doc-card'
import { DocPreviewModal } from '@/components/docs/doc-preview-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQuery } from '@tanstack/react-query'
import {
    ChevronLeft,
    ChevronRight,
    FileText,
    Loader2,
    Search,
    Upload,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function DocumentsClient() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { data: session } = useSession()
    const [preview, setPreview] = useState<string | null>(null)
    const [q, setQ] = useState(searchParams.get('q') ?? '')
    const params = searchParams.toString()
    const { data, isLoading } = useQuery({
        queryKey: ['documents', params],
        queryFn: () =>
            fetch(`/api/documents?${params}`).then((res) => res.json()),
    })

    function update(key: string, value: string) {
        const next = new URLSearchParams(searchParams)
        if (value) next.set(key, value)
        else next.delete(key)
        if (key !== 'page') next.set('page', '1')
        router.push(`/documents?${next.toString()}`)
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
                <div>
                    <p data-mono className="text-xs text-[var(--fg-muted)]">/documents</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--fg)]">
                        Documents
                    </h1>
                    <p className="mt-1 text-sm text-[var(--fg-soft)]">
                        Cours, TP, TD et anciens sujets · recherche par mot-clé, filière, niveau
                    </p>
                </div>
                <Button asChild variant="outline" size="md">
                    <Link
                        href={
                            session
                                ? '/documents/upload'
                                : '/login?callbackUrl=/documents/upload'
                        }
                    >
                        <Upload size={13} /> Déposer
                    </Link>
                </Button>
            </div>

            <div className="sticky top-12 z-30 my-6 flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--bg-elev)] p-1">
                <div className="relative flex-1">
                    <Search
                        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--fg-muted)]"
                        size={14}
                    />
                    <input
                        data-mono
                        className="h-8 w-full bg-transparent pl-8 pr-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] outline-none"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && update('q', q)}
                        placeholder="rechercher un document..."
                    />
                </div>
                <Button size="sm" onClick={() => update('q', q)}>
                    Chercher
                </Button>
            </div>

            {isLoading ? (
                <div className="grid place-items-center py-20 text-[var(--fg-muted)]">
                    <Loader2 className="animate-spin" size={20} />
                    <p data-mono className="mt-3 text-xs">chargement...</p>
                </div>
            ) : (
                <>
                    {data?.documents?.length === 0 ? (
                        <div className="rounded-md border border-dashed border-[var(--border)] p-12 text-center">
                            <FileText
                                size={24}
                                className="mx-auto text-[var(--fg-muted)]"
                            />
                            <p className="mt-3 text-sm font-medium text-[var(--fg)]">
                                Aucun document trouvé
                            </p>
                            <p className="mt-1 text-xs text-[var(--fg-soft)]">
                                Essaye un autre mot-clé.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {data?.documents?.map((document: any) => (
                                <DocCard
                                    key={document.id}
                                    document={document}
                                    onPreview={setPreview}
                                />
                            ))}
                        </div>
                    )}

                    {data?.pagination && (data?.pagination?.pages ?? 1) > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={(data?.pagination?.page ?? 1) <= 1}
                                onClick={() =>
                                    update(
                                        'page',
                                        String(
                                            (data.pagination.page ?? 1) - 1,
                                        ),
                                    )
                                }
                            >
                                <ChevronLeft size={13} /> Précédent
                            </Button>
                            <span data-mono className="rounded-md border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-1 text-xs text-[var(--fg-soft)]">
                                {data?.pagination?.page ?? 1} / {data?.pagination?.pages || 1}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                    (data?.pagination?.page ?? 1) >=
                                    (data?.pagination?.pages || 1)
                                }
                                onClick={() =>
                                    update(
                                        'page',
                                        String(
                                            (data.pagination.page ?? 1) + 1,
                                        ),
                                    )
                                }
                            >
                                Suivant <ChevronRight size={13} />
                            </Button>
                        </div>
                    )}
                </>
            )}
            <DocPreviewModal id={preview} onClose={() => setPreview(null)} />
        </div>
    )
}
