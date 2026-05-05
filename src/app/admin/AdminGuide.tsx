import React from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Database, 
  MapPin, 
  Layers, 
  Settings, 
  Shield, 
  Terminal,
  Search,
  Target,
  Zap,
  Globe,
  Lock,
  Cpu
} from "lucide-react";

export const AdminGuideView = () => {
  const sections = [
    {
      id: "vault",
      title: "Content Vault",
      icon: Database,
      desc: "Management of cinematic storytelling artifacts and travel chronicles.",
      details: [
        "Create high-fidelity blog and vlog entries.",
        "Manage visual artifacts (images/videos) and narrative logs.",
        "Categorize stories by mission sector (Gastronomy, Logistics, etc.)",
        "Control status manifests: Draft vs. Live versions."
      ],
      mockup: (
        <div className="technical-card p-6 bg-primary/[0.02] border border-primary/10 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6 border-b border-primary/5 pb-4">
             <div className="flex items-center gap-2">
                <Terminal size={12} className="text-tertiary" />
                <span className="font-technical text-[8px] font-bold uppercase tracking-widest text-primary/40">Vault_Explorer_v.1</span>
             </div>
             <div className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-primary/20 rounded-full" />
             </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 w-3/4 bg-primary/5 rounded" />
            <div className="h-24 w-full bg-primary/[0.03] border border-primary/5 rounded flex items-center justify-center">
               <span className="font-technical text-[10px] text-primary/20">CINEMATIC_ARTIFACT.JPG</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-2 bg-primary/10 rounded" />
              <div className="h-2 bg-primary/10 rounded" />
              <div className="h-2 bg-primary/10 rounded" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: "registry",
      title: "Journey Registry",
      icon: MapPin,
      desc: "Administrative oversight of global mission sectors and geographic registries.",
      details: [
        "Manage 3-level interactive drill-down map coordinates.",
        "Update live altitude telemetry and geospatial metadata.",
        "Assign categories to geographic nodes (Astro, Expedition, etc.)",
        "Synchronize map markers with Content Vault narratives."
      ],
      mockup: (
        <div className="technical-card p-6 bg-primary/[0.02] border border-primary/10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
            <Globe size={120} className="text-primary animate-pulse" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex justify-between">
              <span className="font-technical text-[10px] text-tertiary font-bold">LAT: 64.9631 N</span>
              <span className="font-technical text-[10px] text-tertiary font-bold">LONG: 19.0208 W</span>
            </div>
            <div className="h-32 w-full border border-primary/10 rounded relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Target size={24} className="text-tertiary animate-ping" />
               </div>
            </div>
            <div className="flex justify-between items-center bg-primary/5 p-3">
               <span className="font-technical text-[8px] text-primary/40 uppercase">Altitude</span>
               <span className="font-technical text-lg text-primary font-bold">12,400M</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "manifest",
      title: "Intelligence Manifest",
      icon: Layers,
      desc: "Global Content Registry for site-wide narrative management.",
      details: [
        "Edit site-wide static sectors: Home, About, Logistics, etc.",
        "Staging Protocol: Save drafts without affecting the live platform.",
        "Publishing Protocol: Authorized synchronization of drafts to the global grid.",
        "Real-time metadata management (Titles, Hero text, SEO)."
      ],
      mockup: (
        <div className="technical-card p-6 bg-primary/[0.02] border border-primary/10">
          <div className="flex gap-4 mb-6">
            <div className="px-3 py-1 bg-tertiary/10 border border-tertiary/20 text-tertiary font-technical text-[8px] font-bold">STAGED</div>
            <div className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary/40 font-technical text-[8px] font-bold">LIVE</div>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-primary/5 border border-primary/10 font-body text-[10px] text-primary/60 italic">
               "Documenting the resolution of a technical world..."
            </div>
            <div className="flex justify-end gap-2">
               <div className="h-6 w-20 bg-primary/10 rounded" />
               <div className="h-6 w-24 bg-tertiary/80 rounded" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: "security",
      title: "Security & Intelligence",
      icon: Shield,
      desc: "Administrative oversight of encryption protocols and access logs.",
      details: [
        "Monitor live Access Logs and authorization telemetry.",
        "Verify encryption health and biometric sync status.",
        "Review 'Threat Intel' data and coordinated node lockdowns.",
        "Manage Lead Explorer credentials and access keys."
      ],
      mockup: (
        <div className="technical-card p-6 bg-primary/[0.02] border border-primary/10">
          <div className="flex items-center gap-2 mb-6">
             <Shield size={14} className="text-tertiary" />
             <span className="font-technical text-[10px] text-primary font-bold tracking-widest uppercase">Encryption_HUD</span>
          </div>
          <div className="space-y-2">
            {[1,2,3].map(i => (
              <div key={i} className="flex justify-between font-technical text-[8px] py-1 border-b border-primary/5">
                 <span className="text-primary/30 uppercase">ACCESS_ATTEMPT // {1000 + i}</span>
                 <span className={i === 1 ? 'text-tertiary' : 'text-primary'}>{i === 1 ? 'AUTHORIZED' : 'VERIFIED'}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-3 bg-tertiary/5 border border-tertiary/10 text-center">
             <span className="font-technical text-[12px] text-tertiary font-bold tracking-widest">SECURE_MANIFEST_LOCKED</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-16 pb-24"
    >
      {/* Intro Header */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
           <BookOpen size={20} className="text-tertiary" />
           <span className="font-technical text-[10px] text-tertiary font-bold uppercase tracking-[0.4em]">Operations Manual v.1.0.4</span>
        </div>
        <h1 className="font-heading text-5xl text-primary mb-6 italic">Command Protocol</h1>
        <p className="font-body text-lg text-primary/60 leading-relaxed italic border-l-2 border-primary/10 pl-8">
          Welcome to the NEXUS-AURORA administrative registry. This guide defines the technical operating procedures for the Divine Destinations global grid. Follow these protocols to maintain platform integrity and visual excellence.
        </p>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {sections.map((section) => (
          <div key={section.id} className="space-y-8">
            <div className="flex items-start gap-6">
               <div className="w-12 h-12 bg-primary flex items-center justify-center text-neutral rotate-45">
                  <section.icon size={20} className="-rotate-45" />
               </div>
               <div>
                  <h3 className="font-heading text-2xl text-primary mb-2">{section.title}</h3>
                  <p className="font-body text-sm text-primary/50 italic">{section.desc}</p>
               </div>
            </div>

            {section.mockup}

            <ul className="space-y-4">
              {section.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-4 group">
                   <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-tertiary group-hover:scale-125 transition-transform" />
                   <p className="font-technical text-[10px] text-primary/70 font-bold uppercase tracking-widest leading-relaxed">
                     {detail}
                   </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* System Quick Tips */}
      <div className="p-10 technical-card bg-primary/[0.02] border border-primary/10 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-all">
            <Cpu size={120} className="text-primary" />
         </div>
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
               <div className="flex items-center gap-2 mb-4">
                  <Zap size={14} className="text-tertiary" />
                  <h4 className="font-technical text-[10px] text-primary font-bold uppercase tracking-widest">Rapid Synchronization</h4>
               </div>
               <p className="font-body text-xs text-primary/40 italic">Changes in the Content Vault are synchronized instantly. Always verify visual artifacts before pushing to live nodes.</p>
            </div>
            <div>
               <div className="flex items-center gap-2 mb-4">
                  <Lock size={14} className="text-tertiary" />
                  <h4 className="font-technical text-[10px] text-primary font-bold uppercase tracking-widest">Safety Manifests</h4>
               </div>
               <p className="font-body text-xs text-primary/40 italic">Use "Stage Draft" in the Intelligence Manifest to test new layouts. The live platform remains unaffected until the Push protocol is authorized.</p>
            </div>
            <div>
               <div className="flex items-center gap-2 mb-4">
                  <Settings size={14} className="text-tertiary" />
                  <h4 className="font-technical text-[10px] text-primary font-bold uppercase tracking-widest">Identity Control</h4>
               </div>
               <p className="font-body text-xs text-primary/40 italic">System Settings control the global HUD identity. Changing the "Theme" will dynamically shift aesthetic protocols across all sectors.</p>
            </div>
         </div>
      </div>
    </motion.div>
  );
};
