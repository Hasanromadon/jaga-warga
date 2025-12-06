// Utility untuk memetakan kode galat Firebase ke pesan yang ramah pengguna

export function mapFirebaseError(error: unknown): string {
  // Pastikan 'error' adalah objek dan memiliki properti 'code'
  if (typeof error === 'object' && error && 'code' in error) {
    const code = (error as { code?: string }).code;

    switch (code) {
      // --- AUTHENTICATION ERRORS ---
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Email atau kata sandi salah.';

      case 'auth/email-already-in-use':
        return 'Email sudah digunakan oleh akun lain.';

      case 'auth/invalid-email':
        return 'Format email tidak valid. Silakan periksa kembali.';

      case 'auth/weak-password':
        return 'Kata sandi terlalu lemah. Gunakan minimal 6 karakter.';

      case 'auth/user-disabled':
        return 'Akun ini telah dinonaktifkan.';

      case 'auth/too-many-requests':
        return 'Terlalu banyak percobaan. Silakan coba beberapa saat lagi untuk melindungi akun Anda.';

      case 'auth/network-request-failed':
        return 'Koneksi jaringan gagal. Periksa koneksi internet Anda.';

      case 'auth/requires-recent-login':
        return 'Tindakan ini memerlukan login ulang. Silakan login kembali dan coba lagi.';

      // --- STORAGE ERRORS ---
      case 'storage/unauthorized':
        return 'Anda tidak memiliki izin untuk mengakses file ini.';

      case 'storage/object-not-found':
        return 'File yang dituju tidak ditemukan.';

      case 'storage/quota-exceeded':
        return 'Kuota penyimpanan sudah penuh.';

      case 'storage/canceled':
        return 'Aksi dibatalkan oleh pengguna.';

      case 'storage/retry-limit-exceeded':
        return 'Waktu unggah habis. Silakan coba lagi.';

      // --- FIRESTORE & GENERAL ERRORS ---
      case 'permission-denied':
        return 'Anda tidak memiliki izin untuk melakukan aksi ini.';

      case 'unavailable':
        return 'Layanan tidak tersedia saat ini. Coba lagi nanti.';

      case 'deadline-exceeded':
        return 'Waktu permintaan habis, periksa koneksi internet Anda.';

      case 'not-found':
        return 'Data yang Anda cari tidak ditemukan.';

      // --- DEFAULT ---
      default:
        console.error('Firebase Error Code:', code); // Opsional: log kode error yang tidak tertangani
        return 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.';
    }
  }

  // Fallback untuk error yang tidak terduga
  console.error('Unknown Error:', error);
  return 'Terjadi kesalahan. Silakan coba lagi.';
}
