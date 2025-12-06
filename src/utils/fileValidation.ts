/**
 * Validasi ukuran file
 * @param file File yang akan divalidasi
 * @param maxSizeMB Ukuran maksimal dalam MB (default: 3)
 * @returns true jika valid, false jika terlalu besar
 */
export function validateFileSize(file: File, maxSizeMB = 3): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
}

/**
 * Validasi tipe file
 * @param file File yang akan divalidasi
 * @param allowedTypes Array tipe file yang diizinkan (default: image types)
 * @returns true jika tipe file valid
 */
export function validateFileType(
  file: File,
  allowedTypes: string[] = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
  ],
): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Validasi file dengan size dan type
 * @param file File yang akan divalidasi
 * @param maxSizeMB Ukuran maksimal dalam MB
 * @param allowedTypes Array tipe file yang diizinkan
 * @returns { valid: boolean, error?: string }
 */
export function validateFile(
  file: File,
  maxSizeMB = 3,
  allowedTypes: string[] = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
  ],
): { valid: boolean; error?: string } {
  if (!validateFileSize(file, maxSizeMB)) {
    return {
      valid: false,
      error: `Ukuran file maksimal ${maxSizeMB}MB`,
    };
  }

  if (!validateFileType(file, allowedTypes)) {
    const types = allowedTypes
      .map((t) => t.split('/')[1].toUpperCase())
      .join(', ');
    return {
      valid: false,
      error: `Tipe file harus: ${types}`,
    };
  }

  return { valid: true };
}

/**
 * Format ukuran file ke format human readable
 * @param bytes Ukuran dalam bytes
 * @returns String format (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
