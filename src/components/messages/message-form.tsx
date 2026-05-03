"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function MessageForm({ filieres }: { filieres: any[] }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [filiereId, setFiliereId] = useState(filieres[0]?.id ?? "");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const nextContent = String(formData.get("content") ?? "").trim();
    const nextFiliereId = String(formData.get("filiereId") ?? filiereId);
    if (!nextContent) return;
    setBusy(true);
    const res = await fetch("/api/messages", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ content: nextContent, filiereId: nextFiliereId }) });
    setBusy(false);
    if (res.ok) {
      setContent("");
      router.refresh();
    }
  }
  return (
    <form onSubmit={submit} className="mb-8 rounded-xl border border-violet-100 bg-white p-4 dark:border-violet-900 dark:bg-[#1E1830]">
      <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
        <Textarea name="content" value={content} maxLength={500} onInput={(e) => setContent(e.currentTarget.value)} onChange={(e) => setContent(e.target.value)} placeholder="Partager une question, une ressource ou une annonce..." />
        <select name="filiereId" className="h-10 rounded-md border border-violet-200 bg-white px-3 dark:bg-[#14101F]" value={filiereId} onChange={(e) => setFiliereId(e.target.value)}>
          {filieres.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <Button disabled={busy}>Publier</Button>
      </div>
      <div className="mt-2 text-xs text-[#8B7FA8]">{content.length}/500</div>
    </form>
  );
}
