"use client";

import { ArrowRight, Eye, EyeOff, Lock, Mail, Terminal } from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
      setError("Identifiants invalides ou compte pas encore validé.");
      return;
    }
    const session = await getSession();
    const target = session?.user?.role === "ADMIN" ? "/admin" : "/documents";
    router.push(target);
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col px-4 py-16">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--fg)]"
      >
        <span className="grid h-6 w-6 place-items-center rounded border border-[var(--border)] bg-[var(--bg-soft)] text-[var(--fg-soft)]">
          <Terminal size={12} />
        </span>
        <span data-mono>ESTM/dochub</span>
      </Link>

      <div className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)]">
        <div className="border-b border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3">
          <p data-mono className="text-xs text-[var(--fg-muted)]">$ auth.signIn</p>
          <h1 className="mt-1 text-base font-semibold tracking-tight text-[var(--fg)]">
            Connexion
          </h1>
        </div>

        <form onSubmit={submit} className="grid gap-3 p-4">
          <label className="grid gap-1">
            <span data-mono className="text-xs text-[var(--fg-muted)]">email</span>
            <div className="relative">
              <Mail
                size={13}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)]"
              />
              <Input
                name="email"
                type="email"
                placeholder="admin@estm.sn"
                required
                className="pl-9"
              />
            </div>
          </label>

          <label className="grid gap-1">
            <span data-mono className="text-xs text-[var(--fg-muted)]">password</span>
            <div className="relative">
              <Lock
                size={13}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)]"
              />
              <Input
                name="password"
                type={show ? "text" : "password"}
                placeholder="••••••••"
                required
                className="pl-9 pr-9"
              />
              <button
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] hover:text-[var(--fg)]"
                onClick={() => setShow((v) => !v)}
                tabIndex={-1}
              >
                {show ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </label>

          {error && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <Button size="lg" disabled={busy} className="mt-1">
            {busy ? "Connexion..." : "Se connecter"}
            <ArrowRight size={13} />
          </Button>
        </form>

        <div className="border-t border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-center text-xs text-[var(--fg-soft)]">
          Pas de compte ?{" "}
          <Link className="link" href="/register">
            Créer un compte
          </Link>
        </div>
      </div>

      <p data-mono className="mt-4 text-center text-[10px] text-[var(--fg-muted)]">
        demo: admin@estm.sn / Admin123!
      </p>
    </div>
  );
}
