'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import toast, { Toaster } from 'react-hot-toast';
import { ChevronDown } from 'lucide-react';
import { BillDetail } from '@/components/custom/bill-detail';
import { Bill } from '@/types/bill';
import { db, storage } from '@/firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import SearchBillForm from '@/components/warga/SearchBillForm';
import { Button } from '@/components/ui/button';

export default function WargaPage() {
  const [loading, setLoading] = useState(false);
  const [bill, setBill] = useState<Bill | null>(null);
  const [bukti, setBukti] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleCari = async (filters: {
    blok: string;
    nomor: string;
    bulan: string;
    tahun: string;
  }) => {
    setLoading(true);
    setBill(null);
    try {
      const billsRef = collection(db, 'bills');
      const q = query(
        billsRef,
        where('block', '==', filters.blok),
        where('houseNumber', '==', filters.nomor),
        where('month', '==', filters.bulan),
        where('year', '==', filters.tahun),
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        toast.error('Tagihan tidak ditemukan.');
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
    } catch {
      toast.error('Gagal mencari tagihan.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!bill || !bukti) return;
    setUploading(true);
    try {
      const buktiRef = ref(storage, `bukti-bayar/${bill.id}/${bukti.name}`);
      await uploadBytes(buktiRef, bukti);
      const url = await getDownloadURL(buktiRef);
      await updateDoc(doc(db, 'bills', bill.id), {
        proofUrl: url,
        status: 'pending',
      });
      setBill({ ...bill, proofUrl: url, status: 'pending' });
      toast.success('Bukti berhasil diupload, menunggu verifikasi admin.');
    } catch {
      toast.error('Gagal upload bukti.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center p-4">
      <Header
        logoSrc="/logo.svg"
        title="Jaga Warga"
        description="Masukkan data rumah Anda untuk melihat status tagihan di aplikasi Jaga Warga"
      />
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
              <SearchBillForm onSearch={handleCari} loading={loading} />
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
          Jika ada kendala, hubungi admin Jaga Warga <br /> <b>Pak Budi</b> :{' '}
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
      <Footer />
    </main>
  );
}
