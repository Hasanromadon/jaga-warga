export type Bill = {
  id: string;
  residentId: string; // reference to residents
  amount: number;
  month: string; // e.g. '05'
  year: string; // e.g. '2025'
  status: 'unpaid' | 'pending' | 'paid' | 'rejected' | 'approved';
  proofUrl?: string;
  createdAt: string; // ISO date
  paidAt?: string; // ISO date
  submittedAt?: string; // ISO date
  rejectReason?: string;
};
