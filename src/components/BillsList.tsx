import { Bill } from '../types/bill';
import { useBills } from '../hooks/useBills';

export default function BillsList({ userId }: { userId?: string }) {
  const { data: bills, isLoading, error } = useBills(userId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading bills</div>;

  return (
    <div className="space-y-2">
      {bills && (bills as Bill[]).length > 0 ? (
        (bills as Bill[]).map((bill) => (
          <div
            key={bill.id}
            className="p-4 bg-white rounded shadow flex flex-col"
          >
            <span>
              Bulan: {bill.month}/{bill.year}
            </span>
            <span>
              Blok/No: {bill.block}/{bill.houseNumber}
            </span>
            <span>Jumlah: Rp{Number(bill.amount).toLocaleString('id-ID')}</span>
            <span>Status: {bill.status}</span>
            {bill.remark && <span>Catatan: {bill.remark}</span>}
          </div>
        ))
      ) : (
        <div>Tidak ada tagihan</div>
      )}
    </div>
  );
}
