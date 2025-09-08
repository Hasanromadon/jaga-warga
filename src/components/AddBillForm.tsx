"use client";
import { useForm } from 'react-hook-form';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface AddBillFormInputs {
  userId: string;
  bulan: string;
  tahun: string;
  nominal: number;
}

export default function AddBillForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<AddBillFormInputs>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: AddBillFormInputs) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await addDoc(collection(db, 'bills'), {
        ...data,
        status: 'belum bayar',
        buktiBayarURL: '',
      });
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Terjadi error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-sm mx-auto mt-10">
      <CardHeader>
        <CardTitle>Tambah Tagihan</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="User ID" {...register('userId', { required: true })} />
          {errors.userId && <span className="text-red-500 text-xs">User ID wajib diisi</span>}
          <Input placeholder="Bulan (misal: 09)" {...register('bulan', { required: true })} />
          {errors.bulan && <span className="text-red-500 text-xs">Bulan wajib diisi</span>}
          <Input placeholder="Tahun (misal: 2025)" {...register('tahun', { required: true })} />
          {errors.tahun && <span className="text-red-500 text-xs">Tahun wajib diisi</span>}
          <Input type="number" placeholder="Nominal" {...register('nominal', { required: true, valueAsNumber: true })} />
          {errors.nominal && <span className="text-red-500 text-xs">Nominal wajib diisi</span>}
          {error && <div className="text-red-500 text-xs">{error}</div>}
          {success && <div className="text-green-500 text-xs">Tagihan berhasil ditambahkan!</div>}
          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Loading...' : 'Tambah'}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
