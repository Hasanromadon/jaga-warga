# Utilities & Common Components

Dokumentasi untuk utility functions dan common components yang telah dibuat untuk mengurangi duplikasi kode.

## 📂 Struktur

```
src/
├── utils/
│   ├── index.ts                    # Export semua utilities
│   ├── firestoreHelpers.ts         # Firestore CRUD operations
│   ├── uploadToStorage.ts          # Firebase Storage upload
│   ├── fileValidation.ts           # Validasi file
│   ├── validationConstants.ts      # Konstanta validasi
│   ├── toastMessages.ts            # Toast message helpers
│   ├── formatRupiah.ts             # Format currency
│   ├── formatDate.ts               # Format tanggal
│   └── formatPhone.ts              # Format nomor telepon
│
└── components/
    └── common/
        ├── index.ts                        # Export semua components
        ├── BlockHouseNumberSelector.tsx    # Selector Blok & Nomor
        ├── MonthYearSelector.tsx           # Selector Bulan & Tahun
        ├── FileUploadInput.tsx             # Upload file dengan preview
        ├── PhoneInputField.tsx             # Input nomor telepon
        └── CurrencyInputField.tsx          # Input currency (Rupiah)
```

## 🛠️ Utilities

### 1. Firebase Storage (`uploadToStorage.ts`)

**Upload file ke Firebase Storage:**

```typescript
import {
  uploadToStorage,
  uploadBuktiBayar,
  uploadAdImage,
} from '@/utils/uploadToStorage';

// Generic upload
const url = await uploadToStorage(file, 'path/to/file.jpg');

// Upload bukti bayar
const url = await uploadBuktiBayar(file, billId);

// Upload gambar iklan
const url = await uploadAdImage(file);
```

### 2. Firestore Helpers (`firestoreHelpers.ts`)

**CRUD operations untuk Firestore:**

```typescript
import {
  addDocument,
  updateDocument,
  deleteDocument,
  getDocument,
  queryDocuments,
  queryByField,
} from '@/utils/firestoreHelpers';

// Add document
const docId = await addDocument('residents', {
  name: 'John Doe',
  block: 'A',
  houseNumber: '1',
});

// Update document
await updateDocument('residents', docId, { name: 'Jane Doe' });

// Delete document
await deleteDocument('residents', docId);

// Get single document
const resident = await getDocument('residents', docId);

// Query documents
const residents = await queryByField('residents', 'block', 'A');
```

### 3. File Validation (`fileValidation.ts`)

**Validasi file sebelum upload:**

```typescript
import {
  validateFile,
  validateFileSize,
  validateFileType,
} from '@/utils/fileValidation';

// Validasi lengkap
const validation = validateFile(file, 3); // max 3MB
if (!validation.valid) {
  toast.error(validation.error);
  return;
}

// Validasi size saja
const isValidSize = validateFileSize(file, 3);

// Validasi type saja
const isValidType = validateFileType(file, ['image/png', 'image/jpeg']);
```

### 4. Toast Messages (`toastMessages.ts`)

**Consistent toast notifications:**

```typescript
import { toastMessages, toastPromise } from '@/utils/toastMessages';

// Success messages
toastMessages.residentAdded();
toastMessages.billAdded();
toastMessages.proofUploaded();

// Error messages
toastMessages.billNotFound();
toastMessages.fileSizeError(3);

// Generic
toastMessages.success('Custom success message');
toastMessages.error('Custom error message');

// Promise-based toast
await toastPromise(uploadFile(file), {
  loading: 'Uploading...',
  success: 'Uploaded!',
  error: 'Failed to upload',
});
```

### 5. Validation Constants (`validationConstants.ts`)

**Konstanta untuk form validation:**

```typescript
import {
  VALIDATION_MESSAGES,
  VALIDATION_PATTERNS,
  FILE_CONSTRAINTS,
} from '@/utils/validationConstants';

// Dalam form validation
{
  register('name', { required: VALIDATION_MESSAGES.required.name });
}

// Pattern validation
{
  register('phone', {
    pattern: {
      value: VALIDATION_PATTERNS.phone,
      message: VALIDATION_MESSAGES.invalid.phone,
    },
  });
}

// File constraints
const maxSize = FILE_CONSTRAINTS.maxSize.image; // 3 MB
const allowedTypes = FILE_CONSTRAINTS.allowedTypes.image;
```

## 🎨 Common Components

### 1. BlockHouseNumberSelector

Selector untuk memilih Blok dan Nomor Rumah:

```tsx
import { BlockHouseNumberSelector } from '@/components/common';

<Controller
  name="block"
  control={control}
  render={({ field: blockField }) => (
    <Controller
      name="houseNumber"
      control={control}
      render={({ field: houseField }) => (
        <BlockHouseNumberSelector
          blockValue={blockField.value}
          houseNumberValue={houseField.value}
          onBlockChange={blockField.onChange}
          onHouseNumberChange={houseField.onChange}
          blockError={errors.block?.message}
          houseNumberError={errors.houseNumber?.message}
          maxHouseNumber={50}
        />
      )}
    />
  )}
/>;
```

### 2. MonthYearSelector

Selector untuk memilih Bulan dan Tahun:

```tsx
import { MonthYearSelector } from '@/components/common';

<Controller
  name="month"
  control={control}
  render={({ field: monthField }) => (
    <Controller
      name="year"
      control={control}
      render={({ field: yearField }) => (
        <MonthYearSelector
          monthValue={monthField.value}
          yearValue={yearField.value}
          onMonthChange={monthField.onChange}
          onYearChange={yearField.onChange}
          monthError={errors.month?.message}
          yearError={errors.year?.message}
        />
      )}
    />
  )}
/>;
```

### 3. FileUploadInput

Upload file dengan drag & drop dan preview:

```tsx
import { FileUploadInput } from '@/components/common';

<Controller
  name="image"
  control={control}
  render={({ field }) => (
    <FileUploadInput
      value={field.value?.[0] || null}
      onChange={(file) => {
        if (file) {
          const dt = new DataTransfer();
          dt.items.add(file);
          field.onChange(dt.files);
        } else {
          field.onChange(null);
        }
      }}
      label="Upload Gambar"
      accept="image/png, image/jpeg, image/webp"
      maxSizeMB={2}
      description="PNG, JPG, WEBP"
      showPreview={true}
      error={errors.image?.message}
    />
  )}
/>;
```

### 4. PhoneInputField

Input nomor telepon dengan format Indonesia:

```tsx
import { PhoneInputField } from '@/components/common';

<Controller
  name="phoneNumber"
  control={control}
  render={({ field }) => (
    <PhoneInputField
      value={field.value}
      onChange={field.onChange}
      error={errors.phoneNumber?.message}
      label="Nomor Telepon"
      placeholder="Contoh: 081234567890"
      required={false}
    />
  )}
/>;
```

### 5. CurrencyInputField

Input currency (Rupiah) dengan separator:

```tsx
import { CurrencyInputField } from '@/components/common';

<Controller
  name="price"
  control={control}
  render={({ field }) => (
    <CurrencyInputField
      value={field.value || ''}
      onChange={field.onChange}
      error={errors.price?.message}
      label="Harga"
      placeholder="Contoh: 75000"
    />
  )}
/>;
```

## 📝 Best Practices

### Import Utilities

```typescript
// ✅ Good - Import dari index
import { uploadBuktiBayar, toastMessages, validateFile } from '@/utils';

// ❌ Avoid - Import individual files
import { uploadBuktiBayar } from '@/utils/uploadToStorage';
import { toastMessages } from '@/utils/toastMessages';
```

### Import Components

```typescript
// ✅ Good - Import dari common/index
import {
  BlockHouseNumberSelector,
  CurrencyInputField,
} from '@/components/common';

// ❌ Avoid - Import individual files
import { BlockHouseNumberSelector } from '@/components/common/BlockHouseNumberSelector';
```

### Error Handling

```typescript
// ✅ Good - Menggunakan utility functions
const url = await uploadBuktiBayar(file, billId);
if (!url) {
  return; // Toast sudah ditampilkan oleh utility
}

// ✅ Good - Custom error handling
const url = await uploadToStorage(file, path, false); // showToast = false
if (!url) {
  toastMessages.error('Custom error message');
  return;
}
```

## 🔄 Migration Guide

### Before (Duplikasi):

```typescript
// Di beberapa file berbeda
const storageRef = ref(storage, `bukti-bayar/${billId}/${file.name}`);
await uploadBytes(storageRef, file);
const url = await getDownloadURL(storageRef);
```

### After (Menggunakan utility):

```typescript
const url = await uploadBuktiBayar(file, billId);
```

---

## 📦 Files yang Sudah Direfactor

- ✅ `AdGeneratorModal.tsx` - Menggunakan `uploadAdImage`, `CurrencyInputField`, `FileUploadInput`
- ✅ `src/app/warga/page.tsx` - Menggunakan `uploadBuktiBayar`
- ✅ `src/app/warga/[residential_id]/page.tsx` - Menggunakan `uploadBuktiBayar`
- ✅ `UploadBuktiForm.tsx` - Menggunakan `uploadBuktiBayar`

## 🎯 Next Steps

Files yang bisa direfactor selanjutnya:

- `AddBillForm.tsx` - Bisa menggunakan `BlockHouseNumberSelector`, `MonthYearSelector`, `CurrencyInputField`
- `AddFinanceRecordForm.tsx` - Bisa menggunakan `CurrencyInputField`, `MonthYearSelector`
- `ResidentForm.tsx` - Bisa menggunakan `BlockHouseNumberSelector`, `PhoneInputField`
- `ResidentList.tsx` - Bisa menggunakan `toastMessages`
- `LaporanList.tsx` - Bisa menggunakan `toastMessages`
- Hooks mutations - Bisa menggunakan `addDocument`, `updateDocument`, `deleteDocument`
