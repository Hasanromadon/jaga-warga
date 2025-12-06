import { useQuery } from '@tanstack/react-query';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  totalBills: number;
  pendingBills: number;
  closingBalance: number;
}

export function useDashboardStats(residentialId?: string | null) {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats', residentialId],
    queryFn: async () => {
      if (!residentialId) {
        return {
          totalIncome: 0,
          totalExpenses: 0,
          totalBills: 0,
          pendingBills: 0,
          closingBalance: 0,
        } as DashboardStats;
      }

      const now = new Date();
      const year = now.getFullYear().toString();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');

      // 1. Ambil Saldo Global (Real Balance) dari residential_info
      const globalRef = doc(db, 'residential_info', residentialId);
      const globalSnap = await getDoc(globalRef);
      const globalData = globalSnap.data();
      const currentBalance = globalData?.current_balance || 0;

      // 2. Ambil Statistik Bulan Ini dari monthly_summaries
      const summaryRef = doc(
        db,
        'monthly_summaries',
        residentialId,
        year,
        month,
      );
      const summarySnap = await getDoc(summaryRef);
      const monthData = summarySnap.exists() ? summarySnap.data() : {};

      return {
        totalIncome: monthData.total_income || 0,
        totalExpenses: monthData.total_expense || 0,
        totalBills: monthData.total_bills || 0,
        pendingBills: monthData.pending_bills || 0,
        closingBalance: currentBalance, // Menggunakan saldo global
      } as DashboardStats;
    },
    enabled: !!residentialId,
  });
}
export type Activity = {
  id: string;
  type: 'income' | 'expense';
  user: string;
  amount: number;
  time: string;
};

export function useActivities(residentialId?: string | null) {
  return useQuery<Activity[]>({
    queryKey: ['activities', residentialId],
    queryFn: async () => {
      if (!residentialId) return [];

      const q = query(
        collection(db, 'general_transactions'),
        where('residential_id', '==', residentialId),
        orderBy('created_at', 'desc'),
        limit(4),
      );
      try {
        const transSnap = await getDocs(q);

        const list = transSnap.docs.map((doc) => {
          const t = doc.data();
          return {
            id: doc.id,
            type: t.type,
            user: t.description,
            amount: t.amount,
            time: t.created_at
              ? new Date(t.created_at.seconds * 1000).toLocaleString('id-ID')
              : '-',
          } as Activity;
        });

        return list;
      } catch (error) {
        console.error('Error fetching activities:', error);
        return [];
      }
    },
  });
}
