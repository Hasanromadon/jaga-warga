import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query as fsQuery, where, CollectionReference, Query } from 'firebase/firestore';



import { db } from '../firebaseConfig';
import { Bill } from '../types/bill';

export function useBills(userId?: string) {
  return useQuery({
    queryKey: ['bills', userId],
    queryFn: async () => {
      let q: CollectionReference | Query = collection(db, 'bills');
      if (userId) {
        q = fsQuery(q, where('residentId', '==', userId));
      }
      const snapshot = await getDocs(q);
      // Map old keys to new keys for backward compatibility (if needed)
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          residentId: data.residentId ?? data.userId,
          amount: data.amount ?? data.nominal,
          month: data.month ?? data.bulan,
          year: data.year ?? data.tahun,
          status: data.status,
          proofUrl: data.proofUrl ?? data.buktiBayarURL,
          createdAt: data.createdAt ?? data.tanggalPengajuan,
          paidAt: data.paidAt ?? data.tanggalPembayaran,
          submittedAt: data.submittedAt,
          rejectReason: data.rejectReason,
        } as Bill;
      });
    },
  });
}
