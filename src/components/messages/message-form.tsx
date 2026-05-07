"use client";

import { Send } from "lucide-react";
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
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ content: nextContent, filiereId: nextFiliereId }),
    });
    setBusy(false);
    if (res.ok) {
      setContent("");
      router.refresh();
    }
  }

  const remaining = 500 - content.length;
  const overLimit = remaining < 0;

  return (
    <form
      onSubmit={submit}
      className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-5 shadow-[var(--shadow-sm)] transition focus-within:border-[var(--primary)]/40 focus-within:shadow-[var(--shadow-md)]"
    >
      <Textarea
        name="content"
        value={content}
        maxLength={500}
        onInput={(e) => setContent(e.currentTarget.value)}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Partager une question, une ressource ou une annonce..."
        className="border-0 bg-transparent p-0 focus:ring-0 hover:border-transparent shadow-none"
      />
      <div className="mt-4 flex flex-col gap-3 border-t border-[var(--border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <select
          name="filiereId"
          className="h-10 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-soft)] px-3 text-sm text-[var(--fg)] outline-none transition focus:border-[var(--primary)] focus:ring-[3px] focus:ring-[var(--ring)]"
          value={filiereId}
          onChange={(e) => setFiliereId(e.target.value)}
        >
          {filieres.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-medium tabular-nums ${
              overLimit
                ? "text-rose-500"
                : remaining < 50
                  ? "text-amber-500"
                  : "text-[var(--fg-muted)]"
            }`}
          >
            {content.length} / 500
          </span>
          <Button disabled={busy || !content.trim() || overLimit}>
            <Send size={14} />
            Publier
          </Button>
        </div>
      </div>
    </form>
  );
}
