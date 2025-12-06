import { useQuery } from '@tanstack/react-query';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  totalBills: number;
  pendingBills: number;
}

export function useDashboardStats(key = 'GHI') {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats', key],
    queryFn: async () => {
      const now = new Date();
      const year = now.getFullYear().toString();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');

      const summaryRef = doc(db, 'monthly_summaries', key, year, month);
      const summarySnap = await getDoc(summaryRef);

      if (summarySnap.exists()) {
        const data = summarySnap.data();
        return {
          totalIncome: data.total_income || 0,
          totalExpenses: data.total_expense || 0,
          totalBills: data.total_bills || 0,
          pendingBills: data.pending_bills || 0,
        } as DashboardStats;
      }

      return {
        totalIncome: 0,
        totalExpenses: 0,
        totalBills: 0,
        pendingBills: 0,
      } as DashboardStats;
    },
  });
}
export type Activity = {
  id: string;
  type: 'income' | 'expense';
  user: string;
  amount: number;
  time: string;
};

export function useActivities() {
  return useQuery<Activity[]>({
    queryKey: ['activities'],
    queryFn: async () => {
      const q = query(
        collection(db, 'general_transactions'),
        orderBy('created_at', 'desc'),
        limit(4),
      );
      const transSnap = await getDocs(q);

      const list = transSnap.docs.map((doc) => {
        const t = doc.data();
        return {
          id: doc.id,
          type: t.type,
          user: t.description,
          amount: t.amount,
          time: new Date(t.created_at.seconds * 1000).toLocaleString('id-ID'),
        } as Activity;
      });

      return list;
    },
  });
}
