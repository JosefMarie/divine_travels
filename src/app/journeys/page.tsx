"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { TechnicalOverlay, Scanline } from "@/components/ui/TechnicalOverlay";
import { Search, ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import Image from "next/image";
import Link from "next/link";
import { subscribeToDestinations } from "@/lib/db/destinations";
import { Destination } from "@/types";

const CATEGORIES = ["All", "CHRONICLE", "RETREAT", "ASTRO", "CULTURE", "WILDERNESS", "EXPEDITION"];

const SkeletonCard = () => (
  <div className="group cursor-pointer animate-pulse">
    <div className="relative aspect-[4/5] overflow-hidden mb-8 bg-primary/10" />
    <div className="h-3 w-16 bg-primary/10 rounded mb-2" />
    <div className="h-8 w-3/4 bg-primary/10 rounded" />
  </div>
);

export default function JourneysPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsub = subscribeToDestinations((data) => {
      setDestinations(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = destinations.filter((d) => {
    const matchesCategory = activeCategory === "All" || d.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="relative min-h-screen pt-32 px-6 md:px-12 bg-neutral">
      <Navbar />
      <TechnicalOverlay className="opacity-5" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-24">
          <p className="font-technical text-[10px] text-primary/50 mb-4 tracking-[0.4em] font-bold uppercase">
            Archive Hub
          </p>
          <h1 className="font-serif text-6xl md:text-8xl text-primary uppercase mb-12">
            Journeys
          </h1>

          {/* Filter/Search Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-y border-primary/5 py-8">
            <div className="flex flex-wrap items-center gap-8 font-technical text-[10px] tracking-widest uppercase font-bold text-primary/40">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`transition-colors pb-1 ${
                    activeCategory === cat
                      ? "text-tertiary border-b border-tertiary"
                      : "hover:text-primary"
                  }`}
                >
                  {cat === "All" ? "All Chronologies" : cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH COORDINATES / LOCATION..."
                className="w-full bg-primary/[0.03] border-none font-technical text-[9px] py-4 px-6 focus:ring-1 focus:ring-tertiary transition-all placeholder:text-primary/20 uppercase tracking-widest"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/20" size={14} />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12 mb-32">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div className="col-span-3 text-center py-32">
              <p className="font-technical text-[10px] text-primary/30 uppercase tracking-widest">
                No destinations found.
              </p>
            </div>
          ) : (
            filtered.map((story, idx) => (
              <div key={story.id} className="group cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden mb-8 grayscale group-hover:grayscale-0 transition-all duration-700">
                  {story.imageUrl && (
                    <Image
                      src={`${story.imageUrl}?auto=format&fit=crop&q=80&w=1000`}
                      alt={story.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  )}
                  <Scanline />
                  <div className="absolute top-4 left-4 p-4 glass-panel border-none">
                    <span className="font-technical text-[9px] font-bold text-primary">
                      {String(idx + 1).padStart(3, "0")}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-technical text-[8px] tracking-[0.2em] font-bold text-tertiary uppercase">
                    {story.category}
                  </span>
                  <span className="font-technical text-[8px] tracking-widest font-bold text-primary/30 uppercase">
                    {story.location}
                  </span>
                </div>
                <h3 className="font-serif text-3xl text-primary group-hover:text-tertiary transition-colors">
                  {story.title}
                </h3>
                <MagneticButton className="mt-8 group flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-technical text-[9px] uppercase tracking-widest font-bold">
                    Read Chronicle
                  </span>
                  <ArrowRight size={14} className="text-tertiary" />
                </MagneticButton>
              </div>
            ))
          )}
        </div>
      </div>

      <footer className="py-12 border-t border-primary/5 text-center">
        <p className="font-technical text-[8px] tracking-[0.5em] uppercase text-primary/10">
          Archive Synchronized — {filtered.length} Destinations Live
        </p>
      </footer>
    </main>
  );
}
