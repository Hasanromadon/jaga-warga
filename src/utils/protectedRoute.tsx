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

export function withProtectedRoute<P>(
  Component: React.ComponentType<P>,
  allowedRoles?: string[]
) {
  return function ProtectedComponent(props: P) {
    const { user, role, loading, initialized } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
      // Only redirect after auth is initialized to prevent false redirects
      if (initialized && !loading) {
        if (!user) {
          router.replace("/login");
        } else if (allowedRoles && role && !allowedRoles.includes(role)) {
          router.replace("/dashboard");
        }
      }
    }, [user, role, loading, initialized, router]);

    // Show loading while auth is being initialized or is loading
    if (!initialized || loading) {
      return <AuthLoadingSpinner />;
    }

    // Show loading if user is not authenticated (while redirect is happening)
    if (!user) {
      return <AuthLoadingSpinner />;
    }

    // Show loading if role is required but not available or not allowed
    if (allowedRoles && (!role || !allowedRoles.includes(role))) {
      return <AuthLoadingSpinner />;
    }

    // @ts-expect-error: props spreading for HOC
    return <Component {...props} />;
  };
}
