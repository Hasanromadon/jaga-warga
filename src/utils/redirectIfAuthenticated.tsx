import LoadingOverlay from '@/components/LoadingOverlay';
import { useAuthContext } from '../context/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function withRedirectIfAuthenticated<P>(
  Component: React.ComponentType<P>,
) {
  return function RedirectIfAuthenticatedComponent(props: P) {
    const { user, loading, initialized } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
      // Only redirect after auth is initialized
      if (initialized && !loading && user) {
        router.replace('/dashboard');
      }
    }, [user, loading, initialized, router]);

    // Show loading while auth is being initialized
    if (!initialized || loading) {
      return (
        <LoadingOverlay
          show={!initialized || loading}
          message="Memuat Data..."
        />
      );
    }

    // If user is authenticated, show loading (while redirect is happening)
    if (user) {
      return <LoadingOverlay show={true} message="Memuat Data..." />;
    }

    // @ts-expect-error: props spreading for HOC
    return <Component {...props} />;
  };
}
