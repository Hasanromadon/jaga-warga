"use client";
import { useState } from "react";
import { Card, } from "./ui/card";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { PlusCircle, Edit, Trash2, Phone } from "lucide-react";
import { EmptyBillIllustration } from "./svg/EmptyBillIllustration";
import { useResidents, useAddResident, useEditResident, useDeleteResident, Resident } from "../hooks/useResidents";
import ResidentForm, { ResidentFormInputs } from "./ResidentForm";
import toast from "react-hot-toast";
import { SearchInput } from "./custom/search-input";

export default function ResidentList() {
  const { data: residents = [], isLoading } = useResidents();
  const residentList = residents;
  const addResident = useAddResident();
  const editResident = useEditResident();
  const deleteResident = useDeleteResident();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Resident | null>(null);
  const [deleteId, setDeleteId] = useState<string|null>(null);

  const filtered = residentList.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.block.toLowerCase().includes(search.toLowerCase()) ||
    r.houseNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data: ResidentFormInputs) => {
    addResident.mutate(data, {
      onSuccess: () => {
        toast.success("Warga berhasil ditambahkan");
        setShowForm(false);
      },
      onError: () => toast.error("Gagal tambah warga"),
    });
  };

  const handleEdit = (data: ResidentFormInputs) => {
    if (!editData) return;
    editResident.mutate({ ...editData, ...data }, {
      onSuccess: () => {
        toast.success("Warga berhasil diupdate");
        setEditData(null);
      },
      onError: () => toast.error("Gagal update warga"),
    });
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };
  const confirmDelete = () => {
    if (!deleteId) return;
    deleteResident.mutate(deleteId, {
      onSuccess: () => {
        toast.success("Warga dihapus");
        setDeleteId(null);
      },
      onError: () => {
        toast.error("Gagal hapus warga");
        setDeleteId(null);
      },
    });
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-4">
      <div className="sticky top-0 z-10 bg-gradient-to-b pb-2 pt-2">
        <div className="flex flex-col gap-2">
          <SearchInput value={search} onChange={e => setSearch(e.target.value)} />
        </div>

      </div>
      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center text-gray-400 py-8">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-blue-700">
            <EmptyBillIllustration />
            <div className="mt-4 text-base font-semibold">Tidak ada warga.</div>
          </div>
        ) : (
          filtered.map(r => (
            <Card key={r.id} className="animate-fade-in border border-gray-200 bg-white/95 shadow-sm rounded-xl px-4 pt-4 pb-3 flex flex-col gap-2">
              <div className="font-semibold text-blue-900 text-base truncate mb-2" title={r.name}>{r.name}</div>
              <div className="flex flex-wrap gap-2 items-center w-full mb-1">
                <span className="bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs font-semibold">Blok {r.block}</span>
                <span className="bg-blue-50 text-blue-700 rounded px-2 py-0.5 text-xs font-normal border border-blue-100">No. {r.houseNumber}</span>
              </div>
              {r.phoneNumber && (
                <div className="text-xs text-blue-700 flex items-center gap-1 mb-2">
                  <Phone className="w-4 h-4" />
                  <span>{r.phoneNumber}</span>
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="icon" onClick={() => setEditData(r)}>
                  <Edit className="w-4 h-4 text-blue-600" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
      {/* Modal Konfirmasi Delete */}
      <Dialog open={!!deleteId} onOpenChange={v => { if (!v) setDeleteId(null); }}>
        <DialogContent className="p-6  border-none max-w-xs mx-auto rounded-md">
          <div className="font-semibold text-lg text-blue-900 mb-2 text-center">Hapus Warga?</div>
          <div className="text-gray-600 mb-4 text-sm text-center">Data warga akan dihapus secara permanen. Lanjutkan?</div>
          <div className="flex gap-2 justify-center mt-2">
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteResident.isPending}>Hapus</Button>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleteResident.isPending}>Batal</Button>
          </div>
        </DialogContent>
      </Dialog>
              </div>
            </Card>
          ))
        )}
      </div>
      {/* Modal Add Warga */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-sm mx-auto rounded-md">
          <ResidentForm onSave={handleAdd} />
        </DialogContent>
      </Dialog>
      {/* Modal Edit Warga */}
      <Dialog open={!!editData} onOpenChange={v => { if (!v) setEditData(null); }}>
        <DialogContent className="max-w-sm mx-auto rounded-md">
          {editData && <ResidentForm initial={editData} onSave={handleEdit} />}
        </DialogContent>
      </Dialog>
           {/* Floating Add Button */}
      <Button
        className="fixed bottom-20 right-4 left-4 z-50  w-xs mx-auto bg-blue-600 text-white flex items-center gap-2 justify-center text-base"
        onClick={() => setShowForm(true)}
        aria-label="Tambah Warga"
        style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)' }}
      >
        <PlusCircle className="w-5 h-5" />
        <span>Tambah Warga</span>
      </Button>
    </div>
  );
}
