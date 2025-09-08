"use client";
// import { useBills } from '../hooks/useBills';
import { BadgeCheck, XCircle } from 'lucide-react';
import { EmptyBillIllustration } from './svg/EmptyBillIllustration';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
// Reusable search input component
function SearchInput({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <Input
      type="text"
      placeholder="Cari nama/blok/nomor/bulan/tahun..."
      value={value}
      onChange={onChange}
      className="bg-white transition-colors"
    />
  );
}
import { toast } from 'react-hot-toast';


export default function ConfirmBillList() {
  // Dummy data for UI/UX preview
  const bills = [
    {
      id: '1',
      bulan: 'Mei',
      tahun: '2024',
      blokRumah: 'A',
      nomorRumah: '12',
      nama: 'Budi',
      nominal: 150000,
      status: 'pending',
      buktiBayarURL: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      bulan: 'Mei',
      tahun: '2024',
      blokRumah: 'B',
      nomorRumah: '7',
      nama: 'Siti',
      nominal: 150000,
      status: 'pending',
      buktiBayarURL: '',
    },
    {
      id: '3',
      bulan: 'Mei',
      tahun: '2024',
      blokRumah: 'C',
      nomorRumah: '21',
      nama: 'Agus',
      nominal: 150000,
      status: 'approved',
      buktiBayarURL: 'https://via.placeholder.com/150',
    },
  ];
  const isLoading = false;
  const error = null;
  const [rejectingId, setRejectingId] = useState<string|null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [search, setSearch] = useState('');
  const [loadingId, setLoadingId] = useState<string|null>(null);

  // Filter bills by search (by nama, blok, nomor, bulan, tahun)
  const filteredBills = bills.filter(bill => {
    const q = search.toLowerCase();
    return (
      bill.nama.toLowerCase().includes(q) ||
      bill.blokRumah.toLowerCase().includes(q) ||
      bill.nomorRumah.toLowerCase().includes(q) ||
      bill.bulan.toLowerCase().includes(q) ||
      bill.tahun.toLowerCase().includes(q)
    );
  });

  if (isLoading) return <div className="text-center py-8 text-blue-700">Memuat data tagihan...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Gagal memuat data tagihan</div>;

  const pendingBills = (filteredBills || []).filter(bill => bill.status === 'pending');


  // Search input and empty state
  if (pendingBills.length === 0)
    return (
      <div>
        <div className="sticky top-0 z-10 bg-gradient-to-b mb-4 pb-2 pt-2">
          <SearchInput value={search} onChange={e => setSearch(e.target.value)} />
        </div>
            <div className="flex flex-col items-center justify-center py-10 text-blue-700">
              <EmptyBillIllustration />
              <div className="mt-4 text-base font-semibold">Tidak ada tagihan menunggu konfirmasi.</div>
            </div>
      </div>
    );

  return (
    <div>
      <div className="sticky top-0 z-10 mb-2">
        <SearchInput value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="space-y-4">
        {pendingBills.map(bill => (
          <div
            key={bill.id}
            className="bg-white rounded-xl shadow border border-blue-50 p-4 flex flex-col gap-2 animate-fade-in"
            style={{ transition: 'opacity 0.3s' }}
          >
            <div className="flex items-center gap-2 text-blue-900 font-semibold">
              <span className="text-xs bg-blue-100 text-blue-700 rounded px-2 py-0.5">{bill.bulan}/{bill.tahun}</span>
              <span className="text-xs bg-gray-100 text-gray-700 rounded px-2 py-0.5">{bill.blokRumah}/{bill.nomorRumah}</span>
              <span className="text-xs bg-green-100 text-green-700 rounded px-2 py-0.5">{bill.nama || 'Warga'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>Nominal:</span>
              <span className="font-bold text-blue-700">Rp{bill.nominal}</span>
            </div>
            {bill.buktiBayarURL && (
              <a href={bill.buktiBayarURL} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">Lihat Bukti Pembayaran</a>
            )}
            {rejectingId === bill.id ? (
              <div className="flex flex-col gap-2 mt-2">
                <input
                  className="border rounded px-2 py-1 text-xs"
                  placeholder="Alasan penolakan..."
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={loadingId === bill.id}
                    onClick={async () => {
                      setLoadingId(bill.id);
                      setTimeout(() => {
                        toast.success('Tagihan ditolak');
                        setLoadingId(null);
                        setRejectingId(null);
                        setRejectReason('');
                      }, 900);
                    }}
                  >
                    {loadingId === bill.id ? 'Memproses...' : 'Tolak'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setRejectingId(null)}>
                    Batal
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  disabled={loadingId === bill.id}
                  onClick={async () => {
                    setLoadingId(bill.id);
                    setTimeout(() => {
                      toast.success('Tagihan disetujui');
                      setLoadingId(null);
                    }, 900);
                  }}
                  className="flex items-center gap-1"
                >
                  {loadingId === bill.id ? 'Memproses...' : (<><BadgeCheck className="w-4 h-4" /> Approve</>)}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => { setRejectingId(bill.id); setRejectReason(''); }}
                  className="flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
