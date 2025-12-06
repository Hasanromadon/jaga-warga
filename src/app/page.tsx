'use client';

import {
  Users,
  LogIn,
  Home,
  ShieldCheck,
  FileText,
  ShoppingBag,
} from 'lucide-react';
import Header from '@/components/landing/Header';
import ActionButton from '@/components/landing/ActionButton';
import FeatureHighlight from '@/components/landing/FeatureHighlight';
import PromoPreview from '@/components/landing/PromoPreview';
import { DEMO_RESIDENTIAL_ID } from '@/constants';
import { useResidentialInfo } from '@/hooks/useResidentialInfo';
import ResidentialLoading from '@/components/ResidentialLoading';

export default function HomePage() {
  const { data: residentialInfo, isLoading } =
    useResidentialInfo(DEMO_RESIDENTIAL_ID);

  if (isLoading && DEMO_RESIDENTIAL_ID) {
    return <ResidentialLoading />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center p-4">
      <Header logoSrc={residentialInfo?.logo} title={residentialInfo?.name} />
      <div className="w-full max-w-sm flex flex-col gap-4">
        <ActionButton
          href={
            DEMO_RESIDENTIAL_ID ? `/warga/${DEMO_RESIDENTIAL_ID}` : '/warga'
          }
          icon={Users}
          text="Cek Tagihan IPL"
          color="blue"
        />
        <ActionButton
          href={
            DEMO_RESIDENTIAL_ID ? `/login/${DEMO_RESIDENTIAL_ID}` : '/login'
          }
          icon={LogIn}
          text="Login Admin"
          color="green"
        />
      </div>

      <PromoPreview />

      <div className="w-full max-w-sm mt-6 space-y-1">
        <FeatureHighlight
          icon={Home}
          text="Akses mudah, mobile friendly, tanpa login untuk warga"
          color="blue"
        />
        <FeatureHighlight
          icon={ShieldCheck}
          text="Data aman, verifikasi admin, upload bukti pembayaran"
          color="green"
        />
        <FeatureHighlight
          icon={ShoppingBag}
          text="Pasar Warga: Jual beli produk & jasa antar tetangga"
          color="orange"
        />
        <FeatureHighlight
          icon={FileText}
          text="Riwayat tagihan dan status pembayaran transparan"
          color="yellow"
        />
      </div>
      <footer className="mt-10 text-xs text-blue-900/60 text-center">
        &copy; {new Date().getFullYear()} Jaga Warga. All rights reserved.
      </footer>
    </main>
  );
}
