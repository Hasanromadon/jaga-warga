"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import LoginForm from "../../../components/LoginForm";
import Image from "next/image";

interface ResidentialInfo {
  name: string;
  logo?: string;
  // address?: string; // tidak perlu di halaman login
}

export default function LoginWithResidencePage() {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      {residentialInfo.logo && (
        <div className="mb-4">
          <Image
            src={residentialInfo.logo}
            alt="Logo"
            width={80}
            height={80}
            className="h-20 w-auto rounded-lg shadow"
          />
        </div>
      )}
      <h1 className="text-2xl font-bold text-blue-900 mb-2">
        {residentialInfo.name}
      </h1>
      {/* Tidak perlu tampilkan alamat di sini */}
      <div className="w-full p-2 mt-4">
        <LoginForm />
        <div className="text-center text-xs text-blue-400 mt-4">
          Powered by Jaga Warga
        </div>
      </div>
    </div>
  );
}
