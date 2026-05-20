"use client";

import { AlertCircle, ArrowLeft, ArrowRight, Check, Terminal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [filieres, setFilieres] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({
    anneeAcademique: "2025-2026",
    niveau: "L1",
  });

  useEffect(() => {
    fetch("/api/filieres")
      .then((r) => r.json())
      .then((d) => setFilieres(d.filieres));
  }, []);

  function validateForm(): string | null {
    if (!form.firstName || form.firstName.trim().length < 2)
      return "Le prénom doit contenir au moins 2 caractères.";
    if (!form.lastName || form.lastName.trim().length < 2)
      return "Le nom doit contenir au moins 2 caractères.";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Email invalide.";
    if (
      !form.password ||
      form.password.length < 8 ||
      !/[A-Z]/.test(form.password) ||
      !/[0-9]/.test(form.password)
    )
      return "Le mot de passe doit faire au moins 8 caractères, avec une majuscule et un chiffre.";
    if (form.avatarUrl && !/^https?:\/\/.+/.test(form.avatarUrl))
      return "L'URL de l'avatar n'est pas valide.";
    return null;
  }

  function goToStep2() {
    const err = validateForm();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep(2);
  }

  async function submit() {
    setError(null);
    const err = validateForm();
    if (err) {
      setError(err);
      return;
    }
    setBusy(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...form,
        filiereId: form.filiereId || filieres[0]?.id,
      }),
    });
    setBusy(false);
    if (res.ok) {
      setSuccess(true);
      return;
    }
    if (res.status === 409) {
      setError("Cet email est déjà utilisé.");
      return;
    }
    if (res.status === 429) {
      setError("Trop de tentatives. Réessayez dans une minute.");
      return;
    }
    if (res.status === 400) {
      setError("Données invalides. Vérifiez vos informations.");
      return;
    }
    setError("Une erreur est survenue. Réessayez.");
  }

  if (success) {
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
        <div className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] p-6 text-center">
          <div className="mx-auto grid h-10 w-10 place-items-center rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent)]">
            <Check size={20} />
          </div>
          <h1 className="mt-4 text-base font-semibold tracking-tight text-[var(--fg)]">
            Compte créé
          </h1>
          <p className="mt-2 text-sm text-[var(--fg-soft)]">
            Tu peux te connecter dès maintenant.
          </p>
          <p data-mono className="mt-3 text-xs text-[var(--fg-muted)]">status: VALIDATED</p>
          <Button asChild className="mt-5">
            <Link href="/login">Se connecter</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12">
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
          <div className="flex items-center justify-between">
            <p data-mono className="text-xs text-[var(--fg-muted)]">$ auth.register · step {step}/2</p>
            <span data-mono className="text-xs text-[var(--fg-muted)]">
              {step === 1 ? "identite" : "filiere"}
            </span>
          </div>
          <h1 className="mt-1 text-base font-semibold tracking-tight text-[var(--fg)]">
            {step === 1 ? "Crée ton compte" : "Choisis ta filière"}
          </h1>
        </div>

        <div className="grid gap-3 p-4">
          {error && (
            <div className="flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
              <AlertCircle size={13} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span data-mono className="text-xs text-[var(--fg-muted)]">prenom</span>
                  <Input
                    value={form.firstName ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                  />
                </label>
                <label className="grid gap-1">
                  <span data-mono className="text-xs text-[var(--fg-muted)]">nom</span>
                  <Input
                    value={form.lastName ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                  />
                </label>
              </div>
              <label className="grid gap-1">
                <span data-mono className="text-xs text-[var(--fg-muted)]">email</span>
                <Input
                  type="email"
                  placeholder="prenom.nom@estm.sn"
                  value={form.email ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </label>
              <label className="grid gap-1">
                <span data-mono className="text-xs text-[var(--fg-muted)]">password</span>
                <Input
                  type="password"
                  value={form.password ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <div className="mt-1 flex flex-col gap-0.5 text-[11px]" data-mono>
                  {[
                    { ok: (form.password ?? "").length >= 8, label: ">= 8 caracteres" },
                    { ok: /[A-Z]/.test(form.password ?? ""), label: "1 majuscule" },
                    { ok: /[0-9]/.test(form.password ?? ""), label: "1 chiffre" },
                  ].map((rule) => (
                    <span
                      key={rule.label}
                      className={`inline-flex items-center gap-1.5 ${rule.ok ? "text-[var(--accent)]" : "text-[var(--fg-muted)]"}`}
                    >
                      <Check size={11} className={rule.ok ? "opacity-100" : "opacity-30"} />
                      {rule.label}
                    </span>
                  ))}
                </div>
              </label>
              <label className="grid gap-1">
                <span data-mono className="text-xs text-[var(--fg-muted)]">avatar (optionnel)</span>
                <Input
                  placeholder="https://..."
                  value={form.avatarUrl ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, avatarUrl: e.target.value })
                  }
                />
              </label>
              <Button size="lg" onClick={goToStep2} className="mt-1">
                Continuer <ArrowRight size={13} />
              </Button>
            </>
          ) : (
            <>
              <label className="grid gap-1">
                <span data-mono className="text-xs text-[var(--fg-muted)]">numero etudiant (optionnel)</span>
                <Input
                  placeholder="ESTM-2026-XXX"
                  value={form.studentNumber ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, studentNumber: e.target.value })
                  }
                />
              </label>
              <label className="grid gap-1">
                <span data-mono className="text-xs text-[var(--fg-muted)]">filiere</span>
                <select
                  className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-3 text-sm text-[var(--fg)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]"
                  value={form.filiereId ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, filiereId: e.target.value })
                  }
                >
                  {filieres.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.code} · {f.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span data-mono className="text-xs text-[var(--fg-muted)]">niveau</span>
                  <select
                    className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-3 text-sm text-[var(--fg)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]"
                    value={form.niveau ?? "L1"}
                    onChange={(e) =>
                      setForm({ ...form, niveau: e.target.value })
                    }
                  >
                    {["L1", "L2", "L3", "M1", "M2"].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1">
                  <span data-mono className="text-xs text-[var(--fg-muted)]">annee</span>
                  <Input
                    value={form.anneeAcademique}
                    onChange={(e) =>
                      setForm({ ...form, anneeAcademique: e.target.value })
                    }
                  />
                </label>
              </div>
              <div className="mt-1 flex gap-2">
                <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                  <ArrowLeft size={13} /> Retour
                </Button>
                <Button size="lg" className="flex-1" onClick={submit} disabled={busy}>
                  {busy ? "Envoi..." : "Créer mon compte"}
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-center text-xs text-[var(--fg-soft)]">
          Déjà inscrit ?{" "}
          <Link className="link" href="/login">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
