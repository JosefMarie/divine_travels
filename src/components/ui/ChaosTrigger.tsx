"use client";

import React, { useState } from "react";
import { ZapOff } from "lucide-react";

export const ChaosTrigger = () => {
  const [shouldExplode, setShouldExplode] = useState(false);

  if (shouldExplode) {
    throw new Error("CRITICAL_SYSTEM_KERNEL_PANIC: Manual Chaos Trigger Engaged.");
  }

  return (
    <button 
      onClick={() => setShouldExplode(true)}
      className="fixed bottom-4 left-4 z-[100] p-2 bg-tertiary/10 hover:bg-tertiary/20 text-tertiary border border-tertiary/20 rounded-full transition-all group"
      title="STRESS TEST: TRIGGER MODULE FAILURE"
    >
      <ZapOff size={14} className="group-hover:scale-110 transition-transform" />
    </button>
  );
};
