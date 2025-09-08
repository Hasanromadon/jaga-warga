import { Users, LogIn } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 gap-8">
      <h1 className="text-2xl font-bold mb-4 text-center">IPL Perumahan</h1>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <a href="/warga" className="flex items-center gap-3 p-4 rounded-lg shadow bg-white text-lg font-medium hover:bg-gray-100 transition">
          <Users className="w-6 h-6 text-blue-600" />
          Cek Tagihan Warga
        </a>
        <a href="/login" className="flex items-center gap-3 p-4 rounded-lg shadow bg-white text-lg font-medium hover:bg-gray-100 transition">
          <LogIn className="w-6 h-6 text-green-600" />
          Login Admin
        </a>
      </div>
    </main>
  );
}
