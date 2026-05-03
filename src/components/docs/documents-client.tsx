"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DocCard } from "@/components/docs/doc-card";
import { DocPreviewModal } from "@/components/docs/doc-preview-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DocumentsClient({ filieres }: { filieres: any[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const params = searchParams.toString();
  const { data, isLoading } = useQuery({
    queryKey: ["documents", params],
    queryFn: () => fetch(`/api/documents?${params}`).then((res) => res.json()),
  });
  function update(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.set("page", "1");
    router.push(`/documents?${next.toString()}`);
  }
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="sticky top-[65px] z-30 mb-8 rounded-xl border border-violet-100 bg-white p-4 shadow-sm dark:border-violet-900 dark:bg-[#1E1830]">
        <div className="grid gap-3 md:grid-cols-6">
          <select className="rounded-md border border-violet-200 bg-white px-3 dark:bg-[#14101F]" value={searchParams.get("filiere") ?? ""} onChange={(e) => update("filiere", e.target.value)}>
            <option value="">Toutes les filieres</option>
            {filieres.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          <select className="rounded-md border border-violet-200 bg-white px-3 dark:bg-[#14101F]" value={searchParams.get("type") ?? ""} onChange={(e) => update("type", e.target.value)}>
            <option value="">Tous types</option><option value="COURS">Cours</option><option value="ANCIEN_SUJET">Anciens sujets</option><option value="TP">TP</option><option value="TD">TD</option><option value="AUTRE">Autre</option>
          </select>
          <select className="rounded-md border border-violet-200 bg-white px-3 dark:bg-[#14101F]" value={searchParams.get("niveau") ?? ""} onChange={(e) => update("niveau", e.target.value)}>
            <option value="">Tous niveaux</option><option>L1</option><option>L2</option><option>L3</option><option>M1</option><option>M2</option>
          </select>
          <Input placeholder="Annee" value={searchParams.get("annee") ?? ""} onChange={(e) => update("annee", e.target.value)} />
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-2.5 text-[#8B7FA8]" size={16} />
            <Input className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && update("q", q)} placeholder="Recherche..." />
          </div>
        </div>
      </div>
      {isLoading ? <p>Chargement...</p> : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data?.documents?.map((document: any) => <DocCard key={document.id} document={document} onPreview={setPreview} />)}
          </div>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button variant="outline" disabled={(data?.pagination?.page ?? 1) <= 1} onClick={() => update("page", String((data.pagination.page ?? 1) - 1))}>Precedent</Button>
            <span className="text-sm text-[#4B3F6B]">Page {data?.pagination?.page ?? 1} / {data?.pagination?.pages || 1}</span>
            <Button variant="outline" disabled={(data?.pagination?.page ?? 1) >= (data?.pagination?.pages || 1)} onClick={() => update("page", String((data.pagination.page ?? 1) + 1))}>Suivant</Button>
          </div>
        </>
      )}
      <DocPreviewModal id={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
