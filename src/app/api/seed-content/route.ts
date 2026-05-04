import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

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
      { label: "GEAR SPEC", val: "85mm", desc: "Fixed Focal Length Preference", icon: "Gauge", theme: "dark" },
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

export async function GET() {
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
    return NextResponse.json({ message: "Content seeded successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
