"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  Edit,
  FileDown,
  Phone,
  Plus,
  Trash2,
  Upload,
  UserPlus,
} from "lucide-react";
import Papa from "papaparse";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Resident,
  useAddResident,
  useDeleteResident,
  useEditResident,
  useResidents,
} from "../hooks/useResidents";
import { SearchInput } from "./custom/search-input";
import ResidentForm, { ResidentFormInputs } from "./ResidentForm";
import { EmptyBillIllustration } from "./svg/EmptyBillIllustration";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";

type ResidentCSVRow = {
  name: string;
  block: string;
  houseNumber: string;
  phoneNumber?: string;
};

export default function ResidentList() {
  const { data: residents = [], isLoading } = useResidents();
  const residentList = residents;
  const addResident = useAddResident();
  const editResident = useEditResident();
  const deleteResident = useDeleteResident();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Resident | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [importedData, setImportedData] = useState<ResidentFormInputs[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  const filtered = residentList.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.block.toLowerCase().includes(search.toLowerCase()) ||
      r.houseNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<ResidentCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // results.data sudah bertipe ResidentCSVRow[]
        const formatted = results.data.map((row) => ({
          name: row.name?.trim() || "",
          block: row.block?.trim() || "",
          houseNumber: row.houseNumber?.trim() || "",
          phoneNumber: row.phoneNumber?.trim() || "",
        }));

        setImportedData(formatted);
        toast.success(`${formatted.length} data siap diimpor`);
      },
      error: () => toast.error("Gagal membaca file CSV"),
    });
  };

  const handleBulkImport = async () => {
    if (importedData.length === 0) {
      toast.error("Tidak ada data untuk diimpor");
      return;
    }

    setIsImporting(true);
    try {
      // Gunakan mutateAsync agar bisa di-await
      await Promise.all(
        importedData.map((data) => addResident.mutateAsync(data))
      );

      toast.success("Semua warga berhasil diimpor");
      setImportedData([]);
      setShowImport(false);
    } catch {
      toast.error("Beberapa data gagal diimpor");
    } finally {
      setIsImporting(false);
    }
  };

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
    editResident.mutate(
      { ...editData, ...data },
      {
        onSuccess: () => {
          toast.success("Warga berhasil diupdate");
          setEditData(null);
        },
        onError: () => toast.error("Gagal update warga"),
      }
    );
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
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
          filtered.map((r) => (
            <Card
              key={r.id}
              className="animate-fade-in border border-gray-200 bg-white/95 shadow-sm rounded-xl px-4 py-2 flex flex-col gap-1"
            >
              <div
                className="font-semibold text-blue-900 text-base truncate"
                title={r.name}
              >
                {r.name}
              </div>
              <div className="flex flex-wrap gap-2 items-center w-full mb-1">
                <span className="bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs font-semibold">
                  Blok {r.block}
                </span>
                <span className="bg-blue-50 text-blue-700 rounded px-2 py-0.5 text-xs font-normal border border-blue-100">
                  No. {r.houseNumber}
                </span>
              </div>
              {r.phoneNumber && (
                <div className="text-xs text-blue-700 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{r.phoneNumber}</span>
                </div>
              )}
              <div className="flex gap-1 justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditData(r)}
                >
                  <Edit className="w-4 h-4 text-blue-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(r.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
                {/* Modal Konfirmasi Delete */}
                <Dialog
                  open={!!deleteId}
                  onOpenChange={(v) => {
                    if (!v) setDeleteId(null);
                  }}
                >
                  <DialogContent className="p-6  border-none max-w-xs mx-auto rounded-md">
                    <div className="font-semibold text-lg text-blue-900 mb-2 text-center">
                      Hapus Warga?
                    </div>
                    <div className="text-gray-600 mb-4 text-sm text-center">
                      Data warga akan dihapus secara permanen. Lanjutkan?
                    </div>
                    <div className="flex gap-2 justify-center mt-2">
                      <Button
                        variant="destructive"
                        onClick={confirmDelete}
                        disabled={deleteResident.isPending}
                      >
                        Hapus
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteId(null)}
                        disabled={deleteResident.isPending}
                      >
                        Batal
                      </Button>
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
      <Dialog
        open={!!editData}
        onOpenChange={(v) => {
          if (!v) setEditData(null);
        }}
      >
        <DialogContent className="max-w-sm mx-auto rounded-md">
          {editData && <ResidentForm initial={editData} onSave={handleEdit} />}
        </DialogContent>
      </Dialog>
      {/* Modal Import Warga */}
      <Dialog open={showImport} onOpenChange={setShowImport}>
        <DialogContent className="max-w-sm mx-auto rounded-md">
          <div className="flex flex-col items-start gap-3">
            <h2 className="text-blue-900 font-semibold text-lg">
              Import Data Warga (CSV)
            </h2>
            <div>
              <Input
                type="file"
                accept=".csv"
                onChange={handleImportFile}
                className="text-sm text-blue-700"
                aria-label="Import Data Warga"
                title="Unggah data warga CSV (maksimal 3MB)"
              />
              <div className="text-[11px] text-blue-500 mt-1">
                Hanya menerima file CSV. Ukuran maksimal 3MB.
              </div>
            </div>
            {importedData.length > 0 && (
              <div className="w-full bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-blue-700 max-h-40 overflow-y-auto">
                <div className="font-semibold mb-1">
                  {importedData.length} data siap diimpor:
                </div>
                <ul className="list-disc ml-5 space-y-1">
                  {importedData.slice(0, 5).map((d, i) => (
                    <li key={i}>
                      {d.name} - Blok {d.block} No.{d.houseNumber}
                    </li>
                  ))}
                  {importedData.length > 5 && (
                    <li className="italic text-gray-500">
                      +{importedData.length - 5} lainnya...
                    </li>
                  )}
                </ul>
              </div>
            )}
            <div className="flex gap-2 mt-3">
              <Button
                onClick={handleBulkImport}
                disabled={isImporting || importedData.length === 0}
              >
                {isImporting ? "Mengimpor..." : "Mulai Import"}
              </Button>
              <Button variant="outline" onClick={() => setShowImport(false)}>
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Add + Import Buttons */}
      <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {fabOpen && (
            <>
              {/* Download Template */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  asChild
                  className="flex items-center gap-2 bg-white border-blue-200 hover:bg-blue-50 shadow-md text-blue-700"
                >
                  <a href="/template_warga.csv" download>
                    <FileDown className="w-4 h-4" />
                    <span>Unduh Template</span>
                  </a>
                </Button>
              </motion.div>

              {/* Import Warga */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25 }}
              >
                <Button
                  onClick={() => {
                    setShowImport(true);
                    setFabOpen(false);
                  }}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import Warga</span>
                </Button>
              </motion.div>

              {/* Tambah Warga */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  onClick={() => {
                    setShowForm(true);
                    setFabOpen(false);
                  }}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Tambah Warga</span>
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* FAB utama */}
        <motion.button
          onClick={() => setFabOpen(!fabOpen)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xl focus:outline-none transition-all"
          whileTap={{ scale: 0.9 }}
          aria-label="Menu Aksi"
        >
          <motion.div
            animate={{ rotate: fabOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="w-7 h-7" />
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
