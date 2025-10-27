"use client";

import { useAuth } from "@/hooks/useAuth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Coins, FileText, Repeat } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { NumberInputWithSeparator } from "../components/ui/number-input-with-separator";
import { Textarea } from "../components/ui/textarea";
import { db } from "../firebaseConfig";

export interface AddFinanceRecordInputs {
  description: string;
  date: string;
  amount: number | string;
  type: "income" | "expense" | "";
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
      description: "",
      date: "",
      amount: "",
      type: "",
      residential_id: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const navigate = useRouter();

  // Invalidate dashboard queries on successful submit
  const queryClient = useQueryClient();

  const onSubmit = async (data: AddFinanceRecordInputs) => {
    try {
      setLoading(true);
      await addDoc(collection(db, "general_transactions"), {
        description: data.description,
        date: new Date(data.date),
        amount: Number(data.amount),
        type: data.type,
        residential_id: residentialId,
        created_at: serverTimestamp(),
      });

      // invalidate dashboard stats and activities
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });

      toast.success(
        `Transaksi ${
          data.type === "income" ? "pemasukan" : "pengeluaran"
        } berhasil disimpan!`
      );

      navigate.push("/dashboard/keuangan");

      reset();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan transaksi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-sm mx-auto mt-2 shadow-sm border border-gray-200">
      <CardHeader className="relative">
        <div className="flex items-center space-x-3 justify-start mb-3">
          <Button
            onClick={onBack ? onBack : () => navigate.push("/dashboard")}
            variant="ghost"
            className="text-slate-700 hover:text-slate-900"
          >
            <ArrowLeft />
          </Button>
          <h2 className="text-lg font-bold text-slate-800">Catat Keuangan</h2>
        </div>

        <div className="text-xs text-gray-500 mt-1 text-left">
          Catat transaksi keuangan harian, baik pemasukan maupun pengeluaran.
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Tanggal */}
          <div>
            <Label
              htmlFor="date"
              className="text-xs font-semibold text-blue-900 flex items-center gap-1 mb-1"
            >
              <Calendar className="w-4 h-4" />
              Tanggal Transaksi
            </Label>
            <Controller
              name="date"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  type="date"
                  id="date"
                  {...field}
                  value={field.value || ""}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              )}
            />
            {errors.date && (
              <span className="text-red-500 text-xs">Tanggal wajib diisi</span>
            )}
          </div>

          {/* Jumlah */}
          <div>
            <Label
              htmlFor="amount"
              className="text-xs font-semibold text-blue-900 flex items-center gap-1 mb-0"
            >
              <Coins className="w-4 h-4" />
              Jumlah
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                Rp
              </span>
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: true,
                  validate: (v) => !!v && Number(v) > 0,
                }}
                render={({ field }) => (
                  <NumberInputWithSeparator
                    id="amount"
                    value={field.value || ""}
                    onValueChange={(val) =>
                      field.onChange(val ? parseInt(val, 10) : "")
                    }
                    placeholder="Masukkan jumlah transaksi"
                    className="pl-8 !text-xs"
                  />
                )}
              />
            </div>
            {errors.amount && (
              <span className="text-red-500 text-xs">Jumlah wajib diisi</span>
            )}
          </div>

          {/* Jenis Transaksi */}
          <div>
            <Label className="text-xs font-semibold text-blue-900 flex items-center gap-1 mb-1">
              <Repeat className="w-4 h-4" />
              Jenis Transaksi
            </Label>

            <Controller
              name="type"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="flex items-center justify-between gap-3 mt-1">
                  {[
                    { value: "income", label: "Pemasukan", color: "green" },
                    { value: "expense", label: "Pengeluaran", color: "red" },
                  ].map((option) => {
                    const isActive = field.value === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => field.onChange(option.value)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-all text-xs font-medium
                ${
                  isActive
                    ? option.color === "green"
                      ? "bg-emerald-100 border-emerald-400 text-emerald-700 shadow-sm"
                      : "bg-rose-100 border-rose-400 text-rose-700 shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
                      >
                        {option.value === "income" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                        )}
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
            />

            {errors.type && (
              <span className="text-red-500 text-xs block mt-1">
                Jenis wajib dipilih
              </span>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <Label
              htmlFor="description"
              className="text-xs font-semibold text-blue-900 flex items-center gap-1 mb-1"
            >
              <FileText className="w-4 h-4" />
              Deskripsi
            </Label>
            <Controller
              name="description"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Textarea
                  id="description"
                  placeholder="Tuliskan keterangan transaksi..."
                  className="resize-y !text-xs"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.description && (
              <span className="text-red-500 text-xs">
                Deskripsi wajib diisi
              </span>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? "Menyimpan..." : "Simpan Transaksi"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
