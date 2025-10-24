"use client";
import { useAddBulkBillsMutation } from "@/hooks/useAddBulkBillsMutation";
import { useResidents } from "@/hooks/useResidents";
import {
  ArrowLeft,
  Calendar,
  Coins,
  FileText,
  Home,
  PhoneCall,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { NumberInputWithSeparator } from "../components/ui/number-input-with-separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import {
  BLOK_LIST,
  BULAN_LIST,
  HOUSE_NUMBER_LIST,
  TAHUN_LIST,
} from "../constants";
import { useAddBillMutation } from "../hooks/useAddBillMutation";
import { useAuth } from "../hooks/useAuth";
import { UserNotFoundIllustration } from "./svg/UserNotFoundIllustration";

export interface AddBillFormInputs {
  block: string;
  houseNumber: string;
  amount: number;
  month: string;
  year: string;
  remark?: string;
  residentId?: string;
  residential_id?: string;
  forAllResidents?: boolean;
}

export default function AddBillForm({ onBack }: { onBack?: () => void }) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AddBillFormInputs>();

  const [error, setError] = useState<string | null>(null);
  const [isAllResidents, setIsAllResidents] = useState(false);

  const { mutate: addBill, isPending: loadingSingle } = useAddBillMutation();
  const addBulkBills = useAddBulkBillsMutation();
  const { residentialId } = useAuth();
  const { data: residents = [], isLoading: loadingResidents } = useResidents(
    residentialId ?? undefined
  );
  const selectedBlock = watch("block");
  const selectedNumber = watch("houseNumber");
  const HOUSE_NUMBERS = HOUSE_NUMBER_LIST;
  const navigate = useRouter();
  const onSubmit = (data: AddBillFormInputs) => {
    setError(null);

    // ✅ Jika buat untuk semua warga
    if (isAllResidents) {
      if (loadingResidents) {
        toast.error("Sedang memuat data warga...");
        return;
      }

      if (residents.length === 0) {
        toast.error("Belum ada data warga untuk dibuatkan tagihan");
        return;
      }

      // Overwrite all resident's residential_id with current user's residentialId
      const residentsWithAuthResidence = Array.isArray(residents)
        ? residents.map((r) => ({
            ...r,
            residential_id: residentialId ?? undefined,
          }))
        : residents;

      addBulkBills.mutate(
        {
          residents: residentsWithAuthResidence,
          data: {
            month: data.month,
            year: data.year,
            amount: data.amount,
            remark: data.remark || "",
            residential_id: residentialId ?? undefined,
          },
        },
        {
          onSuccess: () => {
            toast.success("Tagihan berhasil dibuat untuk seluruh warga!");
            reset({
              block: "",
              houseNumber: "",
              amount: undefined,
              month: "",
              year: "",
              remark: "",
            });
            setIsAllResidents(false);
          },
          onError: () => {
            toast.error("Gagal membuat tagihan untuk semua warga");
          },
        }
      );
      return;
    }

    // ✅ Jika untuk 1 warga
    // cari resident berdasarkan blok & nomor rumah
    const resident = residents.find(
      (r) => r.block === data.block && r.houseNumber === data.houseNumber
    );

    if (!resident) {
      setError("Warga dengan blok dan nomor rumah tersebut tidak ditemukan.");
      toast.error("Warga tidak ditemukan.");
      return;
    }

    // ✅ kirim data beserta residential_id admin ke mutation single
    addBill(
      {
        ...data,
        residential_id: residentialId ?? undefined,
      },
      {
        onSuccess: () => {
          toast.success("Tagihan berhasil ditambahkan!");
          reset({
            block: "",
            houseNumber: "",
            amount: undefined,
            month: "",
            year: "",
            remark: "",
          });
        },
        onError: (err: unknown) => {
          const message =
            err && typeof err === "object" && "message" in err
              ? (err as { message?: string }).message
              : "Terjadi error";
          setError(message || "Terjadi error");
          toast.error(message || "Terjadi error");
        },
      }
    );
  };
  const selectedResident = useMemo(() => {
    if (!selectedBlock || !selectedNumber) return null;
    return residents.find(
      (r) => r.block === selectedBlock && r.houseNumber === selectedNumber
    );
  }, [selectedBlock, selectedNumber, residents]);

  useEffect(() => {
    if (selectedResident) {
      setValue("residentId", selectedResident.id);
    }
  }, [selectedResident, setValue]);

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
          <h2 className="text-lg font-bold text-slate-800">Tambah Tagihan</h2>
        </div>

        <div className="text-xs text-gray-500 mt-1 text-left">
          Isi data tagihan IPL untuk warga sesuai periode yang berlaku.
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Checkbox Buat Semua Warga */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="allResidents"
              checked={isAllResidents}
              onChange={(e) => setIsAllResidents(e.target.checked)}
              className="accent-blue-600 w-4 h-4"
            />
            <Label
              htmlFor="allResidents"
              className="text-xs font-medium text-blue-900"
            >
              Buat Tagihan untuk seluruh Warga
            </Label>
          </div>

          {/* Blok & Nomor Rumah */}
          {!isAllResidents && (
            <div className="flex flex-col gap-2">
              <Label
                className={`text-xs font-semibold ${
                  isAllResidents ? "text-gray-300" : "text-blue-900"
                } flex items-center gap-1 mb-0`}
              >
                <Home className="w-4 h-4" />
                Blok & Nomor Rumah
              </Label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Select
                    value={watch("block") || ""}
                    onValueChange={(val) => {
                      setValue("block", val);
                      setValue("houseNumber", "");
                    }}
                    disabled={isAllResidents}
                  >
                    <SelectTrigger className="w-full text-xs" id="block">
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
                  {errors.block && (
                    <span className="text-red-500 text-xs">
                      Blok wajib dipilih
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <Select
                    value={watch("houseNumber") || ""}
                    onValueChange={(val) => setValue("houseNumber", val)}
                    disabled={!watch("block") || isAllResidents}
                  >
                    <SelectTrigger className="w-full text-xs" id="houseNumber">
                      <SelectValue placeholder="Pilih Nomor" />
                    </SelectTrigger>
                    <SelectContent>
                      {HOUSE_NUMBERS.map((no) => (
                        <SelectItem key={no} value={no}>
                          {no}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.houseNumber && (
                    <span className="text-red-500 text-xs">
                      Nomor rumah wajib dipilih
                    </span>
                  )}
                </div>
              </div>
              <div className="flex w-full gap-3">
                {/* Detail Warga */}
                {watch("block") &&
                  watch("houseNumber") &&
                  (selectedResident ? (
                    <div className="w-full border text-xs border-blue-100 bg-blue-50/60 rounded-lg p-3 text-blue-900 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-blue-800 text-xs">
                          Detail Warga
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="truncate">
                            {selectedResident.name || "-"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-blue-600" />
                          <span>
                            Blok {selectedResident.block} /{" "}
                            {selectedResident.houseNumber}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <PhoneCall className="w-4 h-4 text-blue-600" />
                          <span>{selectedResident.phoneNumber || "-"}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-24 w-full border border-red-100 justify-start bg-red-50/60 rounded-lg text-blue-900 shadow-sm flex items-center gap-2">
                      <UserNotFoundIllustration className="h-24 w-auto mt-2" />
                      <span className="font-semibold text-red-800 text-xs">
                        Data Warga tidak ditemukan
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Periode Tagihan */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-blue-900 flex items-center gap-1 mb-0">
              <Calendar className="w-4 h-4" />
              Periode Tagihan
            </Label>
            <div className="flex gap-3">
              <div className="flex-1">
                <Controller
                  name="month"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full text-xs" id="month">
                        <SelectValue placeholder="Pilih bulan" />
                      </SelectTrigger>
                      <SelectContent>
                        {BULAN_LIST.map((bulan) => (
                          <SelectItem key={bulan.value} value={bulan.value}>
                            {bulan.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.month && (
                  <span className="text-red-500 text-xs">
                    Bulan wajib dipilih
                  </span>
                )}
              </div>

              <div className="flex-1">
                <Controller
                  name="year"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full text-xs" id="year">
                        <SelectValue placeholder="Pilih tahun" />
                      </SelectTrigger>
                      <SelectContent>
                        {TAHUN_LIST.map((tahun) => (
                          <SelectItem key={tahun} value={tahun}>
                            {tahun}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.year && (
                  <span className="text-red-500 text-xs">
                    Tahun wajib dipilih
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Jumlah Tagihan */}
          <div>
            <Label
              htmlFor="amount"
              className="text-xs font-semibold text-blue-900 flex items-center gap-1 mb-0"
            >
              <Coins className="w-4 h-4" />
              Jumlah Tagihan
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
                    placeholder="Masukkan jumlah tagihan"
                    className="pl-8 !text-xs"
                  />
                )}
              />
            </div>
            {errors.amount && (
              <span className="text-red-500 text-xs">
                Jumlah tagihan wajib diisi
              </span>
            )}
          </div>

          {/* Catatan */}
          <div>
            <Label
              htmlFor="remark"
              className="text-xs font-semibold text-blue-900 flex items-center gap-1 mb-1"
            >
              <FileText className="w-4 h-4" />
              Catatan <span className="text-xs text-blue-500">(Opsional)</span>
            </Label>
            <Controller
              name="remark"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="remark"
                  placeholder="Dimohon untuk membayar iuran..."
                  className="resize-y !text-xs"
                  {...field}
                />
              )}
            />
          </div>

          {error && <div className="text-red-500 text-xs">{error}</div>}

          <Button
            type="submit"
            disabled={loadingSingle || addBulkBills.isPending}
            className="w-full mt-2"
          >
            {loadingSingle || addBulkBills.isPending
              ? "Memproses..."
              : isAllResidents
              ? "Buat Tagihan Semua Warga"
              : "Tambah Tagihan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
