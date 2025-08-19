import React from 'react';
import { CheckCircle, Clock, Calendar, Zap } from 'lucide-react';

export interface KPIProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
  tooltip?: string;
}

export function KPI({ icon, label, value, color, tooltip }: KPIProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 relative group`}>
      <div className="flex items-center">
        <span className={`h-8 w-8 mr-2 flex items-center justify-center rounded-full`} style={{ background: color }}>
          {icon}
        </span>
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
      {tooltip && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs rounded px-2 py-1 z-10">
          {tooltip}
        </div>
      )}
    </div>
  );
}
