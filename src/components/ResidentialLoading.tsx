import React from "react";
import { ResidentialLoadingIllustration } from "./svg/ResidentialLoadingIllustration";

export default function ResidentialLoading({
  message = "Memuat data perumahan...",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <ResidentialLoadingIllustration className="h-40 w-auto mb-4" />
      <div className="text-sm font-medium text-blue-700 animate-pulse">
        {message}
      </div>
    </div>
  );
}
