'use client';

import { useForm, Controller } from 'react-hook-form';
import {
  useGenerateContentMutation,
  GeneratedContent,
} from '@/hooks/useGenerateContentMutation';
import { usePublishAdMutation } from '@/hooks/usePublishAdMutation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Type,
  FileText,
  User,
  ArrowLeft,
  Sparkles,
  Eye,
  CheckCircle,
  Edit,
} from 'lucide-react';
import { useResidents } from '@/hooks/useResidents';
import { useAuth } from '@/hooks/useAuth';
import { useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { uploadAdImage } from '@/utils/uploadToStorage';
import { validateFile } from '@/utils/fileValidation';
import toast from 'react-hot-toast';
import { CurrencyInputField, FileUploadInput } from '@/components/common';
import { useRouter } from 'next/navigation';

interface AdGeneratorFormInputs {
  residentId: string;
  itemName: string;
  rawDescription: string;
  price: number;
  image?: FileList;
}

export default function BuatIklanPage() {
  const router = useRouter();
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

  const { mutate: generateContent, isPending: isGenerating } =
    useGenerateContentMutation();
  const { mutate: publishAd, isPending: isPublishing } = usePublishAdMutation();

  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

  const selectedResidentId = watch('residentId');
  const selectedResident = useMemo(() => {
    return residents.find((r: { id: string }) => r.id === selectedResidentId);
  }, [selectedResidentId, residents]);

  const handlePreview = async (data: AdGeneratorFormInputs) => {
    if (!selectedResident) {
      toast.error('Pilih warga terlebih dahulu!');
      return;
    }

    let imageUrl = uploadedImageUrl;
    const imageFile = data.image?.[0];

    // Only upload if there's a new file and we haven't uploaded it yet (or if we want to re-upload)
    // For simplicity, if there is a file in data.image, we upload it.
    if (imageFile) {
      const validation = validateFile(imageFile, 2);
      if (!validation.valid) {
        toast.error(validation.error || 'File tidak valid');
        return;
      }

      const uploaded = await uploadAdImage(imageFile);
      if (!uploaded) return;
      imageUrl = uploaded;
      setUploadedImageUrl(imageUrl);
    }

    generateContent(
      {
        itemName: data.itemName,
        rawDescription: data.rawDescription,
        price: Number(data.price),
      },
      {
        onSuccess: (content: GeneratedContent) => {
          setGeneratedContent(content);
        },
      },
    );
  };

  const handlePublish = () => {
    if (!generatedContent || !selectedResident) return;

    const formData = watch();

    publishAd(
      {
        itemName: formData.itemName,
        price: Number(formData.price),
        resident: selectedResident,
        imageUrl: uploadedImageUrl,
        marketingContent: generatedContent,
      },
      {
        onSuccess: () => {
          reset();
          setGeneratedContent(null);
          setUploadedImageUrl('');
          router.push('/dashboard');
        },
      },
    );
  };

  if (generatedContent) {
    return (
      <div className="min-h-screen font-sans text-slate-800">
        <main className="w-full max-w-md mx-auto p-4">
          <div className="flex items-center gap-3 mb-6">
            <Button
              onClick={() => setGeneratedContent(null)}
              variant="ghost"
              size="icon"
              className="text-slate-600 hover:bg-slate-100 -ml-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-slate-900">Preview Iklan</h1>
          </div>

          <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden mb-4 pt-0">
            <div className="bg-green-50 p-4 border-b border-green-100">
              <div className="flex items-center gap-2 mb-1 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <h2 className="font-bold">Konten Siap!</h2>
              </div>
              <p className="text-sm text-green-700">
                Berikut adalah hasil yang dibuat oleh AI. Silakan periksa
                sebelum dipublikasikan.
              </p>
            </div>
            <CardContent className="p-6 space-y-4">
              {uploadedImageUrl && (
                <div className="rounded-lg overflow-hidden mb-4 border border-slate-100">
                  <img
                    src={uploadedImageUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {generatedContent.headline}
                </h3>
                <p className="text-sm text-blue-600 font-medium mb-3">
                  {generatedContent.shortTagline}
                </p>
                <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {generatedContent.adBody}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {generatedContent.suggestedHashtags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setGeneratedContent(null)}
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Data
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPublishing ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Memposting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Posting Iklan
                </>
              )}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-slate-800">
      <main className="w-full max-w-md mx-auto p-4">
        <div className="flex items-center gap-3 mb-6">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="ghost"
            size="icon"
            className="text-slate-600 hover:bg-slate-100 -ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-slate-900">Buat Iklan</h1>
        </div>

        <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden pt-0">
          <div className="bg-blue-50 p-6 border-b border-blue-100">
            <div className="flex items-center gap-2 mb-2 text-blue-900">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-bold">AI Generator</h2>
            </div>
            <p className="text-sm text-blue-700 leading-relaxed">
              Isi detail produk, dan biarkan AI membuatkan konten promosi yang
              menarik untuk Anda.
            </p>
          </div>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit(handlePreview)} className="space-y-5">
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
                  {...register('itemName', {
                    required: 'Nama produk wajib diisi',
                  })}
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
                  rows={4}
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
                    showPreview={true}
                  />
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  type="button"
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isGenerating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Iklan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
