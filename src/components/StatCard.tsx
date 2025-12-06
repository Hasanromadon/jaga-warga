import React from 'react';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color: { bg: string; text: string };
}> = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg py-3 flex justify-between items-center gap-1">
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${color.bg}`}
    >
      {icon}
    </div>
    <div className="min-w-0 items-center flex-1">
      <p className="text-xs text-slate-500 truncate">{title}</p>
      <p className="text-sm font-bold text-slate-800 break-words">{value}</p>
    </div>
  </div>
);

export default StatCard;
