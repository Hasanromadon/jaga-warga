"use client";
import { useAuthContext } from "../context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthRedirectProps {
  children: React.ReactNode;
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
  allowedRoles?: string[];
}

export function AuthRedirect({
  children,
  redirectTo = "/dashboard",
  redirectIfAuthenticated = false,
  allowedRoles,
}: AuthRedirectProps) {
  const { user, role, loading, initialized } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !loading) {
      if (redirectIfAuthenticated && user) {
        router.replace(redirectTo);
      } else if (!redirectIfAuthenticated && !user) {
        router.replace("/login");
      } else if (allowedRoles && role && !allowedRoles.includes(role)) {
        router.replace("/dashboard");
      }
    }
  }, [
    user,
    role,
    loading,
    initialized,
    router,
    redirectTo,
    redirectIfAuthenticated,
    allowedRoles,
  ]);

  // Show loading while auth is being initialized
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Prevent rendering if conditions are not met
  if (redirectIfAuthenticated && user) return null;
  if (!redirectIfAuthenticated && !user) return null;
  if (allowedRoles && role && !allowedRoles.includes(role)) return null;

  return <>{children}</>;
}
