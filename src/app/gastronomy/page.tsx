"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TechnicalOverlay, Scanline } from "@/components/ui/TechnicalOverlay";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { 
  ArrowRight, 
  ChefHat, 
  Utensils, 
  Waves, 
  Mountain, 
  Compass,
  ArrowDownRight
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const regions = ["All", "Asia", "Europe", "Americas", "Africa"];

const regionalDishes = [
  {
    id: "jp",
    region: "Asia",
    country: "Japan",
    title: "Omakase Precision",
    img: "https://images.unsplash.com/photo-1580442151529-343f2f5e0e31?auto=format&fit=crop&q=80&w=1500",
    cols: "md:col-span-8",
    aspect: "aspect-[16/9]",
    bgHover: "bg-primary/20"
  },
  {
    id: "fr",
    region: "Europe",
    country: "France",
    title: "Butter Chemistry",
    img: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=1000",
    cols: "md:col-span-4",
    aspect: "aspect-square",
    bgHover: "bg-tertiary/20"
  },
  {
    id: "it",
    region: "Europe",
    country: "Italy",
    title: "Structural Integrity",
    img: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=1000",
    cols: "md:col-span-4",
    aspect: "aspect-square",
    bgHover: "bg-primary/20"
  },
  {
    id: "pe",
    region: "Americas",
    country: "Peru",
    title: "Acidity & Elevation",
    img: "https://images.unsplash.com/photo-1535567465397-7523840f2ae9?auto=format&fit=crop&q=80&w=1500",
    cols: "md:col-span-8",
    aspect: "aspect-[16/9]",
    bgHover: "bg-tertiary/20"
  },
  {
    id: "ma",
    region: "Africa",
    country: "Morocco",
    title: "Spice Architecture",
    img: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&q=80&w=1500",
    cols: "md:col-span-12",
    aspect: "aspect-[21/9]",
    bgHover: "bg-primary/20"
  }
];

export default function GastronomyPage() {
  const [activeRegion, setActiveRegion] = useState("All");

  const filteredDishes = regionalDishes.filter(
    (dish) => activeRegion === "All" || dish.region === activeRegion
  );

  return (
    <main className="relative min-h-screen bg-neutral">
      <Navbar />
      <TechnicalOverlay className="opacity-10" />

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
          
          <h1 className="font-serif text-6xl md:text-8xl text-primary leading-none mb-12">
            Global <br /> Flavors.
          </h1>
          
          <p className="font-serif text-xl text-primary/60 max-w-lg italic mb-16 leading-relaxed">
            An analytical exploration of gastronomy. We decode the DNA of regional cuisines, mapping the intersection of tradition and technical precision.
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
            <h2 className="font-serif text-5xl text-primary">Regional Cartography</h2>
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
                    <h3 className="font-serif text-3xl md:text-4xl text-neutral">{dish.title}</h3>
                 </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Spotlight Section */}
      <section className="py-32 px-6 md:px-12 lg:px-24 bg-neutral/50 border-t border-primary/5 relative overflow-hidden">
        {/* Background Animated Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
             className="w-[150vw] h-[150vw] border-[1px] border-primary rounded-full border-dashed"
           />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5"
            >
              <span className="font-technical text-[10px] text-tertiary mb-6 flex items-center gap-2 uppercase font-bold tracking-widest">
                 <div className="w-1.5 h-1.5 bg-tertiary rounded-full animate-ping" />
                 Sector_02 // Spotlight
              </span>
              <h2 className="font-serif text-5xl text-primary mb-12 relative inline-block">
                The Anatomy of Shio Ramen
                <div className="absolute -bottom-4 left-0 w-1/3 h-[1px] bg-tertiary" />
              </h2>
              
              <div className="space-y-4">
                {[
                  { label: "Base Element", val: "Clear chicken broth, clarified at 85°C for 12 hours." },
                  { label: "Salinity Level", val: "1.2% Sea Salt harvested from the Okhotsk Sea." },
                  { label: "Texture Map", val: "Low-hydration wheat noodles, 0.8mm precision." },
                ].map((item, i) => (
                  <div key={i} className="group border-b border-primary/5 pb-4 cursor-crosshair">
                    <span className="font-technical text-[8px] text-primary/30 uppercase font-bold tracking-widest block mb-2 transition-colors group-hover:text-tertiary">{item.label}</span>
                    <div className="flex items-center gap-4">
                      <div className="w-0 h-[1px] bg-tertiary transition-all duration-500 group-hover:w-4" />
                      <p className="font-serif text-lg text-primary italic leading-relaxed group-hover:translate-x-2 transition-transform duration-500">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="mt-16 p-8 technical-card border border-primary/10 bg-neutral shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 rounded-bl-full pointer-events-none" />
                <h4 className="font-technical text-[9px] text-tertiary uppercase font-bold tracking-widest mb-8 flex items-center justify-between">
                   Recommended Establishments
                   <Compass size={14} className="animate-spin-slow" />
                </h4>
                <div className="space-y-4 font-serif text-sm">
                   {[
                     { name: "Kikanbo", city: "Kanda, Tokyo", rate: "9.8" },
                     { name: "Tsuta", city: "Yoyogi, Tokyo", rate: "9.5" },
                     { name: "Konjiki Hototogisu", city: "Shinjuku, Tokyo", rate: "9.6" },
                   ].map((r, i) => (
                     <div key={i} className="group/item flex justify-between items-center py-2 border-b border-primary/5 hover:border-tertiary/30 transition-colors cursor-pointer">
                        <div>
                          <p className="text-primary font-bold group-hover/item:text-tertiary transition-colors">{r.name}</p>
                          <p className="text-primary/40 italic text-[10px]">{r.city}</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="opacity-0 group-hover/item:opacity-100 transition-opacity -translate-x-2 group-hover/item:translate-x-0 duration-500">
                             <ArrowRight size={12} className="text-tertiary" />
                           </div>
                           <span className="font-technical text-sm text-tertiary font-bold bg-tertiary/10 px-2 py-1 rounded-sm">{r.rate}</span>
                        </div>
                     </div>
                   ))}
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:col-span-7 flex justify-end"
            >
               <div className="relative w-full aspect-[4/5] max-w-xl group">
                  {/* Decorative corner framing */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-tertiary/50 transition-all duration-700 group-hover:-top-6 group-hover:-left-6" />
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-tertiary/50 transition-all duration-700 group-hover:-bottom-6 group-hover:-right-6" />
                  
                  <div className="absolute -top-10 -right-10 w-full h-full border border-primary/5 -z-10 group-hover:top-0 group-hover:right-0 transition-all duration-700" />
                  <Image 
                    src="https://images.unsplash.com/photo-1557872245-741f4c666e5c?auto=format&fit=crop&q=80&w=1500" 
                    alt="Shio Ramen" 
                    fill 
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity mix-blend-overlay pointer-events-none" />
                  <div className="absolute bottom-10 -left-10 bg-primary text-neutral p-10 shadow-2xl overflow-hidden">
                     <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-tertiary opacity-30 transform translate-x-8 -translate-y-8 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
                     <p className="font-technical text-7xl font-bold leading-none">98%</p>
                     <p className="font-technical text-[10px] uppercase font-bold tracking-widest mt-2 text-tertiary">Umami Saturation</p>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
