"use client";
"use client";
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../context/AuthProvider';
import BillsList from '../../components/BillsList';

export default function BillsPage() {
  const { user, role } = useAuthContext();
  const router = useRouter();

  if (!user) {
    router.replace('/login');
    return null;
  }

  return (
    <main className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Daftar Tagihan</h1>
      {role === 'admin' ? <BillsList /> : <BillsList userId={user.uid} />}
    </main>
  );
}
