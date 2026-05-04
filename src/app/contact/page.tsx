"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TechnicalOverlay, Scanline } from "@/components/ui/TechnicalOverlay";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Mail, MessageSquare, ShieldCheck, Loader2 } from "lucide-react";
import { sendMessage } from "@/lib/db/messages";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Expedition Inquiry",
    content: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendMessage(form);
      setSuccess(true);
      setForm({ name: "", email: "", subject: "Expedition Inquiry", content: "" });
    } catch (error) {
      console.error("Transmission error", error);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-primary/[0.03] border border-primary/10 p-4 font-body text-lg text-primary focus:outline-none focus:border-tertiary transition-all placeholder:text-primary/20";
  const labelCls = "block font-technical text-[10px] uppercase font-bold text-primary/40 mb-2 tracking-widest";

  return (
    <main className="relative min-h-screen bg-neutral pt-32 pb-24 overflow-hidden">
      <Navbar />
      <TechnicalOverlay className="opacity-10" />
      <Scanline />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left: Intel */}
          <div className="col-span-12 lg:col-span-5 space-y-12">
            <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-block px-4 py-1 border border-tertiary/30 mb-8 bg-tertiary/5"
              >
                <p className="font-technical text-[10px] text-tertiary uppercase tracking-[0.2em] font-bold">
                  Communication Matrix
                </p>
              </motion.div>
              <h1 className="font-heading text-6xl md:text-7xl text-primary leading-[0.9] mb-8">
                Establish <br /> Transmission
              </h1>
              <p className="font-body text-xl text-primary/60 italic leading-relaxed max-w-md">
                For collaborations, expedition inquiries, or technical consultations, please initiate an encrypted transmission.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 border border-primary/10 flex items-center justify-center group-hover:border-tertiary transition-colors">
                  <Mail size={18} className="text-primary/40 group-hover:text-tertiary transition-colors" />
                </div>
                <div>
                  <span className="block font-technical text-[8px] uppercase text-primary/30 font-bold mb-1 tracking-widest">Digital Hub</span>
                  <span className="font-technical text-sm text-primary font-bold">hello@divinedestinations.io</span>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 border border-primary/10 flex items-center justify-center group-hover:border-tertiary transition-colors">
                  <MessageSquare size={18} className="text-primary/40 group-hover:text-tertiary transition-colors" />
                </div>
                <div>
                  <span className="block font-technical text-[8px] uppercase text-primary/30 font-bold mb-1 tracking-widest">Secure Comms</span>
                  <span className="font-technical text-sm text-primary font-bold">@divine_expeditions (Signal)</span>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-primary/5">
               <div className="flex items-center gap-4 text-primary/20">
                  <ShieldCheck size={24} />
                  <span className="font-technical text-[8px] uppercase font-bold tracking-[0.4em]">AES-256 Encrypted Transmission Mode</span>
               </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="col-span-12 lg:col-span-7">
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="technical-card p-8 md:p-12 bg-neutral/50 backdrop-blur-xl relative overflow-hidden"
                >
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className={labelCls}>Identity (Name)</label>
                        <input 
                          type="text" required
                          className={inputCls}
                          placeholder="Aurelius Thorne"
                          value={form.name}
                          onChange={e => setForm({...form, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={labelCls}>Encrypted Handle (Email)</label>
                        <input 
                          type="email" required
                          className={inputCls}
                          placeholder="operator@nexus.com"
                          value={form.email}
                          onChange={e => setForm({...form, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={labelCls}>Inquiry Vector (Subject)</label>
                      <select 
                        className={inputCls}
                        value={form.subject}
                        onChange={e => setForm({...form, subject: e.target.value})}
                      >
                        <option>Expedition Inquiry</option>
                        <option>Technical Consultation</option>
                        <option>Collaboration Protocol</option>
                        <option>General Intel</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className={labelCls}>Manifest Intel (Message)</label>
                      <textarea 
                        required
                        className={`${inputCls} min-h-[200px] resize-none`}
                        placeholder="Detailed inquiry parameters..."
                        value={form.content}
                        onChange={e => setForm({...form, content: e.target.value})}
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-primary text-neutral py-6 font-technical text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-tertiary transition-all flex items-center justify-center gap-4 group"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />}
                      {loading ? "Transmitting..." : "Initiate Transmission"}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="technical-card p-12 md:p-24 bg-neutral/50 backdrop-blur-xl flex flex-col items-center text-center space-y-8"
                >
                  <div className="w-24 h-24 rounded-full border-2 border-green-500/20 flex items-center justify-center bg-green-500/5">
                    <CheckCircle size={48} className="text-green-500" />
                  </div>
                  <div>
                    <h2 className="font-heading text-primary mb-4 tracking-tight">Transmission Complete</h2>
                    <p className="font-body text-lg text-primary/60 italic max-w-sm mx-auto">
                      Your inquiry has been successfully encrypted and added to the mission queue.
                    </p>
                  </div>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="font-technical text-[9px] uppercase font-bold text-tertiary tracking-widest hover:text-primary transition-colors"
                  >
                    Send New Transmission
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
