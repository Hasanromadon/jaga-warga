'use client';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Mail, Lock } from 'lucide-react';
import { mapFirebaseError } from '../utils/firebaseError';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: LoginFormInputs) => {
    console.log(data);
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push('/dashboard');
    } catch (err) {
      setError(mapFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-sm w-full mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-blue-900">Login Admin</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-500 text-xs mb-2 text-center font-medium">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="text-xs font-semibold text-blue-900 flex items-center gap-1 mb-1"
            >
              <Mail className="w-4 h-4" />
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              {...register('email', { required: true })}
              autoComplete="username"
              className="text-sm"
            />
            {errors.email && (
              <span className="text-red-500 text-xs">Email wajib diisi</span>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-xs font-semibold text-blue-900 flex items-center gap-1 mb-1"
            >
              <Lock className="w-4 h-4" />
              Kata Sandi
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Kata Sandi"
              {...register('password', { required: true })}
              autoComplete="current-password"
              className="text-sm"
            />
            {errors.password && (
              <span className="text-red-500 text-xs">
                Kata sandi wajib diisi
              </span>
            )}
          </div>
          <Button type="submit" disabled={loading} className="w-full text-base">
            {loading ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
