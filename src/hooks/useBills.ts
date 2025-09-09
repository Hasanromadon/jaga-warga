import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query as fsQuery, where, CollectionReference, Query, Timestamp } from 'firebase/firestore';



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
              amount: data.amount ?? data.nominal,
              block: data.block,
              houseNumber: data.houseNumber,
              month: data.month ?? data.bulan,
              year: data.year ?? data.tahun,
              status: data.status,
              proofUrl: data.proofUrl ?? data.buktiBayarURL,
              createdAt: data.createdAt instanceof Object && typeof data.createdAt.toDate === 'function'
                ? data.createdAt
                : (data.createdAt && Timestamp.fromDate(new Date(data.createdAt)))
                  || (data.tanggalPengajuan && Timestamp.fromDate(new Date(data.tanggalPengajuan)))
                  || undefined,
              remark: data.remark,
            } as Bill;
      });
    },
  });
}
