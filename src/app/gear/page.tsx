"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TechnicalOverlay, Scanline } from "@/components/ui/TechnicalOverlay";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowUpRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { subscribeToSectorContent } from "@/lib/db/content";
import { GearContent } from "@/types";

export default function GearPage() {
  const [content, setContent] = useState<GearContent | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const unsub = subscribeToSectorContent<GearContent>('gear', setContent);
    return () => unsub();
  }, []);

  if (!content) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-tertiary" size={40} />
    </div>
  );

  const categories = ["All", ...Array.from(new Set(content.items.map(i => i.category)))];
  const filteredGear = content.items.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  );

  return (
    <main className="relative min-h-screen bg-transparent">
      <Navbar />
      <TechnicalOverlay className="opacity-[0.03]" />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-start pt-40 px-6 border-b border-primary/5">
        <div className="absolute top-44 left-12 font-technical text-[8px] text-primary/30 uppercase tracking-[0.4em]">Manifest_Ref: DD-2024-08</div>
        <div className="absolute bottom-12 right-12 font-technical text-[8px] text-primary/30 text-right uppercase tracking-[0.4em]">
          Coordinates: 52.5200° N, 13.4050° E<br/>Station: Base_Alpha
        </div>
        
        <div className="text-center max-w-4xl">
          <h1 className="font-heading text-7xl md:text-9xl text-primary mb-12">{content.title}</h1>
          <p className="font-body text-xl text-primary/60 max-w-2xl mx-auto italic leading-relaxed">
            {content.description}
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
           {categories.map((cat) => (
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
                    <h3 className="font-heading text-primary">{item.name}</h3>
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
              <h2 className="font-heading border-b border-neutral/10 pb-8">{content.featured.title}</h2>
            </div>
            
            <div className="space-y-8">
              <p className="font-body italic text-neutral/60 leading-relaxed">
                {content.featured.description}
              </p>
              
              <div className="grid grid-cols-2 gap-8 py-8 border-y border-neutral/5">
                {content.featured.specs.map((stat, i) => (
                  <div key={i}>
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
               src={content.featured.img} 
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
