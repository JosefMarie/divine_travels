import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TechnicalOverlay = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 pointer-events-none technical-grid opacity-20", className)}>
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-primary/10"></div>
      <div className="absolute top-0 left-2/4 w-[1px] h-full bg-primary/20"></div>
      <div className="absolute top-0 left-3/4 w-[1px] h-full bg-primary/10"></div>
      <div className="absolute top-1/3 left-0 w-full h-[1px] bg-primary/10"></div>
      <div className="absolute top-2/3 left-0 w-full h-[1px] bg-primary/20"></div>
    </div>
  );
};

export const Scanline = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scanline opacity-0 group-hover:opacity-100 transition-opacity duration-300", className)} />
  );
};
