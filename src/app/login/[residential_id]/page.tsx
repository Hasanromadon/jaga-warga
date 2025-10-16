"use client";
import ResidentialLoading from "@/components/ResidentialLoading";
import { HousingNotFoundIllustration } from "@/components/svg/HousingNotFoundIllustration";
import { Button } from "@/components/ui/button";
import { useResidentialInfo } from "@/hooks/useResidentialInfo";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import LoginForm from "../../../components/LoginForm";

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-blue-900 flex flex-col items-center justify-center gap-2">
          <HousingNotFoundIllustration className="h-80 w-auto mt-2" />
          <span className="font-semibold text-[#7BA7E7] text-lg">
            Data Perumahan tidak ditemukan
          </span>
          <Button
            onClick={() => window.location.replace("/GHI")}
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
