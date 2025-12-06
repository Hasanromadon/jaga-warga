import { useQuery } from '@tanstack/react-query';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface Ad {
  id: string;
  headline: string;
  adBody: string;
  shortTagline: string;
  suggestedHashtags: string[];
  itemName: string;
  price: number;
  imageUrl: string;
  residentId: string;
  residentName: string;
  block: string;
  houseNumber: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: any;
  residential_id: string;
}

export function useAds(residentialId?: string) {
  return useQuery({
    queryKey: ['ads', residentialId],
    queryFn: async () => {
      let q;

      if (residentialId) {
        q = query(
          collection(db, 'ads'),
          where('residential_id', '==', residentialId),
          orderBy('createdAt', 'desc'),
        );
      } else {
        // If no residentialId is provided, fetch all ads (public view)
        q = query(collection(db, 'ads'), orderBy('createdAt', 'desc'));
      }

      const querySnapshot = await getDocs(q);
      const adsData: Ad[] = [];
      querySnapshot.forEach((doc) => {
        adsData.push({ id: doc.id, ...doc.data() } as Ad);
      });
      return adsData;
    },
  });
}
