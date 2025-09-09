"use client";
import { useForm } from 'react-hook-form';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
// ...existing code...
import { useState } from 'react';

export interface ResidentFormInputs {
  block: string;
  houseNumber: string;
  name: string;
  userId: string;
}

interface ResidentFormProps {
  initial?: Partial<ResidentFormInputs>;
  onSave: (data: ResidentFormInputs) => void;
  title?: string;
  subtitle?: string;
}

export default function ResidentForm({ initial, onSave, title, subtitle }: ResidentFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ResidentFormInputs>({ defaultValues: initial });
  const [loading, setLoading] = useState(false);

  // Determine context-aware title/subtitle if not provided
  const isEdit = !!(initial && (initial.name || initial.userId || initial.block || initial.houseNumber));
  const displayTitle = title ?? (isEdit ? "Edit Warga" : "Tambah Warga");
  const displaySubtitle = subtitle ?? (
    isEdit
      ? "Perbarui informasi warga di bawah ini."
      : "Isi data warga dengan lengkap dan benar."
  );

  const onSubmit = (data: ResidentFormInputs) => {
    setLoading(true);
    onSave(data);
    setLoading(false);
  };

  return (
  <div className="w-full mx-auto px-2 max-w-sm">
      <div className="mb-4 text-center">
        <h2 className="text-lg font-semibold">{displayTitle}</h2>
        <p className="text-sm text-muted-foreground mt-1">{displaySubtitle}</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 max-w-[7rem]">
            <Input placeholder="Block" {...register('block', { required: true })} className="text-sm" autoFocus />
            {errors.block && <span className="text-red-500 text-xs">Block is required</span>}
          </div>
          <div className="flex-1 max-w-[9rem]">
            <Input placeholder="House Number" {...register('houseNumber', { required: true })} className="text-sm" />
            {errors.houseNumber && <span className="text-red-500 text-xs">House number is required</span>}
          </div>
        </div>
        <div>
          <Input placeholder="Resident Name" {...register('name', { required: true })} className="text-sm w-full" />
          {errors.name && <span className="text-red-500 text-xs">Name is required</span>}
        </div>
        <div>
          <Input placeholder="User ID" {...register('userId', { required: true })} className="text-sm w-full" />
          {errors.userId && <span className="text-red-500 text-xs">User ID wajib diisi</span>}
        </div>
        <Button type="submit" disabled={loading} className="w-full text-base mt-2">{loading ? 'Loading...' : 'Simpan'}</Button>
      </form>
    </div>
  );
}
