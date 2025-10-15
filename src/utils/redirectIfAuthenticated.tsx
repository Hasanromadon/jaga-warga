import { useAuthContext } from "../context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Loading component for auth state checks
function AuthLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat...</p>
      </div>
    </div>
  );
}

export function withRedirectIfAuthenticated<P>(
  Component: React.ComponentType<P>
) {
  return function RedirectIfAuthenticatedComponent(props: P) {
    const { user, loading, initialized } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
      // Only redirect after auth is initialized
      if (initialized && !loading && user) {
        router.replace("/dashboard");
      }
    }, [user, loading, initialized, router]);

    // Show loading while auth is being initialized
    if (!initialized || loading) {
      return <AuthLoadingSpinner />;
    }

    // If user is authenticated, show loading (while redirect is happening)
    if (user) {
      return <AuthLoadingSpinner />;
    }

    // @ts-expect-error: props spreading for HOC
    return <Component {...props} />;
  };
}
