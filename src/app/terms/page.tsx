"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TechnicalOverlay, Scanline } from "@/components/ui/TechnicalOverlay";
import { Key, AlertTriangle, FileWarning, Camera } from "lucide-react";

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("access");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    const sections = document.querySelectorAll("div[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const navItems = [
    { id: "access", label: "Network Access" },
    { id: "liability", label: "Operational Liabilities" },
    { id: "assets", label: "Visual Assets" }
  ];

  return (
    <main className="relative min-h-screen bg-neutral selection:bg-tertiary selection:text-neutral">
      <Navbar />
      <TechnicalOverlay className="opacity-10" />

      {/* Header */}
      <section className="relative pt-40 pb-20 px-6 md:px-12 lg:px-24 border-b border-primary/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Key size={16} className="text-tertiary" />
            <span className="font-technical text-[10px] text-tertiary uppercase tracking-[0.4em] font-bold">Protocol_Ref: TRM-002</span>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl text-primary mb-8 leading-none">
            Terms of Use.
          </h1>
          <p className="font-body text-xl text-primary/60 italic leading-relaxed">
            Mission parameters and operational liabilities. Engaging with the Divine Destinations network constitutes full acknowledgement of these operational directives.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 relative">
        {/* Sticky Nav */}
        <div className="md:col-span-3 hidden md:block">
          <div className="sticky top-32 space-y-4 border-l border-primary/10 pl-6">
             {navItems.map((item) => (
               <a 
                 key={item.id}
                 href={`#${item.id}`} 
                 className={`block font-technical text-[9px] uppercase font-bold tracking-widest transition-all duration-300 ${
                   activeSection === item.id 
                     ? "text-primary border-l-2 border-primary -ml-[25px] pl-[23px]" 
                     : "text-primary/40 hover:text-tertiary"
                 }`}
               >
                 {item.label}
               </a>
             ))}
          </div>
        </div>

        {/* Text Body */}
        <div className="md:col-span-9 space-y-24">
          
          <div id="access" className="scroll-mt-32">
            <h2 className="font-technical text-sm uppercase tracking-widest font-bold text-primary mb-8 flex items-center gap-4">
              <Key size={16} className="text-tertiary" /> Network Access
            </h2>
            <div className="space-y-6 font-body text-lg text-primary/70 leading-relaxed">
              <p>Access to the central network and Mission Control dashboard is granted on a strict authorization basis. Any attempts to bypass security nodes, inject malicious telemetry, or extract unauthorized intel will result in immediate termination of the session and IP blacklisting.</p>
              <p>You are responsible for maintaining the absolute secrecy of your operational credentials.</p>
            </div>
          </div>

          <div id="liability" className="scroll-mt-32">
            <h2 className="font-technical text-sm uppercase tracking-widest font-bold text-primary mb-8 flex items-center gap-4">
              <AlertTriangle size={16} className="text-tertiary" /> Operational Liabilities
            </h2>
            <div className="space-y-6 font-body text-lg text-primary/70 leading-relaxed">
              <p>The coordinates, gear specifications, and logistical routes documented within this archive are provided as historical records, not instructional directives. We assume zero liability for physical injury, equipment failure, or adverse atmospheric conditions encountered if you attempt to replicate these expeditions.</p>
              <div className="p-6 border-l-2 border-tertiary bg-tertiary/[0.02] text-sm">
                 <strong className="font-technical tracking-widest uppercase mb-2 block">Warning</strong>
                 <p>High-altitude traversal and coastal navigation carry inherent risks. Always consult active meteorological data before initiating a mission.</p>
              </div>
            </div>
          </div>

          <div id="assets" className="scroll-mt-32">
            <h2 className="font-technical text-sm uppercase tracking-widest font-bold text-primary mb-8 flex items-center gap-4">
              <Camera size={16} className="text-tertiary" /> Visual Assets & Copyright
            </h2>
            <div className="space-y-6 font-body text-lg text-primary/70 leading-relaxed">
              <p>All photographic records, architectural maps, and written chronicles hosted on this server are the exclusive intellectual property of Divine Destinations unless otherwise stated. Unauthorized extraction, duplication, or deployment of these assets in external theaters is strictly prohibited.</p>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
