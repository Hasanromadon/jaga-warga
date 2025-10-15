import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  query as fsQuery,
  where,
  CollectionReference,
  Query,
  Timestamp,
} from "firebase/firestore";

import { db } from "../firebaseConfig";
import { Bill } from "../types/bill";

// Combines Firestore-native search (residential_id, keywords) and resident info enrichment
export function useBills(residentialId?: string, search?: string) {
  return useQuery({
    queryKey: ["bills", residentialId, search],
    queryFn: async () => {
      let q: CollectionReference | Query = collection(db, "bills");
      if (residentialId && search) {
        q = fsQuery(
          q,
          where("residential_id", "==", residentialId),
          where("keywords", "array-contains", search.toLowerCase())
        );
      } else if (residentialId) {
        q = fsQuery(q, where("residential_id", "==", residentialId));
      } else if (search) {
        q = fsQuery(
          q,
          where("keywords", "array-contains", search.toLowerCase())
        );
      }
      const snapshot = await getDocs(q);

      // Enrich with resident info
      const residentsSnap = await getDocs(collection(db, "residents"));
      const residentsMap = new Map<
        string,
        { phoneNumber?: string; name?: string }
      >();
      residentsSnap.docs.forEach((doc) => {
        const d = doc.data();
        residentsMap.set(doc.id, {
          phoneNumber: d.phoneNumber,
          name: d.name,
        });
      });

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        const resident = residentsMap.get(data.residentId);
        return {
          id: doc.id,
          amount: data.amount ?? data.nominal,
          block: data.block,
          houseNumber: data.houseNumber,
          month: data.month ?? data.bulan,
          year: data.year ?? data.tahun,
          status: data.status,
          proofUrl: data.proofUrl ?? data.buktiBayarURL,
          remark: data.remark,
          phoneNumber: resident?.phoneNumber ?? data.phoneNumber ?? null,
          residentName: resident?.name ?? data.name ?? null,
          createdAt:
            data.createdAt instanceof Object &&
            typeof data.createdAt.toDate === "function"
              ? data.createdAt
              : (data.createdAt &&
                  Timestamp.fromDate(new Date(data.createdAt))) ||
                (data.tanggalPengajuan &&
                  Timestamp.fromDate(new Date(data.tanggalPengajuan))) ||
                undefined,
        } as Bill;
      });
    },
  });
}
