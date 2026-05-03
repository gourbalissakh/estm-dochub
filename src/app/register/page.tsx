"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [filieres, setFilieres] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({ anneeAcademique: "2025-2026", niveau: "L1" });
  useEffect(() => { fetch("/api/filieres").then((r) => r.json()).then((d) => setFilieres(d.filieres)); }, []);
  async function submit() {
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...form, filiereId: form.filiereId || filieres[0]?.id }) });
    if (res.ok) setSuccess(true);
  }
  if (success) return <div className="mx-auto max-w-xl px-4 py-16"><Card><CardHeader><CardTitle>En attente de validation</CardTitle></CardHeader><CardContent>Votre inscription est envoyee. Un administrateur doit valider le compte avant connexion.</CardContent></Card></div>;
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Card>
        <CardHeader><CardTitle>Inscription etudiant · etape {step}/2</CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          {step === 1 ? (
            <>
              <Input placeholder="Prenom" onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              <Input placeholder="Nom" onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              <Input type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input type="password" placeholder="Mot de passe" onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <Input placeholder="URL avatar optionnelle" onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} />
              <Button onClick={() => setStep(2)}>Continuer</Button>
            </>
          ) : (
            <>
              <Input placeholder="Numero etudiant" onChange={(e) => setForm({ ...form, studentNumber: e.target.value })} />
              <select className="h-10 rounded-md border border-violet-200 px-3 dark:bg-[#14101F]" onChange={(e) => setForm({ ...form, filiereId: e.target.value })}>{filieres.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
              <select className="h-10 rounded-md border border-violet-200 px-3 dark:bg-[#14101F]" onChange={(e) => setForm({ ...form, niveau: e.target.value })}><option>L1</option><option>L2</option><option>L3</option><option>M1</option><option>M2</option></select>
              <Input value={form.anneeAcademique} onChange={(e) => setForm({ ...form, anneeAcademique: e.target.value })} />
              <div className="flex gap-2"><Button variant="outline" onClick={() => setStep(1)}>Retour</Button><Button onClick={submit}>Envoyer</Button></div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
