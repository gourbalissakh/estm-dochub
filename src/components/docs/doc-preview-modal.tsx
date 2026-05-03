"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DocPreviewModal({ id, onClose }: { id: string | null; onClose: () => void }) {
  return (
    <Dialog.Root open={Boolean(id)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 h-[82vh] w-[min(920px,94vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-3 shadow-xl dark:bg-[#1E1830]">
          <div className="mb-2 flex items-center justify-between">
            <Dialog.Title className="font-semibold">Apercu PDF</Dialog.Title>
            <Dialog.Description className="sr-only">
              Apercu du document PDF selectionne dans une fenetre integree.
            </Dialog.Description>
            <Button variant="ghost" size="icon" onClick={onClose}><X size={18} /></Button>
          </div>
          {id && <iframe className="h-[calc(82vh-56px)] w-full rounded-lg border border-violet-100" src={`/api/documents/${id}/preview`} />}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
