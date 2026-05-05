"use client";

import React, { useState, useEffect } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { TechnicalOverlay, Scanline } from "@/components/ui/TechnicalOverlay";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowRight, MoveUpRight, MapPin, Home as HomeIcon, Sparkles, Compass, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { subscribeToPosts } from "@/lib/db/posts";
import { subscribeToSectorContent } from "@/lib/db/content";
import { Post, HomeContent } from "@/types";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<string | null>(null);

  useEffect(() => {
    // Attempt Geolocation Scan
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const latDir = latitude >= 0 ? 'N' : 'S';
        const lonDir = longitude >= 0 ? 'E' : 'W';
        const formatted = `${Math.abs(latitude).toFixed(4)}° ${latDir}, ${Math.abs(longitude).toFixed(4)}° ${lonDir}`;
        setUserLocation(formatted);
      });
    }
    
    const unsubPosts = subscribeToPosts((data) => {
      setPosts(data.slice(0, 3)); // Top 3 latest
      setLoading(false);
    });
    
    // Initial direct fetch for reliability
    import('@/lib/db/content').then(m => {
      m.getSectorContent<HomeContent>('home').then(data => {
        if (data) setContent(data);
      });
    });

    const unsubContent = subscribeToSectorContent<HomeContent>('home', (data) => {
      setContent(data);
    });

    return () => {
      unsubPosts();
      unsubContent();
    };
  }, []);

  const getCategoryIcon = (cat: string) => {
    const c = cat.toUpperCase();
    if (c.includes('ASTRO')) return Sparkles;
    if (c.includes('RETREAT')) return HomeIcon;
    if (c.includes('EXPEDITION')) return Compass;
    return MapPin;
  };

  return (
    <main className="relative min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-32 px-6 md:px-12 overflow-hidden">
        <TechnicalOverlay />
        
        <div className="max-w-7xl mx-auto w-full grid grid-cols-12 gap-8 items-center z-10">
          <div className="col-span-12 lg:col-span-7">
            <div className="inline-block px-4 py-1 border border-primary/30 mb-8 bg-neutral/50 backdrop-blur-sm relative overflow-hidden group">
              <div className="flex items-center gap-2">
                <div className={`w-1 h-1 rounded-full ${userLocation ? 'bg-tertiary' : 'bg-primary/30 animate-pulse'}`} />
                <p className="font-technical text-[10px] text-primary uppercase tracking-[0.2em] font-bold">
                  {userLocation ? `USER_LOC // ${userLocation}` : (content?.label || "Elite Travel Documentation")}
                </p>
              </div>
              {!userLocation && <div className="absolute inset-0 bg-primary/5 -translate-x-full animate-[scan_2s_linear_infinite]" />}
            </div>
            
            <h1 className="font-brand text-6xl md:text-8xl text-primary mb-6 leading-[0.9] tracking-tight font-black">
              {content?.heroTitle.split(' ').map((word, i) => (
                <React.Fragment key={i}>
                  {word} {i === 0 && <br />}
                </React.Fragment>
              )) || "Divine's Destinations"}
            </h1>
            
            <p className="font-body text-xl md:text-2xl text-primary/70 mb-12 max-w-xl italic">
              {content?.heroDescription || "Sharing travel with others through a lens of technical precision and narrative luxury."}
            </p>
            
            <div className="flex flex-wrap gap-8">
              <Link href="/blog">
                <MagneticButton className="group gap-4 border-b border-tertiary pb-2">
                  <span className="font-technical text-xs uppercase tracking-widest font-bold">Explore My Travels</span>
                  <ArrowRight size={16} className="text-tertiary transition-transform group-hover:translate-x-2" />
                </MagneticButton>
              </Link>
              
              <Link href="/about">
                <MagneticButton className="group gap-4 border-b border-primary/20 pb-2">
                  <span className="font-technical text-xs uppercase tracking-widest font-bold text-primary/60">About Me</span>
                  <MoveUpRight size={16} className="text-primary/40 group-hover:text-primary transition-colors" />
                </MagneticButton>
              </Link>
            </div>
          </div>
          
          <div className="col-span-12 lg:col-span-5 relative">
            <div className="group relative aspect-[4/5] overflow-hidden border border-primary/10 shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=75&w=1200" 
                alt="Luxury travel"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
              />
              <Scanline />
              
              <div className="absolute bottom-6 left-6 right-6 p-6 glass-panel border border-primary/10">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="font-technical text-[8px] uppercase opacity-50 mb-1 tracking-tighter">Current Coordinates</p>
                    <p className="font-technical text-[10px] font-bold">{content?.coordinates || "08° 30' 00\" S, 115° 15' 00\" E"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-technical text-[8px] uppercase opacity-50 mb-1 tracking-tighter">Altitude</p>
                    <p className="font-technical text-2xl leading-none text-tertiary">{content?.altitude || "12.4m"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Micro Detailing SVG */}
            <div className="absolute -top-8 -right-8 w-32 h-32 pointer-events-none opacity-20">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-primary stroke-[0.5]">
                <circle cx="50" cy="50" r="45" />
                <path d="M50 5 L50 95 M5 50 L95 50" />
                <circle cx="50" cy="50" r="2" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Stories Section */}
      <section className="py-24 px-6 md:px-12 bg-primary/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <p className="font-technical text-[10px] text-primary/50 mb-2 tracking-[0.3em] font-bold uppercase">01 — COLLECTION</p>
              <h2 className="font-heading text-4xl md:text-5xl text-primary">Recent Stories</h2>
            </div>
            <Link href="/blog">
              <MagneticButton className="hidden md:flex items-center gap-4 text-primary/60 hover:text-tertiary transition-colors">
                <div className="h-[1px] w-12 bg-primary/20" />
                <span className="font-technical text-[10px] uppercase tracking-widest font-bold">View Archive</span>
              </MagneticButton>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="technical-card p-4 animate-pulse">
                  <div className="aspect-[16/10] bg-primary/5 mb-8" />
                  <div className="h-4 w-24 bg-primary/5 mb-4" />
                  <div className="h-8 w-48 bg-primary/5 mb-4" />
                  <div className="h-4 w-full bg-primary/5" />
                </div>
              ))
            ) : posts.length === 0 ? (
              <div className="col-span-3 text-center py-20 border border-dashed border-primary/10">
                <p className="font-technical text-xs text-primary/40 uppercase tracking-widest">Archive empty // Mission in progress</p>
              </div>
            ) : (
              posts.slice(0, 3).map((story) => {
                const Icon = getCategoryIcon(story.category);
                return (
                  <Link href={`/blog/${story.id}`} key={story.id}>
                    <div className="group cursor-pointer technical-card p-4 h-full flex flex-col">
                      <div className="relative aspect-[16/10] overflow-hidden border border-primary/5 group-hover:border-tertiary/20 transition-colors duration-500">
                        <Image 
                          src={`${story.imageUrl || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"}?auto=format&fit=crop&q=70&w=800`} 
                          alt={story.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Scanline />
                      </div>
                      <div className="pt-8 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <span className="font-technical text-[10px] text-primary/40 font-bold tracking-widest">{story.category.toUpperCase()}</span>
                          <Icon size={16} className="text-primary/20 group-hover:text-tertiary transition-colors" />
                        </div>
                        <h3 className="font-heading text-2xl text-primary mb-4 group-hover:text-tertiary transition-colors">{story.title}</h3>
                        <p className="font-body text-sm text-primary/60 line-clamp-2 leading-relaxed italic mb-auto">{story.excerpt}</p>
                        <div className="mt-8 pt-6 border-t border-primary/5 flex items-center justify-between">
                          <div>
                            <span className="block font-technical text-[8px] uppercase opacity-40 mb-1 tracking-tighter">Coordinates</span>
                            <span className="block font-technical text-[10px] font-bold text-primary">{story.coordinates || 'N/A'}</span>
                          </div>
                          <MoveUpRight size={18} className="text-tertiary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Elite Recommendations Section */}
      <section className="py-24 px-6 md:px-12 border-y border-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-4 mb-4">
                <Award size={20} className="text-tertiary" />
                <p className="font-technical text-[10px] text-tertiary tracking-[0.3em] font-bold uppercase">ELITE_MANIFEST // UNIT-01</p>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl text-primary mb-4">Recommended Chronicles</h2>
              <p className="font-body text-primary/60 italic leading-relaxed">
                Mission chronicles prioritized by global operator validation and technical narrative impact.
              </p>
            </div>
            <Link href="/blog">
              <MagneticButton className="flex items-center gap-4 text-primary group">
                <span className="font-technical text-[10px] uppercase tracking-widest font-bold">Discover More</span>
                <div className="w-12 h-12 rounded-full border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-neutral transition-all">
                  <ArrowRight size={16} />
                </div>
              </MagneticButton>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {posts
              .filter(p => (p.recommendations || 0) > 0)
              .sort((a, b) => (b.recommendations || 0) - (a.recommendations || 0))
              .slice(0, 2)
              .map((story) => (
                <Link href={`/blog/${story.id}`} key={story.id}>
                  <div className="group relative flex flex-col md:flex-row technical-card overflow-hidden bg-primary/[0.01]">
                    <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                      <Image 
                        src={story.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"} 
                        alt={story.title}
                        fill
                        className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-primary/20 opacity-20 group-hover:opacity-0 transition-opacity" />
                    </div>
                    <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-6">
                        <Award size={14} className="text-tertiary" />
                        <span className="font-technical text-[9px] text-tertiary font-bold uppercase tracking-widest">{story.recommendations} Recommendations</span>
                      </div>
                      <h3 className="font-heading text-3xl text-primary mb-4 group-hover:text-tertiary transition-colors">{story.title}</h3>
                      <p className="font-body text-sm text-primary/60 line-clamp-3 mb-8 italic">{story.excerpt}</p>
                      <div className="flex items-center gap-4">
                        <span className="font-technical text-[8px] uppercase font-bold text-primary/40 tracking-[0.2em]">Read Dispatch</span>
                        <div className="h-[1px] flex-1 bg-primary/10" />
                        <MoveUpRight size={14} className="text-tertiary" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
