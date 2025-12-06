/**
 * Common constants untuk form validation
 */

export const VALIDATION_MESSAGES = {
  required: {
    block: 'Blok wajib diisi',
    houseNumber: 'Nomor rumah wajib diisi',
    name: 'Nama wajib diisi',
    phone: 'Nomor telepon wajib diisi',
    amount: 'Jumlah wajib diisi',
    month: 'Bulan wajib diisi',
    year: 'Tahun wajib diisi',
    description: 'Deskripsi wajib diisi',
    type: 'Tipe wajib dipilih',
    file: 'File wajib diupload',
    resident: 'Warga wajib dipilih',
    itemName: 'Nama produk wajib diisi',
    price: 'Harga wajib diisi',
  },
  invalid: {
    phone: 'Nomor telepon tidak valid',
    amount: 'Jumlah harus berupa angka',
    email: 'Email tidak valid',
  },
};

/**
 * Regex patterns untuk validation
 */
export const VALIDATION_PATTERNS = {
  phone: /^(\+62|62|0)[0-9]{9,12}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  numberOnly: /^\d+$/,
};

/**
 * File upload constraints
 */
export const FILE_CONSTRAINTS = {
  maxSize: {
    image: 3, // MB
    document: 5, // MB
  },
  allowedTypes: {
    image: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    document: ['application/pdf', 'image/png', 'image/jpeg'],
  },
};
