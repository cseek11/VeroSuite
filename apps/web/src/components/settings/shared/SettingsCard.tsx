import React from 'react';
import { LucideProps } from "lucide-react";

interface SettingsCardProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<Partial<LucideProps>>;
  children: React.ReactNode;
  className?: string;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  description,
  icon: Icon,
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        {Icon && (
          <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
            <Icon className="w-4 h-4 text-white" />
          </div>
        )}
        <div>
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          {description && (
            <p className="text-sm text-slate-600">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
