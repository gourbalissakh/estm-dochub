"use client";

import { BookOpen, Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const links = [
  ["Accueil", "/"],
  ["Filieres", "/filieres"],
  ["Documents", "/documents"],
  ["Messages", "/messages"],
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const content = (
    <>
      {links.map(([label, href]) => (
        <Link key={href} href={href} className="text-sm font-medium text-[#4B3F6B] hover:text-violet-800 dark:text-violet-100">
          {label}
        </Link>
      ))}
      {session?.user?.role === "ADMIN" && <Link href="/admin" className="text-sm font-medium text-[#4B3F6B] hover:text-violet-800 dark:text-violet-100">Admin</Link>}
      {session ? (
        <>
          <Link href="/profile" className="text-sm font-medium text-[#4B3F6B] hover:text-violet-800 dark:text-violet-100">Profil</Link>
          <Button variant="secondary" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>Sortir</Button>
        </>
      ) : (
        <Button asChild size="sm"><Link href="/login">Connexion</Link></Button>
      )}
      <ThemeToggle />
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-violet-100 bg-white/90 backdrop-blur dark:border-violet-900 dark:bg-[#14101F]/90">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-violet-900 dark:text-violet-50">
          <BookOpen className="text-cyan-500" /> ESTM DocHub
        </Link>
        <div className="hidden items-center gap-5 md:flex">{content}</div>
        <Button className="md:hidden" variant="ghost" size="icon" onClick={() => setOpen((value) => !value)}>
          {open ? <X /> : <Menu />}
        </Button>
      </nav>
      {open && <div className="grid gap-3 border-t border-violet-100 px-4 py-4 md:hidden dark:border-violet-900">{content}</div>}
    </header>
  );
}
