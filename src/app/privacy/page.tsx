"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TechnicalOverlay } from "@/components/ui/TechnicalOverlay";
import { ShieldCheck, Lock, Database, EyeOff, Network } from "lucide-react";

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("telemetry");

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
    { id: "telemetry", label: "Telemetry Collection" },
    { id: "encryption", label: "Encryption Standards" },
    { id: "archiving", label: "Data Archiving" },
    { id: "nodes", label: "Third-Party Nodes" }
  ];

  return (
    <main className="relative min-h-screen bg-transparent selection:bg-tertiary selection:text-neutral">
      <Navbar />
      <TechnicalOverlay className="opacity-10" />

      {/* Header */}
      <section className="relative pt-40 pb-20 px-6 md:px-12 lg:px-24 border-b border-primary/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <ShieldCheck size={16} className="text-tertiary" />
            <span className="font-technical text-[10px] text-tertiary uppercase tracking-[0.4em] font-bold">Protocol_Ref: PRV-001</span>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl text-primary mb-8 leading-none">
            Privacy Protocol.
          </h1>
          <p className="font-body text-xl text-primary/60 italic leading-relaxed">
            Data telemetry rules and encryption standards. We monitor the minimal required parameters to ensure mission success while maintaining operational opacity for all personnel.
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
          
          <div id="telemetry" className="scroll-mt-32">
            <h2 className="font-technical text-sm uppercase tracking-widest font-bold text-primary mb-8 flex items-center gap-4">
              <EyeOff size={16} className="text-tertiary" /> Telemetry Collection
            </h2>
            <div className="space-y-6 font-body text-lg text-primary/70 leading-relaxed">
              <p>During your traversal of the Divine Destinations network, passive telemetry sensors capture non-identifying operational data. This includes node latency, viewport dimensions, and navigation vectors.</p>
              <p>We do not deploy invasive tracking matrices. Cookies are utilized strictly as session-integrity tokens, ensuring your secure connection to the Mission Control dashboard is maintained without interruption.</p>
            </div>
          </div>

          <div id="encryption" className="scroll-mt-32">
            <h2 className="font-technical text-sm uppercase tracking-widest font-bold text-primary mb-8 flex items-center gap-4">
              <Lock size={16} className="text-tertiary" /> Encryption Standards
            </h2>
            <div className="space-y-6 font-body text-lg text-primary/70 leading-relaxed">
              <p>All data transmitted between your local terminal and our central servers is encrypted using standard AES-256 protocols. Operational coordinates, logistical bookings, and direct communications are strictly opaque to external interception.</p>
            </div>
            <div className="mt-8 p-6 technical-card border border-primary/5 bg-primary/[0.02]">
               <span className="font-technical text-[8px] uppercase tracking-widest text-primary/40 block mb-4">Encryption Profile</span>
               <div className="grid grid-cols-2 gap-4 font-technical text-sm text-primary font-bold">
                 <div>Protocol: <span className="text-tertiary">TLS 1.3</span></div>
                 <div>Cipher: <span className="text-tertiary">ECDHE-RSA-AES256-GCM-SHA384</span></div>
               </div>
            </div>
          </div>

          <div id="archiving" className="scroll-mt-32">
            <h2 className="font-technical text-sm uppercase tracking-widest font-bold text-primary mb-8 flex items-center gap-4">
              <Database size={16} className="text-tertiary" /> Data Archiving
            </h2>
            <div className="space-y-6 font-body text-lg text-primary/70 leading-relaxed">
              <p>Records of past expeditions, submitted field notes, and archived photography are stored indefinitely within secure vaults unless a localized deletion command is initiated by the user. Deletion is absolute; we do not retain shadow backups of purged data.</p>
            </div>
          </div>

          <div id="nodes" className="scroll-mt-32">
            <h2 className="font-technical text-sm uppercase tracking-widest font-bold text-primary mb-8 flex items-center gap-4">
              <Network size={16} className="text-tertiary" /> Third-Party Nodes
            </h2>
            <div className="space-y-6 font-body text-lg text-primary/70 leading-relaxed">
              <p>We do not broker telemetry with external intelligence agencies or marketing conglomerates. However, operational necessities require integration with secure third-party nodes, including payment gateways and edge-caching networks.</p>
              <p>These external nodes operate under strict NDAs and are technically barred from accessing de-encrypted personnel logs.</p>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
