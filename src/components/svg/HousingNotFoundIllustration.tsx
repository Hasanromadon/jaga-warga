import * as React from "react";

export function HousingNotFoundIllustration({
  width = 180,
  height = 180,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={width}
      height={height}
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
          values="0,0; 0,6; 0,0"
          keyTimes="0;0.5;1"
          dur="2.2s"
          repeatCount="indefinite"
        />

        {/* Shadow under scene */}
        <ellipse
          cx="90"
          cy="145"
          rx="40"
          ry="7"
          fill="#B6D0F7"
          fillOpacity="0.55"
        >
          <animate
            attributeName="opacity"
            values="0.55;0.85;0.55"
            dur="2.2s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Base ground */}
        <rect x="50" y="120" width="80" height="8" rx="4" fill="#E0EDFF" />

        {/* House body */}
        <rect
          x="60"
          y="90"
          width="60"
          height="35"
          rx="4"
          fill="#F1F5FF"
          stroke="#7BA7E7"
          strokeWidth="2"
        />

        {/* Roof */}
        <path
          d="M55 92L90 66L125 92H55Z"
          fill="#B6D0F7"
          stroke="#7BA7E7"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Door */}
        <rect x="85" y="104" width="14" height="21" rx="2" fill="#D1E0FF" />

        {/* Windows */}
        <rect x="66" y="102" width="10" height="10" rx="1.5" fill="#D1E0FF" />
        <rect x="104" y="102" width="10" height="10" rx="1.5" fill="#D1E0FF" />

        {/* Cross icon to indicate 'not found' */}
        <g>
          <circle
            cx="130"
            cy="70"
            r="10"
            fill="#F8D7DA"
            stroke="#E35D6A"
            strokeWidth="1.5"
          />
          <path
            d="M126 66l8 8M134 66l-8 8"
            stroke="#E35D6A"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 130 70; 10 130 70; 0 130 70"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </g>
      </g>

      {/* Pulsing ground shadow */}
      <ellipse cx="90" cy="155" rx="48" ry="8" fill="#EAF2FF">
        <animate
          attributeName="rx"
          values="48;56;48"
          dur="2.2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.7;1;0.7"
          dur="2.2s"
          repeatCount="indefinite"
        />
      </ellipse>

      {/* Floating sky element */}
      <rect x="60" y="28" width="60" height="10" rx="5" fill="#E0EDFF" />
      <rect x="72" y="14" width="36" height="8" rx="4" fill="#E0EDFF" />
    </svg>
  );
}
