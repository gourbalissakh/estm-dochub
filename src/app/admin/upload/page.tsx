"use client";

import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminUploadPage() {
  const [filieres, setFilieres] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [form, setForm] = useState<Record<string, string>>({ type: "COURS", niveau: "L1", anneeAcademique: "2025-2026" });
  useEffect(() => {
    fetch("/api/filieres").then((r) => r.json()).then((d) => {
      setFilieres(d.filieres);
      setForm((current) => ({ ...current, filiereId: current.filiereId || d.filieres[0]?.id || "" }));
    });
  }, []);
  async function submit() {
    const filiereId = form.filiereId || filieres[0]?.id;
    if (!file || !filiereId) return;
    const chunkSize = 5 * 1024 * 1024;
    const totalChunks = Math.ceil(file.size / chunkSize);
    const uploadId = crypto.randomUUID();
    for (let index = 0; index < totalChunks; index += 1) {
      const body = new FormData();
      Object.entries({ ...form, filiereId, fileName: file.name, fileType: file.type || "application/pdf", fileSize: String(file.size), uploadId, chunkIndex: String(index), totalChunks: String(totalChunks) }).forEach(([k, v]) => body.set(k, v));
      body.set("file", file.slice(index * chunkSize, (index + 1) * chunkSize), file.name);
      await fetch("/api/documents", { method: "POST", body });
      setProgress(Math.round(((index + 1) / totalChunks) * 100));
    }
  }
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Upload /> Ajouter document</CardTitle></CardHeader>
      <CardContent className="grid gap-4">
        <label className="grid min-h-36 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-violet-200 p-4 text-center">
          <input className="hidden" type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          {file ? file.name : "Glisser ou choisir un PDF"}
        </label>
        <Input placeholder="Titre" onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Textarea placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Input placeholder="Matiere" onChange={(e) => setForm({ ...form, matiere: e.target.value })} />
        <div className="grid gap-3 md:grid-cols-4">
          <select className="h-10 rounded-md border px-3 dark:bg-[#14101F]" value={form.filiereId || ""} onChange={(e) => setForm({ ...form, filiereId: e.target.value })}>{filieres.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
          <select className="h-10 rounded-md border px-3 dark:bg-[#14101F]" onChange={(e) => setForm({ ...form, type: e.target.value })}><option>COURS</option><option>ANCIEN_SUJET</option><option>TP</option><option>TD</option><option>AUTRE</option></select>
          <select className="h-10 rounded-md border px-3 dark:bg-[#14101F]" onChange={(e) => setForm({ ...form, niveau: e.target.value })}><option>L1</option><option>L2</option><option>L3</option><option>M1</option><option>M2</option></select>
          <Input value={form.anneeAcademique} onChange={(e) => setForm({ ...form, anneeAcademique: e.target.value })} />
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-violet-100"><div data-testid="upload-progress" className="h-full bg-cyan-500" style={{ width: `${progress}%` }} /></div>
        <Button type="button" disabled={!file || !form.filiereId} onClick={submit}>Envoyer</Button>
      </CardContent>
    </Card>
  );
}
