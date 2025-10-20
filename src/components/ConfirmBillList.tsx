"use client";
import { useBills } from "../hooks/useBills";
import {
  useApproveBillMutation,
  useRejectBillMutation,
} from "../hooks/useConfirmBillMutations";
import { BadgeCheck, XCircle } from "lucide-react";
import { EmptyBillIllustration } from "./svg/EmptyBillIllustration";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ModalConfirmation } from "./ui/modal-confirmation";
import { SearchInput } from "./custom/search-input";
import { useState } from "react";
import toast from "react-hot-toast";
import { PreviewImageModal } from "./ui/PreviewImageModal";
import { formatTimestampID, getMonthName } from "../utils/formatDate";
import { useAuthContext } from "../context/AuthProvider";

export default function ConfirmBillList() {
  const { residentialId } = useAuthContext();
  const [rejectReason, setRejectReason] = useState("");
  const [search, setSearch] = useState("");
  const {
    data: bills,
    isLoading,
    error,
  } = useBills(residentialId || undefined, search || undefined);
  const approveMutation = useApproveBillMutation();
  const rejectMutation = useRejectBillMutation();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [modal, setModal] = useState<null | {
    type: "approve" | "reject";
    billId: string;
  }>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const pendingBills = (bills || []).filter(
    (bill) => bill.status === "pending"
  );

  if (isLoading)
    return (
      <div className="text-center py-8 text-blue-700">
        Memuat data tagihan...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-8 text-red-600">
        Gagal memuat data tagihan
      </div>
    );

  // Search input and empty state
  if (pendingBills.length === 0)
    return (
      <div>
        <div className="sticky top-0 z-10 bg-gradient-to-b mb-4 pb-2 pt-2">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-center justify-center py-10 text-blue-700">
          <EmptyBillIllustration />
          <div className="mt-4 text-base font-semibold">
            Tidak ada tagihan menunggu konfirmasi.
          </div>
        </div>
      </div>
    );

  return (
    <div>
      <div className="sticky top-0 z-10 mb-2">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        {pendingBills.map((bill) => (
          <Card
            key={bill.id}
            className="animate-fade-in border border-gray-200 bg-white/95 shadow-sm rounded-xl"
          >
            <div className="px-4">
              <div className="flex flex-col mb-2 space-y-1">
                <div className="flex flex-row space-x-2">
                  <span className="text-md font-bold">
                    {bill.residentName || "Nama tidak tersedia"}
                  </span>
                </div>
                <span className="inline-flex bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0">
                  {getMonthName(bill.month)} {bill.year}
                </span>
              </div>
              <div
                className="font-semibold text-blue-900 text-xs truncate mb-1"
                title={`Blok ${bill.block} No ${bill.houseNumber}`}
              >{`Blok ${bill.block} No ${bill.houseNumber}`}</div>
              <div className="flex items-center gap-2 text-xs mb-0">
                <span className="text-gray-700">Jumlah :</span>
                <span className="font-bold text-blue-700 text-base">
                  Rp{Number(bill.amount).toLocaleString("id-ID")}
                </span>
              </div>
              {bill.proofUrl && (
                <button
                  type="button"
                  className="text-xs text-blue-600 underline bg-transparent border-0 p-0 cursor-pointer hover:text-blue-800"
                  onClick={() => setPreviewImage(bill.proofUrl || null)}
                >
                  🔗 Lihat Bukti Pembayaran
                </button>
              )}
              <div className="flex gap-2 mt-3 justify-end">
                <Button
                  size="sm"
                  disabled={loadingId === bill.id}
                  onClick={() => setModal({ type: "approve", billId: bill.id })}
                  className="flex items-center gap-1"
                >
                  <BadgeCheck className="w-4 h-4" /> Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setModal({ type: "reject", billId: bill.id });
                    setRejectReason("");
                  }}
                  className="flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </Button>
              </div>
            </div>
            {/* Modal konfirmasi approve/reject */}
            <ModalConfirmation
              open={!!modal}
              title={
                modal?.type === "approve"
                  ? "Konfirmasi Approve Pembayaran"
                  : "Konfirmasi Penolakan Pembayaran"
              }
              description={(() => {
                if (!modal) return undefined;
                const bill = pendingBills.find((b) => b.id === modal.billId);
                if (!bill) return undefined;
                return (
                  <div className="text-left space-y-2">
                    <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-1 text-sm items-center">
                      <span className="text-gray-500">Blok/No</span>{" "}
                      <span>
                        {bill.block}/{bill.houseNumber}
                      </span>
                      <span className="text-gray-500">Month/Year</span>{" "}
                      <span>
                        {bill.month}/{bill.year}
                      </span>
                      <span className="text-gray-500">Created At</span>{" "}
                      <span>{formatTimestampID(bill.createdAt)}</span>
                      <span className="text-gray-500">Amount</span>{" "}
                      <span className="font-bold text-blue-700">
                        Rp{Number(bill.amount).toLocaleString("id-ID")}
                      </span>
                      {bill.proofUrl && (
                        <>
                          <span className="text-gray-500">Proof</span>
                          <span className="inline-block">
                            <button
                              type="button"
                              className="text-blue-600 underline p-0 bg-transparent border-0 cursor-pointer hover:text-blue-800 text-left"
                              onClick={(e) => {
                                e.preventDefault();
                                setPreviewImage(bill.proofUrl || null);
                              }}
                            >
                              🔗 Lihat Bukti Pembayaran
                            </button>
                          </span>
                        </>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      {modal.type === "approve"
                        ? "Apakah Anda yakin ingin menyetujui pembayaran tagihan ini? Data akan tercatat sebagai sudah lunas."
                        : "Apakah Anda yakin ingin menolak pembayaran tagihan ini? Data akan tercatat sebagai ditolak."}
                    </div>
                  </div>
                );
              })()}
              confirmLabel={
                modal?.type === "approve" ? "Ya, Setujui" : "Ya, Tolak"
              }
              cancelLabel="Batal"
              loading={!!loadingId}
              rejectReason={modal?.type === "reject" ? rejectReason : undefined}
              onRejectReasonChange={
                modal?.type === "reject" ? setRejectReason : undefined
              }
              onCancel={() => {
                setModal(null);
              }}
              onConfirm={async () => {
                if (!modal) return;
                setLoadingId(modal.billId);
                if (modal.type === "approve") {
                  approveMutation.mutate(
                    { billId: modal.billId },
                    {
                      onSuccess: () => {
                        toast.success("Tagihan berhasil dikonfirmasi.");
                        setLoadingId(null);
                        setModal(null);
                      },
                      onError: () => {
                        toast.error("Gagal mengkonfirmasi tagihan.");
                        setLoadingId(null);
                      },
                    }
                  );
                } else {
                  rejectMutation.mutate(
                    { billId: modal.billId, reason: rejectReason },
                    {
                      onSuccess: () => {
                        toast.success("Tagihan berhasil ditolak.");
                        // removed setRejectingId(null); not needed
                        setRejectReason("");
                        setLoadingId(null);
                        setModal(null);
                      },
                      onError: () => {
                        toast.error("Gagal menolak tagihan.");
                        setLoadingId(null);
                      },
                    }
                  );
                }
              }}
            />
            {/* Modal khusus untuk preview bukti bayar */}
            <PreviewImageModal
              open={!!previewImage}
              src={previewImage}
              onClose={() => setPreviewImage(null)}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
