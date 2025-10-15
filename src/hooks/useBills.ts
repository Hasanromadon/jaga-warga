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
      // Map old keys to new keys for backward compatibility (if needed)
      return snapshot.docs.map((doc) => {
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
          createdAt:
            data.createdAt instanceof Object &&
            typeof data.createdAt.toDate === "function"
              ? data.createdAt
              : (data.createdAt &&
                  Timestamp.fromDate(new Date(data.createdAt))) ||
                (data.tanggalPengajuan &&
                  Timestamp.fromDate(new Date(data.tanggalPengajuan))) ||
                undefined,
          remark: data.remark,
        } as Bill;
      });
    },
  });
}
