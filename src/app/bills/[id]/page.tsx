'use client';
import { useParams } from 'next/navigation';
import UploadBuktiForm from '../../../components/UploadBuktiForm';
import { DEMO_RESIDENTIAL_ID } from '@/constants';

export default function BillDetailPage() {
  const params = useParams();
  const billId = DEMO_RESIDENTIAL_ID ?? (params?.id as string);
  // Placeholder: fetch bill detail, show info, and upload form
  return (
    <main className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Detail Tagihan</h1>
      {/* TODO: Show bill detail here */}
      <UploadBuktiForm billId={billId} />
    </main>
  );
}
