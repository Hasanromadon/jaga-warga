"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./dialog"; // Asumsi dari shadcn/ui
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { Button } from "./button"; // Asumsi dari shadcn/ui

// Konfigurasi untuk tipe modal yang berbeda (lebih fleksibel)
const MODAL_TYPES = {
  warning: {
    Icon: AlertTriangle,
    className:
      "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/40 dark:text-yellow-300",
    confirmClass: "bg-yellow-500 hover:bg-yellow-600",
  },
  danger: {
    Icon: AlertCircle,
    className: "text-red-500 bg-red-100 dark:bg-red-900/40 dark:text-red-300",
    confirmClass: "bg-red-600 hover:bg-red-700",
  },
  info: {
    Icon: Info,
    className:
      "text-blue-500 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300",
    confirmClass: "bg-blue-600 hover:bg-blue-700",
  },
};

export interface ModalConfirmationProps {
  open: boolean;
  type?: keyof typeof MODAL_TYPES;
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
  type = "warning", // Default ke 'warning'
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
  const modalType = MODAL_TYPES[type];
  const { Icon, className: iconClassName, confirmClass } = modalType;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="w-[90vw] max-w-md rounded-xl p-6">
        <div className="flex flex-col items-center text-center">
          {/* Ikon Dinamis */}
          <div
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${iconClassName}`}
          >
            <Icon className="h-7 w-7" />
          </div>

          {/* Header */}
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-50">
              {title}
            </DialogTitle>
          </DialogHeader>

          {/* Deskripsi */}
          {description && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </div>
          )}

          {/* Input Alasan Penolakan */}
          {typeof rejectReason !== "undefined" && onRejectReasonChange && (
            <textarea
              className="mt-4 w-full min-h-[80px] resize-none rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900"
              placeholder="Berikan alasan penolakan..."
              value={rejectReason}
              onChange={(e) => onRejectReasonChange(e.target.value)}
              maxLength={200}
              autoFocus
            />
          )}

          {/* Footer dengan layout mobile-first */}
          <DialogFooter className="mt-6 flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              className={`w-full text-white sm:w-auto ${confirmClass}`}
            >
              {loading ? "Memproses..." : confirmLabel}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
