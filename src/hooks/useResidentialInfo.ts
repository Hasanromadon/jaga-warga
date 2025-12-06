import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface ManagementContact {
  name: string;
  phone: string;
}

export interface ResidentialInfo {
  name: string;
  logo?: string;
  address?: string;
  management?: ManagementContact[];
}

const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

export function useResidentialInfo(residentialId?: string) {
  return useQuery<ResidentialInfo | null>({
    queryKey: ['residentialInfo', residentialId],
    queryFn: async () => {
      if (!residentialId) return null;
      const docRef = doc(db, 'residential_info', residentialId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;
      return snap.data() as ResidentialInfo;
    },
    enabled: !!residentialId,
    staleTime: THIRTY_DAYS,
  });
}
