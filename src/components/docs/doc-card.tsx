"use client";

import { Download, Eye, Heart } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBytes } from "@/lib/utils";

export function DocCard({ document, onPreview }: { document: any; onPreview?: (id: string) => void }) {
  const { data: session } = useSession();
  async function favorite() {
    if (!session) return signIn(undefined, { callbackUrl: "/documents" });
    await fetch(`/api/favorites/${document.id}`, { method: "POST" });
  }
  function download() {
    if (!session) return signIn(undefined, { callbackUrl: "/documents" });
    window.location.href = `/api/documents/${document.id}/download`;
  }
  return (
    <Card className="flex h-full flex-col" data-testid="doc-card">
      <CardHeader>
        <div className="mb-2 flex flex-wrap gap-2">
          <Badge>{document.type.replace("_", " ")}</Badge>
          <Badge className="bg-cyan-100 text-cyan-900">{document.niveau}</Badge>
        </div>
        <CardTitle className="line-clamp-2">{document.title}</CardTitle>
        <p className="text-sm text-[#8B7FA8]">{document.filiere?.name} · {document.matiere}</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="line-clamp-3 flex-1 text-sm text-[#4B3F6B] dark:text-violet-200">{document.description}</p>
        <div className="mt-4 text-xs text-[#8B7FA8]">{formatBytes(document.fileSize)} · {document.downloadCount} telechargements</div>
        <div className="mt-4 flex gap-2">
          <Button className="flex-1" size="sm" onClick={download}><Download size={16} /> Telecharger</Button>
          <Button variant="outline" size="icon" onClick={() => onPreview?.(document.id)} aria-label="Apercu"><Eye size={16} /></Button>
          <Button variant="ghost" size="icon" onClick={favorite} aria-label="Favori"><Heart size={16} /></Button>
        </div>
      </CardContent>
    </Card>
  );
}
