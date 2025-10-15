"use client";
import Image from "next/image";
import { Users, LogIn, Home, ShieldCheck, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

interface ResidentialInfo {
  name: string;
  logo?: string;
}

export default function HomeWithResidencePage() {
  const params = useParams();
  const residentialId = params?.residential_id as string;
  const [residentialInfo, setResidentialInfo] =
    useState<ResidentialInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!residentialId) return;
    const fetchInfo = async () => {
      setLoading(true);
      const docRef = doc(db, "residential_info", residentialId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setResidentialInfo(snap.data() as ResidentialInfo);
      }
      setLoading(false);
    };
    fetchInfo();
  }, [residentialId]);

  if (loading) {
    return <div className="text-center py-10">Memuat data perumahan...</div>;
  }

  if (!residentialInfo) {
    return (
      <div className="text-center py-10 text-red-600">
        Data perumahan tidak ditemukan.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center p-4">
      {residentialInfo && residentialInfo.logo && residentialInfo.name ? (
        <div className="w-full max-w-sm flex flex-col items-center mt-10 mb-2">
          <Image
            src={residentialInfo.logo}
            alt="Logo"
            width={80}
            height={80}
            className="h-16 w-auto mb-2 rounded-lg shadow"
          />
          <h1 className="text-2xl font-bold text-blue-900 mb-1 text-center">
            {residentialInfo.name}
          </h1>
        </div>
      ) : (
        <div className="w-full max-w-sm flex flex-col items-center mt-10 mb-6">
          <div className="p-3 flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt="Logo Jaga Warga"
              width={56}
              height={56}
              className="rounded-full"
            />
            <h1 className="text-2xl font-bold text-blue-900 mb-1 text-center">
              Jaga Warga
            </h1>
          </div>
        </div>
      )}
      <div className="w-full max-w-sm mb-3 ">
        <p className="text-xs text-blue-900 text-center mb-2">
          Aplikasi pengelolaan dan pengecekan iuran lingkungan untuk warga
          perumahan.
        </p>
      </div>
      <div className="w-full max-w-sm flex flex-col gap-4">
        <a
          href="/warga"
          className="flex items-center gap-3 p-4 rounded-xl shadow bg-white text-base font-semibold hover:bg-blue-50 transition border border-blue-100"
        >
          <Users className="w-6 h-6 text-blue-600" />
          Cek Tagihan IPL
        </a>
        <a
          href="/login"
          className="flex items-center gap-3 p-4 rounded-xl shadow bg-white text-base font-semibold hover:bg-green-50 transition border border-green-100"
        >
          <LogIn className="w-6 h-6 text-green-600" />
          Login Admin
        </a>
      </div>
      <div className="w-full max-w-sm mt-5 space-y-1">
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
          <Home className="w-5 h-5 text-blue-500" />
          <span className="text-xs text-blue-900">
            Akses mudah, mobile friendly, tanpa login untuk warga
          </span>
        </div>
        <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-lg p-3">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <span className="text-xs text-green-900">
            Data aman, verifikasi admin, upload bukti pembayaran
          </span>
        </div>
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-100 rounded-lg p-3">
          <FileText className="w-5 h-5 text-yellow-600" />
          <span className="text-xs text-yellow-900">
            Riwayat tagihan dan status pembayaran transparan
          </span>
        </div>
      </div>
    </main>
  );
}
