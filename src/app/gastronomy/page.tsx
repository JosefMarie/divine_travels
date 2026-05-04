"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TechnicalOverlay, Scanline } from "@/components/ui/TechnicalOverlay";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { 
  ArrowRight, 
  Loader2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { subscribeToSectorContent } from "@/lib/db/content";
import { GastronomyContent } from "@/types";

export default function GastronomyPage() {
  const [content, setContent] = useState<GastronomyContent | null>(null);
  const [activeRegion, setActiveRegion] = useState("All");

  useEffect(() => {
    const unsub = subscribeToSectorContent<GastronomyContent>('gastronomy', setContent);
    return () => unsub();
  }, []);

  if (!content) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-tertiary" size={40} />
    </div>
  );

  const regions = ["All", ...Array.from(new Set(content.dishes.map(d => d.region)))];
  const filteredDishes = content.dishes.filter(
    (dish) => activeRegion === "All" || dish.region === activeRegion
  );

  return (
    <main className="relative min-h-screen bg-transparent">
      <Navbar />
      <TechnicalOverlay className="opacity-[0.03]" />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2000" 
            alt="Gastronomy" 
            fill
            className="object-cover grayscale-[0.2] brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral via-neutral/50 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <span className="font-technical text-[10px] text-tertiary uppercase tracking-[0.4em] font-bold">Volume IV</span>
            <div className="h-[1px] w-12 bg-tertiary" />
            <span className="font-technical text-[10px] text-tertiary uppercase tracking-[0.4em] font-bold">Culinary Narratives</span>
          </div>
          
          <h1 className="font-heading text-6xl md:text-8xl text-primary leading-none mb-12">
            {content.heroTitle}
          </h1>
          
          <p className="font-body text-xl text-primary/60 max-w-lg italic mb-16 leading-relaxed">
            {content.heroDescription}
          </p>

          <Link href="#discovery-grid">
            <MagneticButton className="group flex items-center gap-4 border-b border-primary pb-2 w-fit">
              <span className="font-technical text-xs uppercase tracking-widest font-bold">Explore the Archive</span>
              <ArrowRight size={16} className="text-tertiary transition-transform group-hover:translate-x-2" />
            </MagneticButton>
          </Link>
        </div>

        {/* Technical Data Sidebar */}
        <div className="absolute right-12 bottom-24 hidden lg:block">
          <div className="flex flex-col gap-10 border-l border-primary/10 pl-10">
            <div>
              <span className="font-technical text-[8px] text-primary/30 block mb-2 uppercase font-bold tracking-widest">DATA_STREAM</span>
              <span className="font-technical text-xl text-primary font-bold">42.85° N, 2.35° E</span>
            </div>
            <div>
              <span className="font-technical text-[8px] text-primary/30 block mb-2 uppercase font-bold tracking-widest">CURATION_INDEX</span>
              <span className="font-technical text-xl text-primary font-bold">0.992</span>
            </div>
          </div>
        </div>
      </section>

      {/* Discovery Grid */}
      <section id="discovery-grid" className="py-32 px-6 md:px-12 lg:px-24 scroll-mt-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8 border-b border-primary/5 pb-8">
          <div className="max-w-xl">
            <span className="font-technical text-[10px] text-tertiary mb-4 block uppercase font-bold tracking-widest">Sector_01 // Discovery</span>
            <h2 className="font-heading text-primary">Regional Cartography</h2>
          </div>
          <div className="flex flex-wrap gap-4 font-technical text-[9px] font-bold uppercase tracking-widest">
            {regions.map((region) => (
              <button 
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`px-6 py-2 transition-colors ${activeRegion === region ? 'bg-primary text-neutral' : 'border border-primary/5 hover:border-primary text-primary'}`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 min-h-[50vh]">
          {filteredDishes.length === 0 ? (
            <div className="col-span-full py-24 text-center border border-dashed border-primary/10">
              <span className="font-technical text-[10px] uppercase tracking-widest text-primary/40 font-bold">No gastronomic data available for this region.</span>
            </div>
          ) : (
            filteredDishes.map((dish) => (
              <div key={dish.id} className={`${dish.cols} group relative ${dish.aspect} overflow-hidden border border-primary/5 technical-card`}>
                 <Image 
                  src={dish.img} 
                  alt={dish.country} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                 />
                 <Scanline />
                 <div className={`absolute inset-0 ${dish.bgHover} opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 md:p-12`}>
                    <p className="font-technical text-[10px] text-neutral/80 uppercase tracking-widest mb-2 font-bold">Region: {dish.country}</p>
                    <h3 className="font-heading md:text-4xl text-neutral">{dish.title}</h3>
                 </div>
              </div>
            ))
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
