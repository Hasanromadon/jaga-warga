'use client';
import {
  useApproveBillMutation,
  useUpdateBillStatusMutation,
} from '../hooks/useConfirmBillMutations';
import { useInfiniteBills } from '../hooks/useBills';
import toast from 'react-hot-toast';
import { makeWaUrl } from '@/utils/formatPhone';
import { Calendar, FileDown, Filter, Search, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { BULAN_LIST, STATUS_LABELS, STATUS_OPTIONS } from '../constants';
import { Bill } from '../types/bill';
import { EmptyBillIllustration } from './svg/EmptyBillIllustration';
import { PreviewImageModal } from './ui/PreviewImageModal';
import { ModalConfirmation } from './ui/modal-confirmation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BillCard } from './BIllCard';
import { BillStatus } from './ui/BillStatusBadge';
import { getMonthName } from '@/utils/formatDate';
import { formatRupiah } from '@/utils/formatRupiah';

interface YearlyReportRow {
  nama: string;
  blok: string;
  total: number;
  totalLunas: number;
  totalBelumLunas: number;
  bulan: Record<string, string>;
}

const MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];
export default function LaporanList({
  residentialId,
}: {
  residentialId?: string;
}) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [month, setMonth] = useState('all');
  const [year, setYear] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    bill: Bill | null;
    action: 'markPaid' | 'markUnpaid' | null;
  }>({ open: false, bill: null, action: null });

  // Infinite scroll setup
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteBills(residentialId, search, month, status);

  // All bills from all pages
  const allBills = data?.pages.flatMap((page) => page.bills) ?? [];

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
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
      'Nama',
      'Block',
      'House Number',
      'Month',
      'Year',
      'Amount',
      'Status',
      'Remark',
    ];
    const rows = allBills.map((b) => [
      b.residentName,
      b.block,
      b.houseNumber,
      getMonthName(b.month),
      b.year,
      formatRupiah(Number(b.amount)),
      STATUS_LABELS[b.status] || b.status,
      b.remark || '',
    ]);
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'laporan_warga.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 🟡 Ekspor ke Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      allBills.map((b) => ({
        Nama: b.residentName,
        Blok: b.block,
        'No Rumah': b.houseNumber,
        Bulan: getMonthName(b.month),
        Tahun: b.year,
        Jumlah: formatRupiah(Number(b.amount)),
        Status: STATUS_LABELS[b.status] || b.status,
        Catatan: b.remark || '',
      })),
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan');
    XLSX.writeFile(workbook, 'laporan_warga.xlsx');
  };

  // 🔴 Ekspor ke PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Laporan Pembayaran Warga GHI', 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [
        [
          'Nama',
          'Block',
          'No Rumah',
          'Bulan',
          'Tahun',
          'Jumlah',
          'Status',
          'Catatan',
        ],
      ],
      body: allBills.map((b) => [
        String(b.residentName ?? ''),
        String(b.block ?? ''),
        String(b.houseNumber ?? ''),
        String(getMonthName(b.month) ?? ''),
        String(b.year ?? ''),
        String(formatRupiah(Number(b.amount))),
        String(STATUS_LABELS[b.status] ?? b.status ?? ''),
        String(b.remark ?? ''),
      ]),
    });
    doc.save('laporan_warga.pdf');
  };

  const generateYearlyReport = (year: string): YearlyReportRow[] => {
    const filtered = allBills.filter((b) => String(b.year) === year);
    const grouped = new Map<string, YearlyReportRow>();

    filtered.forEach((b) => {
      const residentName = b.residentName ?? '-';
      const block = b.block ?? '-';
      const houseNumber = b.houseNumber ?? '-';
      const key = `${residentName}_${block}_${houseNumber}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          nama: residentName,
          blok: `${block} No ${houseNumber}`,
          totalLunas: 0,
          totalBelumLunas: 0,
          total: 0,
          bulan: Object.fromEntries(MONTHS.map((m) => [m, '-'])),
        });
      }

      const data = grouped.get(key)!;
      const monthName = MONTHS[Number(b.month) - 1];
      const amount = Number(b.amount);

      // Tandai status per bulan
      if (b.status === 'paid') {
        data.bulan[monthName] = '✔️';
        data.totalLunas += amount;
      } else if (b.status === 'unpaid') {
        data.bulan[monthName] = '❌';
        data.totalBelumLunas += amount;
      } else {
        data.bulan[monthName] = '⏳';
      }

      // Tambahkan total keseluruhan
      data.total += amount;
    });

    return Array.from(grouped.values());
  };

  // 🔢 Hitung summary global (semua warga)
  const calculateSummary = (year: string) => {
    const filtered = allBills.filter((b) => String(b.year) === year);
    let totalLunas = 0;
    let totalBelum = 0;

    filtered.forEach((b) => {
      const amount = Number(b.amount);
      if (b.status === 'paid') totalLunas += amount;
      else if (b.status === 'unpaid') totalBelum += amount;
    });

    return { totalLunas, totalBelum, totalSemua: totalLunas + totalBelum };
  };

  // 🟢 Export Excel + Summary di bawah tabel
  const exportYearlyExcel = (year: string) => {
    const report = generateYearlyReport(year);
    if (report.length === 0) {
      toast.error('Tidak ada data untuk tahun ini!');
      return;
    }

    const { totalLunas, totalBelum, totalSemua } = calculateSummary(year);

    // 🔹 Flatten data warga
    const flat = report.map((r) => ({
      Nama: r.nama,
      Blok: r.blok,
      ...r.bulan,
      'Total Lunas': r.totalLunas,
      'Total Belum Lunas': r.totalBelumLunas,
      'Total Semua': r.total,
    }));

    // 🔹 Buat worksheet dari data utama
    const worksheet = XLSX.utils.json_to_sheet(flat);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Laporan ${year}`);

    // 🔹 Cari baris terakhir tabel
    const range = XLSX.utils.decode_range(worksheet['!ref']!);
    const lastRow = range.e.r + 3; // beri jarak 3 baris dari tabel utama

    // 🔹 Tambahkan summary di bawah tabel
    const summaryRows = [
      ['Total Lunas', totalLunas],
      ['Total Belum Lunas', totalBelum],
      ['Total Semua', totalSemua],
    ];

    summaryRows.forEach((row, i) => {
      const rowIndex = lastRow + i;
      worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 0 })] = { v: row[0] };
      worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: 1 })] = {
        v: row[1],
        t: 'n', // angka (number)
      };
    });

    // 🔹 Update referensi range agar Excel tahu sampai mana data
    const newRange = {
      s: { r: 0, c: 0 },
      e: { r: lastRow + summaryRows.length, c: range.e.c },
    };
    worksheet['!ref'] = XLSX.utils.encode_range(newRange);

    XLSX.writeFile(workbook, `laporan_warga_${year}.xlsx`);
  };

  // 🔽 Handle pilihan ekspor
  const handleExport = (type: string) => {
    if (allBills.length === 0) {
      toast.error('Tidak ada data untuk diekspor!');
      return;
    }
    if (type === 'csv') exportCSV();
    if (type === 'excel') exportExcel();
    if (type === 'pdf') exportPDF();
    if (type === 'yearly') exportYearlyExcel(year);
  };

  // This function is triggered by the confirmation modal
  const handleStatusUpdate = () => {
    if (!confirmModal.bill || !confirmModal.action) return;

    const mutationOptions = {
      onSettled: () => {
        setConfirmModal({ open: false, bill: null, action: null });
      },
    };

    if (confirmModal.action === 'markPaid') {
      markPaidMutation.mutate(
        { billId: confirmModal.bill.id },
        mutationOptions,
      );
    } else if (confirmModal.action === 'markUnpaid') {
      updateStatusMutation.mutate(
        { billId: confirmModal.bill.id, status: 'unpaid' },
        mutationOptions,
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
      `Request to change bill ${billToUpdate.id} to status: ${newStatus}`,
    );
    if (newStatus === 'paid') {
      setConfirmModal({ open: true, bill: billToUpdate, action: 'markPaid' });
    } else if (newStatus === 'unpaid') {
      setConfirmModal({ open: true, bill: billToUpdate, action: 'markUnpaid' });
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
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('Nomor WhatsApp untuk warga ini tidak tersedia.');
    }
  };

  return (
    <div className="space-y-4 mt-2">
      {/* 🔹 Row 1: Search, Filter, Export */}
      <div className="flex flex-col justify-start items-center gap-2 w-full pb-4 bg-white/30 backdrop-blur-sm rounded-lg p-3 border border-blue-100/30">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            disabled={allBills.length === 0}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, blok, nomor rumah..."
            className="w-full transition-all duration-200 bg-white border border-blue-200 rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder:text-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 outline-none"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
            <Search className="w-4 h-4" />
          </span>
        </div>
        <div className="flex flex-row w-full gap-1">
          {/* 🔽 Filter Status */}
          <Select
            value={status}
            onValueChange={setStatus}
            disabled={allBills.length === 0}
          >
            <SelectTrigger className="w-12 h-10 p-0 flex items-center justify-center bg-white border border-blue-200 rounded-lg hover:bg-blue-50">
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
          <Select onValueChange={handleExport} disabled={allBills.length === 0}>
            <SelectTrigger className="w-12 h-10 p-0 flex items-center justify-center bg-white border border-blue-200 rounded-lg hover:bg-blue-50">
              <FileDown className="w-4 h-4 text-blue-600" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">📄 Ekspor CSV</SelectItem>
              <SelectItem value="excel">📊 Ekspor Excel</SelectItem>
              <SelectItem value="pdf">📋 Ekspor PDF</SelectItem>
              <SelectItem value="yearly" disabled={!year}>
                🗓️ Laporan Tahunan
              </SelectItem>
            </SelectContent>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[85px] bg-white border border-blue-200">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                {[2024, 2025, 2026].map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Select>
        </div>
      </div>

      {/* 🔹 Row 2: Filter Bulan */}
      <div className="flex items-center justify-between gap-4 mt-3 bg-white/30 backdrop-blur-sm rounded-lg p-3 border border-blue-100/30">
        <span className="text-sm font-semibold text-blue-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          Filter Bulan
        </span>
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="bg-white w-[160px] border border-blue-200">
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
        ) : allBills.length === 0 ? (
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
            {/* {allBills.length > 0 && (
              <div className="flex items-center justify-between text-sm text-blue-700 bg-blue-50/50 rounded-lg px-4 py-2 border border-blue-100/50">
                <span className="font-medium">
                  Menampilkan {allBills.length} tagihan
                </span>
                <span className="text-xs text-blue-600">
                  Total:{" "}
                  {formatRupiah(
                    allBills.reduce((sum, bill) => sum + Number(bill.amount), 0)
                  )}
                </span>
              </div>
            )} */}
            {allBills.map((bill) => (
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
                confirmModal.action === 'markPaid'
                  ? 'Tandai sebagai Lunas?'
                  : 'Batalkan Status Lunas?'
              }
              description={
                confirmModal.bill ? (
                  <div className="text-center space-y-2">
                    <p className="text-sm">
                      {confirmModal.action === 'markPaid'
                        ? 'Tagihan akan ditandai sebagai LUNAS'
                        : 'Status tagihan akan dikembalikan ke BELUM LUNAS'}
                    </p>
                    <div className="bg-blue-50 p-3 rounded-md text-xs">
                      <div className="font-semibold">
                        {confirmModal.bill?.residentName ||
                          'Nama tidak tersedia'}
                      </div>
                      <div>
                        Blok {confirmModal.bill.block} No{' '}
                        {confirmModal.bill.houseNumber}
                      </div>
                      <div>
                        {getMonthName(confirmModal.bill.month)}{' '}
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
                confirmModal.action === 'markPaid'
                  ? 'Ya, Tandai Lunas'
                  : 'Ya, Batalkan'
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
