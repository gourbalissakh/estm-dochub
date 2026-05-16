"use client";

import { ArrowRight, Eye, EyeOff, GraduationCap, Lock, Mail } from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    if (!res?.ok) {
      setBusy(false);
      setError("Identifiants invalides ou compte pas encore valide.");
      return;
    }
    const session = await getSession();
    const target = session?.user?.role === "ADMIN" ? "/admin" : "/documents";
    router.push(target);
    router.refresh();
  }

  return (
    <div className="relative min-h-[80vh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh opacity-70" />
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2.5 text-base font-bold text-[var(--fg)]"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[image:linear-gradient(135deg,#7c3aed,#06b6d4)] text-white shadow-md">
            <GraduationCap size={20} />
          </span>
          ESTM <span className="text-gradient">DocHub</span>
        </Link>

        <Card className="w-full shadow-[var(--shadow-lg)] animate-fade-in">
          <div className="p-7">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
              Bon retour
            </h1>
            <p className="mt-1 text-sm text-[var(--fg-soft)]">
              Connectez-vous pour acceder a vos documents.
            </p>

            <form onSubmit={submit} className="mt-7 grid gap-4">
              <div className="grid gap-1.5">
                <label className="text-xs font-semibold text-[var(--fg-soft)]">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-muted)]"
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="admin@estm.sn"
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[var(--fg-soft)]">
                    Mot de passe
                  </label>
                  <Link
                    href="/register"
                    className="text-xs font-semibold text-[var(--primary)] hover:underline"
                  >
                    Oublie ?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-muted)]"
                  />
                  <Input
                    name="password"
                    type={show ? "text" : "password"}
                    placeholder="********"
                    required
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] hover:text-[var(--primary)]"
                    onClick={() => setShow((v) => !v)}
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-[var(--fg-soft)]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[var(--border-strong)] accent-[var(--primary)]"
                />
                Se souvenir de moi
              </label>

              {error && (
                <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-600 dark:text-rose-400">
                  {error}
                </div>
              )}

              <Button size="lg" disabled={busy}>
                {busy ? "Connexion..." : "Se connecter"}
                <ArrowRight size={16} />
              </Button>
            </form>

            <div className="mt-6 border-t border-[var(--border)] pt-5 text-center text-sm text-[var(--fg-soft)]">
              Pas encore de compte ?{" "}
              <Link
                className="font-semibold text-[var(--primary)] hover:underline"
                href="/register"
              >
                S&apos;inscrire
              </Link>
            </div>
          </div>
        </Card>

        <p className="mt-6 text-xs text-[var(--fg-muted)]">
          Demo : admin@estm.sn / Admin123!
        </p>
      </div>
    </div>
  );
}
