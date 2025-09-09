"use client";
import { useForm } from 'react-hook-form';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./ui/select";
import { BLOK_LIST } from "../constants";
// ...existing code...
import { useState } from 'react';

export interface ResidentFormInputs {
  block: string;
  houseNumber: string;
  name: string;
  phoneNumber?: string;
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
  const isEdit = !!(initial && (initial.name || initial.block || initial.houseNumber));
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
            <Label htmlFor="block" className="mb-1 block text-xs font-semibold text-blue-900">Blok Rumah</Label>
            <Select
              value={initial?.block || ''}
              onValueChange={val => {
                // set value using react-hook-form
                const event = { target: { name: 'block', value: val } };
                register('block', { required: true }).onChange(event);
              }}
            >
              <SelectTrigger className="w-full mt-1" id="block">
                <SelectValue placeholder="Pilih Blok" />
              </SelectTrigger>
              <SelectContent>
                {BLOK_LIST.map(blok => (
                  <SelectItem key={blok} value={blok}>{blok}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.block && <span className="text-red-500 text-xs">Blok wajib diisi</span>}
          </div>
          <div className="flex-1 max-w-[9rem]">
            <Label htmlFor="houseNumber" className="mb-1 block text-xs font-semibold text-blue-900">Nomor Rumah</Label>
            <Select
              value={initial?.houseNumber || ''}
              onValueChange={val => {
                const event = { target: { name: 'houseNumber', value: val } };
                register('houseNumber', { required: true }).onChange(event);
              }}
            >
              <SelectTrigger className="w-full mt-1" id="houseNumber">
                <SelectValue placeholder="Pilih Nomor" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 50 }, (_, i) => String(i + 1)).map(no => (
                  <SelectItem key={no} value={no}>{no}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.houseNumber && <span className="text-red-500 text-xs">Nomor rumah wajib diisi</span>}
          </div>
        </div>
        <div>
          <Label htmlFor="name" className="mb-1 block text-xs font-semibold text-blue-900">Nama Warga</Label>
          <Input id="name" placeholder="Nama Warga" {...register('name', { required: true })} className="text-sm w-full" />
          {errors.name && <span className="text-red-500 text-xs">Nama wajib diisi</span>}
        </div>
        <div>
          <Label htmlFor="phoneNumber" className="mb-1 block text-xs font-semibold text-blue-900">Nomor Telepon (opsional)</Label>
          <Input id="phoneNumber" placeholder="08xxxxxxxxxx" {...register('phoneNumber')} className="text-sm w-full" />
        </div>
  {/* User ID field removed as per requirements */}
        <Button type="submit" disabled={loading} className="w-full text-base mt-2">{loading ? 'Loading...' : 'Simpan'}</Button>
      </form>
    </div>
  );
}
