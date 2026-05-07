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
        <div className="relative">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-mesh opacity-60" />
            <div className="mx-auto max-w-7xl px-4 py-10">
                <div className="mb-8 flex flex-col items-start gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-elev)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                        <FileText size={12} /> Catalogue
                    </span>
                    <h1 className="text-4xl font-bold tracking-tight text-[var(--fg)] sm:text-5xl">
                        Tous les <span className="text-gradient">documents</span>
                    </h1>
                    <p className="max-w-xl text-sm text-[var(--fg-soft)]">
                        Recherche rapide par mot-cle. Cours, TP, TD et anciens
                        sujets de toutes les filieres.
                    </p>
                </div>

                <div className="sticky top-[72px] z-30 mb-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)]/85 p-3 shadow-[var(--shadow-md)] backdrop-blur">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                        <div className="relative flex-1">
                            <Search
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--fg-muted)]"
                                size={16}
                            />
                            <Input
                                className="h-12 border-0 bg-[var(--bg-soft)] pl-11 text-base shadow-none hover:border-transparent"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && update('q', q)
                                }
                                placeholder="Rechercher un cours, TP, TD ou ancien sujet..."
                            />
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Button
                                size="lg"
                                onClick={() => update('q', q)}
                                className="w-full sm:w-auto"
                            >
                                <Search size={15} /> Chercher
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto"
                            >
                                <Link
                                    href={
                                        session
                                            ? '/documents/upload'
                                            : '/login?callbackUrl=/documents/upload'
                                    }
                                >
                                    <Upload size={15} />
                                    Deposer
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid place-items-center py-20 text-[var(--fg-muted)]">
                        <Loader2 className="animate-spin" size={28} />
                        <p className="mt-3 text-sm font-medium">Chargement...</p>
                    </div>
                ) : (
                    <>
                        {data?.documents?.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-elev)] p-14 text-center">
                                <FileText
                                    size={32}
                                    className="mx-auto text-[var(--fg-muted)]"
                                />
                                <p className="mt-3 text-base font-semibold text-[var(--fg)]">
                                    Aucun document trouve
                                </p>
                                <p className="mt-1 text-sm text-[var(--fg-soft)]">
                                    Essayez avec un autre mot-cle.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {data?.documents?.map((document: any, i: number) => (
                                    <div
                                        key={document.id}
                                        className="animate-fade-in"
                                        style={{ animationDelay: `${i * 30}ms` }}
                                    >
                                        <DocCard
                                            document={document}
                                            onPreview={setPreview}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {data?.pagination && (data?.pagination?.pages ?? 1) > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-3">
                                <Button
                                    variant="outline"
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
                                    <ChevronLeft size={15} /> Precedent
                                </Button>
                                <span className="rounded-full border border-[var(--border)] bg-[var(--bg-elev)] px-4 py-1.5 text-sm font-semibold text-[var(--fg-soft)]">
                                    Page {data?.pagination?.page ?? 1} /{' '}
                                    {data?.pagination?.pages || 1}
                                </span>
                                <Button
                                    variant="outline"
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
                                    Suivant <ChevronRight size={15} />
                                </Button>
                            </div>
                        )}
                    </>
                )}
                <DocPreviewModal id={preview} onClose={() => setPreview(null)} />
            </div>
        </div>
    )
}
