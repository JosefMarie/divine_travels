"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TechnicalOverlay, Scanline } from "@/components/ui/TechnicalOverlay";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { 
  Wifi, 
  Map, 
  PlaneTakeoff, 
  Terminal, 
  Clock, 
  Globe, 
  ShieldCheck, 
  Cpu, 
  ArrowRight,
  Zap,
  Layout
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LogisticsPage() {
  return (
    <main className="relative min-h-screen bg-neutral">
      <Navbar />
      <TechnicalOverlay className="opacity-10" />

      {/* Hero Section */}
      <header className="relative h-screen flex items-center px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000" 
            alt="Remote Workspace" 
            fill
            className="object-cover grayscale brightness-50 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral via-neutral/70 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-px w-12 bg-tertiary" />
            <span className="font-technical text-[10px] text-tertiary uppercase tracking-[0.4em] font-bold">Protocol 4.0 // NOMAD_LOG</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-6xl md:text-8xl text-primary mb-12"
          >
            Logistics <br /> Protocol.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-serif text-xl text-primary/60 max-w-xl italic leading-relaxed mb-16"
          >
            Distilling the chaos of global movement into a curated series of high-definition, high-productivity moments. Precision-engineered for the modern nomad.
          </motion.p>

          <div className="grid grid-cols-2 gap-12 max-w-md">
            <div>
              <p className="font-technical text-[40px] font-bold text-tertiary leading-none">0.02s</p>
              <p className="font-technical text-[10px] text-primary/40 uppercase tracking-widest mt-2 font-bold">Latency Rate</p>
            </div>
            <div>
              <p className="font-technical text-[40px] font-bold text-tertiary leading-none">99.9%</p>
              <p className="font-technical text-[10px] text-primary/40 uppercase tracking-widest mt-2 font-bold">Uptime Protocol</p>
            </div>
          </div>
        </div>

        {/* Coordinate Overlay */}
        <div className="absolute bottom-12 right-12 hidden md:block">
          <div className="font-technical text-primary/20 text-[10px] space-y-1 text-right">
            <p>LAT: 45.4215 N</p>
            <p>LONG: 75.6972 W</p>
            <p className="text-tertiary font-bold opacity-100">VALIDATED // SECURE</p>
          </div>
        </div>
      </header>

      {/* Travel Resources */}
      <section className="py-32 px-6 md:px-12 lg:px-24">
        <div className="flex justify-between items-end mb-24 border-b border-primary/5 pb-8">
          <div>
            <h2 className="font-serif text-4xl text-primary mb-4">Travel Resources</h2>
            <p className="font-serif text-lg text-primary/40 italic">Precision-engineered tools for the modern nomad.</p>
          </div>
          <p className="font-technical text-[10px] text-tertiary font-bold tracking-widest uppercase cursor-pointer hover:underline">Access Core API</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Planning Tools", desc: "Dynamic itinerary generation using real-time atmospheric data.", icon: Map, stat: "1.2s Sync" },
            { title: "Flight Hacks", desc: "Bypass standard routing protocols for optimal transit efficiency.", icon: PlaneTakeoff, stat: "142+ Nodes" },
            { title: "Booking Opt", desc: "Algorithmic selection of high-fidelity accommodations.", icon: Terminal, stat: "< 0.001% Error" },
          ].map((item, i) => (
            <div key={i} className="group relative technical-card p-10 border border-primary/5 overflow-hidden cursor-pointer transition-all duration-500 hover:border-tertiary/20">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                 <item.icon size={120} className="group-hover:text-tertiary transition-colors duration-700" />
               </div>
               <div className="relative z-10">
                 <div className="mb-12 flex justify-between items-start">
                    <motion.div 
                      whileHover={{ rotate: 360 }} 
                      transition={{ duration: 0.8, ease: "anticipate" }}
                      className="text-primary group-hover:text-tertiary transition-colors duration-500"
                    >
                      <item.icon size={32} />
                    </motion.div>
                    <span className="font-technical text-[8px] bg-primary text-neutral px-2 py-0.5 font-bold uppercase group-hover:bg-tertiary transition-colors duration-500">Active</span>
                 </div>
                 <h3 className="font-serif text-2xl text-primary mb-4 group-hover:translate-x-1 transition-transform duration-500">{item.title}</h3>
                 <p className="font-serif text-sm text-primary/60 italic mb-12 group-hover:text-primary transition-colors duration-500">{item.desc}</p>
                 <div className="pt-6 border-t border-primary/5 flex justify-between items-center font-technical text-[9px] font-bold uppercase">
                    <span className="text-primary/30 group-hover:text-primary transition-colors duration-500">Metric</span>
                    <span className="text-tertiary group-hover:scale-110 transition-transform duration-500">{item.stat}</span>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Infrastructure Section */}
      <section className="bg-primary py-32 px-6 md:px-12 lg:px-24 text-neutral overflow-hidden relative">
        <div className="absolute top-0 right-0 p-24 opacity-[0.02] font-technical text-[300px] font-bold select-none leading-none rotate-12">DEPO</div>
        
        <div className="grid grid-cols-12 gap-16 relative z-10">
          <div className="col-span-12 lg:col-span-4">
             <div className="sticky top-40">
                <span className="font-technical text-[10px] text-tertiary uppercase tracking-[0.4em] font-bold mb-6 block">Workspace Dashboard</span>
                <h2 className="font-serif text-5xl mb-8">Remote Infrastructure</h2>
                <p className="font-serif text-lg text-neutral/60 italic leading-relaxed mb-12">
                   Deployment protocols for maintaining high-bandwidth productivity in any environment, from alpine peaks to desert dunes.
                </p>
                <div className="space-y-4">
                   <div className="p-6 border border-neutral/10 flex items-center gap-4 bg-neutral/[0.02] backdrop-blur-sm">
                      <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                      <span className="font-technical text-[10px] text-neutral uppercase tracking-widest font-bold">Global Uplink: Engaged</span>
                   </div>
                   <div className="p-6 border border-neutral/5 flex items-center gap-4 opacity-30">
                      <div className="w-2 h-2 rounded-full bg-neutral" />
                      <span className="font-technical text-[10px] text-neutral uppercase tracking-widest font-bold">Local Grid: Bypassed</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="p-10 border border-neutral/10 bg-neutral/[0.02] flex flex-col justify-between group">
                <div>
                   <h4 className="font-serif text-3xl mb-4">Connectivity Hardware</h4>
                   <p className="font-serif text-sm text-neutral/40 italic">Satellite arrays and hardware VPN protocols for the elite traveler.</p>
                </div>
                <div className="mt-12 h-64 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 border border-neutral/5">
                   <Image 
                    src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=1000" 
                    alt="Hardware" 
                    fill 
                    className="object-cover"
                   />
                </div>
             </div>

             <div className="p-10 border border-neutral/10 bg-neutral/[0.02] flex flex-col justify-between">
                <div>
                   <h4 className="font-serif text-3xl mb-4">Work Protocols</h4>
                   <p className="font-serif text-sm text-neutral/40 italic">Standard operating procedures for asynchronous deep-work sessions.</p>
                </div>
                <div className="mt-12 space-y-6">
                   {[
                     { label: "Encryption", val: "AES-256" },
                     { label: "Tunneling", val: "Shadow-P" },
                     { label: "Buffer", val: "Stable" },
                   ].map((p, i) => (
                     <div key={i} className="flex justify-between font-technical text-[10px] font-bold uppercase py-4 border-b border-neutral/10">
                        <span className="text-neutral/30">{p.label}</span>
                        <span className="text-tertiary">{p.val}</span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="p-10 border border-neutral/10 bg-neutral/[0.02] md:col-span-2">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                   <div className="flex-1">
                      <h4 className="font-serif text-3xl mb-4">Timezone Management</h4>
                      <p className="font-serif text-sm text-neutral/40 italic">Circadian-aligned scheduling algorithms that synchronize with global market hours.</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4 w-full md:w-fit">
                      {[
                        { city: "New York", utc: "UTC-5", active: true },
                        { city: "London", utc: "UTC+1", active: false },
                        { city: "Tokyo", utc: "UTC+9", active: false },
                        { city: "Singapore", utc: "UTC+8", active: false },
                      ].map((t, i) => (
                        <div key={i} className={`p-6 border text-center ${t.active ? 'border-tertiary bg-tertiary/[0.05]' : 'border-neutral/10'}`}>
                           <p className={`font-technical text-2xl font-bold ${t.active ? 'text-tertiary' : 'text-neutral'}`}>{t.utc}</p>
                           <p className="font-technical text-[8px] uppercase tracking-widest font-bold text-neutral/40 mt-1">{t.city}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
