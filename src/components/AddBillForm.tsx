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
import { BULAN_LIST, TAHUN_LIST } from '../constants';
import { useResidents } from '../hooks/useResidents';

export interface AddBillFormInputs {
  residentId: string; // reference to residents
  amount: number;
  month: string;
  year: string;
}

export default function AddBillForm() {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<AddBillFormInputs>();
  const [error, setError] = useState<string | null>(null);
  const { mutate: addBill, isPending: loading } = useAddBillMutation();

  const { data: residents = [], isLoading: loadingResidents } = useResidents();

  const onSubmit = (data: AddBillFormInputs) => {
    setError(null);
    addBill(data, {
      onSuccess: () => {
        toast.success('Tagihan berhasil ditambahkan!');
        reset({
          residentId: '',
          amount: undefined,
          month: '',
          year: '',
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
            <Label htmlFor="residentId">Resident</Label>
            <Controller
              name="residentId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full mt-1" id="residentId">
                    <SelectValue placeholder={loadingResidents ? 'Loading...' : 'Select resident'} />
                  </SelectTrigger>
                  <SelectContent>
                    {residents.map(resident => (
                      <SelectItem key={resident.id} value={resident.id}>
                        {resident.name} ({resident.block}/{resident.houseNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.residentId && <span className="text-red-500 text-xs">Resident is required</span>}
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="month">Month</Label>
              <Controller
                name="month"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full mt-1" id="month">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {BULAN_LIST.map(bulan => (
                        <SelectItem key={bulan.value} value={bulan.value}>{bulan.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.month && <span className="text-red-500 text-xs">Month is required</span>}
            </div>
            <div className="flex-1">
              <Label htmlFor="year">Year</Label>
              <Controller
                name="year"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full mt-1" id="year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {TAHUN_LIST.map(tahun => (
                        <SelectItem key={tahun} value={tahun}>{tahun}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.year && <span className="text-red-500 text-xs">Year is required</span>}
            </div>
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
              <Input
                id="amount"
                type="number"
                min={0}
                step={1000}
                placeholder="Bill amount"
                className="pl-8"
                {...register('amount', { required: true, valueAsNumber: true })}
              />
            </div>
            {errors.amount && <span className="text-red-500 text-xs">Amount is required</span>}
          </div>
          {error && <div className="text-red-500 text-xs">{error}</div>}
          <Button type="submit" disabled={loading} className="w-full mt-2">{loading ? 'Loading...' : 'Tambah'}</Button>
          {/* Success handled by toast */}
        </form>
      </CardContent>
    </Card>
  );
}
