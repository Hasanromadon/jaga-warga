import { Users, LogIn, Home, ShieldCheck, FileText } from 'lucide-react';
import Header from '@/components/landing/Header';
import ActionButton from '@/components/landing/ActionButton';
import FeatureHighlight from '@/components/landing/FeatureHighlight';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center p-4">
      <Header />
      <div className="w-full max-w-sm flex flex-col gap-4">
        <ActionButton
          href="/warga"
          icon={Users}
          text="Cek Tagihan IPL"
          color="blue"
        />
        <ActionButton
          href="/login"
          icon={LogIn}
          text="Login Admin"
          color="green"
        />
      </div>
      <div className="w-full max-w-sm mt-5 space-y-1">
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
