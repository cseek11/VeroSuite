import React from 'react';

interface BugIconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const BugIcon: React.FC<BugIconProps> = ({ 
  className = "", 
  size = 40, 
  color = "currentColor" 
}) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        {/* Gradient definitions for a polished look */}
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="1" />
          <stop offset="50%" stopColor="#22c55e" stopOpacity="1" />
          <stop offset="100%" stopColor="#16a34a" stopOpacity="1" />
        </linearGradient>
        
        <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="1" />
          <stop offset="100%" stopColor="#15803d" stopOpacity="1" />
        </linearGradient>
        
        <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="1" />
          <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
          <stop offset="100%" stopColor="#059669" stopOpacity="1" />
        </linearGradient>
        
        <linearGradient id="legGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#16a34a" stopOpacity="1" />
          <stop offset="100%" stopColor="#14532d" stopOpacity="1" />
        </linearGradient>

        {/* Drop shadow filter */}
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#00000020"/>
        </filter>
      </defs>
      
      {/* Main beetle body */}
      <g filter="url(#dropShadow)">
        {/* Head */}
        <ellipse cx="100" cy="65" rx="25" ry="20" fill="url(#headGradient)"/>
        
        {/* Antennae */}
        <path d="M85 50 Q80 40 75 35" stroke="url(#legGradient)" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <path d="M115 50 Q120 40 125 35" stroke="url(#legGradient)" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <circle cx="75" cy="35" r="3" fill="url(#headGradient)"/>
        <circle cx="125" cy="35" r="3" fill="url(#headGradient)"/>
        
        {/* Main body (thorax and abdomen) */}
        <ellipse cx="100" cy="115" rx="35" ry="55" fill="url(#bodyGradient)"/>
        
        {/* Wing covers (elytra) */}
        <ellipse cx="85" cy="105" rx="18" ry="40" fill="url(#wingGradient)"/>
        <ellipse cx="115" cy="105" rx="18" ry="40" fill="url(#wingGradient)"/>
        
        {/* Wing separation line */}
        <line x1="100" y1="75" x2="100" y2="145" stroke="#ffffff40" strokeWidth="2"/>
        
        {/* Legs */}
        {/* Front legs */}
        <path d="M75 85 Q60 90 50 95 Q45 100 55 105" stroke="url(#legGradient)" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path d="M125 85 Q140 90 150 95 Q155 100 145 105" stroke="url(#legGradient)" strokeWidth="5" strokeLinecap="round" fill="none"/>
        
        {/* Middle legs */}
        <path d="M70 115 Q50 120 40 130 Q35 135 45 140" stroke="url(#legGradient)" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path d="M130 115 Q150 120 160 130 Q165 135 155 140" stroke="url(#legGradient)" strokeWidth="5" strokeLinecap="round" fill="none"/>
        
        {/* Back legs */}
        <path d="M80 145 Q65 155 55 165 Q50 170 60 175" stroke="url(#legGradient)" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path d="M120 145 Q135 155 145 165 Q150 170 140 175" stroke="url(#legGradient)" strokeWidth="5" strokeLinecap="round" fill="none"/>
        
        {/* Subtle highlights for extra polish */}
        <ellipse cx="90" cy="90" rx="8" ry="15" fill="#ffffff20"/>
        <ellipse cx="110" cy="90" rx="8" ry="15" fill="#ffffff20"/>
        <ellipse cx="95" cy="55" rx="6" ry="8" fill="#ffffff30"/>
      </g>
    </svg>
  );
};
