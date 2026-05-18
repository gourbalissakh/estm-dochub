import { DocumentUploadForm } from '@/components/docs/document-upload-form'

export default function AdminUploadPage() {
    return (
        <div>
            <div className="mb-5">
                <p data-mono className="text-xs text-[var(--fg-muted)]">/admin/upload</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--fg)]">
                    Déposer un document
                </h1>
                <p className="mt-1 text-sm text-[var(--fg-soft)]">
                    Upload via Vercel Blob · création directe dans le catalogue.
                </p>
            </div>
            <DocumentUploadForm />
        </div>
    )
}
