'use client';
import { useAuthContext } from '../../context/AuthProvider';
import BillsList from '../../components/BillsList';
import { withProtectedRoute } from '../../utils/protectedRoute';

function BillsPage() {
  const { role, residentialId } = useAuthContext();

  return (
    <main className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Daftar Tagihan</h1>
      {role === 'admin' ? (
        <BillsList />
      ) : (
        <BillsList userId={residentialId ?? undefined} />
      )}
    </main>
  );
}

export default withProtectedRoute(BillsPage);
