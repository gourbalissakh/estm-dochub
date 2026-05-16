import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
    ArrowRight,
    Brain,
    Briefcase,
    Calculator,
    Code,
    CreditCard,
    FileText,
    Image as ImageIcon,
    Megaphone,
    Network,
    Scale,
    Shield,
    Target,
    Users,
    Zap,
    type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'

const iconMap: Record<string, LucideIcon> = {
    Network,
    Code,
    Shield,
    CreditCard,
    Image: ImageIcon,
    Zap,
    Brain,
    Briefcase,
    Calculator,
    Users,
    Target,
    Megaphone,
    Scale,
}

export function FiliereCard({ filiere }: { filiere: any }) {
    const isTech = filiere.sector === 'TECH'
    const Icon = iconMap[filiere.icon] ?? FileText
    return (
        <Link href={`/documents?filiere=${filiere.id}`} className="block h-full">
            <Card className="group/card relative h-full overflow-hidden hover:-translate-y-1 hover:border-[var(--primary)]/40 hover:shadow-[var(--shadow-md)]">
                <div
                    className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover/card:opacity-100 ${
                        isTech ? 'bg-cyan-400/30' : 'bg-violet-500/30'
                    }`}
                />
                <div className="relative p-6">
                    <div className="flex items-start justify-between">
                        <div
                            className={`grid h-12 w-12 place-items-center rounded-2xl text-white shadow-md transition-transform duration-300 group-hover/card:scale-105 group-hover/card:rotate-3 ${
                                isTech
                                    ? 'bg-[image:linear-gradient(135deg,#06b6d4,#0891b2)]'
                                    : 'bg-[image:linear-gradient(135deg,#7c3aed,#6d28d9)]'
                            }`}
                        >
                            <Icon size={20} />
                        </div>
                        <Badge variant={isTech ? 'accent' : 'default'}>
                            {isTech ? 'Technique' : 'Gestion'}
                        </Badge>
                    </div>

                    <h3 className="mt-5 text-lg font-semibold leading-tight tracking-tight text-[var(--fg)]">
                        {filiere.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-relaxed text-[var(--fg-soft)]">
                        {filiere.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4 text-sm">
                        <div className="flex items-center gap-3 text-xs text-[var(--fg-muted)]">
                            <span className="inline-flex items-center gap-1">
                                <FileText size={13} />
                                {filiere._count?.documents ?? 0}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Users size={13} />
                                {filiere._count?.users ?? 0}
                            </span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] transition-transform group-hover/card:translate-x-0.5">
                            Voir <ArrowRight size={13} />
                        </span>
                    </div>
                </div>
            </Card>
        </Link>
    )
}
