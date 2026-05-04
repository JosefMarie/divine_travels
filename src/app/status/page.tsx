"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TechnicalOverlay } from "@/components/ui/TechnicalOverlay";
import { ActivitySquare, Database, Globe, Cpu, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function StatusPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  const systems = [
    { name: "Global CDN Edge", status: "Nominal", latency: "12ms", uptime: "99.99%", icon: Globe, state: "ok" },
    { name: "Mission Control DB", status: "Nominal", latency: "45ms", uptime: "99.98%", icon: Database, state: "ok" },
    { name: "Asset Render Engine", status: "Nominal", latency: "110ms", uptime: "99.95%", icon: Cpu, state: "ok" },
    { name: "Telemetry API", status: "Nominal", latency: "24ms", uptime: "100%", icon: ActivitySquare, state: "ok" },
  ];

  return (
    <main className="relative min-h-screen bg-transparent selection:bg-tertiary selection:text-neutral">
      <Navbar />
      <TechnicalOverlay className="opacity-10" />

      {/* Header */}
      <section className="relative pt-40 pb-20 px-6 md:px-12 lg:px-24 border-b border-primary/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <ActivitySquare size={16} className="text-green-600" />
              <span className="font-technical text-[10px] text-green-600 uppercase tracking-[0.4em] font-bold">All Systems Nominal</span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl text-primary mb-4 leading-none">
              System Status.
            </h1>
            <p className="font-technical text-xs text-primary/40 uppercase tracking-widest font-bold">
              Last Sync: {mounted ? new Date().toISOString().replace('T', ' ').substring(0, 19) : "SYNCING..."} UTC
            </p>
          </div>
          
          <div className="text-right border border-primary/10 p-6 bg-primary/[0.02]">
            <p className="font-technical text-[8px] uppercase tracking-widest text-primary/40 mb-2">Overall Uptime (90 Days)</p>
            <p className="font-technical text-4xl text-primary font-bold">99.98<span className="text-lg text-primary/40">%</span></p>
          </div>
        </div>
      </section>

      {/* Core Systems Grid */}
      <section className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <h3 className="font-technical text-[10px] uppercase tracking-widest font-bold text-primary/40 mb-8 border-b border-primary/5 pb-4">Core Infrastructure</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {systems.map((sys, i) => (
            <div key={i} className="technical-card p-8 border border-primary/5 group relative overflow-hidden bg-neutral">
               <div className="absolute top-0 left-0 w-1 h-full bg-green-500/20" />
               <div className="flex justify-between items-start mb-8">
                 <div className="flex items-center gap-4">
                   <div className="p-3 bg-primary/[0.02] border border-primary/10 rounded-sm">
                     <sys.icon size={20} className="text-primary/60" />
                   </div>
                   <div>
                     <h4 className="font-technical text-sm font-bold uppercase tracking-widest text-primary">{sys.name}</h4>
                     <p className="font-technical text-[10px] text-primary/40 uppercase mt-1">ID: SYS_{i+1}00</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="font-technical text-[10px] uppercase font-bold text-green-600">{sys.status}</span>
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4 border-t border-primary/5 pt-6">
                 <div>
                   <span className="font-technical text-[8px] uppercase tracking-widest text-primary/40 block mb-1">Latency</span>
                   <span className="font-technical text-sm font-bold text-primary">{sys.latency}</span>
                 </div>
                 <div>
                   <span className="font-technical text-[8px] uppercase tracking-widest text-primary/40 block mb-1">Uptime</span>
                   <span className="font-technical text-sm font-bold text-primary">{sys.uptime}</span>
                 </div>
               </div>
               
               {/* Decorative chart */}
               <div className="mt-8 flex items-end gap-1 h-8 opacity-20">
                 {[...Array(20)].map((_, j) => (
                   <motion.div 
                     key={j} 
                     initial={{ height: "100%" }}
                     animate={{ height: `${Math.random() * 40 + 60}%` }}
                     transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: j * 0.1 }}
                     className="w-full bg-primary rounded-t-sm"
                   />
                 ))}
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Incident Log */}
      <section className="pb-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <h3 className="font-technical text-[10px] uppercase tracking-widest font-bold text-primary/40 mb-8 border-b border-primary/5 pb-4">Incident Log</h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-6 p-6 border border-primary/5 bg-primary/[0.02]">
            <CheckCircle2 size={20} className="text-green-600 mt-1" />
            <div>
              <p className="font-technical text-sm font-bold text-primary mb-2">No incidents reported.</p>
              <p className="font-body text-sm text-primary/60 italic">The network is currently operating at maximum efficiency. All nodes are reporting stable telemetry.</p>
              <p className="font-technical text-[9px] uppercase tracking-widest text-primary/40 mt-4">Updated: {mounted ? new Date().toISOString().split('T')[0] : "----"}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
