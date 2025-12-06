import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { uploadBuktiBayar } from '@/utils/uploadToStorage';
import toast from 'react-hot-toast';

interface UploadBuktiFormInputs {
  billId: string;
  file: FileList;
}

export default function UploadBuktiForm({ billId }: { billId: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadBuktiFormInputs>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: UploadBuktiFormInputs) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const file = data.file[0];
      const url = await uploadBuktiBayar(file, billId);

      if (!url) {
        throw new Error('Upload failed');
      }

      await updateDoc(doc(db, 'bills', billId), {
        buktiBayarURL: url,
        status: 'pending',
      });
      setSuccess(true);
      toast.success('Bukti bayar berhasil diupload!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Terjadi error';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-sm mx-auto mt-10">
      <CardHeader>
        <CardTitle>Upload Bukti Bayar</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="file"
            accept="image/*,application/pdf"
            {...register('file', { required: true })}
          />
          {errors.file && (
            <span className="text-red-500 text-xs">File wajib diupload</span>
          )}
          {error && <div className="text-red-500 text-xs">{error}</div>}
          {success && (
            <div className="text-green-500 text-xs">
              Bukti bayar berhasil diupload!
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Loading...' : 'Upload'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
