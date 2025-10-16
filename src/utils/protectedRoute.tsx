import LoadingOverlay from "@/components/LoadingOverlay";
import { useAuthContext } from "../context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
      return (
        <LoadingOverlay
          show={!initialized || loading}
          message="Memuat Data..."
        />
      );
    }

    // Show loading if user is not authenticated (while redirect is happening)
    if (!user) {
      return <LoadingOverlay show={true} message="Memuat Data..." />;
    }

    // Show loading if role is required but not available or not allowed
    if (allowedRoles && (!role || !allowedRoles.includes(role))) {
      return <LoadingOverlay show={true} message="Memuat Data..." />;
    }

    // @ts-expect-error: props spreading for HOC
    return <Component {...props} />;
  };
}
