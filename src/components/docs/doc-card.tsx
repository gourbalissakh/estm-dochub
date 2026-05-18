"use client";

import { Download, Eye, FileText, Heart } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/utils";

const typeColors: Record<string, "default" | "accent" | "warn" | "success" | "danger" | "primary"> = {
  COURS: "primary",
  TP: "success",
  TD: "accent",
  ANCIEN_SUJET: "warn",
  AUTRE: "default",
};

export function DocCard({
  document,
  onPreview,
}: {
  document: any;
  onPreview?: (id: string) => void;
}) {
  const { data: session } = useSession();
  const [favored, setFavored] = useState(false);

  async function favorite() {
    if (!session) return signIn(undefined, { callbackUrl: "/documents" });
    setFavored((v) => !v);
    await fetch(`/api/favorites/${document.id}`, { method: "POST" });
  }

  function download() {
    if (!session) return signIn(undefined, { callbackUrl: "/documents" });
    window.location.href = `/api/documents/${document.id}/download`;
  }

  return (
    <div
      className="group flex h-full flex-col rounded-md border border-[var(--border)] bg-[var(--bg-elev)] transition-colors hover:border-[var(--border-strong)]"
      data-testid="doc-card"
    >
      <div className="flex items-start gap-2 border-b border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2">
        <FileText size={14} className="mt-0.5 shrink-0 text-[var(--fg-muted)]" />
        <span className="code-chip">{document.filiere?.code}</span>
        <Badge variant={typeColors[document.type] ?? "default"}>
          {document.type.replace("_", " ")}
        </Badge>
        <Badge variant="outline">{document.niveau}</Badge>
        <button
          onClick={favorite}
          aria-label="Favori"
          className={`ml-auto rounded p-1 transition-colors ${
            favored
              ? "text-red-500"
              : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
          }`}
        >
          <Heart size={13} className={favored ? "fill-current" : ""} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-[var(--fg)]">
          {document.title}
        </h3>
        <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-[var(--fg-soft)]">
          {document.description}
        </p>
        <div className="flex items-center gap-3 text-[11px] text-[var(--fg-muted)]" data-mono>
          <span>{document.matiere}</span>
          <span>·</span>
          <span>{document.anneeAcademique}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2">
        <div className="flex items-center gap-2 text-[11px] text-[var(--fg-muted)]" data-mono>
          <span>{formatBytes(document.fileSize)}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-0.5">
            <Download size={10} /> {document.downloadCount}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onPreview?.(document.id)} aria-label="Apercu">
            <Eye size={13} />
          </Button>
          <Button size="sm" onClick={download}>
            <Download size={13} /> Télécharger
          </Button>
        </div>
      </div>
    </div>
  );
}
