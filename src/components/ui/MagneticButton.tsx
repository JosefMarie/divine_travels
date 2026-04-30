"use client";

import React, { useState } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// We keep the name for compatibility, but the logic is now "Kinetic/Drawing"
type MagneticButtonProps = HTMLMotionProps<"button">;

export const MagneticButton = ({
  children,
  className,
  ...props
}: MagneticButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative inline-flex items-center justify-center px-6 py-3 transition-all duration-300 focus:outline-none group",
        className
      )}
      {...props}
    >
      {/* 1. Left Border (Top to Bottom) */}
      <motion.span
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isHovered ? 1 : 0 }}
        transition={{ duration: 0.15, ease: "linear", delay: isHovered ? 0 : 0.45 }}
        className="absolute top-0 left-0 w-[1px] h-full bg-tertiary origin-top"
      />
      
      {/* 2. Bottom Border (Left to Right) */}
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.15, ease: "linear", delay: isHovered ? 0.15 : 0.3 }}
        className="absolute bottom-0 left-0 w-full h-[1px] bg-tertiary origin-left"
      />
      
      {/* 3. Right Border (Bottom to Top) */}
      <motion.span
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isHovered ? 1 : 0 }}
        transition={{ duration: 0.15, ease: "linear", delay: isHovered ? 0.3 : 0.15 }}
        className="absolute bottom-0 right-0 w-[1px] h-full bg-tertiary origin-bottom"
      />
      
      {/* 4. Top Border (Right to Left) */}
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.15, ease: "linear", delay: isHovered ? 0.45 : 0 }}
        className="absolute top-0 right-0 w-full h-[1px] bg-tertiary origin-right"
      />

      {/* Content wrapper */}
      <span className="relative z-10 flex items-center gap-2">
        {children as React.ReactNode}
      </span>
    </motion.button>
  );
};
