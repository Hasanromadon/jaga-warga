'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import LoadingOverlay from '@/components/LoadingOverlay';
import { useAuth } from '@/hooks/useAuth';

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function RequireAuth({
  children,
  allowedRoles,
}: RequireAuthProps) {
  const { user, role, loading, initialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (!initialized || loading) {
    return <LoadingOverlay show={true} message="Memuat Data..." />;
  }

  if (!user) {
    // Redirect to login and keep the current path as query param
    router.replace(`/login?from=${encodeURIComponent(pathname || '/')}`);
    return null;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    // If role not allowed, redirect to dashboard (safe fallback)
    router.replace('/dashboard');
    return null;
  }

  return <>{children}</>;
}
