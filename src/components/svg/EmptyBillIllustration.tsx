import * as React from 'react';

export function EmptyBillIllustration(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="180"
      height="180"
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Animated floating document with shadow */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,10; 0,0"
          keyTimes="0;0.5;1"
          dur="2.2s"
          repeatCount="indefinite"
        />
        {/* Shadow under document */}
        <ellipse
          cx="90"
          cy="126"
          rx="38"
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
        <rect
          x="36"
          y="50"
          width="108"
          height="68"
          rx="16"
          fill="#F1F5FF"
          stroke="#7BA7E7"
          strokeWidth="2"
        />
        <rect x="56" y="68" width="60" height="8" rx="4" fill="#D1E0FF" />
        <rect x="56" y="84" width="32" height="7" rx="3.5" fill="#D1E0FF" />
        <rect x="56" y="98" width="18" height="6" rx="3" fill="#D1E0FF" />
      </g>
      {/* Animated empty folder (relevant to empty data) */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,6; 0,0"
          keyTimes="0;0.5;1"
          dur="1.8s"
          repeatCount="indefinite"
        />
        {/* Folder back */}
        <rect x="120" y="62" width="32" height="18" rx="4" fill="#E0EDFF" />
        {/* Folder tab */}
        <rect x="126" y="56" width="12" height="8" rx="2" fill="#7BA7E7" />
        {/* Folder front */}
        <rect
          x="120"
          y="70"
          width="32"
          height="14"
          rx="3"
          fill="#B6D0F7"
          stroke="#3973C4"
          strokeWidth="1.5"
        />
        {/* Minus icon */}
        <rect x="134" y="77" width="8" height="2" rx="1" fill="#3973C4" />
      </g>
      {/* Animated pulsing shadow */}
      <ellipse cx="90" cy="150" rx="48" ry="8" fill="#EAF2FF">
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
      {/* Floating header bar */}
      <rect x="60" y="32" width="60" height="12" rx="6" fill="#E0EDFF" />
      {/* Floating small bar */}
      <rect x="76" y="18" width="28" height="10" rx="5" fill="#E0EDFF" />
    </svg>
  );
}
