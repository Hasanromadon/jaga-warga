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

  React.useEffect(() => {
    if (!initialized || loading) return;

    if (!user) {
      router.replace(`/login?from=${encodeURIComponent(pathname || '/')}`);
    } else if (allowedRoles && (!role || !allowedRoles.includes(role))) {
      router.replace('/dashboard');
    }
  }, [user, role, loading, initialized, router, pathname, allowedRoles]);

  if (!initialized || loading) {
    return <LoadingOverlay show={true} message="Memuat Data..." />;
  }

  if (!user) {
    return null;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return null;
  }

  return <>{children}</>;
}
