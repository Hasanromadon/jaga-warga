import { BadgeCheck, UploadCloud, XCircle } from "lucide-react";
import React from "react";

export type BillStatus =
  | "unpaid"
  | "pending"
  | "paid"
  | "rejected"
  | "approved";

const STATUS_MAP: Record<
  BillStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  paid: {
    label: "Lunas",
    color: "text-green-600",
    icon: <BadgeCheck className="w-4 h-4" />,
  },
  pending: {
    label: "Verifikasi",
    color: "text-yellow-600",
    icon: <UploadCloud className="w-4 h-4" />,
  },
  approved: {
    label: "Disetujui",
    color: "text-blue-600",
    icon: <UploadCloud className="w-4 h-4" />,
  },
  rejected: {
    label: "Ditolak",
    color: "text-red-600",
    icon: <XCircle className="w-4 h-4" />,
  },
  unpaid: {
    label: "Belum Lunas",
    color: "text-red-600",
    icon: <XCircle className="w-4 h-4" />,
  },
};

export function BillStatusBadge({ status }: { status: BillStatus }) {
  const s = STATUS_MAP[status] || STATUS_MAP.unpaid;
  return (
    <span
      className={`flex items-center gap-1 ${s.color} text-xs font-semibold`}
    >
      {s.icon} {s.label}
    </span>
  );
}
