"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Layers, Target, ArrowUpRight, Loader2 } from "lucide-react";
import { MagneticButton } from "../ui/MagneticButton";
import Map, { Marker } from 'react-map-gl/mapbox';
import type { MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from "next/link";
import { subscribeToPosts } from "@/lib/db/posts";
import { Post } from "@/types";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

// Parse "lat, lon" string (supports degrees/cardinals) into { longitude, latitude }
function parseCoords(raw?: string): { longitude: number; latitude: number } | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[°NSEW]/gi, '').trim();
  const parts = cleaned.split(',').map(s => parseFloat(s.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { latitude: parts[0], longitude: parts[1] };
  }
  return null;
}

type LivePin = {
  post: Post;
  latitude: number;
  longitude: number;
};

export const MapEngine = ({ focusLocation }: { focusLocation?: { longitude: number; latitude: number; id: string } | null }) => {
  const mapRef = useRef<MapRef>(null);
  const [pins, setPins] = useState<LivePin[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePin, setActivePin] = useState<LivePin | null>(null);

  const handleFlyTo = (longitude: number, latitude: number) => {
    mapRef.current?.flyTo({ center: [longitude, latitude], zoom: 6, duration: 3000, essential: true });
  };

  // Handle external focus (e.g. from sidebar)
  useEffect(() => {
    if (focusLocation) {
      handleFlyTo(focusLocation.longitude, focusLocation.latitude);
      // Also set as active pin if it matches one of our posts
      const match = pins.find(p => p.post.id === focusLocation.id);
      if (match) {
        const timer = setTimeout(() => setActivePin(match), 0);
        return () => clearTimeout(timer);
      }
    }
  }, [focusLocation, pins]);

  // Subscribe to Firestore posts and build live pin list
  useEffect(() => {
    const unsub = subscribeToPosts((posts) => {
      const live: LivePin[] = [];
      posts.forEach(post => {
        const coords = parseCoords(post.coordinates);
        if (coords) live.push({ post, ...coords });
      });
      setPins(live);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleZoom = (direction: 'in' | 'out') => {
    const currentZoom = mapRef.current?.getZoom() || 1;
    mapRef.current?.zoomTo(direction === 'in' ? currentZoom + 1 : currentZoom - 1, { duration: 1000 });
  };

  const statusColor = (s: string) =>
    s === 'live' ? 'text-green-600' : s === 'draft' ? 'text-tertiary' : 'text-primary/40';
  const statusDot = (s: string) =>
    s === 'live' ? 'bg-green-600' : s === 'draft' ? 'bg-tertiary' : 'bg-primary/30';
  const dotGlow = (s: string) =>
    s === 'live' ? '0 0 15px rgba(22,163,74,0.6)' : s === 'draft' ? '0 0 15px rgba(179,48,91,0.5)' : 'none';

  return (
    <div className="relative w-full h-full bg-neutral overflow-hidden flex items-center justify-center">

      {/* Background Mapbox Instance */}
      <div className="absolute inset-0 z-0">
        <Map
          ref={mapRef}
          initialViewState={{ longitude: 10, latitude: 30, zoom: 1.5 }}
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: '100%', height: '100%' }}
          projection={{ name: 'globe' }}
          dragRotate={false}
          pitchWithRotate={false}
        >
          <style>{`
            .mapboxgl-canvas {
              filter: grayscale(1) sepia(0.2) hue-rotate(70deg) opacity(0.6);
              mix-blend-mode: multiply;
            }
            .mapboxgl-ctrl-bottom-left, .mapboxgl-ctrl-bottom-right { display: none !important; }
          `}</style>

          {/* Live Firestore Markers */}
          {pins.map((pin) => (
            <Marker
              key={pin.post.id}
              longitude={pin.longitude}
              latitude={pin.latitude}
              anchor="center"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setActivePin(activePin?.post.id === pin.post.id ? null : pin);
                handleFlyTo(pin.longitude, pin.latitude);
              }}
            >
              <div className="relative flex items-center justify-center group cursor-pointer">
                {/* Sonar ping for live entries */}
                {pin.post.status === 'live' && (
                  <>
                    <div className="w-16 h-16 rounded-full border border-green-500/40 absolute animate-ping" style={{ animationDuration: '2s' }} />
                    <div className="w-24 h-24 rounded-full border border-green-500/20 absolute animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
                  </>
                )}
                {pin.post.status === 'draft' && (
                  <div className="w-12 h-12 rounded-full border border-tertiary/30 absolute animate-ping" style={{ animationDuration: '3s' }} />
                )}

                {/* Core Node */}
                <div
                  className="w-3 h-3 rounded-full relative z-20 transition-all duration-300 group-hover:scale-150"
                  style={{
                    backgroundColor: pin.post.status === 'live' ? '#16a34a' : pin.post.status === 'draft' ? '#b3305b' : '#888',
                    boxShadow: dotGlow(pin.post.status),
                  }}
                />

                {/* Hover Tooltip */}
                <div className="absolute -top-12 whitespace-nowrap bg-neutral/90 backdrop-blur-md px-3 py-1 border border-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 pointer-events-none">
                  <span className={`font-technical text-[8px] font-bold uppercase tracking-widest ${statusColor(pin.post.status)}`}>
                    {pin.post.title} {"//"} {pin.post.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </Marker>
          ))}

          {/* Fallback placeholder pins when no data yet */}
          {!loading && pins.length === 0 && [
            { longitude: -105.2, latitude: 40.0 },
            { longitude: 8.5, latitude: 47.3 },
            { longitude: 139.6, latitude: 35.6 },
          ].map((loc, i) => (
            <Marker key={i} longitude={loc.longitude} latitude={loc.latitude} anchor="center">
              <div className="w-3 h-3 rounded-full bg-primary/20 animate-pulse" />
            </Marker>
          ))}
        </Map>

        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 technical-grid opacity-30 pointer-events-none" />
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 glass-panel px-4 py-2">
          <Loader2 size={12} className="animate-spin text-primary/40" />
          <span className="font-technical text-[9px] uppercase tracking-widest text-primary/40">Synchronizing Registry...</span>
        </div>
      )}

      {/* Live entry count badge */}
      {!loading && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-50">
          <div className="glass-panel px-4 py-2 flex items-center gap-3">
            <span className={`w-1.5 h-1.5 rounded-full ${pins.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-primary/20'}`} />
            <span className="font-technical text-[9px] uppercase tracking-widest text-primary/60">
              {pins.length} {pins.length === 1 ? 'Entry' : 'Entries'} Mapped
            </span>
          </div>
        </div>
      )}

      {/* Control Overlays */}
      <div className="absolute top-44 left-8 flex flex-col gap-4 z-50">
        <div className="flex gap-2">
          <MagneticButton className="glass-panel p-3 text-primary hover:bg-primary/5" onClick={() => handleZoom('in')}>
            <Plus size={18} />
          </MagneticButton>
          <MagneticButton className="glass-panel p-3 text-primary hover:bg-primary/5" onClick={() => handleZoom('out')}>
            <Minus size={18} />
          </MagneticButton>
          <MagneticButton className="glass-panel p-3 text-primary hover:bg-primary/5" onClick={() => { mapRef.current?.flyTo({ center: [10, 30], zoom: 1.5, duration: 2000 }); setActivePin(null); }}>
            <Layers size={18} />
          </MagneticButton>
        </div>
      </div>

      {/* Pin Detail Panel */}
      <AnimatePresence>
        {activePin && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute top-32 right-8 w-80 glass-panel border border-primary/10 p-8 z-50 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${statusDot(activePin.post.status)} ${activePin.post.status === 'live' ? 'animate-pulse' : ''}`} />
                <span className={`font-technical text-[10px] font-bold tracking-widest uppercase ${statusColor(activePin.post.status)}`}>
                  {activePin.post.status}
                </span>
              </div>
              <button
                onClick={() => { setActivePin(null); mapRef.current?.flyTo({ center: [10, 30], zoom: 1.5, duration: 2000 }); }}
                className="text-primary/20 hover:text-primary transition-colors"
              >
                <Plus className="rotate-45" size={20} />
              </button>
            </div>

            <span className="font-accent text-[9px] text-primary/40 uppercase tracking-widest">{activePin.post.category}</span>
            <h3 className="font-heading text-2xl text-primary mb-3 leading-tight mt-1">{activePin.post.title}</h3>
            <p className="font-body text-sm text-primary/60 italic mb-6 leading-relaxed line-clamp-3">
              {activePin.post.excerpt || 'No excerpt available.'}
            </p>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-4 border-t border-primary/5 pt-6 mb-6">
              <div>
                <span className="block font-technical text-[8px] uppercase opacity-40 mb-1 tracking-tighter">Lat</span>
                <span className="block font-technical text-[10px] font-bold text-primary">
                  {Math.abs(activePin.latitude).toFixed(4)}° {activePin.latitude >= 0 ? 'N' : 'S'}
                </span>
              </div>
              <div>
                <span className="block font-technical text-[8px] uppercase opacity-40 mb-1 tracking-tighter">Long</span>
                <span className="block font-technical text-[10px] font-bold text-primary">
                  {Math.abs(activePin.longitude).toFixed(4)}° {activePin.longitude >= 0 ? 'E' : 'W'}
                </span>
              </div>
              {activePin.post.gear && (
                <div className="col-span-2">
                  <span className="block font-technical text-[8px] uppercase opacity-40 mb-1 tracking-tighter">Gear</span>
                  <span className="block font-technical text-[10px] font-bold text-primary">{activePin.post.gear}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <MagneticButton
                className="flex-1 group gap-2 border-b border-primary/10 pb-2"
                onClick={() => handleFlyTo(activePin.longitude, activePin.latitude)}
              >
                <span className="font-technical text-[10px] uppercase tracking-widest font-bold">Re-Flyover</span>
                <Target size={14} className="text-tertiary" />
              </MagneticButton>
              {activePin.post.status === 'live' && (
                <Link href={`/blog/${activePin.post.id}`}>
                  <MagneticButton className="group gap-2 border-b border-tertiary pb-2">
                    <span className="font-technical text-[10px] uppercase tracking-widest font-bold text-tertiary">Read</span>
                    <ArrowUpRight size={14} className="text-tertiary" />
                  </MagneticButton>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapEngine;
