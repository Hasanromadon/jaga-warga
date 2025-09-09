"use client";
import { useForm } from 'react-hook-form';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Mail, Lock } from "lucide-react";
import { mapFirebaseError } from "../utils/firebaseError";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: LoginFormInputs) => {

    console.log(data);
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/dashboard");
    } catch (err) {
      setError(mapFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label htmlFor="email" className="text-xs font-semibold text-blue-900 flex items-center gap-1 mb-1"><Mail className="w-4 h-4" />Email</label>
            <Input id="email" type="email" placeholder="Email" {...register('email', { required: true })} autoComplete="username" className="text-sm" />
            {errors.email && <span className="text-red-500 text-xs">Email wajib diisi</span>}
          </div>
          <div>
            <label htmlFor="password" className="text-xs font-semibold text-blue-900 flex items-center gap-1 mb-1"><Lock className="w-4 h-4" />Kata Sandi</label>
            <Input id="password" type="password" placeholder="Kata Sandi" {...register('password', { required: true })} autoComplete="current-password" className="text-sm" />
            {errors.password && <span className="text-red-500 text-xs">Kata sandi wajib diisi</span>}
          </div>
          <Button type="submit" disabled={loading} className="w-full text-base">{loading ? 'Memproses...' : 'Masuk'}</Button>
        </form>
        <Button onClick={handleGoogle} variant="outline" className="w-full mt-2 text-base flex items-center justify-center gap-2" disabled={loading}>
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_17_40)"><path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.704H24.48v9.12h13.008c-.56 2.96-2.24 5.456-4.768 7.144v5.92h7.712c4.52-4.16 7.1-10.288 7.1-17.48z" fill="#4285F4"/><path d="M24.48 48c6.48 0 11.92-2.144 15.888-5.824l-7.712-5.92c-2.144 1.44-4.88 2.288-8.176 2.288-6.288 0-11.616-4.256-13.528-9.968H2.56v6.176C6.512 43.36 14.624 48 24.48 48z" fill="#34A853"/><path d="M10.952 28.576A14.98 14.98 0 0 1 9.36 24c0-1.584.272-3.12.76-4.576v-6.176H2.56A23.98 23.98 0 0 0 0 24c0 3.872.92 7.52 2.56 10.752l8.392-6.176z" fill="#FBBC05"/><path d="M24.48 9.6c3.528 0 6.656 1.216 9.136 3.584l6.832-6.832C36.392 2.144 30.96 0 24.48 0 14.624 0 6.512 4.64 2.56 13.424l8.392 6.176c1.912-5.712 7.24-9.968 13.528-9.968z" fill="#EA4335"/></g><defs><clipPath id="clip0_17_40"><rect width="48" height="48" fill="#fff"/></clipPath></defs></svg>
          Masuk dengan Google
        </Button>
      </CardContent>
    </Card>
  );
}
