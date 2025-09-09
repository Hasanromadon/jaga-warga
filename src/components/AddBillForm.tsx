"use client";
import { useForm, Controller } from 'react-hook-form';
import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
import { NumberInputWithSeparator } from "../components/ui/number-input-with-separator";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Home, Calendar, Coins, FileText } from "lucide-react";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useState } from 'react';
import { useAddBillMutation } from '../hooks/useAddBillMutation';
import toast from 'react-hot-toast';
import { BULAN_LIST, TAHUN_LIST, BLOK_LIST, HOUSE_NUMBER_LIST } from '../constants';


export interface AddBillFormInputs {
  block: string;
  houseNumber: string;
  amount: number;
  month: string;
  year: string;
  remark?: string;
  residentId?: string; // for backend compatibility, not a form field
}

export default function AddBillForm() {
  const { handleSubmit, control, reset, formState: { errors }, setValue, watch } = useForm<AddBillFormInputs>();
  const [error, setError] = useState<string | null>(null);
  const { mutate: addBill, isPending: loading } = useAddBillMutation();

  // const { data: residents = [] } = useResidents();
  // Use shared constants
  const HOUSE_NUMBERS = HOUSE_NUMBER_LIST;

  const onSubmit = (data: AddBillFormInputs) => {
    setError(null);
    // Find residentId based on block and houseNumber
    // const resident = residents.find(r => r.block === data.block && r.houseNumber === data.houseNumber);
    // if (!resident) {
    //   setError('Warga dengan blok dan nomor tersebut tidak ditemukan');
    //   return;
    // }
    addBill({
      ...data,
      // residentId: resident.id,
    }, {
      onSuccess: () => {
        toast.success('Tagihan berhasil ditambahkan!');
        reset({
          block: '',
          houseNumber: '',
          amount: undefined,
          month: '',
          year: '',
          remark: '',
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
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-blue-900 flex items-center gap-1 mb-0"><Home className="w-4 h-4" />Blok & Nomor Rumah</Label>
            <div className="flex gap-3">
              <div className="flex-1">
                <Select
                  value={watch('block') || ''}
                  onValueChange={val => {
                    setValue('block', val);
                    setValue('houseNumber', '');
                  }}
                >
                  <SelectTrigger className="w-full" id="block">
                    <SelectValue placeholder="Pilih Blok" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOK_LIST.map(blok => (
                      <SelectItem key={blok} value={blok}>{blok}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.block && <span className="text-red-500 text-xs">Blok wajib dipilih</span>}
              </div>
              <div className="flex-1">
                <Select
                  value={watch('houseNumber') || ''}
                  onValueChange={val => setValue('houseNumber', val)}
                  disabled={!watch('block')}
                >
                  <SelectTrigger className="w-full" id="houseNumber">
                    <SelectValue placeholder="Pilih Nomor" />
                  </SelectTrigger>
                  <SelectContent>
                    {HOUSE_NUMBERS.map(no => (
                      <SelectItem key={no} value={no}>{no}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.houseNumber && <span className="text-red-500 text-xs">Nomor rumah wajib dipilih</span>}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-blue-900 flex items-center gap-1 mb-0"><Calendar className="w-4 h-4" />Periode Tagihan</Label>
            <div className="flex gap-3">
              <div className="flex-1">
                <Controller
                  name="month"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full" id="month">
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
                {errors.month && <span className="text-red-500 text-xs">Bulan wajib dipilih</span>}
              </div>
              <div className="flex-1">
                <Controller
                  name="year"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full" id="year">
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
                {errors.year && <span className="text-red-500 text-xs">Tahun wajib dipilih</span>}
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="amount" className="text-xs font-semibold text-blue-900 flex items-center gap-1 mb-0"><Coins className="w-4 h-4" />Jumlah Tagihan</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
              <Controller
                name="amount"
                control={control}
                rules={{ required: true, validate: v => !!v && Number(v) > 0 }}
                render={({ field }) => (
                  <NumberInputWithSeparator
                    id="amount"
                    value={field.value || ""}
                    onValueChange={val => field.onChange(val ? parseInt(val, 10) : "")}
                    placeholder="Masukkan jumlah tagihan"
                    className="pl-8"
                  />
                )}
              />
            </div>
            {errors.amount && <span className="text-red-500 text-xs">Jumlah tagihan wajib diisi</span>}
          </div>
          <div>
            <Label htmlFor="remark" className="text-xs font-semibold text-blue-900 flex items-center gap-1 mb-1"><FileText className="w-4 h-4" />Catatan <span className="text-xs text-blue-500">(Opsional)</span></Label>
            <Controller
              name="remark"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="remark"
                  placeholder="Tulis catatan tambahan jika ada..."
                  className="resize-y"
                  {...field}
                />
              )}
            />
          </div>
          {error && <div className="text-red-500 text-xs">{error}</div>}
          <Button type="submit" disabled={loading} className="w-full mt-2">{loading ? 'Memproses...' : 'Tambah'}</Button>
          {/* Success handled by toast */}
        </form>
      </CardContent>
    </Card>
  );
}
