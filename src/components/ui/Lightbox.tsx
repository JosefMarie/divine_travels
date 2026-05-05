"use client";
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import Image from 'next/image';

interface LightboxProps {
  src: string | null;
  alt: string;
  onClose: () => void;
}

export const Lightbox = ({ src, alt, onClose }: LightboxProps) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isScanning, setIsScanning] = useState(true);

  // Prevent body scrolling when open
  useEffect(() => {
    if (src) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => setIsScanning(false), 2000);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
    }
  }, [src]);

  // Handle scanning state when src changes
  useEffect(() => {
    if (src) {
      const timer = setTimeout(() => setIsScanning(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [src]);

  const handleClose = useCallback(() => {
    setIsZoomed(false);
    setIsScanning(false);
    onClose();
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F4F1EA]/95 backdrop-blur-2xl overflow-hidden"
          onClick={onClose}
        >
          {/* Technical Metadata HUD */}
          <div className="absolute top-12 left-12 z-50 pointer-events-none hidden md:block">
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="font-technical text-[8px] text-tertiary uppercase font-bold tracking-[0.3em]">Asset_ID</span>
                <span className="font-technical text-[10px] text-primary font-bold uppercase">{alt.replace(/\s+/g, '_').toUpperCase()}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-technical text-[8px] text-primary/30 uppercase font-bold tracking-[0.3em]">Resolution</span>
                <span className="font-technical text-[10px] text-primary/60 font-bold uppercase">6000 x 4000_RAW</span>
              </div>
              <div className="flex flex-col">
                <span className="font-technical text-[8px] text-primary/30 uppercase font-bold tracking-[0.3em]">Sensor</span>
                <span className="font-technical text-[10px] text-primary/60 font-bold uppercase">Full Frame / 24.2MP</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-12 right-12 z-50 pointer-events-none hidden md:block">
            <div className="text-right space-y-4">
              <div className="flex flex-col items-end">
                <span className="font-technical text-[8px] text-tertiary uppercase font-bold tracking-[0.3em]">Shutter</span>
                <span className="font-technical text-[10px] text-primary font-bold uppercase">1/250 SEC</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-technical text-[8px] text-primary/30 uppercase font-bold tracking-[0.3em]">ISO</span>
                <span className="font-technical text-[10px] text-primary/60 font-bold uppercase">400_NOMINAL</span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-8 right-8 z-50 p-4 text-primary/50 hover:text-tertiary transition-colors bg-primary/5 hover:bg-primary/10 rounded-full"
          >
            <X size={24} />
          </button>

          {/* Technical UI Hints */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 text-primary/40 pointer-events-none z-50">
            {isZoomed ? <ZoomOut size={14} className="animate-pulse" /> : <ZoomIn size={14} className="animate-pulse" />}
            <span className="font-technical text-[10px] uppercase tracking-[0.3em] font-bold">
              {isZoomed ? "High-Fidelity Pan Active" : "High-Fidelity Rendering Active"}
            </span>
          </div>

          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-tertiary opacity-50 m-8 z-50" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-tertiary opacity-50 m-8 z-50" />

          {/* Image Container */}
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: isZoomed ? 2.5 : 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            drag={isZoomed}
            dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
            dragElastic={0.1}
            className={`relative w-[90vw] h-[85vh] max-w-7xl max-h-[1000px] ${isZoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }} 
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain drop-shadow-2xl pointer-events-none"
              sizes="100vw"
              priority
              draggable={false}
            />
            
            {/* Scanning Line Overlay */}
            <AnimatePresence>
              {isScanning && (
                <motion.div 
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2, ease: "linear" }}
                  className="absolute left-0 right-0 h-[2px] bg-tertiary/50 shadow-[0_0_20px_rgba(var(--tertiary),0.5)] z-20 pointer-events-none"
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
