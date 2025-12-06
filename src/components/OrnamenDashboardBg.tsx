// src/components/OrnamenDashboardBg.tsx
'use client';

export function OrnamenDashboardBg() {
  return (
    <>
      {/* Ornamen bulat dan rumah kiri atas */}
      <svg
        className="pointer-events-none absolute -top-4 -left-4 w-60 h-60 opacity-50 blur-lg"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="100" fill="#3b82f6" fillOpacity="0.15" />
        <circle cx="60" cy="60" r="40" fill="#60a5fa" fillOpacity="0.18" />
        {/* Rumah */}
        <rect
          x="40"
          y="120"
          width="40"
          height="28"
          rx="6"
          fill="#2563eb"
          fillOpacity="0.18"
        />
        <polygon
          points="40,120 60,100 80,120"
          fill="#2563eb"
          fillOpacity="0.22"
        />
        {/* Pohon */}
        <rect
          x="32"
          y="135"
          width="6"
          height="18"
          rx="2"
          fill="#22c55e"
          fillOpacity="0.18"
        />
        <circle cx="35" cy="132" r="7" fill="#22c55e" fillOpacity="0.22" />
      </svg>
      {/* Ornamen ellipse dan komunitas kanan bawah */}
      <svg
        className="pointer-events-none absolute -bottom-8 right-0 w-72 h-72 opacity-40 blur-lg"
        viewBox="0 0 300 300"
        fill="none"
      >
        <ellipse
          cx="200"
          cy="200"
          rx="100"
          ry="80"
          fill="#2563eb"
          fillOpacity="0.13"
        />
        <ellipse
          cx="220"
          cy="220"
          rx="60"
          ry="40"
          fill="#1e40af"
          fillOpacity="0.10"
        />
        {/* Komunitas/orang */}
        <circle cx="250" cy="250" r="18" fill="#60a5fa" fillOpacity="0.18" />
        <circle cx="250" cy="245" r="7" fill="#2563eb" fillOpacity="0.22" />
        <ellipse
          cx="235"
          cy="260"
          rx="7"
          ry="7"
          fill="#60a5fa"
          fillOpacity="0.18"
        />
        <ellipse
          cx="265"
          cy="260"
          rx="7"
          ry="7"
          fill="#60a5fa"
          fillOpacity="0.18"
        />
      </svg>
    </>
  );
}
