"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function VisibilityButton({ id, visible, kind }: { id: string; visible: boolean; kind: "documents" }) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(visible);
  const [busy, setBusy] = useState(false);
  async function toggle() {
    setBusy(true);
    const next = !isVisible;
    const response = await fetch(`/api/${kind}/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ isVisible: next }) });
    if (response.ok) {
      setIsVisible(next);
      router.refresh();
    }
    setBusy(false);
  }
  return <Button type="button" variant="outline" size="sm" disabled={busy} onClick={toggle}>{isVisible ? "Masquer" : "Afficher"}</Button>;
}

export function DeleteButton({ id, kind }: { id: string; kind: "documents" }) {
  const router = useRouter();
  async function remove() {
    await fetch(`/api/${kind}/${id}`, { method: "DELETE" });
    router.refresh();
  }
  return <Button type="button" variant="danger" size="sm" onClick={remove}>Supprimer</Button>;
}

export function StudentStatusButton({ id, status, label }: { id: string; status: string; label: string }) {
  const router = useRouter();
  async function update() {
    await fetch(`/api/admin/students/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status }) });
    router.refresh();
  }
  return <Button type="button" variant="outline" size="sm" onClick={update}>{label}</Button>;
}
