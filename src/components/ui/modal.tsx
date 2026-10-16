"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Tailwind max-width class for the panel. */
  width?: string;
};

export function Modal({ open, onOpenChange, title, description, children, width = "max-w-lg" }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-on-surface/30 z-50" />
        <Dialog.Content
          className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-32px)] ${width} max-h-[calc(100vh-48px)] overflow-y-auto bg-surface-container-lowest rounded-xl shadow-[0_8px_32px_rgba(16,24,40,0.18)] focus:outline-none`}
        >
          <div className="flex items-start justify-between gap-4 p-5 border-b border-outline-variant/40">
            <div>
              <Dialog.Title className="text-base font-semibold text-on-surface">{title}</Dialog.Title>
              {description ? (
                <Dialog.Description className="text-xs text-on-surface-variant mt-0.5">
                  {description}
                </Dialog.Description>
              ) : (
                <Dialog.Description className="sr-only">{title}</Dialog.Description>
              )}
            </div>
            <Dialog.Close
              className="w-8 h-8 -mr-1.5 -mt-1 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </Dialog.Close>
          </div>
          <div className="p-5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
