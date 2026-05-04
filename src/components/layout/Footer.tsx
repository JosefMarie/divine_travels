"use client";

import React from "react";
import Link from "next/link";
import { 
  Terminal, 
  Globe, 
  Shield, 
  ArrowUpRight,
  Cpu,
  Mail,
  Navigation,
  BookOpen,
  FileText,
  Map,
  User,
  Settings,
  Backpack,
  Box,
  Utensils,
  ShieldCheck,
  Key,
  ActivitySquare
} from "lucide-react";
import { MagneticButton } from "../ui/MagneticButton";

const footerLinks = {
  primary: [
    { label: "Journal", href: "/", icon: BookOpen },
    { label: "Blog", href: "/blog", icon: FileText },
    { label: "Map Engine", href: "/map", icon: Map },
    { label: "About", href: "/about", icon: User },
  ],
  systems: [
    { label: "Mission Control", href: "/admin", icon: Settings },
    { label: "Gear Manifest", href: "/gear", icon: Backpack },
    { label: "Logistics", href: "/logistics", icon: Box },
    { label: "Gastronomy", href: "/gastronomy", icon: Utensils },
  ],
  legal: [
    { label: "Privacy Protocol", href: "/privacy", icon: ShieldCheck },
    { label: "Terms of Use", href: "/terms", icon: Key },
    { label: "System Status", href: "/status", icon: ActivitySquare },
  ]
};

export const Footer = () => {
  return (
    <footer className="relative bg-neutral border-t border-primary/5 pt-24 pb-12 px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute bottom-0 right-0 p-24 opacity-[0.02] font-technical text-[200px] font-bold select-none leading-none rotate-12">
        DIVINE
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-12 gap-12 mb-24">
          {/* Brand Column */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div>
              <h2 className="text-2xl font-brand font-bold tracking-[0.2em] text-primary uppercase mb-2">
                Divine&apos;s Destinations
              </h2>
              <p className="font-technical text-[8px] text-tertiary font-bold tracking-[0.4em] uppercase">
                Technical Precision in Travel
              </p>
            </div>
            
            <p className="font-body text-lg text-primary/60 italic leading-relaxed max-w-sm">
              A technical archive of human exploration. Documenting the world with precision and narrative depth.
            </p>

            <div className="flex gap-4">
              <MagneticButton className="p-3 border border-primary/10 rounded-full text-primary/40 hover:text-tertiary hover:border-tertiary transition-all">
                <Terminal size={18} />
              </MagneticButton>
              <MagneticButton className="p-3 border border-primary/10 rounded-full text-primary/40 hover:text-tertiary hover:border-tertiary transition-all">
                <Globe size={18} />
              </MagneticButton>
              <MagneticButton className="p-3 border border-primary/10 rounded-full text-primary/40 hover:text-tertiary hover:border-tertiary transition-all">
                <Mail size={18} />
              </MagneticButton>
            </div>
          </div>

          {/* Links Matrix */}
          <div className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="font-accent text-[10px] text-primary/30 uppercase font-bold tracking-widest mb-8 flex items-center gap-2">
                <Navigation size={10} className="text-tertiary" />
                Discovery Hub
              </h4>
              <ul className="space-y-4">
                {footerLinks.primary.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="font-body text-primary/60 hover:text-primary transition-all duration-300 flex items-center gap-3 group"
                    >
                      <link.icon size={14} className="opacity-40 group-hover:opacity-100 group-hover:text-tertiary transition-colors duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                      <ArrowUpRight size={12} className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-tertiary transition-all duration-300 ml-auto" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-accent text-[10px] text-primary/30 uppercase font-bold tracking-widest mb-8 flex items-center gap-2">
                <Cpu size={10} className="text-tertiary" />
                Specialized
              </h4>
              <ul className="space-y-4">
                {footerLinks.systems.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="font-body text-primary/60 hover:text-primary transition-all duration-300 flex items-center gap-3 group"
                    >
                      <link.icon size={14} className="opacity-40 group-hover:opacity-100 group-hover:text-tertiary transition-colors duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                      <ArrowUpRight size={12} className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-tertiary transition-all duration-300 ml-auto" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="font-accent text-[10px] text-primary/30 uppercase font-bold tracking-widest mb-8 flex items-center gap-2">
                <Shield size={10} className="text-tertiary" />
                Compliance
              </h4>
              <ul className="space-y-4">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="font-body text-primary/60 hover:text-primary transition-all duration-300 flex items-center gap-3 group"
                    >
                      <link.icon size={14} className="opacity-40 group-hover:opacity-100 group-hover:text-tertiary transition-colors duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                      <ArrowUpRight size={12} className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-tertiary transition-all duration-300 ml-auto" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Technical Bar */}
        <div className="pt-8 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8">
            <p className="font-technical text-[8px] text-primary/20 tracking-[0.4em] uppercase">
              © 2026 Divine&apos;s Destinations // Terminal V.0.4.2
            </p>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/40 animate-pulse" />
              <span className="font-technical text-[8px] text-primary/20 uppercase font-bold">System Nominal</span>
            </div>
          </div>

          <div className="flex gap-8">
            <div className="flex flex-col items-end">
              <span className="font-technical text-[7px] text-primary/20 uppercase font-bold mb-1">Curation Index</span>
              <span className="font-technical text-[10px] text-primary/40 font-bold">0.994_STABLE</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-technical text-[7px] text-primary/20 uppercase font-bold mb-1">Local Synchronization</span>
              <span className="font-technical text-[10px] text-primary/40 font-bold">UTC+00:00</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
