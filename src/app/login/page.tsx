"use client";
import LoginForm from "../../components/LoginForm";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { withRedirectIfAuthenticated } from "../../utils/redirectIfAuthenticated";

function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center p-4">
      <div className="w-full max-w-sm flex flex-col items-center mt-10 mb-2">
        <div className="rounded-full bg-white shadow-lg p-3 mb-2 flex items-center justify-center">
          <Image
            src="/logo.svg"
            alt="Logo Jaga Warga"
            width={56}
            height={56}
            className="rounded-full"
          />
        </div>
        <h1 className="text-2xl font-bold text-blue-900 mb-1 text-center flex items-center gap-2">
          Jaga Warga
        </h1>
        <p className="text-sm text-blue-700 text-center mb-2">
          Masuk ke dashboard admin Jaga Warga untuk mengelola data tagihan dan
          verifikasi pembayaran.
        </p>
      </div>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
      <div className="w-full max-w-sm mt-8 flex items-center gap-3 bg-green-50 border border-green-100 rounded-lg p-3">
        <ShieldCheck className="w-5 h-5 text-green-600" />
        <span className="text-sm text-green-900">
          Akses hanya untuk admin terdaftar. Data dijaga aman.
        </span>
      </div>
      <footer className="mt-10 text-xs text-blue-900/60 text-center">
        &copy; {new Date().getFullYear()} Jaga Warga. All rights reserved.
      </footer>
    </main>
  );
}

export default withRedirectIfAuthenticated(LoginPage);
