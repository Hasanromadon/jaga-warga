"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog";
import { AlertTriangle } from "lucide-react";
import { Button } from "./button";

export interface ModalConfirmationProps {
  open: boolean;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  rejectReason?: string;
  onRejectReasonChange?: (v: string) => void;
}

export function ModalConfirmation({
  open,
  title,
  description,
  confirmLabel = "Ya, Lanjutkan",
  cancelLabel = "Batal",
  onConfirm,
  onCancel,
  loading,
  rejectReason,
  onRejectReasonChange,
}: ModalConfirmationProps) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onCancel()}>
  <DialogContent className="max-w-sm w-full p-2 sm:p-4">
        <DialogHeader className="items-center">
          <div className="flex flex-col items-center gap-2">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mb-1" />
            <DialogTitle className="text-center text-base font-bold text-blue-900">{title}</DialogTitle>
          </div>
        </DialogHeader>
  {description && <div className="text-sm text-muted-foreground text-center mb-3 mt-1">{description}</div>}
        {typeof rejectReason !== 'undefined' && onRejectReasonChange && (
          <textarea
            className="border rounded px-3 py-2 text-sm w-full mb-3 min-h-[64px] resize-none focus:outline-blue-400"
            placeholder="Alasan penolakan..."
            value={rejectReason}
            onChange={e => onRejectReasonChange(e.target.value)}
            autoFocus
            maxLength={200}
          />
        )}
        <DialogFooter className="flex flex-row gap-2 justify-center mt-2">
          <Button onClick={onConfirm} disabled={loading} className="px-4">
            {loading ? "Memproses..." : confirmLabel}
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={loading} className="px-4">
            {cancelLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
