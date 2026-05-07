'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { upload } from '@vercel/blob/client'
import { Upload } from 'lucide-react'
import { useEffect, useState } from 'react'

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

const initialForm = {
    type: 'COURS',
    niveau: 'L1',
    anneeAcademique: '2025-2026',
}

export function DocumentUploadForm() {
    const [filieres, setFilieres] = useState<any[]>([])
    const [file, setFile] = useState<File | null>(null)
    const [progress, setProgress] = useState(0)
    const [state, setState] = useState<UploadState>('idle')
    const [message, setMessage] = useState(
        'Tous les utilisateurs valides peuvent proposer un document.',
    )
    const [form, setForm] = useState<Record<string, string>>({ ...initialForm })

    useEffect(() => {
        let active = true
        fetch('/api/filieres')
            .then((response) => response.json())
            .then((data) => {
                if (!active) return
                setFilieres(data.filieres ?? [])
                setForm((current) => ({
                    ...current,
                    filiereId:
                        current.filiereId || data.filieres?.[0]?.id || '',
                }))
            })
            .catch(() => {
                if (active) {
                    setState('error')
                    setMessage('Impossible de charger les filieres.')
                }
            })

        return () => {
            active = false
        }
    }, [])

    async function submitLocalUpload(currentFile: File, filiereId: string) {
        const chunkSize = 5 * 1024 * 1024
        const totalChunks = Math.ceil(currentFile.size / chunkSize)
        const uploadId = crypto.randomUUID()

        for (let index = 0; index < totalChunks; index += 1) {
            const body = new FormData()
            Object.entries({
                ...form,
                filiereId,
                fileName: currentFile.name,
                fileType: currentFile.type || 'application/pdf',
                fileSize: String(currentFile.size),
                uploadId,
                chunkIndex: String(index),
                totalChunks: String(totalChunks),
            }).forEach(([key, value]) => body.set(key, value))
            body.set(
                'file',
                currentFile.slice(index * chunkSize, (index + 1) * chunkSize),
                currentFile.name,
            )

            const response = await fetch('/api/documents', {
                method: 'POST',
                body,
            })
            const payload = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new Error(
                    typeof payload?.error === 'string'
                        ? payload.error
                        : "Le serveur a refuse l'envoi. Verifiez votre session.",
                )
            }

            setProgress(Math.round(((index + 1) / totalChunks) * 100))
        }
    }

    async function submitBlobUpload(currentFile: File, filiereId: string) {
        const blob = await upload(currentFile.name, currentFile, {
            access: 'public',
            handleUploadUrl: '/api/uploads/documents',
        })

        const response = await fetch('/api/documents', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                ...form,
                filiereId,
                fileName: currentFile.name,
                fileType: currentFile.type || 'application/pdf',
                fileSize: String(currentFile.size),
                blobUrl: blob.url,
            }),
        })
        const payload = await response.json().catch(() => ({}))

        if (!response.ok) {
            throw new Error(
                typeof payload?.error === 'string'
                    ? payload.error
                    : "Le serveur a refuse l'enregistrement du document.",
            )
        }

        setProgress(100)
    }

    async function submit() {
        const filiereId = form.filiereId || filieres[0]?.id
        if (!file || !filiereId) {
            setState('error')
            setMessage(
                "Selectionnez un fichier et une filiere avant d'envoyer.",
            )
            return
        }

        setState('uploading')
        setProgress(0)
        setMessage('Envoi du document en cours...')

        try {
            await submitBlobUpload(file, filiereId)
            setState('success')
            setMessage('Document envoye avec succes via stockage cloud.')
            setFile(null)
            setForm((current) => ({
                ...current,
                title: '',
                description: '',
                matiere: '',
            }))
            return
        } catch {
            setMessage('Stockage cloud indisponible, passage en mode local...')
        }

        try {
            await submitLocalUpload(file, filiereId)
            setState('success')
            setMessage('Document envoye avec succes.')
            setFile(null)
            setProgress(100)
            setForm((current) => ({
                ...current,
                title: '',
                description: '',
                matiere: '',
            }))
        } catch (error) {
            setState('error')
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Impossible d'envoyer le document.",
            )
        }
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader className="border-b border-[var(--border)] bg-grad-soft">
                <CardTitle className="text-xl">Ajouter un document</CardTitle>
                <p className="max-w-2xl text-sm text-[var(--fg-soft)]">
                    Partagez un cours, un TD, un TP ou un ancien sujet. Les
                    documents sont relies a une filiere ESTM et restent lisibles
                    sur mobile.
                </p>
            </CardHeader>
            <CardContent className="grid gap-6 pt-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)] lg:gap-8">
                <div className="grid gap-4">
                    <label className="group/drop grid min-h-40 cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-[var(--border-strong)] bg-[var(--bg-soft)] p-6 text-center transition hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/40">
                        <input
                            className="hidden"
                            type="file"
                            accept="application/pdf,.pdf"
                            onChange={(event) =>
                                setFile(event.target.files?.[0] ?? null)
                            }
                        />
                        <div className="space-y-2">
                            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] transition group-hover/drop:scale-110">
                                <Upload size={20} />
                            </div>
                            <p className="font-semibold text-[var(--fg)]">
                                {file ? file.name : 'Choisir un fichier PDF'}
                            </p>
                            <p className="text-sm text-[var(--fg-soft)]">
                                Glissez-deposez ou cliquez pour selectionner un
                                document.
                            </p>
                        </div>
                    </label>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Input
                            placeholder="Titre du document"
                            value={form.title ?? ''}
                            onChange={(event) =>
                                setForm({ ...form, title: event.target.value })
                            }
                        />
                        <Input
                            placeholder="Matiere"
                            value={form.matiere ?? ''}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    matiere: event.target.value,
                                })
                            }
                        />
                    </div>

                    <Textarea
                        placeholder="Description"
                        value={form.description ?? ''}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                description: event.target.value,
                            })
                        }
                    />

                    <div className="grid gap-3 md:grid-cols-4">
                        <select
                            className="h-11 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-soft)] px-3 text-sm text-[var(--fg)] outline-none transition focus:border-[var(--primary)] focus:ring-[3px] focus:ring-[var(--ring)]"
                            value={form.filiereId || ''}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    filiereId: event.target.value,
                                })
                            }
                        >
                            <option value="">Choisir une filiere</option>
                            {filieres.map((filiere) => (
                                <option key={filiere.id} value={filiere.id}>
                                    {filiere.name}
                                </option>
                            ))}
                        </select>
                        <select
                            className="h-11 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-soft)] px-3 text-sm text-[var(--fg)] outline-none transition focus:border-[var(--primary)] focus:ring-[3px] focus:ring-[var(--ring)]"
                            value={form.type}
                            onChange={(event) =>
                                setForm({ ...form, type: event.target.value })
                            }
                        >
                            <option value="COURS">Cours</option>
                            <option value="ANCIEN_SUJET">Ancien sujet</option>
                            <option value="TP">TP</option>
                            <option value="TD">TD</option>
                            <option value="AUTRE">Autre</option>
                        </select>
                        <select
                            className="h-11 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-soft)] px-3 text-sm text-[var(--fg)] outline-none transition focus:border-[var(--primary)] focus:ring-[3px] focus:ring-[var(--ring)]"
                            value={form.niveau}
                            onChange={(event) =>
                                setForm({ ...form, niveau: event.target.value })
                            }
                        >
                            <option value="L1">L1</option>
                            <option value="L2">L2</option>
                            <option value="L3">L3</option>
                            <option value="M1">M1</option>
                            <option value="M2">M2</option>
                        </select>
                        <Input
                            value={form.anneeAcademique}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    anneeAcademique: event.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-soft)] ring-1 ring-inset ring-[var(--border)]">
                            <div
                                data-testid="upload-progress"
                                className="h-full bg-[image:linear-gradient(90deg,#7c3aed,#06b6d4)] transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-sm text-[var(--fg-soft)]">
                            {message}
                        </p>
                    </div>

                    <Button
                        className="w-full sm:w-fit"
                        type="button"
                        disabled={
                            !file || !form.filiereId || state === 'uploading'
                        }
                        onClick={submit}
                    >
                        {state === 'uploading'
                            ? 'Envoi en cours...'
                            : 'Envoyer le document'}
                    </Button>
                </div>

                <aside className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-5 text-sm text-[var(--fg-soft)]">
                    <h3 className="text-base font-semibold text-[var(--fg)]">
                        Avant l&apos;envoi
                    </h3>
                    <ul className="mt-4 grid gap-3">
                        {[
                            'PDF recommande pour une lecture uniforme.',
                            'Chaque document doit etre associe a une filiere ESTM.',
                            'Les intitules courts et precis facilitent la recherche.',
                            'Les utilisateurs valides peuvent deposer un document.',
                        ].map((tip) => (
                            <li
                                key={tip}
                                className="flex items-start gap-2 leading-relaxed"
                            >
                                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
                                {tip}
                            </li>
                        ))}
                    </ul>
                </aside>
            </CardContent>
        </Card>
    )
}
