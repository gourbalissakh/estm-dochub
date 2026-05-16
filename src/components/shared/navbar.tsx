'use client'

import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { GraduationCap, LogOut, Menu, Sparkles, Upload, User, X } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const links = [
    ['Accueil', '/'],
    ['Filieres', '/filieres'],
    ['Documents', '/documents'],
] as const

export function Navbar() {
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { data: session } = useSession()
    const pathname = usePathname()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        setOpen(false)
    }, [pathname])

    const navLinks = (
        <>
            {links.map(([label, href]) => {
                const active =
                    pathname === href ||
                    (href !== '/' && pathname?.startsWith(href))
                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            'relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                            active
                                ? 'text-[var(--primary)]'
                                : 'text-[var(--fg-soft)] hover:text-[var(--primary)]',
                        )}
                    >
                        {label}
                        {active && (
                            <span className="absolute inset-0 -z-10 rounded-full bg-[var(--primary-soft)]" />
                        )}
                    </Link>
                )
            })}
            {session?.user?.role === 'ADMIN' && (
                <Link
                    href="/admin"
                    className="rounded-full bg-[image:linear-gradient(135deg,#7c3aed,#06b6d4)] px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:shadow-glow transition"
                >
                    <span className="flex items-center gap-1.5">
                        <Sparkles size={13} /> Admin
                    </span>
                </Link>
            )}
        </>
    )

    const actions = (
        <>
            {session && (
                <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex">
                    <Link href="/documents/upload">
                        <Upload size={15} /> Deposer
                    </Link>
                </Button>
            )}
            {session ? (
                <div className="flex items-center gap-1.5">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/profile">
                            <User size={14} /> Profil
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => signOut({ callbackUrl: '/' })}
                        aria-label="Sortir"
                    >
                        <LogOut size={16} />
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
        <header
            className={cn(
                'sticky top-0 z-40 transition-all duration-300',
                scrolled
                    ? 'glass-strong shadow-[var(--shadow-sm)]'
                    : 'bg-[var(--bg)]/80 backdrop-blur-md',
            )}
        >
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
                <Link
                    href="/"
                    className="group flex items-center gap-2.5 text-base font-bold text-[var(--fg)]"
                >
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-[image:linear-gradient(135deg,#7c3aed,#6d28d9_50%,#06b6d4)] text-white shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                        <GraduationCap size={18} />
                    </span>
                    <span className="hidden sm:flex flex-col leading-tight">
                        <span className="text-[15px] font-bold">
                            ESTM <span className="text-gradient">DocHub</span>
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--fg-muted)]">
                            Dakar
                        </span>
                    </span>
                </Link>

                <div className="hidden items-center gap-1 lg:flex">{navLinks}</div>

                <div className="hidden items-center gap-2 md:flex">{actions}</div>

                <Button
                    className="md:hidden"
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen((value) => !value)}
                    aria-label="Menu"
                >
                    {open ? <X size={18} /> : <Menu size={18} />}
                </Button>
            </nav>
            {open && (
                <div className="grid gap-3 border-t border-[var(--border)] glass-strong px-4 py-4 md:hidden animate-fade-in">
                    <div className="flex flex-wrap gap-2">{navLinks}</div>
                    <div className="flex flex-wrap items-center gap-2">{actions}</div>
                </div>
            )}
        </header>
    )
}
