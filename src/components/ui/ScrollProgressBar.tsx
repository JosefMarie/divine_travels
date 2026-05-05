"use client";

import { motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const [percent, setPercent] = useState(0);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setPercent(Math.round(latest * 100));
  });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-tertiary origin-left z-[100] shadow-[0_0_20px_#B3305B]"
        style={{ scaleX }}
      />
      
      {/* Progress Readout HUD */}
      <div className="fixed top-2 md:top-4 right-4 md:right-12 z-[100] flex items-center gap-3 pointer-events-none">
        <div className="flex flex-col items-end">
          <span className="font-technical text-[6px] md:text-[7px] text-primary/30 uppercase font-bold tracking-[0.2em]">Transmission_Progress</span>
          <span className="font-technical text-[8px] md:text-[10px] text-tertiary font-bold">{percent.toString().padStart(3, '0')}%</span>
        </div>
        <div className="w-[1px] h-3 md:h-4 bg-tertiary/20" />
      </div>
    </>
  );
};
