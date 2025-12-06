'use client';
import { useForm, Controller } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from './ui/select';
import { Home, User, Phone } from 'lucide-react';
import { BLOK_LIST } from '../constants';
import { useState } from 'react';

export interface ResidentFormInputs {
  block: string;
  houseNumber: string;
  name: string;
  phoneNumber?: string;
  residential_id?: string;
}

interface ResidentFormProps {
  initial?: Partial<ResidentFormInputs>;
  onSave: (data: ResidentFormInputs) => void;
  title?: string;
  subtitle?: string;
}

import { useAuth } from '../hooks/useAuth';

export default function ResidentForm({
  initial,
  onSave,
  title,
  subtitle,
}: ResidentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ResidentFormInputs>({ defaultValues: initial });
  const [loading, setLoading] = useState(false);
  const { residentialId } = useAuth();

  // Determine context-aware title/subtitle if not provided
  const isEdit = !!(
    initial &&
    (initial.name || initial.block || initial.houseNumber)
  );
  const displayTitle = title ?? (isEdit ? 'Edit Warga' : 'Tambah Warga');
  const displaySubtitle =
    subtitle ??
    (isEdit
      ? 'Perbarui informasi warga di bawah ini.'
      : 'Isi data warga dengan lengkap dan benar.');

  const onSubmit = (data: ResidentFormInputs) => {
    setLoading(true);
    onSave({ ...data, residential_id: residentialId ?? undefined });
    setLoading(false);
  };

  return (
    <div className="w-full mx-auto px-2 max-w-sm">
      <div className="mb-4 text-center">
        <h2 className="text-lg font-semibold">{displayTitle}</h2>
        <p className="text-sm text-muted-foreground mt-1">{displaySubtitle}</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label className="text-xs flex items-center gap-1 mb-0 font-semibold text-blue-900">
            <Home className="w-4 h-4" />
            Blok & Nomor Rumah
          </Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <Controller
                name="block"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    value={field.value || ''}
                    onValueChange={field.onChange}
                    defaultValue={field.value || ''}
                  >
                    <SelectTrigger className="w-full" id="block">
                      <SelectValue placeholder="Pilih Blok" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOK_LIST.map((blok) => (
                        <SelectItem key={blok} value={blok}>
                          {blok}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.block && (
                <span className="text-red-500 text-xs">Blok wajib diisi</span>
              )}
            </div>
            <div className="flex-1">
              <Controller
                name="houseNumber"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    value={field.value || ''}
                    onValueChange={field.onChange}
                    defaultValue={field.value || ''}
                  >
                    <SelectTrigger className="w-full" id="houseNumber">
                      <SelectValue placeholder="Pilih Nomor" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 50 }, (_, i) => String(i + 1)).map(
                        (no) => (
                          <SelectItem key={no} value={no}>
                            {no}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.houseNumber && (
                <span className="text-red-500 text-xs">
                  Nomor rumah wajib diisi
                </span>
              )}
            </div>
          </div>
        </div>
        <div>
          <Label
            htmlFor="name"
            className="mb-1 text-xs font-semibold text-blue-900 flex items-center gap-1"
          >
            <User className="w-4 h-4" />
            Nama Warga
          </Label>
          <Input
            id="name"
            maxLength={20}
            placeholder="Nama Warga"
            {...register('name', { required: true })}
            className="text-sm w-full"
          />
          {errors.name && (
            <span className="text-red-500 text-xs">Nama wajib diisi</span>
          )}
        </div>
        <div>
          <Label
            htmlFor="phoneNumber"
            className="mb-1 text-xs font-semibold text-blue-900 flex items-center gap-1"
          >
            <Phone className="w-4 h-4" />
            Nomor Telepon{' '}
            <span className="text-xs text-blue-500">(opsional)</span>
          </Label>
          <Input
            id="phoneNumber"
            placeholder="08xxxxxxxxxx"
            {...register('phoneNumber')}
            className="text-sm w-full"
          />
        </div>
        {/* User ID field removed as per requirements */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full text-base mt-2"
        >
          {loading ? 'Loading...' : 'Simpan'}
        </Button>
      </form>
    </div>
  );
}
