import toast from 'react-hot-toast';

/**
 * Common toast messages untuk consistency
 */

// Success messages
export const toastMessages = {
  // Resident/Warga
  residentAdded: () => toast.success('Warga berhasil ditambahkan'),
  residentUpdated: () => toast.success('Warga berhasil diupdate'),
  residentDeleted: () => toast.success('Warga dihapus'),
  residentImportSuccess: (count: number) =>
    toast.success(`✅ Semua ${count} warga berhasil diimpor!`),
  residentImportPartial: (success: number, failed: number) =>
    toast.error(
      `Berhasil: ${success} warga, Gagal: ${failed} warga. Periksa konsol untuk detail.`,
    ),

  // Bill/Tagihan
  billAdded: () => toast.success('Tagihan berhasil ditambahkan!'),
  billUpdated: () => toast.success('Tagihan berhasil diupdate'),
  billNotFound: () => toast.error('Tagihan tidak ditemukan.'),
  billSearchError: () => toast.error('Gagal mencari tagihan.'),

  // Bukti Bayar
  proofUploaded: () =>
    toast.success('Bukti berhasil diupload, menunggu verifikasi admin.'),
  proofUploadError: () => toast.error('Gagal upload bukti.'),

  // Finance/Keuangan
  financeAdded: (type: 'income' | 'expense') =>
    toast.success(
      `Transaksi ${type === 'income' ? 'pemasukan' : 'pengeluaran'} berhasil disimpan!`,
    ),
  financeError: () => toast.error('Gagal menyimpan transaksi!'),

  // File operations
  fileUploadSuccess: () => toast.success('File berhasil diunggah!'),
  fileUploadError: () => toast.error('Gagal mengunggah file.'),
  fileSizeError: (maxMB: number) =>
    toast.error(`Ukuran file terlalu besar. Maksimal ${maxMB}MB`),
  fileTypeError: () => toast.error('Tipe file tidak valid'),

  // Import/Export
  noDataToImport: () => toast.error('Tidak ada data untuk diimpor'),
  noDataToExport: () => toast.error('Tidak ada data untuk diekspor!'),
  importInProgress: () => toast.error('Tunggu hingga import selesai'),
  csvReadError: (error: string) =>
    toast.error(`Gagal membaca file CSV: ${error}`),
  noValidData: () => toast.error('Tidak ada data valid untuk diimpor'),

  // WhatsApp
  waNumberNotAvailable: () =>
    toast.error('Nomor WhatsApp untuk warga ini tidak tersedia.'),

  // Generic
  loading: (message = 'Memproses...') => toast.loading(message),
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast(message),
};

/**
 * Helper untuk update toast yang sedang loading
 */
export const updateToast = {
  success: (id: string, message: string) => toast.success(message, { id }),
  error: (id: string, message: string) => toast.error(message, { id }),
};

/**
 * Toast untuk loading dengan promise
 */
export async function toastPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  },
): Promise<T> {
  return toast.promise(promise, messages);
}
