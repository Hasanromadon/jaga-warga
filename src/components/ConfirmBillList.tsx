"use client";
import { useBills } from '../hooks/useBills';
import { useApproveBillMutation, useRejectBillMutation } from '../hooks/useConfirmBillMutations';
import { BadgeCheck, XCircle, Download } from 'lucide-react';
import { EmptyBillIllustration } from './svg/EmptyBillIllustration';
import { Button } from './ui/button';
import { Card, } from './ui/card';
import { ModalConfirmation } from './ui/modal-confirmation';
import { Dialog, DialogContent } from './ui/dialog';
import { SearchInput } from './custom/search-input';
import { useState } from 'react';
import toast from 'react-hot-toast';

import React, { useState as useReactState, useEffect } from 'react';
function PreviewImageModal({ open, src, onClose }: { open: boolean; src: string|null; onClose: () => void }) {
  const [imgLoaded, setImgLoaded] = useReactState(false);
  // Reset loading state when src changes
  useEffect(() => { setImgLoaded(false); }, [src, setImgLoaded]);
  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md p-4 flex flex-col items-center">
        <div className="w-full flex flex-col items-center">
          <div className="font-semibold text-base mb-2 text-blue-900">Preview Bukti Pembayaran</div>
          <div className="relative w-full flex flex-col items-center min-h-[200px]">
            {src && (
              <>
                {!imgLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded border mb-4 min-h-[200px] w-full">
                    <span className="text-gray-400 animate-pulse">Memuat gambar...</span>
                  </div>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt="Bukti Pembayaran"
                  className={`max-h-[70vh] max-w-full rounded border shadow-lg mb-4 transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImgLoaded(true)}
                  style={{ display: imgLoaded ? 'block' : 'none' }}
                />
              </>
            )}
          </div>
          <div className="flex flex-row gap-4 justify-center w-full mb-1">
            <a
              href={src || undefined}
              download
              className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              target="_blank"
              rel="noopener noreferrer"
              title="Download"
            >
              <Download className="w-6 h-6" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 text-sm font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ConfirmBillList() {
  const { data: bills, isLoading, error } = useBills();
  const approveMutation = useApproveBillMutation();
  const rejectMutation = useRejectBillMutation();
  // const [rejectingId, setRejectingId] = useState<string|null>(null); // unused
  const [rejectReason, setRejectReason] = useState('');
  const [search, setSearch] = useState('');
  const [loadingId, setLoadingId] = useState<string|null>(null);
  const [modal, setModal] = useState<null | { type: 'approve' | 'reject'; billId: string }>(null);
  const [previewImage, setPreviewImage] = useState<string|null>(null);
  // Filter bills by search (by nama, blok, nomor, bulan, tahun)
  const filteredBills = (bills || []).filter((bill: import('../types/bill').Bill) => {
    const q = search.toLowerCase();
    return (
      (bill.nama || '').toLowerCase().includes(q) ||
      (bill.blokRumah || '').toLowerCase().includes(q) ||
      (bill.nomorRumah || '').toLowerCase().includes(q) ||
      (bill.bulan || '').toLowerCase().includes(q) ||
      (bill.tahun || '').toLowerCase().includes(q)
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
  <div className="space-y-2">
        {pendingBills.map(bill => (
          <Card key={bill.id} className="animate-fade-in border border-gray-200 bg-white/95 shadow-sm rounded-xl">
            <div className="px-4 pt-3 pb-2">
              <div className="flex flex-wrap gap-2 items-center w-full mb-4">
                <span className="bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs font-semibold">{bill.bulan}/{bill.tahun}</span>
                <span className="bg-blue-50 text-blue-700 rounded px-2 py-0.5 text-xs font-normal border border-blue-100">{bill.blokRumah}/{bill.nomorRumah}</span>
                <span className="ml-auto text-xs text-gray-400 font-normal">{bill.tanggalPengajuan ? new Date(bill.tanggalPengajuan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>
              </div>
              <div className="font-semibold text-blue-900 text-sm truncate mb-1" title={bill.nama || 'Warga'}>{bill.nama || 'Warga'}    </div>
              <div className="flex items-center gap-2 text-sm mb-1">
                <span className="text-gray-700">Nominal:</span>
                <span className="font-bold text-blue-700 text-base">Rp{bill.nominal.toLocaleString('id-ID')}</span>
              </div>
              {bill.buktiBayarURL && (
                <button
                  type="button"
                  className="text-xs text-blue-600 underline bg-transparent border-0 p-0 cursor-pointer hover:text-blue-800"
                  onClick={() => setPreviewImage(bill.buktiBayarURL || null)}
                >
                  Lihat Bukti Pembayaran
                </button>
              )}
              <div className="flex gap-2 mt-3 justify-end">
                <Button
                  size="sm"
                  disabled={loadingId === bill.id}
                  onClick={() => setModal({ type: 'approve', billId: bill.id })}
                  className="flex items-center gap-1"
                >
                  <BadgeCheck className="w-4 h-4" /> Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => { setModal({ type: 'reject', billId: bill.id }); setRejectReason(''); }}
                  className="flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </Button>
              </div>
            </div>
      {/* Modal konfirmasi approve/reject */}
      <ModalConfirmation
        open={!!modal}
        title={modal?.type === 'approve' ? 'Konfirmasi Approve Pembayaran' : 'Konfirmasi Penolakan Pembayaran'}
        description={(() => {
          if (!modal) return undefined;
          const bill = pendingBills.find(b => b.id === modal.billId);
          if (!bill) return undefined;
          return (
            <div className="text-left space-y-2">
              <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-1 text-sm items-center">
                <span className="text-gray-500">Nama</span> <span className="font-medium text-blue-900 truncate" title={bill.nama}>{bill.nama}</span>
                <span className="text-gray-500">Blok/No</span> <span>{bill.blokRumah}/{bill.nomorRumah}</span>
                <span className="text-gray-500">Bulan/Tahun</span> <span>{bill.bulan}/{bill.tahun}</span>
                <span className="text-gray-500">Tgl Pengajuan</span> <span>{bill.tanggalPengajuan ? new Date(bill.tanggalPengajuan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>
                <span className="text-gray-500">Nominal</span> <span className="font-bold text-blue-700">Rp{bill.nominal.toLocaleString('id-ID')}</span>
                {bill.buktiBayarURL && <>
                  <span className="text-gray-500">Bukti</span>
                  <span className="inline-block">
                    <button
                      type="button"
                      className="text-blue-600 underline p-0 bg-transparent border-0 cursor-pointer hover:text-blue-800 text-left"
                      onClick={e => { e.preventDefault(); setPreviewImage(bill.buktiBayarURL || null); }}
                    >
                      Lihat Bukti Pembayaran
                    </button>
                  </span>
                </>}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {modal.type === 'approve'
                  ? 'Apakah Anda yakin ingin menyetujui pembayaran tagihan ini? Data akan tercatat sebagai sudah lunas.'
                  : 'Apakah Anda yakin ingin menolak pembayaran tagihan ini? Data akan tercatat sebagai ditolak.'}
              </div>
            </div>
          );
        })()}
        confirmLabel={modal?.type === 'approve' ? 'Ya, Setujui' : 'Ya, Tolak'}
        cancelLabel="Batal"
        loading={!!loadingId}
        rejectReason={modal?.type === 'reject' ? rejectReason : undefined}
        onRejectReasonChange={modal?.type === 'reject' ? setRejectReason : undefined}
        onCancel={() => {
          setModal(null);
        }}
        onConfirm={async () => {
          if (!modal) return;
          setLoadingId(modal.billId);
          if (modal.type === 'approve') {
            approveMutation.mutate(
              { billId: modal.billId },
              {
                onSuccess: () => {
                  toast.success('Tagihan berhasil dikonfirmasi.');
                  setLoadingId(null);
                  setModal(null);
                },
                onError: () => {
                  toast.error('Gagal mengkonfirmasi tagihan.');
                  setLoadingId(null);
                },
              }
            );
          } else {
            rejectMutation.mutate(
              { billId: modal.billId, reason: rejectReason },
              {
                onSuccess: () => {
                  toast.success('Tagihan berhasil ditolak.');
                  // removed setRejectingId(null); not needed
                  setRejectReason('');
                  setLoadingId(null);
                  setModal(null);
                },
                onError: () => {
                  toast.error('Gagal menolak tagihan.');
                  setLoadingId(null);
                },
              }
            );
          }
        }}
      />
        {/* Modal khusus untuk preview bukti bayar */}
  <PreviewImageModal open={!!previewImage} src={previewImage} onClose={() => setPreviewImage(null)} />
          </Card>
        ))}
      </div>
    </div>
  );
}
