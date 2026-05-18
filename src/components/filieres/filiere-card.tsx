import { Badge } from '@/components/ui/badge'
import { ChevronRight, FileText, Users } from 'lucide-react'
import Link from 'next/link'

export function FiliereCard({ filiere }: { filiere: any }) {
    const isTech = filiere.sector === 'TECH'
    return (
        <Link
            href={`/documents?filiere=${filiere.id}`}
            className="group block rounded-md border border-[var(--border)] bg-[var(--bg-elev)] p-4 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-soft)]"
        >
            <div className="flex items-start justify-between gap-3">
                <span className="code-chip">{filiere.code}</span>
                <Badge variant={isTech ? 'accent' : 'primary'}>
                    {isTech ? 'TECH' : 'MGMT'}
                </Badge>
            </div>

            <h3 className="mt-3 text-sm font-semibold leading-tight tracking-tight text-[var(--fg)]">
                {filiere.name}
            </h3>

            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--fg-soft)]">
                {filiere.description}
            </p>

            <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
                <div className="flex items-center gap-3 text-xs text-[var(--fg-muted)]" data-mono>
                    <span className="inline-flex items-center gap-1">
                        <FileText size={11} />
                        {filiere._count?.documents ?? 0}
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <Users size={11} />
                        {filiere._count?.users ?? 0}
                    </span>
                </div>
                <ChevronRight
                    size={14}
                    className="text-[var(--fg-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--fg-soft)]"
                />
            </div>
        </Link>
    )
}
