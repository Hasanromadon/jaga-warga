import * as React from "react";

export function ResidentialLoadingIllustration(
  props: React.SVGProps<SVGSVGElement>
) {
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

        {/* Shadow under building */}
        <ellipse
          cx="90"
          cy="145"
          rx="45"
          ry="8"
          fill="#BFDBFE"
          fillOpacity="0.55"
        >
          <animate
            attributeName="opacity"
            values="0.55;0.85;0.55"
            dur="2s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Building/House icon representing residential */}
        <g>
          {/* Building base */}
          <rect
            x="60"
            y="75"
            width="60"
            height="50"
            rx="4"
            fill="#DBEAFE"
            stroke="#3B82F6"
            strokeWidth="2"
          />

          {/* Roof */}
          <path
            d="M55 75 L90 50 L125 75 L120 75 L90 55 L60 75 Z"
            fill="#3B82F6"
          />

          {/* Windows - top row */}
          <rect x="70" y="85" width="12" height="12" rx="2" fill="#93C5FD" />
          <rect x="98" y="85" width="12" height="12" rx="2" fill="#93C5FD" />

          {/* Windows - bottom row */}
          <rect x="70" y="105" width="12" height="12" rx="2" fill="#93C5FD" />
          <rect x="98" y="105" width="12" height="12" rx="2" fill="#93C5FD" />

          {/* Door */}
          <rect x="84" y="102" width="12" height="23" rx="2" fill="#60A5FA" />
          <circle cx="93" cy="114" r="1.5" fill="#DBEAFE" />
        </g>

        {/* Animated loading spinner circle */}
        <g>
          <circle
            cx="90"
            cy="35"
            r="12"
            fill="none"
            stroke="#BFDBFE"
            strokeWidth="3"
          />
          <circle
            cx="90"
            cy="35"
            r="12"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeDasharray="18 57"
            strokeLinecap="round"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 90 35"
              to="360 90 35"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </g>

      {/* Floating decorative elements */}
      <circle cx="130" cy="60" r="4" fill="#BFDBFE">
        <animate
          attributeName="cy"
          values="60;54;60"
          dur="1.8s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="50" cy="70" r="3" fill="#BFDBFE">
        <animate
          attributeName="cy"
          values="70;65;70"
          dur="2.2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="135" cy="95" r="3.5" fill="#BFDBFE">
        <animate
          attributeName="cy"
          values="95;90;95"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
