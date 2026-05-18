'use client'

import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LogOut, Menu, Terminal, Upload, User, X } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const links = [
    ['filieres', '/filieres'],
    ['documents', '/documents'],
    ['about', '/about'],
] as const

export function Navbar() {
    const [open, setOpen] = useState(false)
    const { data: session } = useSession()
    const pathname = usePathname()

    useEffect(() => {
        setOpen(false)
    }, [pathname])

    const navLinks = (
        <>
            {links.map(([label, href]) => {
                const active = pathname === href || pathname?.startsWith(href)
                return (
                    <Link
                        key={href}
                        href={href}
                        data-mono
                        className={cn(
                            'px-2 py-1 text-sm transition-colors',
                            active
                                ? 'text-[var(--fg)] font-medium'
                                : 'text-[var(--fg-muted)] hover:text-[var(--fg)]',
                        )}
                    >
                        {label}
                    </Link>
                )
            })}
            {session?.user?.role === 'ADMIN' && (
                <Link
                    href="/admin"
                    data-mono
                    className={cn(
                        'px-2 py-1 text-sm transition-colors',
                        pathname?.startsWith('/admin')
                            ? 'text-[var(--accent)] font-medium'
                            : 'text-[var(--accent)] hover:opacity-80',
                    )}
                >
                    admin
                </Link>
            )}
        </>
    )

    const actions = (
        <>
            {session && (
                <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex">
                    <Link href="/documents/upload">
                        <Upload size={14} /> Déposer
                    </Link>
                </Button>
            )}
            {session ? (
                <div className="flex items-center gap-1">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/profile">
                            <User size={13} /> Profil
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => signOut({ callbackUrl: '/' })}
                        aria-label="Se déconnecter"
                    >
                        <LogOut size={14} />
                    </Button>
                </div>
            ) : (
                <Button asChild size="sm">
                    <Link href="/login">Connexion</Link>
                </Button>
            )}
            <ThemeToggle />
        </>
    )

    return (
        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur">
            <nav className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-4 px-4">
                <Link
                    href="/"
                    className="group flex items-center gap-2 text-sm font-semibold text-[var(--fg)]"
                >
                    <span className="grid h-6 w-6 place-items-center rounded border border-[var(--border)] bg-[var(--bg-soft)] text-[var(--fg-soft)] group-hover:text-[var(--fg)]">
                        <Terminal size={12} />
                    </span>
                    <span data-mono className="hidden sm:inline">ESTM/dochub</span>
                </Link>

                <div className="hidden items-center gap-1 lg:flex">{navLinks}</div>

                <div className="hidden items-center gap-1.5 md:flex">{actions}</div>

                <Button
                    className="md:hidden"
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen((value) => !value)}
                    aria-label="Menu"
                >
                    {open ? <X size={16} /> : <Menu size={16} />}
                </Button>
            </nav>
            {open && (
                <div className="border-t border-[var(--border)] bg-[var(--bg)] px-4 py-3 md:hidden">
                    <div className="flex flex-col gap-1">{navLinks}</div>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[var(--border)] pt-3">{actions}</div>
                </div>
            )}
        </header>
    )
}
