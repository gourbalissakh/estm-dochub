'use client'

import { Button } from '@/components/ui/button'
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

    async function saveDocumentRecord(
        currentFile: File,
        filiereId: string,
        blobUrl: string,
    ) {
        const response = await fetch('/api/documents', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                ...form,
                filiereId,
                fileName: currentFile.name,
                fileType: currentFile.type || 'application/pdf',
                fileSize: String(currentFile.size),
                blobUrl,
            }),
        })
        const payload = await response.json().catch(() => ({}))
        if (!response.ok) {
            const detail =
                typeof payload?.error === 'string'
                    ? payload.error
                    : payload?.error?.fieldErrors
                      ? Object.entries(payload.error.fieldErrors)
                            .map(
                                ([key, errors]) =>
                                    `${key}: ${(errors as string[]).join(', ')}`,
                            )
                            .join(' | ')
                      : "Le serveur a refuse l'enregistrement du document."
            throw new Error(detail)
        }
    }

    function validate(filiereId: string): string | null {
        if (!file) return 'Selectionnez un fichier PDF avant d envoyer.'
        if (!filiereId) return 'Choisissez une filiere.'
        if (!form.title || form.title.trim().length < 3)
            return 'Le titre doit faire au moins 3 caracteres.'
        if (!form.description || form.description.trim().length < 3)
            return 'La description doit faire au moins 3 caracteres.'
        if (!form.matiere || form.matiere.trim().length < 2)
            return 'Renseignez la matiere.'
        return null
    }

    async function submit() {
        const filiereId = form.filiereId || filieres[0]?.id
        const validationError = validate(filiereId)
        if (validationError) {
            setState('error')
            setMessage(validationError)
            return
        }

        setState('uploading')
        setProgress(0)
        setMessage('Envoi du document en cours...')

        try {
            const blob = await upload(file!.name, file!, {
                access: 'public',
                handleUploadUrl: '/api/uploads/documents',
            })
            setProgress(70)
            setMessage('Enregistrement du document...')
            await saveDocumentRecord(file!, filiereId, blob.url)
            setProgress(100)
            setState('success')
            setMessage('Document envoye avec succes.')
            setFile(null)
            setForm((current) => ({
                ...current,
                title: '',
                description: '',
                matiere: '',
            }))
            return
        } catch (blobError) {
            // Local fallback for dev environments without BLOB_READ_WRITE_TOKEN
            try {
                await submitLocalUpload(file!, filiereId)
                setState('success')
                setMessage('Document envoye avec succes (stockage local).')
                setFile(null)
                setProgress(100)
                setForm((current) => ({
                    ...current,
                    title: '',
                    description: '',
                    matiere: '',
                }))
            } catch (localError) {
                setState('error')
                const message =
                    blobError instanceof Error
                        ? blobError.message
                        : localError instanceof Error
                          ? localError.message
                          : "Impossible d'envoyer le document."
                setMessage(message)
            }
        }
    }

    const stateColor =
        state === 'error'
            ? 'text-[var(--danger)]'
            : state === 'success'
              ? 'text-[var(--accent)]'
              : 'text-[var(--fg-soft)]'

    return (
        <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
            <div className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)]">
                <div className="border-b border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2">
                    <p data-mono className="text-xs text-[var(--fg-muted)]">$ document.upload</p>
                </div>
                <div className="grid gap-3 p-4">
                    <label className="group flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-[var(--border)] bg-[var(--bg-soft)] px-4 py-5 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-code)]">
                        <input
                            className="hidden"
                            type="file"
                            accept="application/pdf,.pdf"
                            onChange={(event) =>
                                setFile(event.target.files?.[0] ?? null)
                            }
                        />
                        <span className="grid h-8 w-8 place-items-center rounded-md border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--fg-soft)]">
                            <Upload size={14} />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-[var(--fg)]">
                                {file ? file.name : 'Choisir un fichier PDF'}
                            </p>
                            <p data-mono className="text-xs text-[var(--fg-muted)]">
                                {file ? `${(file.size / 1024).toFixed(1)} KB` : 'pdf · max 4.5 MB'}
                            </p>
                        </div>
                    </label>

                    <div className="grid gap-3 md:grid-cols-2">
                        <label className="grid gap-1">
                            <span data-mono className="text-xs text-[var(--fg-muted)]">titre</span>
                            <Input
                                value={form.title ?? ''}
                                onChange={(event) =>
                                    setForm({ ...form, title: event.target.value })
                                }
                            />
                        </label>
                        <label className="grid gap-1">
                            <span data-mono className="text-xs text-[var(--fg-muted)]">matiere</span>
                            <Input
                                value={form.matiere ?? ''}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        matiere: event.target.value,
                                    })
                                }
                            />
                        </label>
                    </div>

                    <label className="grid gap-1">
                        <span data-mono className="text-xs text-[var(--fg-muted)]">description</span>
                        <Textarea
                            value={form.description ?? ''}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    description: event.target.value,
                                })
                            }
                        />
                    </label>

                    <div className="grid gap-3 md:grid-cols-4">
                        <label className="grid gap-1 md:col-span-2">
                            <span data-mono className="text-xs text-[var(--fg-muted)]">filiere</span>
                            <select
                                className="h-9 rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-3 text-sm text-[var(--fg)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]"
                                value={form.filiereId || ''}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        filiereId: event.target.value,
                                    })
                                }
                            >
                                <option value="">Choisir...</option>
                                {filieres.map((filiere) => (
                                    <option key={filiere.id} value={filiere.id}>
                                        {filiere.code} · {filiere.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="grid gap-1">
                            <span data-mono className="text-xs text-[var(--fg-muted)]">type</span>
                            <select
                                className="h-9 rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-3 text-sm text-[var(--fg)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]"
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
                        </label>
                        <label className="grid gap-1">
                            <span data-mono className="text-xs text-[var(--fg-muted)]">niveau</span>
                            <select
                                className="h-9 rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-3 text-sm text-[var(--fg)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]"
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
                        </label>
                    </div>

                    <label className="grid gap-1">
                        <span data-mono className="text-xs text-[var(--fg-muted)]">annee academique</span>
                        <Input
                            value={form.anneeAcademique}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    anneeAcademique: event.target.value,
                                })
                            }
                        />
                    </label>

                    <div className="space-y-1.5">
                        <div className="h-1 overflow-hidden rounded-full bg-[var(--bg-soft)] border border-[var(--border)]">
                            <div
                                data-testid="upload-progress"
                                className="h-full bg-[var(--accent)] transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p data-mono className={`text-xs ${stateColor}`}>
                            {message}
                        </p>
                    </div>

                    <Button
                        className="w-fit"
                        size="lg"
                        type="button"
                        disabled={!file || !form.filiereId || state === 'uploading'}
                        onClick={submit}
                    >
                        {state === 'uploading' ? 'Envoi en cours...' : 'Envoyer le document'}
                    </Button>
                </div>
            </div>

            <aside className="rounded-md border border-[var(--border)] bg-[var(--bg-soft)]">
                <div className="border-b border-[var(--border)] px-3 py-2">
                    <p data-mono className="text-xs text-[var(--fg-muted)]">notes.md</p>
                </div>
                <ul className="grid gap-2 p-3 text-xs leading-relaxed text-[var(--fg-soft)]" data-mono>
                    {[
                        'PDF uniquement',
                        'Lier le document a une filiere',
                        'Titre court et precis',
                        'Compte VALIDATED requis',
                        'Max 4.5 MB sur plan Hobby',
                    ].map((tip) => (
                        <li key={tip} className="flex items-start gap-1.5">
                            <span className="mt-1 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--fg-muted)]" />
                            {tip}
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    )
}
