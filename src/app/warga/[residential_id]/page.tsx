'use client';

import ResidentialLoading from '@/components/ResidentialLoading';
import { UserNotFoundIllustration } from '@/components/svg/UserNotFoundIllustration';
import { useResidentialInfo } from '@/hooks/useResidentialInfo';
import { useResidents } from '@/hooks/useResidents';
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  Home,
  Loader2,
  PhoneCall,
  Search,
  User,
} from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BillDetail } from '../../../components/custom/bill-detail';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  BLOK_LIST,
  BULAN_LIST,
  HOUSE_NUMBER_LIST,
  TAHUN_LIST,
} from '../../../constants';
import { db, storage } from '../../../firebaseConfig';
import { Bill } from '../../../types/bill';
import { HousingNotFoundIllustration } from '@/components/svg/HousingNotFoundIllustration';

// ResidentialInfo type provided by hook

export default function WargaWithResidencePage() {
  const params = useParams();
  const residentialId = params?.residential_id as string;
  const { data: residentialInfo, isLoading: loadingBranding } =
    useResidentialInfo(residentialId);

  // Main warga page state
  const [blok, setBlok] = useState('');
  const [nomor, setNomor] = useState('');
  const [bulan, setBulan] = useState('');
  const [tahun, setTahun] = useState('');
  const [loading, setLoading] = useState(false);
  const [bill, setBill] = useState<Bill | null>(null);
  const [error, setError] = useState<string | null>(null);
  // keep error to show toasts; also output to debug to avoid unused var linter
  if (error) console.debug('Warga page error:', error);
  const [bukti, setBukti] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  // const [success, setSuccess] = useState(false); // not used
  const [showForm, setShowForm] = useState(true);

  // Residents hook, filter by residential_id
  const { data: residents = [] } = useResidents(residentialId);

  // residentialInfo and loadingBranding come from useResidentialInfo hook

  const handleCari = async () => {
    setLoading(true);
    setError(null);
    setBill(null);
    // setSuccess(false); // removed, unused
    try {
      const billsRef = collection(db, 'bills');
      const q = query(
        billsRef,
        where('block', '==', blok),
        where('houseNumber', '==', nomor),
        where('month', '==', bulan),
        where('year', '==', tahun),
        where('residential_id', '==', residentialId),
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        setError('Tagihan tidak ditemukan.');
        toast.error('Tagihan tidak ditemukan.');
      } else {
        const data = snap.docs[0].data();
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
    } catch {
      setError('Gagal mencari tagihan.');
      toast.error('Gagal mencari tagihan.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!bill || !bukti) return;
    setUploading(true);
    setError(null);
    // setSuccess(false); // removed, unused
    try {
      const buktiRef = ref(storage, `bukti-bayar/${bill.id}/${bukti.name}`);
      await uploadBytes(buktiRef, bukti);
      const url = await getDownloadURL(buktiRef);
      await updateDoc(doc(db, 'bills', bill.id), {
        proofUrl: url,
        status: 'pending',
      });
      // setSuccess(true); // removed, unused
      setBill({ ...bill, proofUrl: url, status: 'pending' });
      toast.success('Bukti berhasil diupload, menunggu verifikasi admin.');
    } catch {
      setError('Gagal upload bukti.');
      toast.error('Gagal upload bukti.');
    } finally {
      setUploading(false);
    }
  };

  if (loadingBranding) {
    return <ResidentialLoading />;
  }

  if (!residentialInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-blue-900 flex flex-col items-center justify-center gap-2">
          <HousingNotFoundIllustration className="h-80 w-auto mt-2" />
          <span className="font-semibold text-[#7BA7E7] text-lg">
            Data Perumahan tidak ditemukan
          </span>
          <Button
            onClick={() => window.location.replace('/GHI')}
            variant="default"
            size="sm"
          >
            <ChevronLeft />
            Kembali ke halaman Utama
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center p-4">
      {residentialInfo && residentialInfo.logo && residentialInfo.name ? (
        <div className="w-full max-w-sm flex flex-col items-center mt-6 mb-4">
          <Image
            src={residentialInfo.logo}
            alt="Logo"
            width={80}
            height={80}
            className="h-20 w-auto mb-2 rounded-lg shadow"
          />
          <h1 className="text-2xl font-bold text-blue-900 mb-1 text-center">
            {residentialInfo.name}
          </h1>
          <p className="text-xs text-blue-900 text-center mb-2">
            Masukkan data rumah Anda untuk melihat status tagihan
          </p>
        </div>
      ) : (
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
            Masukkan data rumah Anda untuk melihat status tagihan di aplikasi
            Jaga Warga
          </p>
        </div>
      )}
      <Card className="w-full max-w-sm shadow-xl border-0">
        <CardContent className="pb-2">
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
                  {showForm ? 'Sembunyikan Form' : 'Tampilkan Form'}
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      !showForm ? 'rotate-180' : ''
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
                            setNomor('');
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
                          (r) => r.block === blok && r.houseNumber === nomor,
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
                                  {resident.name || '-'}
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
                                <span>{resident.phoneNumber || '-'}</span>
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
                  )}{' '}
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
          Jika ada kendala, hubungi admin
          <br />
          {Array.isArray(residentialInfo.management) &&
          residentialInfo.management.length > 0 ? (
            residentialInfo.management.map((m, idx) => (
              <span key={idx} className="block mt-1">
                <b>{m.name}</b> :{' '}
                <a
                  href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}`}
                  className="underline text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {m.phone}
                </a>
              </span>
            ))
          ) : (
            <>
              <b>Pak Budi</b> :{' '}
              <a
                href="https://wa.me/6281234567890"
                className="underline text-blue-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                0812-3456-7890
              </a>
            </>
          )}
        </span>
      </div>
      <Toaster position="top-center" />
      <footer className="mt-10 text-xs text-blue-900/60 text-center">
        &copy; {new Date().getFullYear()} Jaga Warga. All rights reserved.
      </footer>
    </main>
  );
}
