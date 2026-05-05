"use client";

import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TechnicalOverlay } from "@/components/ui/TechnicalOverlay";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Database, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const initialContent = {
  home: {
    heroTitle: "Divine's Destinations",
    heroDescription: "Sharing travel with others through a lens of technical precision and narrative luxury.",
    coordinates: "08° 30' 00\" S, 115° 15' 00\" E",
    altitude: "12.4m",
    label: "Elite Travel Documentation"
  },
  about: {
    title: "Divine's Perspective.",
    description: "Observing the world through a lens of technical precision and poetic silence. A journey defined not by distance, but by the density of the moments captured.",
    subjectId: "099-DIVINE",
    phases: [
      { title: "Genesis", content: "Divine began as an exercise in structural observation. In a world saturated with fleeting imagery, the goal was to create a sanctuary of precision." },
      { title: "Evolution", content: "The technical data—the ISO settings, the coordinates, the barometric pressure—is not just metadata. It is the skeletal structure of a memory." },
      { title: "Current", content: "This narrative is built upon the pillars of intentional luxury. It is for the elite voyager who seeks the quietest corner of the busiest city." }
    ],
    metrics: [
      { label: "OPERATIONAL RANGE", val: "Global Nomadism", desc: "Focusing on high-altitude terrains and coastal architecture across four continents.", icon: "Compass" },
      { label: "GEAR SPEC", val: "85mm", desc: "Fixed Focal Length Preference", icon: "Gauge" },
      { label: "SHUTTER RESPONSE", val: "0.02s", desc: "Technical Latency Minimalized", icon: "Gauge" }
    ],
    faqs: [
      { q: "Mission Protocol", a: "Destinations are selected through a rigorous analysis of architectural significance, geographic isolation, and visual storytelling potential.", ref: "INT_MSG_01" },
      { q: "Hardware Integrity", a: "Standard operational gear includes the Leica SL2-S for visual documentation, technical apparel for extreme climates, and satellite communication arrays.", ref: "INT_MSG_02" }
    ]
  },
  gear: {
    title: "The Gear Manifest.",
    description: "Precision tools for the global nomad. A curated inventory of hardware selected for reliability, performance, and aesthetic integrity.",
    items: [
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
        icon: "Camera"
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
        icon: "Backpack"
      }
    ],
    featured: {
      title: "The Hinderer XM-18 3.5\"",
      description: "Essential operational hardware. Precision machined in the USA, this tool represents the pinnacle of reliability for the modern explorer.",
      img: "https://images.unsplash.com/photo-1614362984534-7389814421b3?auto=format&fit=crop&q=80&w=1000",
      specs: [
        { l: "Steel_Type", v: "CPM-S45VN" },
        { l: "Handle_Mat", v: "Grade 5 Titanium" }
      ]
    }
  },
  gastronomy: {
    heroTitle: "Global Flavors.",
    heroDescription: "An analytical exploration of gastronomy. We decode the DNA of regional cuisines, mapping the intersection of tradition and technical precision.",
    dishes: [
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
      }
    ],
    spotlight: {
      title: "The Anatomy of Shio Ramen",
      details: [
        { label: "Base Element", val: "Clear chicken broth, clarified at 85°C for 12 hours." },
        { label: "Salinity Level", val: "1.2% Sea Salt harvested from the Okhotsk Sea." }
      ],
      recommended: [
        { name: "Kikanbo", city: "Kanda, Tokyo", rate: "9.8" }
      ],
      img: "https://images.unsplash.com/photo-1557872245-741f4c666e5c?auto=format&fit=crop&q=80&w=1500",
      saturation: "98%"
    }
  },
  logistics: {
    heroTitle: "Logistics Protocol.",
    heroDescription: "Distilling the chaos of global movement into a curated series of high-definition, high-productivity moments.",
    latency: "0.02s",
    uptime: "99.9%",
    resources: [
      { title: "Planning Tools", desc: "Dynamic itinerary generation using real-time atmospheric data.", icon: "Map", stat: "1.2s Sync" },
      { title: "Flight Hacks", desc: "Bypass standard routing protocols for optimal transit efficiency.", icon: "PlaneTakeoff", stat: "142+ Nodes" }
    ],
    infrastructure: {
      uplink: "Engaged",
      localGrid: "Bypassed",
      timezones: [
        { city: "New York", utc: "UTC-5", active: true },
        { city: "London", utc: "UTC+1", active: false }
      ]
    }
  }
};

export default function SeedPage() {
  const [status, setStatus] = useState<"idle" | "seeding" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSeed = async () => {
    if (!confirm("Authorize Global Content Initialization? This will overwrite existing manifest data.")) return;
    
    setStatus("seeding");
    try {
      for (const [sectorId, content] of Object.entries(initialContent)) {
        const docRef = doc(db, 'site_content', sectorId);
        await setDoc(docRef, {
          id: sectorId,
          published: content,
          draft: content,
          updatedAt: Date.now()
        });
      }
      setStatus("success");
    } catch (error) {
      console.error("Seeding failed:", error);
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unknown connectivity error.");
    }
  };

  return (
    <main className="min-h-screen bg-neutral flex items-center justify-center p-6">
      <TechnicalOverlay />
      
      <div className="max-w-md w-full glass-panel p-8 border-l-2 border-tertiary relative overflow-hidden">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-tertiary/10 rounded-full">
            <Database className="text-tertiary" size={24} />
          </div>
          <div>
            <h1 className="font-heading text-2xl text-primary tracking-tighter">Manifest Initializer</h1>
            <p className="font-technical text-[8px] text-primary/40 uppercase tracking-widest">Global Content Registry v1.0</p>
          </div>
        </div>

        <div className="space-y-6">
          <p className="font-body text-sm text-primary/60 leading-relaxed">
            Execute this protocol to synchronize the base mission manifests with the Firestore Registry. 
            This process bypasses server-side GRPC limitations by leveraging browser-native connectivity.
          </p>

          {status === "idle" && (
            <MagneticButton onClick={handleSeed} className="w-full py-4 bg-primary text-neutral font-technical text-xs font-bold uppercase tracking-widest hover:bg-tertiary transition-colors">
              Initialize Registry
            </MagneticButton>
          )}

          {status === "seeding" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <Loader2 className="animate-spin text-tertiary" size={32} />
              <p className="font-technical text-[10px] text-tertiary uppercase font-bold animate-pulse">Synchronizing Manifests...</p>
            </div>
          )}

          {status === "success" && (
            <div className="bg-tertiary/5 border border-tertiary/20 p-4 flex gap-4 items-center">
              <CheckCircle2 className="text-tertiary shrink-0" size={20} />
              <div>
                <p className="font-technical text-[10px] text-tertiary uppercase font-bold">Initialization Successful</p>
                <p className="font-body text-[10px] text-primary/60">Global Content Registry is now online.</p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="bg-red-500/5 border border-red-500/20 p-4 flex gap-4 items-center">
              <AlertCircle className="text-red-500 shrink-0" size={20} />
              <div>
                <p className="font-technical text-[10px] text-red-500 uppercase font-bold">Protocol Failure</p>
                <p className="font-body text-[10px] text-primary/60">{errorMessage}</p>
              </div>
            </div>
          )}

          {status === "success" && (
            <MagneticButton onClick={() => window.location.href = "/admin"} className="w-full py-3 border border-primary/10 text-primary font-technical text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-neutral transition-all">
              Return to Command Hub
            </MagneticButton>
          )}
        </div>

        <div className="absolute -bottom-10 -right-10 opacity-5">
          <Database size={120} />
        </div>
      </div>
    </main>
  );
}
