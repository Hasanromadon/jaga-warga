"use client";
import { useAuthContext } from '../../context/AuthProvider';
import BillsList from '../../components/BillsList';
import AddBillForm from '../../components/AddBillForm';

export default function DashboardPage() {
  const { user, role } = useAuthContext();

  return (
    <main className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>
      {role === 'admin' ? (
        <>
          <AddBillForm />
          <h2 className="mt-8 mb-2 font-semibold">Semua Tagihan</h2>
          <BillsList />
        </>
      ) : (
        <>
          <h2 className="mb-2 font-semibold">Tagihan Saya</h2>
          <BillsList userId={user?.uid} />
        </>
      )}
    </main>
  );
}
