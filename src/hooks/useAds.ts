import { useQuery } from '@tanstack/react-query';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useEffect, useState } from 'react';

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
  createdAt: any;
  residential_id: string;
}

export function useAds(residentialId?: string) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!residentialId) {
        setIsLoading(false);
        return;
    };

    const q = query(
      collection(db, 'ads'),
      where('residential_id', '==', residentialId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const adsData: Ad[] = [];
      querySnapshot.forEach((doc) => {
        adsData.push({ id: doc.id, ...doc.data() } as Ad);
      });
      setAds(adsData);
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching ads: ", error);
        setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [residentialId]);

  return { data: ads, isLoading };
}
