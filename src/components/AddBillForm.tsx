"use client";
import { useForm, Controller } from 'react-hook-form';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { useState } from 'react';
import { useAddBillMutation } from '../hooks/useAddBillMutation';
import toast from 'react-hot-toast';
import { BLOK_LIST, BULAN_LIST, TAHUN_LIST } from '../constants';

export interface AddBillFormInputs {
  blokRumah: string;
  nomorRumah: string;
  bulan: string;
  tahun: string;
  nominal: number;
}

export default function AddBillForm() {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<AddBillFormInputs>();
  const [error, setError] = useState<string | null>(null);
  const { mutate: addBill, isPending: loading } = useAddBillMutation();

  // Dummy nomor rumah, bisa diganti dengan fetch dari backend
  const nomorList = Array.from({ length: 30 }, (_, i) => String(i + 1));

  const onSubmit = (data: AddBillFormInputs) => {
    setError(null);
    addBill(data, {
      onSuccess: () => {
        toast.success('Tagihan berhasil ditambahkan!');
        reset({
          blokRumah: '',
          nomorRumah: '',
          bulan: '',
          tahun: '',
          nominal: undefined,
        });
      },
      onError: (err: unknown) => {
        const message = err && typeof err === 'object' && 'message' in err ? (err as { message?: string }).message : 'Terjadi error';
        setError(message || 'Terjadi error');
        toast.error(message || 'Terjadi error');
      },
    });
  };

  return (
    <Card className="max-w-sm mx-auto mt-6 shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-blue-900 text-lg font-bold">Tambah Tagihan</CardTitle>
        <div className="text-xs text-gray-500 mt-1">Isi data tagihan IPL untuk warga sesuai periode yang berlaku.</div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="blokRumah">Blok Rumah</Label>
            <Controller
              name="blokRumah"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full mt-1" id="blokRumah">
                    <SelectValue placeholder="Pilih blok" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOK_LIST.map(blok => (
                      <SelectItem key={blok} value={blok}>{blok}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.blokRumah && <span className="text-red-500 text-xs">Blok wajib diisi</span>}
          </div>
          <div>
            <Label htmlFor="nomorRumah">Nomor Rumah</Label>
            <Controller
              name="nomorRumah"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full mt-1" id="nomorRumah">
                    <SelectValue placeholder="Pilih nomor rumah" />
                  </SelectTrigger>
                  <SelectContent>
                    {nomorList.map(no => (
                      <SelectItem key={no} value={no}>{no}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.nomorRumah && <span className="text-red-500 text-xs">Nomor rumah wajib diisi</span>}
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="bulan">Bulan</Label>
              <Controller
                name="bulan"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full mt-1" id="bulan">
                      <SelectValue placeholder="Pilih bulan" />
                    </SelectTrigger>
                    <SelectContent>
                      {BULAN_LIST.map(bulan => (
                        <SelectItem key={bulan.value} value={bulan.value}>{bulan.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.bulan && <span className="text-red-500 text-xs">Bulan wajib diisi</span>}
            </div>
            <div className="flex-1">
              <Label htmlFor="tahun">Tahun</Label>
              <Controller
                name="tahun"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full mt-1" id="tahun">
                      <SelectValue placeholder="Pilih tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      {TAHUN_LIST.map(tahun => (
                        <SelectItem key={tahun} value={tahun}>{tahun}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tahun && <span className="text-red-500 text-xs">Tahun wajib diisi</span>}
            </div>
          </div>
          <div>
            <Label htmlFor="nominal">Nominal</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
              <Input
                id="nominal"
                type="number"
                min={0}
                step={1000}
                placeholder="Nominal tagihan"
                className="pl-8"
                {...register('nominal', { required: true, valueAsNumber: true })}
              />
            </div>
            {errors.nominal && <span className="text-red-500 text-xs">Nominal wajib diisi</span>}
          </div>
          {error && <div className="text-red-500 text-xs">{error}</div>}
          <Button type="submit" disabled={loading} className="w-full mt-2">{loading ? 'Loading...' : 'Tambah'}</Button>
          {/* Success handled by toast */}
        </form>
      </CardContent>
    </Card>
  );
}
