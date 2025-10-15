import * as React from "react";

export function UserFoundIllustration(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="180"
      height="180"
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Floating animation */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,8; 0,0"
          keyTimes="0;0.5;1"
          dur="2s"
          repeatCount="indefinite"
        />

        {/* Shadow under figure */}
        <ellipse
          cx="90"
          cy="140"
          rx="38"
          ry="7"
          fill="#B6D0F7"
          fillOpacity="0.55"
        >
          <animate
            attributeName="opacity"
            values="0.55;0.85;0.55"
            dur="2s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Circle background (profile silhouette) */}
        <circle
          cx="90"
          cy="80"
          r="38"
          fill="#F1F5FF"
          stroke="#7BA7E7"
          strokeWidth="2"
        />

        {/* Head */}
        <circle cx="90" cy="68" r="12" fill="#D1E0FF" />

        {/* Body */}
        <path
          d="M64 106c2-10 12-18 26-18h0c14 0 24 8 26 18v6H64v-6z"
          fill="#D1E0FF"
        />

        {/* Checkmark icon to indicate "user found" */}
        <g>
          <circle
            cx="120"
            cy="60"
            r="10"
            fill="#D4EDDA"
            stroke="#28A745"
            strokeWidth="1.5"
          />
          <path
            d="M116 60l3 3 5-6"
            stroke="#28A745"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.1;1"
            dur="2s"
            repeatCount="indefinite"
            additive="sum"
          />
        </g>
      </g>

      {/* Floating info bar */}
      <rect x="60" y="24" width="60" height="10" rx="5" fill="#E0EDFF" />
      <rect x="72" y="12" width="36" height="8" rx="4" fill="#E0EDFF" />
    </svg>
  );
}
