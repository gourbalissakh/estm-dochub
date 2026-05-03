"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function VisibilityButton({ id, visible, kind }: { id: string; visible: boolean; kind: "documents" | "messages" }) {
  const router = useRouter();
  async function toggle() {
    await fetch(`/api/${kind}/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ isVisible: !visible }) });
    router.refresh();
  }
  return <Button variant="outline" size="sm" onClick={toggle}>{visible ? "Masquer" : "Afficher"}</Button>;
}

export function DeleteButton({ id, kind }: { id: string; kind: "documents" | "messages" }) {
  const router = useRouter();
  async function remove() {
    await fetch(`/api/${kind}/${id}`, { method: "DELETE" });
    router.refresh();
  }
  return <Button variant="danger" size="sm" onClick={remove}>Supprimer</Button>;
}

export function StudentStatusButton({ id, status, label }: { id: string; status: string; label: string }) {
  const router = useRouter();
  async function update() {
    await fetch(`/api/admin/students/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status }) });
    router.refresh();
  }
  return <Button variant="outline" size="sm" onClick={update}>{label}</Button>;
}
