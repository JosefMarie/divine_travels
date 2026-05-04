"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { TechnicalOverlay } from "@/components/ui/TechnicalOverlay";
const MapEngine = dynamic(() => import("@/components/map/MapEngine"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-neutral">
      <div className="font-technical text-[10px] text-primary/40 animate-pulse uppercase tracking-[0.3em]">
        Initializing Map Engine...
      </div>
    </div>
  )
});
import { ArrowRight, Grid3X3, PlaneTakeoff } from "lucide-react";
import { motion } from "framer-motion";

import { subscribeToPosts } from "@/lib/db/posts";
import { Post } from "@/types";

function parseCoords(raw?: string): { longitude: number; latitude: number } | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[°NSEW]/gi, '').trim();
  const parts = cleaned.split(',').map(s => parseFloat(s.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { latitude: parts[0], longitude: parts[1] };
  }
  return null;
}

export default function GlobalEngine() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSectorId, setActiveSectorId] = useState<string | null>(null);
  const [focusLocation, setFocusLocation] = useState<{ longitude: number; latitude: number; id: string } | null>(null);

  useEffect(() => {
    const unsub = subscribeToPosts((data) => {
      setPosts(data.slice(0, 10)); // Top 10 latest
      setLoading(false);
      // Auto-focus the first one if none selected
      if (data.length > 0 && !activeSectorId) {
        const first = data[0];
        const coords = parseCoords(first.coordinates);
        if (coords) {
          setActiveSectorId(first.id);
          setFocusLocation({ ...coords, id: first.id });
        }
      }
    });
    return () => unsub();
  }, [activeSectorId]);

  const handleSelectSector = (post: Post) => {
    const coords = parseCoords(post.coordinates);
    if (coords) {
      setActiveSectorId(post.id);
      setFocusLocation({ ...coords, id: post.id });
    }
  };

  const activePost = posts.find(p => p.id === activeSectorId);
  const activeCoords = activePost ? parseCoords(activePost.coordinates) : null;

  return (
    <main className="relative h-screen bg-transparent overflow-hidden flex flex-col md:flex-row">
      <Navbar />
      <TechnicalOverlay className="opacity-10" />

      {/* Sidebar: Expedition Sectors */}
      <aside className="w-full md:w-80 h-full bg-neutral/80 backdrop-blur-2xl border-r border-primary/5 pt-32 p-8 z-40 overflow-y-auto">
        <div className="space-y-12">
          <section>
            <h3 className="font-technical text-[10px] text-primary mb-6 flex items-center gap-2 font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse"></span>
              Expedition Sectors
            </h3>
            
            <div className="space-y-4">
              {loading ? (
                [1,2,3].map(i => (
                  <div key={i} className="py-3 px-4 border-l-2 border-primary/5 animate-pulse">
                    <div className="h-2 w-20 bg-primary/10 rounded mb-2" />
                    <div className="h-4 w-32 bg-primary/10 rounded" />
                  </div>
                ))
              ) : posts.length === 0 ? (
                <p className="font-technical text-[8px] text-primary/30 uppercase">No active sectors.</p>
              ) : (
                posts.map((post, idx) => (
                  <motion.div 
                    key={post.id}
                    onClick={() => handleSelectSector(post)}
                    className={`cursor-pointer relative py-3 px-4 border-l-2 transition-all duration-500 ${activeSectorId === post.id ? 'border-tertiary bg-tertiary/[0.03]' : 'border-transparent hover:border-primary/20'}`}
                  >
                    <span className={`font-technical text-[8px] font-bold ${activeSectorId === post.id ? 'text-tertiary' : 'text-primary/30'}`}>
                      {String(idx + 1).padStart(2, '0')} / {post.category?.toUpperCase() || 'UNCATEGORIZED'}
                    </span>
                    <div className="flex justify-between items-baseline mt-1">
                      <span className={`font-heading text-lg truncate pr-2 ${activeSectorId === post.id ? 'text-primary' : 'text-primary/60'}`}>
                        {post.title}
                      </span>
                      <span className="font-technical text-[9px] text-primary/40 font-bold whitespace-nowrap">
                        {post.status.toUpperCase()}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          <section className="pt-8 border-t border-primary/5">
            <h3 className="font-technical text-[10px] text-primary/40 uppercase font-bold tracking-widest mb-4">Live Telemetry</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/[0.02] p-4 relative overflow-hidden border border-primary/5">
                <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-tertiary"></div>
                <span className="font-technical text-[7px] text-primary/40 block mb-1 font-bold uppercase">Latitude</span>
                <span className="font-technical text-sm text-primary font-bold tracking-tighter">
                  {activeCoords ? `${Math.abs(activeCoords.latitude).toFixed(4)}° ${activeCoords.latitude >= 0 ? 'N' : 'S'}` : '--.----°'}
                </span>
              </div>
              <div className="bg-primary/[0.02] p-4 relative overflow-hidden border border-primary/5">
                <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-tertiary"></div>
                <span className="font-technical text-[7px] text-primary/40 block mb-1 font-bold uppercase">Longitude</span>
                <span className="font-technical text-sm text-primary font-bold tracking-tighter">
                  {activeCoords ? `${Math.abs(activeCoords.longitude).toFixed(4)}° ${activeCoords.longitude >= 0 ? 'E' : 'W'}` : '--.----°'}
                </span>
              </div>
            </div>
          </section>
        </div>
      </aside>

      {/* Main Map Engine */}
      <div className="flex-1 relative bg-transparent flex items-center justify-center">
        <MapEngine focusLocation={focusLocation} />
        
        {/* Engagement Overlays */}
        <div className="absolute bottom-12 right-12 z-30 flex flex-col gap-6 w-80">
          {/* Statistics Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-neutral/80 backdrop-blur-2xl p-8 border border-primary/5 relative group shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Grid3X3 size={20} className="text-tertiary" />
            </div>
            
            <div className="space-y-6">
              <div>
                <span className="font-technical text-[8px] text-primary/40 block tracking-[0.2em] font-bold uppercase">Global Coverage</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-technical text-4xl text-primary font-bold tracking-tighter">64</span>
                  <span className="font-body text-lg text-primary/60 italic">Countries</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-primary flex items-center justify-center text-neutral rotate-45 group-hover:rotate-90 transition-transform duration-700">
                  <PlaneTakeoff size={20} className="-rotate-45 group-hover:-rotate-90 transition-transform duration-700" />
                </div>
                <div>
                  <span className="font-technical text-[8px] text-primary/40 block tracking-[0.2em] font-bold uppercase">Distance Traversed</span>
                  <span className="font-technical text-xl text-primary font-bold tracking-tighter">142,800 <span className="text-[10px] opacity-40">KM</span></span>
                </div>
              </div>

              <div className="pt-4 border-t border-primary/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-technical text-[8px] uppercase text-primary/40 font-bold tracking-widest">Archive Integrity</span>
                  <span className="font-technical text-[10px] text-tertiary font-bold">98.4%</span>
                </div>
                <div className="h-1 bg-primary/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "98.4%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-tertiary"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action CTA */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-primary text-neutral p-6 relative flex items-center justify-between cursor-pointer shadow-2xl overflow-hidden group"
          >
            <div className="relative z-10">
              <span className="font-technical text-[8px] text-tertiary block uppercase font-bold tracking-widest mb-1">Action Required</span>
              <span className="font-body text-lg italic">Drill-down to Iceland</span>
            </div>
            <ArrowRight size={24} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
            
            {/* Background energy effect */}
            <motion.div 
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-tertiary/20 to-transparent skew-x-12 translate-x-1/2"
            />
          </motion.div>
        </div>

        {/* Center UI Reticle */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
          <div className="w-[85%] h-[85%] border border-primary/10 relative">
            <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-tertiary"></div>
            <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-tertiary"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-tertiary"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-tertiary"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
