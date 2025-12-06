'use client';

import { useAuth } from '@/hooks/useAuth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Coins,
  FileText,
  Loader2,
  Save,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { NumberInputWithSeparator } from '../components/ui/number-input-with-separator';
import { Textarea } from '../components/ui/textarea';
import { db } from '../firebaseConfig';

export interface AddFinanceRecordInputs {
  description: string;
  date: string;
  amount: number | string;
  type: 'income' | 'expense' | '';
  residential_id: string;
}

export default function AddFinanceRecordForm({
  onBack,
}: {
  onBack?: () => void;
}) {
  const { residentialId } = useAuth();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddFinanceRecordInputs>({
    defaultValues: {
      description: '',
      date: '',
      amount: '',
      type: '',
      residential_id: '',
    },
  });

  const [loading, setLoading] = useState(false);

  const navigate = useRouter();

  // Invalidate dashboard queries on successful submit
  const queryClient = useQueryClient();

  const onSubmit = async (data: AddFinanceRecordInputs) => {
    try {
      setLoading(true);
      await addDoc(collection(db, 'general_transactions'), {
        description: data.description,
        date: new Date(data.date),
        amount: Number(data.amount),
        type: data.type,
        residential_id: residentialId,
        created_at: serverTimestamp(),
      });

      // invalidate dashboard stats and activities
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });

      toast.success(
        `Transaksi ${
          data.type === 'income' ? 'pemasukan' : 'pengeluaran'
        } berhasil disimpan!`,
      );

      navigate.push('/dashboard/keuangan');

      reset();
    } catch (error) {
      console.error(error);
      toast.error('Gagal menyimpan transaksi!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 px-1">
        <Button
          onClick={onBack ? onBack : () => navigate.push('/dashboard/keuangan')}
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-slate-100 -ml-2"
        >
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Catat Transaksi</h1>
          <p className="text-xs text-slate-500">
            Kelola pemasukan & pengeluaran
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Transaction Type Selector */}
        <Controller
          name="type"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => field.onChange('income')}
                className={`relative overflow-hidden p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                  field.value === 'income'
                    ? 'bg-emerald-50 border-emerald-500 shadow-md shadow-emerald-500/10'
                    : 'bg-white border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50'
                }`}
              >
                <div
                  className={`p-3 rounded-full ${field.value === 'income' ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600'}`}
                >
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span
                  className={`font-semibold text-sm ${field.value === 'income' ? 'text-emerald-700' : 'text-slate-600'}`}
                >
                  Pemasukan
                </span>
                {field.value === 'income' && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                )}
              </button>

              <button
                type="button"
                onClick={() => field.onChange('expense')}
                className={`relative overflow-hidden p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                  field.value === 'expense'
                    ? 'bg-rose-50 border-rose-500 shadow-md shadow-rose-500/10'
                    : 'bg-white border-slate-100 hover:border-rose-200 hover:bg-rose-50/50'
                }`}
              >
                <div
                  className={`p-3 rounded-full ${field.value === 'expense' ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-600'}`}
                >
                  <TrendingDown className="w-6 h-6" />
                </div>
                <span
                  className={`font-semibold text-sm ${field.value === 'expense' ? 'text-rose-700' : 'text-slate-600'}`}
                >
                  Pengeluaran
                </span>
                {field.value === 'expense' && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                )}
              </button>
            </div>
          )}
        />
        {errors.type && (
          <p className="text-red-500 text-xs text-center -mt-4">
            Pilih jenis transaksi terlebih dahulu
          </p>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-5">
          {/* Date Input */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500">
              Tanggal
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Controller
                name="date"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <input
                    type="date"
                    {...field}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                )}
              />
            </div>
            {errors.date && (
              <span className="text-red-500 text-xs">Tanggal wajib diisi</span>
            )}
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500">
              Nominal (Rp)
            </Label>
            <div className="relative">
              <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Controller
                name="amount"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field }) => (
                  <NumberInputWithSeparator
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                    placeholder="0"
                  />
                )}
              />
            </div>
            {errors.amount && (
              <span className="text-red-500 text-xs">Nominal wajib diisi</span>
            )}
          </div>

          {/* Description Input */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500">
              Keterangan
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Controller
                name="description"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[100px] resize-none"
                    placeholder="Contoh: Iuran bulanan, Pembelian alat kebersihan..."
                  />
                )}
              />
            </div>
            {errors.description && (
              <span className="text-red-500 text-xs">
                Keterangan wajib diisi
              </span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-base font-semibold"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
        </Button>
      </form>
    </div>
  );
}
