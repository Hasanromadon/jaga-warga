import * as React from 'react';

export function UserNotFoundIllustration(props: React.SVGProps<SVGSVGElement>) {
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
          fill="#F8D7DA"
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
          fill="#F8D7DA"
          stroke="#E35D6A"
          strokeWidth="2"
        />

        {/* Head */}
        <circle cx="90" cy="68" r="12" fill="#E35D6A" />

        {/* Body */}
        <path
          d="M64 106c2-10 12-18 26-18h0c14 0 24 8 26 18v6H64v-6z"
          fill="#E35D6A"
        />

        {/* Cross (X) icon to indicate "not found" */}
        <g>
          <circle
            cx="120"
            cy="60"
            r="10"
            fill="#F8D7DA"
            stroke="#E35D6A"
            strokeWidth="1.5"
          />
          <path
            d="M116 56l8 8M124 56l-8 8"
            stroke="#E35D6A"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 120 60; 10 120 60; 0 120 60"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </g>
      </g>

      {/* Floating info bar */}
      <rect x="60" y="24" width="60" height="10" rx="5" fill="#F8D7DA" />
      <rect x="72" y="12" width="36" height="8" rx="4" fill="#F8D7DA" />
    </svg>
  );
}
