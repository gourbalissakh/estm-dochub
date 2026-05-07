"use client";

import { ArrowLeft, ArrowRight, Check, GraduationCap, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [filieres, setFilieres] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({
    anneeAcademique: "2025-2026",
    niveau: "L1",
  });

  useEffect(() => {
    fetch("/api/filieres")
      .then((r) => r.json())
      .then((d) => setFilieres(d.filieres));
  }, []);

  async function submit() {
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
    if (res.ok) setSuccess(true);
  }

  if (success) {
    return (
      <div className="relative min-h-[80vh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh opacity-60" />
        <div className="mx-auto max-w-xl px-4 py-20">
          <Card className="text-center animate-fade-in">
            <div className="p-10">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-500">
                <Check size={32} />
              </div>
              <h1 className="mt-5 text-2xl font-bold tracking-tight text-[var(--fg)]">
                Inscription envoyee
              </h1>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[var(--fg-soft)]">
                Votre compte est en attente de validation. Un administrateur
                doit valider votre inscription avant de vous permettre de vous
                connecter.
              </p>
              <Button asChild className="mt-6">
                <Link href="/">Retour a l&apos;accueil</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh opacity-70" />
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-12">
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
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--primary)]">
                  <Sparkles size={11} /> Etape {step} sur 2
                </span>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--fg)]">
                  {step === 1 ? "Vos informations" : "Votre filiere"}
                </h1>
                <p className="mt-1 text-sm text-[var(--fg-soft)]">
                  {step === 1
                    ? "Creons votre compte etudiant ESTM."
                    : "Selectionnez votre filiere et votre niveau."}
                </p>
              </div>
            </div>

            <div className="my-6 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-soft)]">
              <div
                className="h-full rounded-full bg-[image:linear-gradient(90deg,#7c3aed,#06b6d4)] transition-all duration-500"
                style={{ width: step === 1 ? "50%" : "100%" }}
              />
            </div>

            <div className="grid gap-4">
              {step === 1 ? (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      placeholder="Prenom"
                      value={form.firstName ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Nom"
                      value={form.lastName ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                    />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email ESTM"
                    value={form.email ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                  <Input
                    type="password"
                    placeholder="Mot de passe (8+ caracteres)"
                    value={form.password ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                  <Input
                    placeholder="URL avatar (optionnel)"
                    value={form.avatarUrl ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, avatarUrl: e.target.value })
                    }
                  />
                  <Button size="lg" onClick={() => setStep(2)}>
                    Continuer <ArrowRight size={16} />
                  </Button>
                </>
              ) : (
                <>
                  <Input
                    placeholder="Numero etudiant"
                    value={form.studentNumber ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, studentNumber: e.target.value })
                    }
                  />
                  <select
                    className="h-11 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-soft)] px-3 text-sm text-[var(--fg)] outline-none transition focus:border-[var(--primary)] focus:ring-[3px] focus:ring-[var(--ring)]"
                    onChange={(e) =>
                      setForm({ ...form, filiereId: e.target.value })
                    }
                  >
                    {filieres.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="h-11 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-soft)] px-3 text-sm text-[var(--fg)] outline-none transition focus:border-[var(--primary)] focus:ring-[3px] focus:ring-[var(--ring)]"
                    onChange={(e) =>
                      setForm({ ...form, niveau: e.target.value })
                    }
                    defaultValue="L1"
                  >
                    <option>L1</option>
                    <option>L2</option>
                    <option>L3</option>
                    <option>M1</option>
                    <option>M2</option>
                  </select>
                  <Input
                    value={form.anneeAcademique}
                    onChange={(e) =>
                      setForm({ ...form, anneeAcademique: e.target.value })
                    }
                    placeholder="Annee academique"
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                      <ArrowLeft size={16} /> Retour
                    </Button>
                    <Button size="lg" className="flex-1" onClick={submit} disabled={busy}>
                      {busy ? "Envoi..." : "Creer mon compte"}
                    </Button>
                  </div>
                </>
              )}
            </div>

            <p className="mt-6 border-t border-[var(--border)] pt-5 text-center text-sm text-[var(--fg-soft)]">
              Deja inscrit ?{" "}
              <Link
                className="font-semibold text-[var(--primary)] hover:underline"
                href="/login"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
