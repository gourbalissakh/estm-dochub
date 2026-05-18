import {
    DeleteButton,
    VisibilityButton,
} from '@/components/admin/admin-actions'
import { Badge } from '@/components/ui/badge'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type AdminDocument = {
    id: string
    title: string
    isVisible: boolean
    type: string
    niveau: string
    filiere: { code: string }
}

export default async function AdminDocumentsPage({
    searchParams,
}: {
    searchParams: { q?: string }
}) {
    await requireAdmin()
    const docs: AdminDocument[] = await prisma.document.findMany({
        where: searchParams.q
            ? { title: { contains: searchParams.q, mode: 'insensitive' } }
            : {},
        include: { filiere: true },
        orderBy: { createdAt: 'desc' },
    })
    return (
        <div>
            <div className="mb-5">
                <p data-mono className="text-xs text-[var(--fg-muted)]">/admin/documents</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--fg)]">
                    Documents
                </h1>
                <p className="mt-1 text-sm text-[var(--fg-soft)]">
                    {docs.length} document{docs.length > 1 ? 's' : ''}
                </p>
            </div>

            <div className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg-elev)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--border)] bg-[var(--bg-soft)] text-xs text-[var(--fg-muted)]" data-mono>
                                <th className="px-3 py-2 text-left font-medium">titre</th>
                                <th className="px-3 py-2 text-left font-medium">filière</th>
                                <th className="px-3 py-2 text-left font-medium">type</th>
                                <th className="px-3 py-2 text-left font-medium">niv.</th>
                                <th className="px-3 py-2 text-left font-medium">visibilité</th>
                                <th className="px-3 py-2 text-right font-medium">actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {docs.map((doc) => (
                                <tr
                                    key={doc.id}
                                    className="border-b border-[var(--border)] transition-colors last:border-b-0 hover:bg-[var(--bg-soft)]"
                                >
                                    <td className="px-3 py-2 font-medium text-[var(--fg)]">
                                        {doc.title}
                                    </td>
                                    <td className="px-3 py-2">
                                        <span className="code-chip">{doc.filiere.code}</span>
                                    </td>
                                    <td className="px-3 py-2 text-xs text-[var(--fg-muted)]" data-mono>
                                        {doc.type.replace('_', ' ')}
                                    </td>
                                    <td className="px-3 py-2 text-xs text-[var(--fg-muted)]" data-mono>
                                        {doc.niveau}
                                    </td>
                                    <td className="px-3 py-2">
                                        <Badge variant={doc.isVisible ? 'success' : 'warn'}>
                                            {doc.isVisible ? 'visible' : 'caché'}
                                        </Badge>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex justify-end gap-1.5">
                                            <VisibilityButton
                                                id={doc.id}
                                                visible={doc.isVisible}
                                                kind="documents"
                                            />
                                            <DeleteButton id={doc.id} kind="documents" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
