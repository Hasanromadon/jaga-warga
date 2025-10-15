import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { AddBillFormInputs } from "../components/AddBillForm";
import { Resident } from "./useResidents";

export function useAddBulkBillsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      residents,
      data,
    }: {
      residents: Resident[];
      data: Omit<AddBillFormInputs, "block" | "houseNumber">;
    }) => {
      await Promise.all(
        residents.map((resident) =>
          addDoc(collection(db, "bills"), {
            ...data,
            block: resident.block,
            houseNumber: resident.houseNumber,
            residentId: resident.id,
            residentName: resident.name,
            phoneNumber: resident.phoneNumber || "",
            status: "unpaid",
            proofUrl: "",
            createdAt: serverTimestamp(),
          })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });
}
