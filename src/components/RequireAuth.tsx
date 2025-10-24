"use client";

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useAuth } from "@/hooks/useAuth";

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function RequireAuth({
  children,
  allowedRoles,
}: RequireAuthProps) {
  const { user, role, loading, initialized } = useAuth();
  const location = useLocation();

  if (!initialized || loading) {
    return <LoadingOverlay show={true} message="Memuat Data..." />;
  }

  if (!user) {
    // Redirect to login and keep the current location in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    // If role not allowed, redirect to dashboard (safe fallback)
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
