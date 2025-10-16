"use client";
import { useParams } from "next/navigation";
import LoginForm from "../../../components/LoginForm";
import Image from "next/image";
import { useResidentialInfo } from "@/hooks/useResidentialInfo";
import ResidentialLoading from "@/components/ResidentialLoading";

export default function LoginWithResidencePage() {
  const params = useParams();
  const residentialId = params?.residential_id as string;
  const { data: residentialInfo, isLoading: loading } =
    useResidentialInfo(residentialId);

  if (loading) {
    return <ResidentialLoading />;
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
