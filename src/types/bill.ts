import type { Timestamp } from 'firebase/firestore';
export type Bill = {
  id: string;
  amount: number;
  block: string;
  houseNumber: string;
  month: string;
  year: string;
  status: 'unpaid' | 'pending' | 'paid' | 'rejected' | 'approved';
  proofUrl?: string;
  rejectReason?: string;
  createdAt: Timestamp;
  remark?: string;
  phoneNumber?: string | null;
  residentName?: string | null;
  residential_id?: string | null;
};
