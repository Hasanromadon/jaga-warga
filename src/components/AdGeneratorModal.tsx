'use client';
import { useForm, Controller } from 'react-hook-form';
import { useGenerateAdMutation } from '@/hooks/useGenerateAdMutation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Type, FileText, User } from 'lucide-react';
import { useResidents } from '@/hooks/useResidents';
import { useAuth } from '@/hooks/useAuth';
import { useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Input } from './ui/input';
import { uploadAdImage } from '@/utils/uploadToStorage';
import { validateFile } from '@/utils/fileValidation';
import toast from 'react-hot-toast';
import { CurrencyInputField, FileUploadInput } from './common';

// ... (imports)

interface AdGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AdGeneratorFormInputs {
  residentId: string;
  itemName: string;
  rawDescription: string;
  price: number;
  image?: FileList;
}

const AdGeneratorModal: React.FC<AdGeneratorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<AdGeneratorFormInputs>();

  const { residentialId } = useAuth();
  const { data: residents = [] } = useResidents(residentialId ?? undefined);

  const { mutate: generateAd, isPending } = useGenerateAdMutation();

  const selectedResidentId = watch('residentId');
  const selectedResident = useMemo(() => {
    return residents.find((r: { id: string }) => r.id === selectedResidentId);
  }, [selectedResidentId, residents]);

  const handleGenerateAd = async (data: AdGeneratorFormInputs) => {
    if (!selectedResident) {
      toast.error('Pilih warga terlebih dahulu!');
      return;
    }

    let imageUrl = '';
    const imageFile = data.image?.[0];

    if (imageFile) {
      // Validasi file sebelum upload
      const validation = validateFile(imageFile, 2);
      if (!validation.valid) {
        toast.error(validation.error || 'File tidak valid');
        return;
      }

      // Upload menggunakan utility function
      const uploadedUrl = await uploadAdImage(imageFile);
      if (!uploadedUrl) {
        return; // Toast sudah ditampilkan di utility function
      }
      imageUrl = uploadedUrl;
    }

    generateAd(
      {
        ...data,
        price: Number(data.price),
        resident: selectedResident,
        imageUrl,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset();
        }
        onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Buat Iklan Otomatis</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Pilih warga, isi detail produk, dan biarkan AI membuat iklan yang
            menarik.
          </p>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleGenerateAd)}
          className="space-y-4 pt-2"
        >
          {/* Resident Selector */}
          <div>
            <Label className="mb-1 text-xs font-semibold text-blue-900 flex items-center gap-1">
              <User className="w-4 h-4" />
              Pilih Warga
            </Label>
            <Controller
              name="residentId"
              control={control}
              rules={{ required: 'Warga wajib dipilih' }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cari nama atau blok..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {residents.map(
                      (r: {
                        id: string;
                        name: string;
                        block: string;
                        houseNumber: string;
                      }) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name} (Blok {r.block}/{r.houseNumber})
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.residentId && (
              <span className="text-red-500 text-xs">
                {errors.residentId.message}
              </span>
            )}
          </div>

          {/* Item Details */}
          <div>
            <Label
              htmlFor="itemName"
              className="mb-1 text-xs font-semibold text-blue-900 flex items-center gap-1"
            >
              <Type className="w-4 h-4" />
              Nama Produk
            </Label>
            <Input
              id="itemName"
              placeholder="Contoh: Kue Lebaran Premium"
              {...register('itemName', { required: 'Nama produk wajib diisi' })}
            />
            {errors.itemName && (
              <span className="text-red-500 text-xs">
                {errors.itemName.message}
              </span>
            )}
          </div>

          <div>
            <Label
              htmlFor="rawDescription"
              className="mb-1 text-xs font-semibold text-blue-900 flex items-center gap-1"
            >
              <FileText className="w-4 h-4" />
              Deskripsi Singkat
            </Label>
            <Textarea
              id="rawDescription"
              placeholder="Contoh: Dibuat dari bahan-bahan pilihan, tanpa pengawet."
              {...register('rawDescription', {
                required: 'Deskripsi wajib diisi',
              })}
              rows={3}
            />
            {errors.rawDescription && (
              <span className="text-red-500 text-xs">
                {errors.rawDescription.message}
              </span>
            )}
          </div>

          {/* Price */}
          <Controller
            name="price"
            control={control}
            rules={{ required: 'Harga wajib diisi' }}
            render={({ field }) => (
              <CurrencyInputField
                value={field.value || ''}
                onChange={field.onChange}
                error={errors.price?.message}
                label="Harga"
                placeholder="Contoh: 75000"
              />
            )}
          />

          {/* Image Upload */}
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <FileUploadInput
                value={field.value?.[0] || null}
                onChange={(file) => {
                  // Convert to FileList-like object for react-hook-form
                  if (file) {
                    const dt = new DataTransfer();
                    dt.items.add(file);
                    field.onChange(dt.files);
                  } else {
                    field.onChange(null);
                  }
                }}
                label="Gambar Produk (Opsional)"
                accept="image/png, image/jpeg, image/webp"
                maxSizeMB={2}
                description="PNG, JPG, WEBP"
              />
            )}
          />

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={onClose} type="button">
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Membuat Iklan...' : 'Buat Iklan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdGeneratorModal;
