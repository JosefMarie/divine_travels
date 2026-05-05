"use client";

import React from "react";

interface GeometricAvatarProps {
  name: string;
  size?: number;
}

export const GeometricAvatar = ({ name, size = 32 }: GeometricAvatarProps) => {
  // Simple hash function to generate a number from string
  const getHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const hash = getHash(name || "ANONYMOUS");
  
  // Deterministic values based on hash
  const hue = hash % 360;
  const rotation = hash % 360;
  const shapeType = hash % 3; // 0: Square, 1: Circle, 2: Triangle

  const colors = {
    primary: `hsl(${hue}, 70%, 40%)`,
    secondary: `hsl(${(hue + 40) % 360}, 60%, 60%)`,
    accent: `hsl(${(hue + 180) % 360}, 80%, 50%)`,
    tertiary: `hsl(${(hue + 220) % 360}, 70%, 45%)`
  };

  return (
    <div 
      className="relative flex items-center justify-center overflow-hidden bg-primary/5 border border-primary/10"
      style={{ width: size, height: size, borderRadius: shapeType === 1 ? '50%' : '4px' }}
    >
      <div 
        className="absolute inset-0 opacity-20"
        style={{ 
          backgroundColor: colors.primary,
          clipPath: shapeType === 2 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
        }}
      />
      
      {/* Central Geometric Reticle */}
      <svg 
        width={size * 0.6} 
        height={size * 0.6} 
        viewBox="0 0 100 100" 
        className="relative z-10 transition-transform duration-1000"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <rect x="10" y="10" width="80" height="80" fill="none" stroke={colors.primary} strokeWidth="4" opacity="0.5" />
        <circle cx="50" cy="50" r="30" fill="none" stroke={colors.secondary} strokeWidth="2" strokeDasharray="10 5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke={colors.accent} strokeWidth="1" opacity="0.3" />
        <line x1="50" y1="0" x2="50" y2="100" stroke={colors.accent} strokeWidth="1" opacity="0.3" />
        <rect x="45" y="45" width="10" height="10" fill={colors.tertiary || colors.primary} />
      </svg>

      {/* Scanning effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-1/2 w-full animate-scanline opacity-20" />
    </div>
  );
};
