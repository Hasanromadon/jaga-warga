import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  query as fsQuery,
  where,
  CollectionReference,
  Query,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
} from "firebase/firestore";

import { db } from "../firebaseConfig";
import { Bill } from "../types/bill";

// Simplified bills query - bills already contain all necessary information
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

      return snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            amount: data.amount ?? data.nominal ?? 0,
            block: data.block ?? "",
            houseNumber: data.houseNumber ?? "",
            month: data.month ?? data.bulan ?? "",
            year: data.year ?? data.tahun ?? "",
            status: data.status ?? "unpaid",
            proofUrl: data.proofUrl ?? data.buktiBayarURL ?? "",
            rejectReason: data.rejectReason ?? "",
            remark: data.remark ?? "",
            phoneNumber: data.phoneNumber ?? null,
            residentName: data.residentName ?? data.name ?? null,
            createdAt: data.createdAt,
            residential_id: data.residential_id ?? null,
          } as Bill;
        })
        .filter((bill) => !!bill.residential_id);
    },
  });
}

// Infinite scroll bills query with keyword filtering
export function useInfiniteBills(residentialId?: string, search?: string) {
  return useInfiniteQuery({
    queryKey: ["bills-infinite", residentialId, search],
    queryFn: async ({ pageParam }) => {
      const BILLS_PER_PAGE = 20;
      let q: CollectionReference | Query = collection(db, "bills");

      // Base query with residential_id filter
      if (residentialId) {
        q = fsQuery(q, where("residential_id", "==", residentialId));
      }

      // Add keyword search if provided
      if (search && search.trim()) {
        const searchTerm = search.trim().toLowerCase();
        q = fsQuery(q, where("keywords", "array-contains", searchTerm));
      }

      // Add ordering and pagination
      q = fsQuery(q, orderBy("createdAt", "desc"), limit(BILLS_PER_PAGE));

      // Add cursor for pagination
      if (pageParam) {
        q = fsQuery(q, startAfter(pageParam));
      }

      const snapshot = await getDocs(q);

      const bills = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          amount: data.amount ?? data.nominal ?? 0,
          block: data.block ?? "",
          houseNumber: data.houseNumber ?? "",
          month: data.month ?? data.bulan ?? "",
          year: data.year ?? data.tahun ?? "",
          status: data.status ?? "unpaid",
          proofUrl: data.proofUrl ?? data.buktiBayarURL ?? "",
          rejectReason: data.rejectReason ?? "",
          remark: data.remark ?? "",
          phoneNumber: data.phoneNumber ?? null,
          residentName: data.residentName ?? data.name ?? null,
          createdAt: data.createdAt,
          residential_id: data.residential_id ?? null,
        } as Bill;
      });

      return {
        bills,
        nextCursor: snapshot.docs.length === BILLS_PER_PAGE ? snapshot.docs[snapshot.docs.length - 1] : null,
        hasMore: snapshot.docs.length === BILLS_PER_PAGE,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null as DocumentSnapshot | null,
  });
}
