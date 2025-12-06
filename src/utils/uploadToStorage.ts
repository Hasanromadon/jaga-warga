import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebaseConfig';
import toast from 'react-hot-toast';

/**
 * Upload file ke Firebase Storage
 * @param file File yang akan diupload
 * @param path Path di storage (contoh: 'bukti-bayar/123/file.jpg')
 * @param showToast Tampilkan toast notification (default: true)
 * @returns URL download file atau null jika gagal
 */
export async function uploadToStorage(
  file: File,
  path: string,
  showToast = true,
): Promise<string | null> {
  let toastId: string | undefined;

  try {
    if (showToast) {
      toastId = toast.loading('Mengunggah file...');
    }

    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    if (showToast && toastId) {
      toast.success('File berhasil diunggah!', { id: toastId });
    }

    return downloadURL;
  } catch (error) {
    console.error('Upload error:', error);

    if (showToast && toastId) {
      toast.error('Gagal mengunggah file.', { id: toastId });
    }

    return null;
  }
}

/**
 * Upload bukti bayar ke storage
 * @param file File bukti bayar
 * @param billId ID tagihan
 * @returns URL download atau null jika gagal
 */
export async function uploadBuktiBayar(
  file: File,
  billId: string,
): Promise<string | null> {
  const path = `bukti-bayar/${billId}/${file.name}`;
  return uploadToStorage(file, path, true);
}

/**
 * Upload gambar iklan ke storage
 * @param file File gambar
 * @returns URL download atau null jika gagal
 */
export async function uploadAdImage(file: File): Promise<string | null> {
  const path = `ads/${Date.now()}_${file.name}`;
  return uploadToStorage(file, path, true);
}
