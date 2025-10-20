export const STATUS_OPTIONS = [
  { label: "Semua", value: "all" },
  { label: "Belum Lunas", value: "unpaid" },
  { label: "Verifikasi", value: "pending" },
  { label: "Lunas", value: "paid" },
  { label: "Disetujui", value: "approved" },
  { label: "Ditolak", value: "rejected" },
];
// IPL App constants

export const BLOK_LIST = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
export const HOUSE_NUMBER_LIST = Array.from({ length: 50 }, (_, i) =>
  String(i + 1)
);

export const BULAN_LIST = [
  { value: "01", label: "Januari" },
  { value: "02", label: "Februari" },
  { value: "03", label: "Maret" },
  { value: "04", label: "April" },
  { value: "05", label: "Mei" },
  { value: "06", label: "Juni" },
  { value: "07", label: "Juli" },
  { value: "08", label: "Agustus" },
  { value: "09", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

export const STATUS_LABELS: Record<string, string> = {
  unpaid: "Belum Lunas",
  pending: "Verifikasi",
  paid: "Lunas",
  approved: "Disetujui",
  rejected: "Ditolak",
};

export const TAHUN_LIST = ["2024", "2025", "2026"];
