"use client";

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import toast, { Toaster } from "react-hot-toast";
import {
  Search,
  Home,
  Calendar,
  Loader2,
  ChevronDown,
  PhoneCall,
  User,
} from "lucide-react";
import { BillDetail } from "../../components/custom/bill-detail";
import Image from "next/image";
import {
  BLOK_LIST,
  HOUSE_NUMBER_LIST,
  BULAN_LIST,
  TAHUN_LIST,
} from "../../constants";
import { Bill } from "../../types/bill";

import { useState } from "react";
import { db, storage } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { EmptyBillIllustration } from "@/components/svg/EmptyBillIllustration";
import { useResidents } from "@/hooks/useResidents";
import { UserNotFoundIllustration } from "@/components/svg/UserNotFoundIllustration";

export default function WargaPage() {
  const [blok, setBlok] = useState("");
  const [nomor, setNomor] = useState("");
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("");
  const [loading, setLoading] = useState(false);
  const [bill, setBill] = useState<Bill | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bukti, setBukti] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const { data: residents = [], isLoading: loadingResidents } = useResidents();

  const handleCari = async () => {
    setLoading(true);
    setError(null);
    setBill(null);
    setSuccess(false);
    try {
      const billsRef = collection(db, "bills");
      const q = query(
        billsRef,
        where("block", "==", blok),
        where("houseNumber", "==", nomor),
        where("month", "==", bulan),
        where("year", "==", tahun)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        setError("Tagihan tidak ditemukan.");
        toast.error("Tagihan tidak ditemukan.");
      } else {
        const data = snap.docs[0].data();
        // Map Firestore fields to Bill type
        setBill({
          id: snap.docs[0].id,
          amount: data.amount,
          block: data.block,
          houseNumber: data.houseNumber,
          month: data.month,
          year: data.year,
          status: data.status,
          proofUrl: data.proofUrl,
          createdAt: data.createdAt,
          remark: data.remark,
          rejectReason: data?.rejectReason,
        } as Bill);
        setShowForm(false);
      }
    } catch (e) {
      setError("Gagal mencari tagihan.");
      toast.error("Gagal mencari tagihan.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!bill || !bukti) return;
    setUploading(true);
    setError(null);
    setSuccess(false);
    try {
      const buktiRef = ref(storage, `bukti-bayar/${bill.id}/${bukti.name}`);
      await uploadBytes(buktiRef, bukti);
      const url = await getDownloadURL(buktiRef);
      await updateDoc(doc(db, "bills", bill.id), {
        proofUrl: url,
        status: "pending",
      });
      setSuccess(true);
      setBill({ ...bill, proofUrl: url, status: "pending" });
      toast.success("Bukti berhasil diupload, menunggu verifikasi admin.");
    } catch (e) {
      setError("Gagal upload bukti.");
      toast.error("Gagal upload bukti.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center p-4">
      <div className="w-full max-w-sm flex flex-col items-center mt-6 mb-4">
        <div className="p-3 flex items-center justify-center">
          <Image
            src="/logo.svg"
            alt="Logo Jaga Warga"
            width={56}
            height={56}
            className="rounded-full"
          />
        </div>
        <h1 className="text-xl font-bold text-blue-900 mb-1 text-center">
          Jaga Warga
        </h1>
        <p className="text-xs text-blue-900 text-center mb-2">
          Masukkan data rumah Anda untuk melihat status tagihan di aplikasi Jaga
          Warga
        </p>
      </div>
      <Card className="w-full max-w-sm shadow-xl border-0">
        <CardContent className="pt-6 pb-2">
          <div className="flex flex-col gap-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-bold text-blue-800 flex items-center gap-2 mb-0">
                Cari Tagihan
              </h2>
              {bill && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-blue-700"
                  onClick={() => setShowForm((v) => !v)}
                  type="button"
                  aria-expanded={showForm}
                >
                  {showForm ? "Sembunyikan Form" : "Tampilkan Form"}
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      !showForm ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              )}
            </div>
            {(showForm || !bill) && (
              <form
                className="flex flex-col gap-5 animate-fade-in"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCari();
                }}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-semibold flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      Blok & Nomor Rumah
                    </Label>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Select
                          value={blok}
                          onValueChange={(value) => {
                            setBlok(value);
                            setNomor("");
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Blok" />
                          </SelectTrigger>
                          <SelectContent>
                            {BLOK_LIST.map((b) => (
                              <SelectItem key={b} value={b}>
                                {b}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <Select value={nomor} onValueChange={setNomor}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Nomor" />
                          </SelectTrigger>
                          <SelectContent>
                            {HOUSE_NUMBER_LIST.map((n) => (
                              <SelectItem key={n} value={n}>
                                {n}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  {blok && nomor && (
                    <div className="animate-fade-in">
                      {(() => {
                        const resident = residents.find(
                          (r) => r.block === blok && r.houseNumber === nomor
                        );
                        return resident ? (
                          <div className="w-full border text-xs border-blue-100 bg-blue-50/60 rounded-lg p-5 text-blue-900 shadow-sm ">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-blue-800 text-xs flex items-center gap-1">
                                <Home className="w-4 h-4" /> Detail Warga
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-600" />
                                <span className="truncate">
                                  {resident.name || "-"}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Home className="w-4 h-4 text-blue-600" />
                                <span>
                                  Blok {resident.block} / {resident.houseNumber}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <PhoneCall className="w-4 h-4 text-blue-600" />
                                <span>{resident.phoneNumber || "-"}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-24 border border-red-100 justify-start bg-red-50/60 rounded-lg text-blue-900 shadow-sm flex items-center gap-2">
                            <UserNotFoundIllustration className="h-24 w-auto mt-2" />
                            <span className="font-semibold text-red-800 text-xs">
                              Data Warga tidak ditemukan
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-semibold flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Periode Tagihan
                    </Label>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Select value={bulan} onValueChange={setBulan}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Bulan" />
                          </SelectTrigger>
                          <SelectContent>
                            {BULAN_LIST.map((b) => (
                              <SelectItem key={b.value} value={b.value}>
                                {b.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <Select value={tahun} onValueChange={setTahun}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Tahun" />
                          </SelectTrigger>
                          <SelectContent>
                            {TAHUN_LIST.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  onClick={handleCari}
                  disabled={loading || !blok || !nomor || !bulan || !tahun}
                  className="w-full mt-1 flex items-center justify-center gap-2 text-base h-11 font-bold bg-blue-600 hover:bg-blue-700 text-white shadow"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}{" "}
                  Cek Tagihan
                </Button>
              </form>
            )}
            {bill && (
              <BillDetail
                bill={bill}
                uploading={uploading}
                bukti={bukti}
                setBukti={setBukti}
                handleUpload={handleUpload}
              />
            )}
          </div>
        </CardContent>
      </Card>
      <div className="text-xs text-neutral-900 mt-10 text-center">
        <span className="block">
          Jika ada kendala, hubungi admin Jaga Warga <br /> <b>Pak Budi</b> :{" "}
          <a
            href="https://wa.me/6281234567890"
            className="underline text-blue-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            0812-3456-7890
          </a>
        </span>
      </div>
      <Toaster position="top-center" />
      <footer className="mt-10 text-xs text-blue-900/60 text-center">
        &copy; {new Date().getFullYear()} Jaga Warga. All rights reserved.
      </footer>
    </main>
  );
}

// : (
//                 <div className="mt-8 flex flex-col items-center gap-2 animate-fade-in">
//                   <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-2">
//                     <Home className="w-12 h-12 text-blue-200" />
//                   </div>
//                   <div className="text-blue-400 font-semibold text-sm text-center">Belum ada data tagihan ditemukan.<br/>Silakan cari tagihan Anda.</div>
//                 </div>
//               )
