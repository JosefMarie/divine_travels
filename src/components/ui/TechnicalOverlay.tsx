import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TechnicalOverlay = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {/* Pulsing Grid Base */}
      <motion.div 
        animate={{ 
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute inset-0 technical-grid"
      />
      
      {/* Viewport HUD Brackets */}
      <div className="fixed inset-4 md:inset-8 pointer-events-none z-50">
        <div className="absolute top-0 left-0 w-3 h-3 md:w-4 md:h-4 border-t border-l border-tertiary/30" />
        <div className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 border-t border-r border-tertiary/30" />
        <div className="absolute bottom-0 left-0 w-3 h-3 md:w-4 md:h-4 border-b border-l border-tertiary/30" />
        <div className="absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 border-b border-r border-tertiary/30" />
        
        {/* Decorative HUD Elements - Hidden on small screens */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[1px] h-8 bg-primary/10 hidden md:block" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[1px] h-8 bg-primary/10 hidden md:block" />
      </div>
    </div>
  );
};

export const Scanline = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scanline opacity-0 group-hover:opacity-100 transition-opacity duration-300", className)} />
  );
};
