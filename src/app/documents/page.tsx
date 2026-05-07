import { DocumentsClient } from '@/components/docs/documents-client'
import { Suspense } from 'react'

export default async function DocumentsPage() {
    return (
        <Suspense
            fallback={
                <div className="mx-auto max-w-7xl px-4 py-10">
                    Chargement des documents...
                </div>
            }
        >
            <DocumentsClient />
        </Suspense>
    )
}
