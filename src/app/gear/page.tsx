"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TechnicalOverlay, Scanline } from "@/components/ui/TechnicalOverlay";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowUpRight, Camera, Backpack, Laptop, Shirt, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const gearCategories = ["All", "Photography", "Luggage", "Tech", "Apparel"];

const gearItems = [
  {
    id: "TECH_SPEC_01",
    name: "Leica SL2-S",
    category: "Photography",
    ref: "#8821-C",
    val1: "931g (Body)",
    label1: "Weight",
    val2: "Visual Documentation",
    label2: "Primary Use",
    img: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&q=80&w=1000",
    icon: Camera
  },
  {
    id: "TECH_SPEC_02",
    name: "Arc'teryx Granville",
    category: "Luggage",
    ref: "#4419-L",
    val1: "20 Liters",
    label1: "Capacity",
    val2: "Urban Exploration",
    label2: "Primary Use",
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000",
    icon: Backpack
  },
  {
    id: "TECH_SPEC_03",
    name: "iPad Pro 12.9\"",
    category: "Tech",
    ref: "#1022-T",
    val1: "2TB / M2 Chip",
    label1: "Storage",
    val2: "Mobile Workflow",
    label2: "Primary Use",
    img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=1000",
    icon: Laptop
  }
];

export default function GearPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredGear = gearItems.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  );

  return (
    <main className="relative min-h-screen bg-neutral">
      <Navbar />
      <TechnicalOverlay className="opacity-5" />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-start pt-40 px-6 border-b border-primary/5">
        <div className="absolute top-44 left-12 font-technical text-[8px] text-primary/30 uppercase tracking-[0.4em]">Manifest_Ref: DD-2024-08</div>
        <div className="absolute bottom-12 right-12 font-technical text-[8px] text-primary/30 text-right uppercase tracking-[0.4em]">
          Coordinates: 52.5200° N, 13.4050° E<br/>Station: Base_Alpha
        </div>
        
        <div className="text-center max-w-4xl">
          <h1 className="font-serif text-7xl md:text-9xl text-primary mb-12">The Gear Manifest.</h1>
          <p className="font-serif text-xl text-primary/60 max-w-2xl mx-auto italic leading-relaxed">
            Precision tools for the global nomad. A curated inventory of hardware selected for reliability, performance, and aesthetic integrity across varying operational theaters.
          </p>
          <div className="mt-16">
             <Link href="#gear-grid">
               <MagneticButton className="border-b border-tertiary pb-1">
                 <span className="font-technical text-[10px] uppercase tracking-[0.2em] font-bold text-tertiary">Initialize Gear Selection</span>
               </MagneticButton>
             </Link>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <nav id="gear-grid" className="sticky top-[96px] z-40 bg-neutral/80 backdrop-blur-xl border-b border-primary/5 py-8 px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8 md:gap-12 font-technical text-[10px] font-bold uppercase tracking-widest text-primary/40">
           {gearCategories.map((cat) => (
             <button 
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`transition-colors pb-1 ${activeCategory === cat ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'}`}
             >
               {cat}
             </button>
           ))}
        </div>
      </nav>

      {/* Gear Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24 min-h-[50vh]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {filteredGear.length === 0 ? (
            <div className="col-span-full py-12 text-center border border-dashed border-primary/10">
              <span className="font-technical text-[10px] uppercase tracking-widest text-primary/40 font-bold">No assets found in this sector.</span>
            </div>
          ) : (
            filteredGear.map((item) => (
              <div key={item.id} className="group space-y-6 technical-card p-6">
                <div className="relative aspect-[4/5] bg-primary/[0.02] overflow-hidden border border-primary/5">
                  <Image 
                    src={item.img} 
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  />
                  <Scanline />
                  <div className="absolute top-4 left-4 font-technical text-[8px] bg-primary text-neutral px-2 py-1 font-bold">{item.id}</div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-2xl text-primary">{item.name}</h3>
                    <span className="font-technical text-[9px] text-primary/30 font-bold">{item.ref}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 border-t border-primary/5 pt-4">
                    <div>
                      <p className="font-technical text-[7px] text-primary/40 uppercase font-bold mb-1">{item.label1}</p>
                      <p className="font-technical text-[10px] text-primary font-bold">{item.val1}</p>
                    </div>
                    <div>
                      <p className="font-technical text-[7px] text-primary/40 uppercase font-bold mb-1">{item.label2}</p>
                      <p className="font-technical text-[10px] text-primary font-bold">{item.val2}</p>
                    </div>
                  </div>
                  
                  <button className="flex items-center gap-2 font-technical text-[9px] font-bold text-primary/60 group-hover:text-tertiary transition-colors uppercase tracking-widest pt-2">
                    Spec Sheet <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Author's Choice Featured */}
      <section className="bg-primary py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="grid grid-cols-12 h-full w-full divide-x divide-neutral">
            {[...Array(12)].map((_, i) => <div key={i} />)}
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10 text-neutral">
          <div className="space-y-12">
            <div>
              <p className="font-technical text-[10px] text-tertiary font-bold tracking-[0.4em] uppercase mb-4">Author&apos;s Choice</p>
              <h2 className="font-serif text-6xl md:text-7xl border-b border-neutral/10 pb-8">The Hinderer XM-18 3.5&quot;</h2>
            </div>
            
            <div className="space-y-8">
              <p className="font-serif text-lg italic text-neutral/60 leading-relaxed">
                Essential operational hardware. Precision machined in the USA, this tool represents the pinnacle of reliability for the modern explorer. Every component is engineered for extreme tolerances.
              </p>
              
              <div className="grid grid-cols-2 gap-8 py-8 border-y border-neutral/5">
                {[
                  { l: "Steel_Type", v: "CPM-S45VN" },
                  { l: "Handle_Mat", v: "Grade 5 Titanium" },
                  { l: "Lock_Mech", v: "Frame Lock" },
                  { l: "Deployment", v: "Ceramic Bearings" }
                ].map(stat => (
                  <div key={stat.l}>
                    <p className="font-technical text-[7px] text-neutral/40 uppercase font-bold mb-1">{stat.l}</p>
                    <p className="font-technical text-sm font-bold text-neutral">{stat.v}</p>
                  </div>
                ))}
              </div>
              
              <MagneticButton className="bg-tertiary text-neutral px-8 py-4 font-technical text-[10px] uppercase tracking-widest font-bold">
                Order for Next Mission
              </MagneticButton>
            </div>
          </div>
          
          <div className="relative group aspect-square bg-neutral/5 flex items-center justify-center p-12">
             <div className="absolute inset-0 border border-neutral/10 group-hover:border-tertiary transition-colors" />
             <Scanline />
             <Image 
               src="https://images.unsplash.com/photo-1614362984534-7389814421b3?auto=format&fit=crop&q=80&w=1000" 
               alt="Technical Knife"
               width={500}
               height={500}
               className="object-contain mix-blend-screen opacity-80"
             />
             <div className="absolute top-4 right-4 text-right font-technical text-[7px] text-neutral/30 leading-tight">
                Render_Engine: v4.2<br/>Geom_ID: HK-881<br/>Tolerance: +/- 0.001mm
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
