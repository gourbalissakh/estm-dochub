"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DocPreviewModal({
  id,
  onClose,
}: {
  id: string | null;
  onClose: () => void;
}) {
  return (
    <Dialog.Root open={Boolean(id)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex h-[88vh] w-[min(960px,94vw)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-3 shadow-[var(--shadow-lg)]">
          <div className="mb-2 flex items-center justify-between px-2">
            <Dialog.Title className="text-sm font-semibold text-[var(--fg)]">
              Apercu du document
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Apercu du document PDF selectionne dans une fenetre integree.
            </Dialog.Description>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={18} />
            </Button>
          </div>
          {id && (
            <iframe
              className="flex-1 rounded-xl border border-[var(--border)] bg-white"
              src={`/api/documents/${id}/preview`}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
