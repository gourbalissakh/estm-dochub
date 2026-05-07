"use client";

import { Download, Eye, FileText, Heart } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatBytes } from "@/lib/utils";

const typeColors: Record<string, "default" | "accent" | "warn" | "success" | "danger"> = {
  COURS: "default",
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
    <Card
      className="group/doc flex h-full flex-col hover:-translate-y-1 hover:border-[var(--primary)]/30 hover:shadow-[var(--shadow-md)]"
      data-testid="doc-card"
    >
      <div className="relative flex items-start gap-3 p-5">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[image:linear-gradient(135deg,#ede9fe,#cffafe)] text-[var(--primary)] dark:bg-[image:linear-gradient(135deg,#1f1640,#0e3a47)] dark:text-[var(--primary)]">
          <FileText size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap gap-1.5">
            <Badge variant={typeColors[document.type] ?? "default"}>
              {document.type.replace("_", " ")}
            </Badge>
            <Badge variant="outline">{document.niveau}</Badge>
          </div>
          <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-[var(--fg)]">
            {document.title}
          </h3>
          <p className="mt-1 truncate text-xs text-[var(--fg-muted)]">
            {document.filiere?.name} · {document.matiere}
          </p>
        </div>
        <button
          onClick={favorite}
          aria-label="Favori"
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition ${
            favored
              ? "bg-rose-500/10 text-rose-500"
              : "text-[var(--fg-muted)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
          }`}
        >
          <Heart size={15} className={favored ? "fill-current" : ""} />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--fg-soft)]">
          {document.description}
        </p>

        <div className="mt-4 flex items-center gap-3 text-[11px] font-medium text-[var(--fg-muted)]">
          <span className="rounded-md bg-[var(--bg-soft)] px-2 py-0.5 ring-1 ring-inset ring-[var(--border)]">
            {formatBytes(document.fileSize)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Download size={11} /> {document.downloadCount}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button className="flex-1" size="sm" onClick={download}>
            <Download size={14} /> Telecharger
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPreview?.(document.id)}
            aria-label="Apercu"
          >
            <Eye size={15} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
