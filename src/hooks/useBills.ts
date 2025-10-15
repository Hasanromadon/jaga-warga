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

export function useBills(userId?: string) {
  return useQuery({
    queryKey: ["bills", userId],
    queryFn: async () => {
      // Ambil semua tagihan
      let q: CollectionReference | Query = collection(db, "bills");
      if (userId) {
        q = fsQuery(q, where("residentId", "==", userId));
      }
      const snapshot = await getDocs(q);

      // Ambil semua residents untuk gabungan data
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

      // Gabungkan bills + residents info
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
