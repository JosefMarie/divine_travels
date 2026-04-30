"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TechnicalOverlay, Scanline } from "@/components/ui/TechnicalOverlay";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowRight, MoveRight, Globe, Gauge, Compass } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const metrics = [
  { label: "OPERATIONAL RANGE", val: "Global Nomadism", desc: "Focusing on high-altitude terrains and coastal architecture across four continents.", icon: Compass },
  { label: "GEAR SPEC", val: "85mm", desc: "Fixed Focal Length Preference", icon: Gauge, theme: "dark" },
  { label: "SHUTTER RESPONSE", val: "0.02s", desc: "Technical Latency Minimalized", icon: Gauge },
];

export default function AboutPage() {
  const [activePhase, setActivePhase] = useState(1);

  return (
    <main className="relative min-h-screen bg-neutral">
      <Navbar />
      <TechnicalOverlay className="opacity-10" />

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-12 items-center">
          <div className="col-span-12 lg:col-span-7 relative group">
            {/* Corner Reticles */}
            <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-tertiary z-20" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-tertiary z-20" />
            
            <div className="relative aspect-[4/5] overflow-hidden border border-primary/10 shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=2000" 
                alt="Divine's Portrait"
                fill
                priority
                className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              />
              <Scanline />
              
              {/* HUD Overlay */}
              <div className="absolute bottom-8 left-8 p-6 glass-panel border-l-2 border-tertiary max-w-[280px]">
                <p className="font-technical text-[8px] text-tertiary mb-2 font-bold tracking-widest uppercase">Subject ID: 099-DIVINE</p>
                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div>
                    <p className="font-technical text-[7px] uppercase opacity-50 mb-1">Travel Radius</p>
                    <p className="font-technical text-sm font-bold">14.2K<span className="text-[8px] ml-1 opacity-50">KM</span></p>
                  </div>
                  <div>
                    <p className="font-technical text-[7px] uppercase opacity-50 mb-1">Exposure</p>
                    <p className="font-technical text-sm font-bold">f/2.8</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-tertiary" />
              <p className="font-technical text-[10px] text-tertiary uppercase tracking-[0.3em] font-bold">The Protagonist</p>
            </div>
            
            <h1 className="font-serif text-6xl md:text-8xl text-primary leading-[0.9] mb-8">
              Divine&apos;s <br /> Perspective.
            </h1>
            
            <p className="font-serif text-lg text-primary/70 mb-12 italic leading-relaxed">
              Observing the world through a lens of technical precision and poetic silence. A journey defined not by distance, but by the density of the moments captured.
            </p>

            <Link href="#manifesto">
              <MagneticButton className="group flex items-center gap-4 border-b border-tertiary pb-2 w-fit">
                <span className="font-technical text-xs uppercase tracking-widest font-bold">Explore the Manifesto</span>
                <ArrowRight size={16} className="text-tertiary transition-transform group-hover:translate-x-2" />
              </MagneticButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Narrative Section - Interactive Scroll Spy */}
      <section id="manifesto" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-primary/5 relative scroll-mt-24">
        <div className="grid grid-cols-12 gap-12">
          
          {/* Sticky Sidebar */}
          <div className="col-span-12 lg:col-span-3 hidden lg:block">
            <div className="sticky top-40 space-y-6">
              <div className={`font-technical text-[10px] font-bold tracking-widest uppercase transition-colors duration-500 ${activePhase >= 1 ? 'text-tertiary' : 'text-primary/30'}`}>
                01 / Genesis
              </div>
              
              <div className="w-[1px] h-32 bg-primary/5 ml-2 relative overflow-hidden">
                <motion.div 
                  className="absolute top-0 left-0 w-full bg-tertiary transition-all duration-700 ease-out" 
                  style={{ height: activePhase === 1 ? '33%' : activePhase === 2 ? '66%' : '100%' }} 
                />
              </div>
              
              <div className={`font-technical text-[10px] font-bold tracking-widest uppercase transition-colors duration-500 ${activePhase >= 2 ? 'text-tertiary' : 'text-primary/30'}`}>
                02 / Evolution
              </div>
              
              <div className="w-[1px] h-32 bg-primary/5 ml-2 relative overflow-hidden">
                <motion.div 
                  className="absolute top-0 left-0 w-full bg-tertiary transition-all duration-700 ease-out" 
                  style={{ height: activePhase >= 3 ? '100%' : '0%' }} 
                />
              </div>

              <div className={`font-technical text-[10px] font-bold tracking-widest uppercase transition-colors duration-500 ${activePhase === 3 ? 'text-tertiary' : 'text-primary/30'}`}>
                03 / Current
              </div>
            </div>
          </div>
          
          {/* Scrolling Content Blocks */}
          <div className="col-span-12 lg:col-span-7 space-y-48 pb-32">
            <motion.div 
              onViewportEnter={() => setActivePhase(1)} 
              viewport={{ margin: "-40% 0px -40% 0px" }}
              className={`transition-opacity duration-700 ${activePhase === 1 ? 'opacity-100' : 'opacity-40'}`}
            >
              <h2 className="font-serif text-4xl text-primary mb-8">A dialogue between data and dreamscape.</h2>
              <p className="font-serif text-lg text-primary/60 leading-relaxed italic">
                Divine began as an exercise in structural observation. In a world saturated with fleeting imagery, the goal was to create a sanctuary of precision. Every expedition is logged with the rigor of a flight manifest, yet experienced with the emotional depth of an editorial masterpiece.
              </p>
            </motion.div>

            <motion.div 
              onViewportEnter={() => setActivePhase(2)} 
              viewport={{ margin: "-40% 0px -40% 0px" }}
              className={`transition-opacity duration-700 ${activePhase === 2 ? 'opacity-100' : 'opacity-40'}`}
            >
              <h2 className="font-serif text-4xl text-primary mb-8">The Evolution of Documentation.</h2>
              <div className="border-l-4 border-tertiary/20 pl-8 py-2 mb-8">
                <p className="font-serif text-xl text-primary/80 italic leading-relaxed">
                  &quot;The technical data—the ISO settings, the coordinates, the barometric pressure—is not just metadata. It is the skeletal structure of a memory.&quot;
                </p>
              </div>
            </motion.div>

            <motion.div 
              onViewportEnter={() => setActivePhase(3)} 
              viewport={{ margin: "-40% 0px -40% 0px" }}
              className={`transition-opacity duration-700 ${activePhase === 3 ? 'opacity-100' : 'opacity-40'}`}
            >
              <h2 className="font-serif text-4xl text-primary mb-8">Current Operations.</h2>
              <p className="font-serif text-lg text-primary/60 leading-relaxed italic">
                This narrative is built upon the pillars of intentional luxury. It is for the elite voyager who seeks the quietest corner of the busiest city, the sharpest focus in the softest light, and the technical truth behind every curated aesthetic. The operation has expanded from a singular perspective into a global archive.
              </p>
            </motion.div>
          </div>
          
        </div>
      </section>


      {/* Technical DNA Grid */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-primary/5">
        <div className="flex justify-between items-end mb-12 border-b border-primary/5 pb-8">
          <h2 className="font-serif text-3xl text-primary">Technical DNA</h2>
          <p className="font-technical text-[9px] text-tertiary font-bold tracking-widest uppercase">Metrics v.2.0.4</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {metrics.map((m, i) => (
             <div key={i} className={`p-10 border border-primary/5 relative group overflow-hidden cursor-pointer transition-all duration-500 technical-card hover:border-tertiary/20 ${m.theme === 'dark' ? '!bg-primary text-neutral' : 'bg-neutral/50'}`}>
                <div className="flex justify-between items-start mb-12">
                   <motion.div 
                     whileHover={{ rotate: 360 }} 
                     transition={{ duration: 0.8 }}
                     className={m.theme === 'dark' ? 'text-tertiary' : 'text-primary/30 group-hover:text-tertiary transition-colors duration-500'}
                   >
                    <m.icon size={24} />
                   </motion.div>
                   <p className="font-technical text-[8px] font-bold tracking-tighter opacity-50 uppercase group-hover:text-tertiary group-hover:opacity-100 transition-all duration-500">{m.label}</p>
                </div>
                <p className="font-serif text-2xl mb-2 group-hover:translate-x-1 transition-transform duration-500">{m.val}</p>
                <p className="font-serif text-xs opacity-50 italic group-hover:opacity-80 transition-opacity duration-500">{m.desc}</p>
             </div>
           ))}
           <div className="md:col-span-1 p-10 bg-neutral/50 border border-primary/5 flex flex-col justify-center relative group overflow-hidden cursor-pointer transition-all duration-500 technical-card hover:border-tertiary/20">
              <p className="font-technical text-[8px] font-bold text-tertiary mb-6 tracking-widest uppercase">Core Philosophy</p>
              <ul className="space-y-4">
                 {["Chronological Rigor", "Visual Minimalism", "Geospatial Precision"].map((item) => (
                   <li key={item} className="flex items-center gap-3 font-technical text-[9px] font-bold uppercase text-primary/60 group-hover:translate-x-1 transition-transform duration-500">
                     <div className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                     {item}
                   </li>
                 ))}
              </ul>
           </div>
        </div>
      </section>

      {/* Intelligence Manifest (FAQ) */}
      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-technical text-[10px] text-tertiary font-bold tracking-[0.4em] uppercase mb-4">Intelligence Manifest</p>
          <h2 className="font-serif text-5xl text-primary">Common Inquiries</h2>
        </div>

        <div className="space-y-4">
          {[
            { q: "Mission Protocol", a: "Destinations are selected through a rigorous analysis of architectural significance, geographic isolation, and visual storytelling potential.", ref: "INT_MSG_01" },
            { q: "Hardware Integrity", a: "Standard operational gear includes the Leica SL2-S for visual documentation, technical apparel for extreme climates, and satellite communication arrays.", ref: "INT_MSG_02" },
            { q: "Data Archiving", a: "Every expedition is logged with full technical metadata including exact coordinates, atmospheric conditions, and precise exposure parameters.", ref: "INT_MSG_03" },
            { q: "Operational Access", a: "Inquiries regarding bespoke itineraries or collaborative expeditions should be directed through the encrypted communication hub in Mission Control.", ref: "INT_MSG_04" },
          ].map((item, i) => (
            <details key={i} className="group border border-primary/5 bg-neutral/30 transition-all duration-500 open:bg-neutral/80 hover:-translate-y-1 hover:shadow-lg hover:border-tertiary/20 hover:bg-neutral/50">
              <summary className="flex items-center justify-between p-8 cursor-pointer list-none">
                <div className="flex items-center gap-8">
                  <span className="font-technical text-[9px] text-primary/30 font-bold uppercase">{item.ref}</span>
                  <h4 className="font-serif text-2xl text-primary">{item.q}</h4>
                </div>
                <div className="relative w-4 h-4">
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-primary group-open:rotate-180 transition-transform duration-500" />
                  <div className="absolute top-0 left-1/2 w-[1px] h-full bg-primary group-open:opacity-0 transition-opacity duration-500" />
                </div>
              </summary>
              <div className="px-8 pb-8 pt-0">
                <div className="max-w-2xl ml-20">
                  <p className="font-serif text-lg text-primary/60 leading-relaxed italic border-l-2 border-tertiary/20 pl-8">
                    {item.a}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
