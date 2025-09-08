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
        q = fsQuery(q, where('userId', '==', userId));
      }
      const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Bill[];
    },
  });
}
