import { useAuthContext } from '../context/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function withProtectedRoute<P>(Component: React.ComponentType<P>, allowedRoles?: string[]) {
  return function ProtectedComponent(props: P) {
    const { user, role, loading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.replace('/login');
        } else if (allowedRoles && !allowedRoles.includes(role || '')) {
          router.replace('/dashboard');
        }
      }
    }, [user, role, loading, router]);

    if (loading || !user || (allowedRoles && !allowedRoles.includes(role || ''))) {
      return null;
    }
    // @ts-expect-error: props spreading for HOC
    return <Component {...props} />;
  };
}
