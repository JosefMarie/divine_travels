"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ChevronDown, Shield, Settings, Camera, UtensilsCrossed, Navigation, Search } from "lucide-react";
import { MagneticButton } from "../ui/MagneticButton";
import { SearchScan } from "../ui/SearchScan";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { label: "Journeys", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Map", href: "/map" },
];

export const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [showSystems, setShowSystems] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6 glass-panel border-b border-primary/5">
      <Link href="/" className="text-4xl font-brand font-bold tracking-[0.1em] text-primary transition-colors hover:text-tertiary">
        Divine&apos;s Destinations
      </Link>
      
      <div className="hidden md:flex items-center gap-4 font-body text-xs tracking-widest uppercase font-bold">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`relative px-6 py-2 transition-colors duration-500 ${isActive ? 'text-tertiary' : 'text-primary/40 hover:text-primary'}`}
            >
              {isActive && (
                <motion.div 
                  layoutId="nav-active"
                  className="absolute inset-0 bg-tertiary/[0.03] border-b border-tertiary -z-10 overflow-hidden"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <motion.div 
                    animate={{ 
                      x: ["-100%", "200%"],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                    className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-tertiary/20 to-transparent skew-x-12"
                  />
                </motion.div>
              )}
              <span className="relative z-10">{link.label}</span>
            </Link>
          );
        })}
        
        {/* Systems Dropdown */}
        <div 
          className="relative ml-4"
          onMouseEnter={() => setShowSystems(true)}
          onMouseLeave={() => setShowSystems(false)}
        >
          <button className={`flex items-center gap-2 py-2 px-4 transition-colors cursor-pointer group uppercase ${showSystems ? 'text-tertiary' : 'text-primary/40 hover:text-primary'}`}>
            Systems 
            <ChevronDown size={10} className={`transition-transform duration-300 ${showSystems ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showSystems && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 mt-4 p-6 glass-panel border border-primary/10 min-w-[240px] shadow-2xl backdrop-blur-2xl"
              >
                <h4 className="font-accent text-[10px] text-primary/30 uppercase font-bold tracking-widest mb-8 flex items-center gap-2">
                  <Navigation size={10} className="text-tertiary" />
                  Discovery Hub
                </h4>
                <div className="flex flex-col gap-6">
                  <Link href="/gear" className="flex items-center gap-4 group">
                    <Camera size={14} className="text-primary/60" />
                    <div className="flex flex-col">
                      <span className="text-primary group-hover:text-tertiary transition-colors">Gear Manifest</span>
                      <span className="text-[7px] opacity-40 lowercase font-technical">Hardware Inventory</span>
                    </div>
                  </Link>

                  <Link href="/gastronomy" className="flex items-center gap-4 group">
                    <UtensilsCrossed size={14} className="text-primary/60" />
                    <div className="flex flex-col">
                      <span className="text-primary group-hover:text-tertiary transition-colors">Gastronomy</span>
                      <span className="text-[7px] opacity-40 lowercase font-technical">Culinary Archive</span>
                    </div>
                  </Link>
                  
                  <Link href="/logistics" className="flex items-center gap-4 group">
                    <Settings size={14} className="text-primary/60" />
                    <div className="flex flex-col">
                      <span className="text-primary group-hover:text-tertiary transition-colors">Logistics</span>
                      <span className="text-[7px] opacity-40 lowercase font-technical">Remote Operations</span>
                    </div>
                  </Link>
                  
                  <Link href="/about#faq" className="flex items-center gap-4 group">
                    <Shield size={14} className="text-primary/60" />
                    <div className="flex flex-col">
                      <span className="text-primary group-hover:text-tertiary transition-colors">Intelligence FAQ</span>
                      <span className="text-[7px] opacity-40 lowercase font-technical">Knowledge Base</span>
                    </div>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Contact Link (Last) */}
        <Link 
          href="/contact" 
          className={`relative px-6 py-2 transition-colors duration-500 ${pathname === '/contact' ? 'text-tertiary' : 'text-primary/40 hover:text-primary'}`}
        >
          {pathname === '/contact' && (
            <motion.div 
              layoutId="nav-active"
              className="absolute inset-0 bg-tertiary/[0.03] border-b border-tertiary -z-10"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">Contact</span>
        </Link>
      </div>
      
      <div className="flex items-center gap-6">
        <MagneticButton 
          className="text-primary p-2 rounded-full hover:bg-primary/5 transition-colors"
          onClick={() => setIsSearchOpen(true)}
        >
          <Search size={20} strokeWidth={1.5} />
        </MagneticButton>

        <Link href="/admin">
          <MagneticButton className="text-primary p-2 rounded-full hover:bg-primary/5 transition-colors">
            <User size={20} strokeWidth={1.5} />
          </MagneticButton>
        </Link>
      </div>

      <SearchScan isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
};
