"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Command, ArrowRight } from "lucide-react";
import { getPosts } from "@/lib/db/posts";
import { Post } from "@/types";
import Link from "next/link";

interface SearchScanProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchScan = ({ isOpen, onClose }: SearchScanProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setQuery("");
    setResults([]);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setIsScanning(true);
      
      // Simulate technical scan delay
      await new Promise(r => setTimeout(r, 600));
      
      const allPosts = await getPosts();
      const filtered = allPosts.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(filtered);
      setIsScanning(false);
    };

    const timer = setTimeout(handleSearch, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[#F4F1EA]/90 backdrop-blur-3xl"
            onClick={handleClose}
          />

          {/* Search Container */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-3xl glass-panel border border-primary/10 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.1)]"
          >
            {/* Search Header */}
            <div className="p-8 border-b border-primary/5 bg-primary/[0.02] relative overflow-hidden">
              <div className="flex items-center gap-6 relative z-10">
                <Search className={`text-tertiary transition-transform duration-500 ${isScanning ? 'scale-125 animate-pulse' : ''}`} size={24} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="SCAN ARCHIVE..."
                  className="w-full bg-transparent border-none outline-none font-brand text-3xl md:text-4xl text-primary placeholder:text-primary/10 uppercase tracking-tight"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={handleClose} className="p-2 text-primary/20 hover:text-tertiary transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              {/* Scanline Status */}
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${isScanning ? 'bg-tertiary animate-pulse' : 'bg-primary/20'}`} />
                  <span className="font-technical text-[8px] uppercase tracking-widest text-primary/40 font-bold">
                    {isScanning ? "Data_Streaming..." : "Interface_Ready"}
                  </span>
                </div>
                <div className="h-[1px] flex-1 bg-primary/5" />
                <span className="font-technical text-[8px] uppercase tracking-widest text-primary/40 font-bold">
                  {results.length} Matches Found
                </span>
              </div>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-4">
              <AnimatePresence mode="popLayout">
                {results.length > 0 ? (
                  results.map((post, idx) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link 
                        href={`/blog/${post.id}`}
                        onClick={handleClose}
                        className="flex items-center justify-between p-6 hover:bg-primary/[0.03] transition-colors group"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3">
                            <span className="font-technical text-[7px] text-tertiary uppercase font-bold tracking-widest px-2 py-0.5 border border-tertiary/20">
                              {post.category}
                            </span>
                            <span className="font-technical text-[7px] text-primary/30 uppercase font-bold tracking-[0.2em]">
                              {post.id.substring(0, 8)}
                            </span>
                          </div>
                          <h4 className="font-heading text-xl text-primary group-hover:text-tertiary transition-colors">
                            {post.title}
                          </h4>
                        </div>
                        <ArrowRight size={18} className="text-primary/10 group-hover:text-tertiary transition-all group-hover:translate-x-2" />
                      </Link>
                    </motion.div>
                  ))
                ) : query && !isScanning ? (
                  <div className="p-12 text-center flex flex-col items-center gap-4">
                    <Command size={40} className="text-primary/5" />
                    <span className="font-technical text-[10px] text-primary/30 uppercase tracking-[0.3em] font-bold">
                      No Records Matching Encryption String
                    </span>
                  </div>
                ) : !query && (
                  <div className="p-12 text-center opacity-20">
                    <span className="font-technical text-[10px] uppercase tracking-[0.5em] font-bold">
                      Enter Search Parameters_
                    </span>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 bg-primary/[0.01] border-t border-primary/5 flex justify-between items-center px-8">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="bg-primary/5 text-[8px] font-technical px-1.5 py-0.5 rounded text-primary/40 uppercase">ESC</span>
                  <span className="text-[8px] font-technical text-primary/20 uppercase font-bold tracking-widest">To Close</span>
                </div>
              </div>
              <span className="font-technical text-[8px] text-primary/10 uppercase font-bold tracking-widest">
                Global_Scan_v4.2.1
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
