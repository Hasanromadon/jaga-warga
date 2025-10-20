"use client";
import {
  useApproveBillMutation,
  useUpdateBillStatusMutation,
} from "../hooks/useConfirmBillMutations";
import { useInfiniteBills } from "../hooks/useBills";
import toast from "react-hot-toast";
import { makeWaUrl } from "@/utils/formatPhone";
import { Calendar, FileDown, Filter, Search, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { BULAN_LIST, STATUS_LABELS, STATUS_OPTIONS } from "../constants";
import { Bill } from "../types/bill";
import { EmptyBillIllustration } from "./svg/EmptyBillIllustration";
import { PreviewImageModal } from "./ui/PreviewImageModal";
import { ModalConfirmation } from "./ui/modal-confirmation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { BillCard } from "./BIllCard";
import { BillStatus } from "./ui/BillStatusBadge";
import { getMonthName } from "@/utils/formatDate";
import { formatRupiah } from "@/utils/formatRupiah";

export default function LaporanList({
  residentialId,
}: {
  residentialId?: string;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [month, setMonth] = useState("all");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    bill: Bill | null;
    action: "markPaid" | "markUnpaid" | null;
  }>({ open: false, bill: null, action: null });

  // Infinite scroll setup
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteBills(residentialId, search);

  // All bills from all pages
  const allBills = data?.pages.flatMap((page) => page.bills) ?? [];

  // Client-side filtering for status and month (since these are not in keywords)
  const filteredBills = allBills.filter((bill) => {
    if (status && status !== "all" && bill.status !== status) return false;
    if (month && month !== "all" && bill.month !== month) return false;
    return true;
  });

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Mutations for status update
  const markPaidMutation = useApproveBillMutation();
  const updateStatusMutation = useUpdateBillStatusMutation();

  // 🟢 Ekspor ke CSV
  const exportCSV = () => {
    const header = [
      "Nama",
      "Block",
      "House Number",
      "Month",
      "Year",
      "Amount",
      "Status",
      "Remark",
    ];
    const rows = filteredBills.map((b) => [
      b.residentName,
      b.block,
      b.houseNumber,
      getMonthName(b.month),
      b.year,
      formatRupiah(Number(b.amount)),
      STATUS_LABELS[b.status] || b.status,
      b.remark || "",
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "laporan_warga.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 🟡 Ekspor ke Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredBills.map((b) => ({
        Nama: b.residentName,
        Blok: b.block,
        "No Rumah": b.houseNumber,
        Bulan: getMonthName(b.month),
        Tahun: b.year,
        Jumlah: formatRupiah(Number(b.amount)),
        Status: STATUS_LABELS[b.status] || b.status,
        Catatan: b.remark || "",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
    XLSX.writeFile(workbook, "laporan_warga.xlsx");
  };

  // 🔴 Ekspor ke PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Pembayaran Warga GHI", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [
        [
          "Nama",
          "Block",
          "No Rumah",
          "Bulan",
          "Tahun",
          "Jumlah",
          "Status",
          "Catatan",
        ],
      ],
      body: filteredBills.map((b) => [
        String(b.residentName ?? ""),
        String(b.block ?? ""),
        String(b.houseNumber ?? ""),
        String(getMonthName(b.month) ?? ""),
        String(b.year ?? ""),
        String(formatRupiah(Number(b.amount))),
        String(STATUS_LABELS[b.status] ?? b.status ?? ""),
        String(b.remark ?? ""),
      ]),
    });
    doc.save("laporan_warga.pdf");
  };

  // 🔽 Handle pilihan ekspor
  const handleExport = (type: string) => {
    if (filteredBills.length === 0) {
      toast.error("Tidak ada data untuk diekspor!");
      return;
    }
    if (type === "csv") exportCSV();
    if (type === "excel") exportExcel();
    if (type === "pdf") exportPDF();
  };

  // This function is triggered by the confirmation modal
  const handleStatusUpdate = () => {
    if (!confirmModal.bill || !confirmModal.action) return;
    const billId = confirmModal.bill.id;
    setEditLoading(billId);

    const mutationOptions = {
      onSettled: () => {
        setEditLoading(null);
        setConfirmModal({ open: false, bill: null, action: null });
      },
    };

    if (confirmModal.action === "markPaid") {
      markPaidMutation.mutate({ billId }, mutationOptions);
    } else if (confirmModal.action === "markUnpaid") {
      updateStatusMutation.mutate(
        { billId, status: "unpaid" },
        mutationOptions
      );
    }
  };

  // --- ✅ COMPLETED HANDLER FUNCTIONS ---

  /**
   * Called by the BillCard component when a status change button is clicked.
   * This function OPENS THE CONFIRMATION MODAL instead of directly calling the mutation.
   */
  const handleStatusChange = (billToUpdate: Bill, newStatus: BillStatus) => {
    console.log(
      `Request to change bill ${billToUpdate.id} to status: ${newStatus}`
    );
    if (newStatus === "paid") {
      setConfirmModal({ open: true, bill: billToUpdate, action: "markPaid" });
    } else if (newStatus === "unpaid") {
      setConfirmModal({ open: true, bill: billToUpdate, action: "markUnpaid" });
    }
  };

  /**
   * Called by the BillCard to show the proof of payment image.
   * It sets the state to open the PreviewImageModal.
   */
  const handleShowProof = (url: string) => {
    setPreviewImage(url);
  };

  /**
   * Called by the BillCard to send a WhatsApp reminder.
   * It constructs a URL and opens it in a new tab.
   */
  const handleSendWhatsApp = (bill: Bill) => {
    const waUrl = makeWaUrl(bill); // Assumes this utility function exists and works
    if (waUrl) {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    } else {
      toast.error("Nomor WhatsApp untuk warga ini tidak tersedia.");
    }
  };

  return (
    <div className="space-y-4 mt-2">
      {/* 🔹 Row 1: Search, Filter, Export */}
      <div className="flex flex-wrap items-center gap-2 w-full pb-2 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-blue-100/50 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] sm:min-w-[280px]">
          <input
            type="text"
            value={search}
            disabled={filteredBills.length === 0}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, blok, nomor rumah..."
            className="w-full transition-all duration-200 bg-white border border-blue-200 rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder:text-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 outline-none shadow-sm"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
            <Search className="w-4 h-4" />
          </span>
        </div>

        {/* 🔽 Filter Status */}
        <Select
          value={status}
          onValueChange={setStatus}
          disabled={filteredBills.length === 0}
        >
          <SelectTrigger className="w-12 h-10 p-0 flex items-center justify-center bg-white border border-blue-200 rounded-lg hover:bg-blue-50 shadow-sm">
            <Filter className="w-4 h-4 text-blue-600" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/*Export Dropdown */}
        <Select
          onValueChange={handleExport}
          disabled={filteredBills.length === 0}
        >
          <SelectTrigger className="w-12 h-10 p-0 flex items-center justify-center bg-white border border-blue-200 rounded-lg hover:bg-blue-50 shadow-sm">
            <FileDown className="w-4 h-4 text-blue-600" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="csv">📄 Ekspor CSV</SelectItem>
            <SelectItem value="excel">📊 Ekspor Excel</SelectItem>
            <SelectItem value="pdf">📋 Ekspor PDF</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 🔹 Row 2: Filter Bulan */}
      <div className="flex items-center justify-between gap-4 mt-3 bg-white/30 backdrop-blur-sm rounded-lg p-3 border border-blue-100/30">
        <span className="text-sm font-semibold text-blue-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          Filter Bulan
        </span>
        <Select
          value={month}
          onValueChange={setMonth}
          disabled={filteredBills.length === 0}
        >
          <SelectTrigger className="bg-white w-[160px] border border-blue-200 shadow-sm">
            <SelectValue placeholder="Pilih Bulan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">📅 Semua Bulan</SelectItem>
            {BULAN_LIST.map((b) => (
              <SelectItem key={b.value} value={b.value}>
                {b.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 🔹 List Section */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-sm border border-blue-200/50 mb-6">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Memuat data...
              </h3>
              <p className="text-sm text-blue-600">
                Sedang mengambil data tagihan
              </p>
            </div>
          </div>
        ) : filteredBills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <EmptyBillIllustration />

            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Tidak ada data laporan
              </h3>
              <p className="text-sm text-blue-600 max-w-sm">
                Belum ada tagihan yang sesuai dengan filter yang dipilih. Coba
                ubah filter atau tambahkan data tagihan baru.
              </p>
            </div>
          </div>
        ) : (
          <>
            {filteredBills.length > 0 && (
              <div className="flex items-center justify-between text-sm text-blue-700 bg-blue-50/50 rounded-lg px-4 py-2 border border-blue-100/50">
                <span className="font-medium">
                  Menampilkan {filteredBills.length} tagihan
                </span>
                <span className="text-xs text-blue-600">
                  Total:{" "}
                  {formatRupiah(
                    filteredBills.reduce(
                      (sum, bill) => sum + Number(bill.amount),
                      0
                    )
                  )}
                </span>
              </div>
            )}
            {filteredBills.map((bill) => (
              <BillCard
                key={bill.id}
                bill={bill}
                onStatusChange={handleStatusChange}
                onShowProof={handleShowProof}
                onSendWhatsApp={() => handleSendWhatsApp(bill)}
              />
            ))}
            <PreviewImageModal
              open={!!previewImage}
              src={previewImage}
              onClose={() => setPreviewImage(null)}
            />

            {/* Status Update Confirmation Modal */}
            <ModalConfirmation
              open={confirmModal.open}
              title={
                confirmModal.action === "markPaid"
                  ? "Tandai sebagai Lunas?"
                  : "Batalkan Status Lunas?"
              }
              description={
                confirmModal.bill ? (
                  <div className="text-center space-y-2">
                    <p className="text-sm">
                      {confirmModal.action === "markPaid"
                        ? "Tagihan akan ditandai sebagai LUNAS"
                        : "Status tagihan akan dikembalikan ke BELUM LUNAS"}
                    </p>
                    <div className="bg-blue-50 p-3 rounded-md text-xs">
                      <div className="font-semibold">
                        {confirmModal.bill?.residentName ||
                          "Nama tidak tersedia"}
                      </div>
                      <div>
                        Blok {confirmModal.bill.block} No{" "}
                        {confirmModal.bill.houseNumber}
                      </div>
                      <div>
                        {getMonthName(confirmModal.bill.month)}{" "}
                        {confirmModal.bill.year}
                      </div>
                      <div className="font-bold text-blue-700 mt-1">
                        {formatRupiah(Number(confirmModal.bill.amount))}
                      </div>
                    </div>
                  </div>
                ) : null
              }
              confirmLabel={
                confirmModal.action === "markPaid"
                  ? "Ya, Tandai Lunas"
                  : "Ya, Batalkan"
              }
              cancelLabel="Batal"
              onConfirm={handleStatusUpdate}
              onCancel={() =>
                setConfirmModal({ open: false, bill: null, action: null })
              }
              loading={
                markPaidMutation.isPending || updateStatusMutation.isPending
              }
            />

            {/* Infinite Scroll Trigger */}
            {hasNextPage && (
              <div ref={loadMoreRef} className="flex justify-center py-8">
                {isFetchingNextPage ? (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Memuat lebih banyak...</span>
                  </div>
                ) : (
                  <div className="text-sm text-blue-500">
                    Gulir untuk memuat lebih banyak
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
