"use client";
import { useForm } from 'react-hook-form';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useState } from 'react';

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Terjadi error');
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
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Terjadi error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-sm mx-auto mt-10">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input type="email" placeholder="Email" {...register('email', { required: true })} />
          {errors.email && <span className="text-red-500 text-xs">Email wajib diisi</span>}
          <Input type="password" placeholder="Password" {...register('password', { required: true })} />
          {errors.password && <span className="text-red-500 text-xs">Password wajib diisi</span>}
          {error && <div className="text-red-500 text-xs">{error}</div>}
          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Loading...' : 'Login'}</Button>
        </form>
        <Button onClick={handleGoogle} variant="outline" className="w-full mt-2" disabled={loading}>
          Login dengan Google
        </Button>
      </CardContent>
    </Card>
  );
}
