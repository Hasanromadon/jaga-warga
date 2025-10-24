"use client";

import React from "react";
import { Button } from "./ui/button";
import { LogOut, User } from "lucide-react";
import { useAuthContext } from "@/context/AuthProvider";

export default function ProfileCard() {
  const { user, role, signOut } = useAuthContext();

  const handleSignOut = async () => {
    // keep sign out client-side
    await signOut();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 bg-white/80 backdrop-blur rounded-lg p-4 shadow-sm">
        <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-base font-medium text-blue-900">
            {user?.displayName || user?.email?.split("@")[0] || "Admin"}
          </p>
          <p className="text-sm text-blue-600 capitalize">{role}</p>
        </div>
      </div>
      <Button
        onClick={handleSignOut}
        variant="outline"
        className="w-full text-red-600 border-red-200 hover:bg-red-50"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Keluar
      </Button>
    </div>
  );
}
