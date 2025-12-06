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
import {
  Type,
  FileText,
  CircleDollarSign,
  User,
  Home,
  Image as ImageIcon,
  UploadCloud,
} from 'lucide-react';
import { NumberInputWithSeparator } from './ui/number-input-with-separator';
import { useResidents } from '@/hooks/useResidents';
import { useAuth } from '@/hooks/useAuth';
import { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Input } from './ui/input';
import { storage } from '@/firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';

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
    setValue,
    reset,
    formState: { errors },
  } = useForm<AdGeneratorFormInputs>();

  const { residentialId } = useAuth();
  const { data: residents = [] } = useResidents(residentialId ?? undefined);

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const { mutate: generateAd, isPending } = useGenerateAdMutation();

  const selectedResidentId = watch('residentId');
  const selectedResident = useMemo(() => {
    return residents.find((r) => r.id === selectedResidentId);
  }, [selectedResidentId, residents]);

  const handleGenerateAd = async (data: AdGeneratorFormInputs) => {
    if (!selectedResident) {
      toast.error('Pilih warga terlebih dahulu!');
      return;
    }

    let imageUrl = '';
    const imageFile = data.image?.[0];

    if (imageFile) {
      const toastId = toast.loading('Mengunggah gambar...');
      try {
        const storageRef = ref(
          storage,
          `ads/${Date.now()}_${imageFile.name}`,
        );
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        imageUrl = await new Promise<string>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error('Upload error:', error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            },
          );
        });

        toast.success('Gambar berhasil diunggah!', { id: toastId });
      } catch (error) {
        console.error(error);
        toast.error('Gagal mengunggah gambar.', { id: toastId });
        setUploadProgress(null);
        return;
      }
      setUploadProgress(null);
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
                    {residents.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name} (Blok {r.block}/{r.houseNumber})
                      </SelectItem>
                    ))}
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
          <div>
            <Label
              htmlFor="price"
              className="mb-1 text-xs font-semibold text-blue-900 flex items-center gap-1"
            >
              <CircleDollarSign className="w-4 h-4" />
              Harga
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                Rp
              </span>
              <Controller
                name="price"
                control={control}
                rules={{ required: 'Harga wajib diisi' }}
                render={({ field }) => (
                  <NumberInputWithSeparator
                    id="price"
                    value={field.value}
                    onValueChange={(val) => field.onChange(parseInt(val, 10))}
                    placeholder="Contoh: 75000"
                    className="pl-9"
                  />
                )}
              />
            </div>
            {errors.price && (
              <span className="text-red-500 text-xs">
                {errors.price.message}
              </span>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <Label className="mb-1 text-xs font-semibold text-blue-900 flex items-center gap-1">
              <ImageIcon className="w-4 h-4" />
              Gambar Produk (Opsional)
            </Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="image-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>Unggah file</span>
                    <input
                      id="image-upload"
                      type="file"
                      className="sr-only"
                      {...register('image')}
                      accept="image/png, image/jpeg, image/webp"
                    />
                  </label>
                  <p className="pl-1">atau tarik dan lepas</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP hingga 2MB</p>
              </div>
            </div>
            {uploadProgress !== null && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-right text-gray-500">{Math.round(uploadProgress)}%</p>
              </div>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={onClose} type="button">
              Batal
            </Button>
            <Button type="submit" disabled={isPending || uploadProgress !== null}>
              {isPending ? 'Membuat Iklan...' : 'Buat Iklan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdGeneratorModal;
