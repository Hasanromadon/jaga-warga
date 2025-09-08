"use client";
import { useForm } from 'react-hook-form';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useState } from 'react';

interface ResidentFormInputs {
  blokRumah: string;
  nomorRumah: string;
  nama: string;
  userId: string;
}

export default function ResidentForm({ initial, onSave }: { initial?: Partial<ResidentFormInputs>, onSave: (data: ResidentFormInputs) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<ResidentFormInputs>({ defaultValues: initial });
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: ResidentFormInputs) => {
    setLoading(true);
    onSave(data);
    setLoading(false);
  };

  return (
    <Card className="max-w-sm w-full mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-blue-900">Detail Warga</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input placeholder="Blok Rumah" {...register('blokRumah', { required: true })} className="text-sm" />
          {errors.blokRumah && <span className="text-red-500 text-xs">Blok wajib diisi</span>}
          <Input placeholder="Nomor Rumah" {...register('nomorRumah', { required: true })} className="text-sm" />
          {errors.nomorRumah && <span className="text-red-500 text-xs">Nomor wajib diisi</span>}
          <Input placeholder="Nama Warga" {...register('nama', { required: true })} className="text-sm" />
          {errors.nama && <span className="text-red-500 text-xs">Nama wajib diisi</span>}
          <Input placeholder="User ID" {...register('userId', { required: true })} className="text-sm" />
          {errors.userId && <span className="text-red-500 text-xs">User ID wajib diisi</span>}
          <Button type="submit" disabled={loading} className="w-full text-base">{loading ? 'Loading...' : 'Simpan'}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
