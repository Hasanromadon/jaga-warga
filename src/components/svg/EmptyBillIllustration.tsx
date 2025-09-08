import * as React from "react";

export function EmptyBillIllustration(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="12" y="30" width="96" height="60" rx="12" fill="#F1F5FF"/>
      <rect x="24" y="44" width="72" height="8" rx="4" fill="#D1E0FF"/>
      <rect x="24" y="60" width="40" height="8" rx="4" fill="#D1E0FF"/>
      <rect x="24" y="76" width="24" height="8" rx="4" fill="#D1E0FF"/>
      <circle cx="90" cy="80" r="10" fill="#E0EDFF"/>
      <path d="M90 74v6l4 4" stroke="#7BA7E7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <ellipse cx="60" cy="105" rx="32" ry="5" fill="#EAF2FF"/>
      <rect x="40" y="20" width="40" height="8" rx="4" fill="#E0EDFF"/>
      <rect x="52" y="10" width="16" height="8" rx="4" fill="#E0EDFF"/>
    </svg>
  );
}
