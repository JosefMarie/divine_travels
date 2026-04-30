"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { TechnicalOverlay, Scanline } from "@/components/ui/TechnicalOverlay";
import { MagneticButton } from "@/components/ui/MagneticButton";
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { subscribeToPosts, createPost, updatePost, deletePost } from '@/lib/db/posts';
import { subscribeToDestinations, createDestination, updateDestination, deleteDestination } from '@/lib/db/destinations';
import { Post, Destination, DestinationInput, DestinationStatus, DestinationCategory } from '@/types';
import { useAuth } from "@/lib/auth";
import { subscribeToMessages, updateMessageStatus, deleteMessage, Message } from '@/lib/db/messages';
import { subscribeToSecurityLogs, logAccessAttempt, SecurityLog } from '@/lib/db/security';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
import { 
  Terminal, 
  Database, 
  BarChart3, 
  Inbox, 
  Settings, 
  Shield, 
  Zap, 
  Clock, 
  Globe, 
  Activity, 
  Search,
  Plus, 
  MapPin,
  MoreVertical, 
  ArrowRight, 
  Maximize, 
  Mail, 
  Edit3, 
  CloudUpload,
  Target,
  Filter,
  Lock,
  Eye,
  Key,
  Server,
  Palette,
  Cpu,
  Minus,
  Layers,
  Trash2,
  CheckCircle,
  X,
  Loader2,
  LogOut,
  RefreshCw,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// --- Sub-Views ---

const AnimatedCounter = ({ value, decimals = 0, suffix = "" }: { value: number, decimals?: number, suffix?: string }) => {
  const [count, setCount] = React.useState(0);
  
  React.useEffect(() => {
    let startTime: number | null = null;
    const duration = 1500; // 1.5s
    const end = value;

    const animate = (currentTime: number) => {
       if (!startTime) startTime = currentTime;
       const progress = Math.min((currentTime - startTime) / duration, 1);
       // Use easeOutQuart for a snappy digital decelerating effect
       const easeProgress = 1 - Math.pow(1 - progress, 4);
       
       setCount(end * easeProgress);
       
       if (progress < 1) {
          requestAnimationFrame(animate);
       } else {
          setCount(end);
       }
    };
    requestAnimationFrame(animate);
  }, [value]);

  const formatted = count.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  return <>{formatted}{suffix}</>;
};

const MissionControlView = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubPosts = subscribeToPosts(setPosts);
    const unsubDest = subscribeToDestinations(setDestinations);
    const unsubMsg = subscribeToMessages((data) => {
      setMessages(data);
      setLoading(false);
    });
    return () => {
      unsubPosts?.();
      unsubDest?.();
      unsubMsg?.();
    };
  }, [auth.currentUser?.uid]);

  const stats = [
    { label: "Total Stories", val: posts.length, sub: "Artifact Registry", icon: Globe, theme: "primary" },
    { label: "Messages Pending", val: messages.filter(m => m.status === 'unread').length, sub: "URGENT", icon: Mail, theme: messages.some(m => m.status === 'unread') ? "tertiary" : "primary" },
    { label: "Active Sectors", val: destinations.length, sub: "Mapped Nodes", icon: MapPin, theme: "primary" },
  ];

  const [timeRange, setTimeRange] = useState<'24H' | '7D'>('7D');

  return (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {stats.map((stat, i) => (
        <div key={i} className="p-8 technical-card bg-neutral/50 group overflow-hidden border border-primary/5">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="font-technical text-[10px] text-primary/40 uppercase font-bold tracking-widest">{stat.label}</span>
          <div className="mt-4 flex items-baseline gap-2">
            <span className={`font-technical text-5xl font-bold ${stat.theme === 'tertiary' ? 'text-tertiary' : 'text-primary'}`}>
              <AnimatedCounter value={stat.val} />
            </span>
            <span className="font-technical text-[10px] text-primary/40">{stat.sub}</span>
          </div>
          <div className="mt-8 h-0.5 w-full bg-primary/5 relative overflow-hidden">
             <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: stat.val > 0 ? "75%" : "0%" }} 
              className={`h-full ${stat.theme === 'tertiary' ? 'bg-tertiary' : 'bg-primary'}`} 
             />
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 lg:col-span-8 p-10 technical-card bg-neutral/50 border border-primary/5">
        <div className="flex justify-between items-start mb-12">
           <div>
             <span className="font-technical text-[10px] text-primary/40 uppercase font-bold tracking-widest">Site Traffic Summary</span>
             <h3 className="font-serif text-3xl text-primary mt-2 italic">Volume Density</h3>
           </div>
           <div className="flex gap-4">
              <button 
                onClick={() => setTimeRange('24H')}
                className={`px-4 py-1.5 border font-technical text-[9px] uppercase font-bold transition-all ${timeRange === '24H' ? 'bg-primary text-neutral border-primary' : 'border-primary/10 text-primary/40 hover:text-primary'}`}
              >
                24H
              </button>
              <button 
                onClick={() => setTimeRange('7D')}
                className={`px-4 py-1.5 border font-technical text-[9px] uppercase font-bold transition-all ${timeRange === '7D' ? 'bg-primary text-neutral border-primary' : 'border-primary/10 text-primary/40 hover:text-primary'}`}
              >
                7D
              </button>
           </div>
        </div>
        <div className="h-64 w-full flex items-end gap-1 px-2">
           {[...Array(timeRange === '24H' ? 24 : 14)].map((_, i) => (
             <motion.div 
               key={`${timeRange}-${i}`}
               initial={{ height: 0 }}
               animate={{ height: `${((i * (timeRange === '24H' ? 37 : 53)) % 60) + 20}%` }}
               transition={{ delay: i * 0.05 }}
               className="flex-1 bg-primary/10 hover:bg-tertiary transition-colors relative group"
             >
               <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-neutral text-[8px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                 {((i * (timeRange === '24H' ? 101 : 142)) % 400) + 100} VISITS
               </div>
             </motion.div>
           ))}
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 p-10 technical-card relative overflow-hidden border border-primary/5">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-primary">
          <Terminal size={120} />
        </div>
        <h3 className="font-technical text-[10px] uppercase tracking-[0.4em] mb-8 text-tertiary font-bold">Quick Actions</h3>
        <div className="space-y-4">
          {[
            { label: "Global Deploy", icon: Target },
            { label: "System Health", icon: Activity },
            { label: "Audit Trails", icon: Clock },
          ].map((action, i) => (
            <button key={i} className="w-full group block border border-primary/10 p-4 hover:border-tertiary transition-all text-left bg-primary/[0.01] hover:bg-primary/[0.02]">
              <div className="flex justify-between items-center mb-4 text-primary group-hover:text-tertiary transition-colors">
                <span className="font-technical text-[10px] uppercase tracking-widest font-bold">{action.label}</span>
                <action.icon size={14} className="text-tertiary group-hover:scale-110 transition-transform" />
              </div>
              <div className="h-[1px] w-0 group-hover:w-full transition-all duration-500 bg-tertiary" />
            </button>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
  );
};

const EMPTY_FORM = { title: '', excerpt: '', content: '', category: 'Expedition Log', date: '', readTime: '', status: 'draft' as Post['status'], imageUrl: '', coordinates: '', gear: '' };

const ContentVaultView = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [form, setForm] = useState<Omit<Post,'id'>>(EMPTY_FORM);
  const [editForm, setEditForm] = useState<Partial<Post>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error' } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;
    const unsub = subscribeToPosts((data) => {
      setPosts(data);
      setLoading(false);
    });
    return () => unsub();
  }, [auth.currentUser?.uid]);

  const showToast = (msg: string, type: 'success'|'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      await createPost({ ...form, createdAt: Date.now(), updatedAt: Date.now() });
      setShowNewModal(false);
      setForm(EMPTY_FORM);
      showToast('Chronicle published.');
    } catch { showToast('Failed to create post.', 'error'); }
    setSaving(false);
  };

  const handleUpdate = async () => {
    if (!selectedPost) return;
    setSaving(true);
    try {
      await updatePost(selectedPost.id, editForm);
      setSelectedPost(null);
      setEditForm({});
      showToast('Changes committed.');
    } catch { showToast('Update failed.', 'error'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePost(id);
      if (selectedPost?.id === id) { setSelectedPost(null); setEditForm({}); }
      setConfirmDelete(null);
      showToast('Entry removed.');
    } catch { showToast('Delete failed.', 'error'); }
  };

  const handleStatusCycle = async (post: Post) => {
    const cycle: Post['status'][] = ['draft', 'live', 'archive'];
    const next = cycle[(cycle.indexOf(post.status) + 1) % cycle.length];
    await updatePost(post.id, { status: next });
    showToast(`Status → ${next}`);
  };

  const selectPost = (post: Post) => {
    setSelectedPost(post);
    setEditForm({ title: post.title, excerpt: post.excerpt, content: post.content, category: post.category, date: post.date, readTime: post.readTime, imageUrl: post.imageUrl, coordinates: post.coordinates, gear: post.gear });
  };

  const statusColor = (s: Post['status']) => s === 'live' ? 'text-green-600' : s === 'draft' ? 'text-primary/40' : 'text-primary/20';
  const statusDot = (s: Post['status']) => s === 'live' ? 'bg-green-600 animate-pulse' : 'bg-primary/20';

  const inputCls = "w-full bg-primary/[0.03] border border-primary/10 px-3 py-2 font-serif text-sm text-primary focus:outline-none focus:border-tertiary transition-colors";
  const labelCls = "block font-technical text-[8px] uppercase font-bold text-primary/40 mb-1";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-12 gap-8">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-8 right-8 z-[100] px-6 py-4 font-technical text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 shadow-2xl ${
              toast.type === 'success' ? 'bg-primary text-neutral' : 'bg-tertiary text-neutral'
            }`}
          >
            <CheckCircle size={14} />{toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Entry Modal */}
      <AnimatePresence>
        {showNewModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary/40 backdrop-blur-md z-50 flex items-center justify-center p-8"
            onClick={() => setShowNewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral w-full max-w-2xl max-h-[90vh] overflow-y-auto technical-card p-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-technical text-[10px] uppercase tracking-widest text-tertiary font-bold">New Chronicle Entry</h3>
                <button onClick={() => setShowNewModal(false)} className="text-primary/20 hover:text-primary transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-5">
                <div><label className={labelCls}>Title</label><input className={inputCls} value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="Chronicle title..." /></div>
                <div><label className={labelCls}>Excerpt</label><textarea className={inputCls} rows={2} value={form.excerpt} onChange={e => setForm(f => ({...f, excerpt: e.target.value}))} placeholder="Brief description..." /></div>
                <div><label className={labelCls}>Content</label><textarea className={inputCls} rows={6} value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} placeholder="Full article body..." /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Category</label>
                    <select className={inputCls} value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
                      {['Expedition Log','Technical Study','Field Notes','Archive'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label className={labelCls}>Status</label>
                    <select className={inputCls} value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value as Post['status']}))}>                      <option value="draft">Draft</option><option value="live">Live</option><option value="archive">Archive</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Date</label><input className={inputCls} value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} placeholder="OCT 12, 2024" /></div>
                  <div><label className={labelCls}>Read Time</label><input className={inputCls} value={form.readTime} onChange={e => setForm(f => ({...f, readTime: e.target.value}))} placeholder="8 min" /></div>
                </div>
                <div><label className={labelCls}>Image URL</label><input className={inputCls} value={form.imageUrl} onChange={e => setForm(f => ({...f, imageUrl: e.target.value}))} placeholder="https://..." /></div>
                <div><label className={labelCls}>Coordinates</label><input className={inputCls} value={form.coordinates} onChange={e => setForm(f => ({...f, coordinates: e.target.value}))} placeholder="78.22° N, 15.62° E" /></div>
                <div><label className={labelCls}>Gear Specs</label><input className={inputCls} value={form.gear} onChange={e => setForm(f => ({...f, gear: e.target.value}))} placeholder="Leica SL2-S | 35mm f/1.4" /></div>
              </div>
              <button
                onClick={handleCreate}
                disabled={saving || !form.title}
                className="mt-8 w-full bg-tertiary text-neutral py-4 font-technical text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-3"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <CloudUpload size={14} />}
                {saving ? 'Publishing...' : 'Commit to Firestore'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary/40 backdrop-blur-md z-50 flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              className="bg-neutral technical-card p-10 max-w-sm w-full text-center"
            >
              <Trash2 size={24} className="text-tertiary mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-primary mb-2">Delete Entry?</h3>
              <p className="font-technical text-[9px] text-primary/40 uppercase tracking-widest mb-8">This action is irreversible.</p>
              <div className="flex gap-4">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 border border-primary/10 py-3 font-technical text-[9px] uppercase font-bold text-primary hover:bg-primary/5 transition-colors">Cancel</button>
                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 bg-tertiary text-neutral py-3 font-technical text-[9px] uppercase font-bold hover:opacity-90 transition-opacity">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Table */}
      <div className="col-span-12 lg:col-span-8 technical-card bg-neutral/50 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-primary/5">
          <span className="font-technical text-[10px] uppercase font-bold text-primary tracking-widest">Content Registry</span>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-tertiary text-neutral font-technical text-[9px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            <Plus size={12} /> New Entry
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={20} className="animate-spin text-primary/30" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-technical text-[9px] text-primary/30 uppercase tracking-widest">No entries in the vault.</p>
            <button onClick={() => setShowNewModal(true)} className="mt-4 font-technical text-[9px] text-tertiary uppercase tracking-widest hover:opacity-70 transition-opacity">+ Create First Entry</button>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-primary/5 bg-primary/[0.02]">
                <th className="p-6 font-technical text-[9px] uppercase text-primary/40 font-bold">Resource Name</th>
                <th className="p-6 font-technical text-[9px] uppercase text-primary/40 font-bold">Status</th>
                <th className="p-6 font-technical text-[9px] uppercase text-primary/40 font-bold">Updated</th>
                <th className="p-6 font-technical text-[9px] uppercase text-primary/40 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {posts.map((post) => (
                <tr
                  key={post.id}
                  onClick={() => selectPost(post)}
                  className={`hover:bg-primary/[0.02] transition-colors cursor-pointer group ${
                    selectedPost?.id === post.id ? 'bg-primary/[0.03] border-l-2 border-tertiary' : ''
                  }`}
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/[0.05] border border-primary/5 relative grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden flex-shrink-0">
                        {post.imageUrl && <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />}
                      </div>
                      <div>
                        <span className="font-serif text-sm block mb-1 text-primary group-hover:text-tertiary transition-colors">{post.title}</span>
                        <span className="font-technical text-[8px] text-primary/30 font-bold uppercase">{post.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStatusCycle(post); }}
                      className={`flex items-center gap-2 font-technical text-[9px] font-bold uppercase hover:opacity-70 transition-opacity ${statusColor(post.status)}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot(post.status)}`} />
                      {post.status}
                    </button>
                  </td>
                  <td className="p-6 font-technical text-[10px] text-primary/60">
                    {post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-6 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDelete(post.id); }}
                      className="text-primary/20 hover:text-tertiary transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick Edit Sidebar */}
      <aside className="col-span-12 lg:col-span-4 space-y-8">
        <div className="p-8 technical-card relative">
          <h3 className="font-technical text-[10px] uppercase tracking-widest text-tertiary mb-8 font-bold">
            {selectedPost ? `Editing: ${selectedPost.title.slice(0, 20)}...` : 'Quick Edit'}
          </h3>
          {!selectedPost ? (
            <p className="font-technical text-[9px] text-primary/30 uppercase tracking-widest">Select a row to edit.</p>
          ) : (
            <div className="space-y-5">
              <div><label className={labelCls}>Title</label><input className={inputCls} value={editForm.title || ''} onChange={e => setEditForm(f => ({...f, title: e.target.value}))} /></div>
              <div><label className={labelCls}>Excerpt</label><textarea className={inputCls} rows={2} value={editForm.excerpt || ''} onChange={e => setEditForm(f => ({...f, excerpt: e.target.value}))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Status</label>
                  <select
                    className={inputCls}
                    value={editForm.status || 'draft'}
                    onChange={e => setEditForm(f => ({...f, status: e.target.value as Post['status']}))}
                  >
                    <option value="draft">Draft</option>
                    <option value="live">Live</option>
                    <option value="archive">Archive</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <select
                    className={inputCls}
                    value={editForm.category || ''}
                    onChange={e => setEditForm(f => ({...f, category: e.target.value}))}
                  >
                    {['Expedition Log','Technical Study','Field Notes','Archive'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div><label className={labelCls}>Coordinates</label><input className={inputCls} value={editForm.coordinates || ''} onChange={e => setEditForm(f => ({...f, coordinates: e.target.value}))} /></div>
              <div><label className={labelCls}>Gear Specs</label><input className={inputCls} value={editForm.gear || ''} onChange={e => setEditForm(f => ({...f, gear: e.target.value}))} /></div>
              <div><label className={labelCls}>Image URL</label><input className={inputCls} value={editForm.imageUrl || ''} onChange={e => setEditForm(f => ({...f, imageUrl: e.target.value}))} /></div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="flex-1 bg-tertiary text-neutral py-3 font-technical text-[9px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <CloudUpload size={12} />}
                  Commit
                </button>
                <button
                  onClick={() => { setSelectedPost(null); setEditForm({}); }}
                  className="px-4 border border-primary/10 text-primary/40 hover:text-primary transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </motion.div>
  );
};

const EMPTY_DESTINATION = { title: '', location: '', category: 'EXPEDITION' as DestinationCategory, status: 'active' as DestinationStatus, imageUrl: '', latitude: 0, longitude: 0, excerpt: '' };

const DestinationsVaultView = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [form, setForm] = useState<DestinationInput>(EMPTY_DESTINATION);
  const [editForm, setEditForm] = useState<Partial<Destination>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error' } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;
    const unsub = subscribeToDestinations((data) => {
      setDestinations(data);
      setLoading(false);
    });
    return () => unsub();
  }, [auth.currentUser?.uid]);

  const showToast = (msg: string, type: 'success'|'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      await createDestination(form);
      setShowNewModal(false);
      setForm(EMPTY_DESTINATION);
      showToast('Sector established.');
    } catch { showToast('Protocol failed.', 'error'); }
    setSaving(false);
  };

  const handleUpdate = async () => {
    if (!selectedDest) return;
    setSaving(true);
    try {
      await updateDestination(selectedDest.id, editForm);
      setSelectedDest(null);
      setEditForm({});
      showToast('Registry updated.');
    } catch { showToast('Update failed.', 'error'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDestination(id);
      if (selectedDest?.id === id) { setSelectedDest(null); setEditForm({}); }
      setConfirmDelete(null);
      showToast('Sector purged.');
    } catch { showToast('Purge failed.', 'error'); }
  };

  const handleStatusCycle = async (dest: Destination) => {
    const cycle: DestinationStatus[] = ['active', 'visited', 'archive'];
    const next = cycle[(cycle.indexOf(dest.status) + 1) % cycle.length];
    await updateDestination(dest.id, { status: next });
    showToast(`Status → ${next.toUpperCase()}`);
  };

  const selectDest = (dest: Destination) => {
    setSelectedDest(dest);
    setEditForm({ title: dest.title, location: dest.location, category: dest.category, status: dest.status, imageUrl: dest.imageUrl, latitude: dest.latitude, longitude: dest.longitude, excerpt: dest.excerpt });
  };

  const statusColor = (s: DestinationStatus) => s === 'active' ? 'text-green-600' : s === 'visited' ? 'text-tertiary' : 'text-primary/20';
  const statusDot = (s: DestinationStatus) => s === 'active' ? 'bg-green-600 animate-pulse' : s === 'visited' ? 'bg-tertiary shadow-[0_0_8px_rgba(179,48,91,0.4)]' : 'bg-primary/20';

  const inputCls = "w-full bg-primary/[0.03] border border-primary/10 px-3 py-2 font-serif text-sm text-primary focus:outline-none focus:border-tertiary transition-colors";
  const labelCls = "block font-technical text-[8px] uppercase font-bold text-primary/40 mb-1";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-12 gap-8">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-8 right-8 z-[100] px-6 py-4 font-technical text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 shadow-2xl ${
              toast.type === 'success' ? 'bg-primary text-neutral' : 'bg-tertiary text-neutral'
            }`}
          >
            <CheckCircle size={14} />{toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Entry Modal */}
      <AnimatePresence>
        {showNewModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary/40 backdrop-blur-md z-50 flex items-center justify-center p-8"
            onClick={() => setShowNewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral w-full max-w-2xl max-h-[90vh] overflow-y-auto technical-card p-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-technical text-[10px] uppercase tracking-widest text-tertiary font-bold">Establish Mission Sector</h3>
                <button onClick={() => setShowNewModal(false)} className="text-primary/20 hover:text-primary transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-5">
                <div><label className={labelCls}>Sector Title</label><input className={inputCls} value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="E.g. Nordic Highlands..." /></div>
                <div><label className={labelCls}>Location Display</label><input className={inputCls} value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} placeholder="E.g. Iceland // 64° N" /></div>
                <div className="grid grid-cols-2 gap-4">
                   <div><label className={labelCls}>Latitude</label><input type="number" step="0.000001" className={inputCls} value={form.latitude} onChange={e => setForm(f => ({...f, latitude: parseFloat(e.target.value)}))} /></div>
                   <div><label className={labelCls}>Longitude</label><input type="number" step="0.000001" className={inputCls} value={form.longitude} onChange={e => setForm(f => ({...f, longitude: parseFloat(e.target.value)}))} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Category</label>
                    <select className={inputCls} value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value as DestinationCategory}))}>
                      {['EXPEDITION','RETREAT','CHRONICLE','ASTRO','WILDERNESS','CULTURE'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label className={labelCls}>Initial Status</label>
                    <select className={inputCls} value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value as DestinationStatus}))}>
                      <option value="active">Active</option><option value="visited">Visited</option><option value="archive">Archive</option>
                    </select>
                  </div>
                </div>
                <div><label className={labelCls}>Manifest Intel (Excerpt)</label><textarea className={inputCls} rows={3} value={form.excerpt} onChange={e => setForm(f => ({...f, excerpt: e.target.value}))} placeholder="Brief sector overview..." /></div>
                <div><label className={labelCls}>Visual Manifest (URL)</label><input className={inputCls} value={form.imageUrl} onChange={e => setForm(f => ({...f, imageUrl: e.target.value}))} placeholder="https://..." /></div>
              </div>
              <button
                onClick={handleCreate}
                disabled={saving || !form.title}
                className="w-full mt-10 bg-primary text-neutral py-4 font-technical text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-tertiary transition-all disabled:opacity-40"
              >
                {saving ? "Establishing..." : "Establish Protocol"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="col-span-12 lg:col-span-8 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-serif text-4xl text-primary mb-2">Journey Registry</h2>
            <p className="font-technical text-[8px] text-primary/40 uppercase tracking-widest font-bold flex items-center gap-2">
              Global Mission Sectors // {destinations.length} Units Mapped
              {loading && <Loader2 size={10} className="animate-spin" />}
            </p>
          </div>
          <button 
            onClick={() => setShowNewModal(true)}
            className="bg-primary text-neutral px-6 py-3 font-technical text-[9px] font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-tertiary transition-all shadow-xl group"
          >
            <Plus size={14} className="group-hover:rotate-90 transition-transform" />
            Establish Sector
          </button>
        </div>

        {loading && destinations.length === 0 ? (
          <div className="h-96 technical-card bg-primary/[0.02] flex items-center justify-center">
            <Loader2 className="animate-spin text-primary/20" size={32} />
          </div>
        ) : (
          <div className="technical-card bg-neutral/50 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-primary/5 bg-primary/[0.02]">
                  <th className="p-6 font-technical text-[8px] uppercase font-bold text-primary/40 tracking-widest">Sector_ID</th>
                  <th className="p-6 font-technical text-[8px] uppercase font-bold text-primary/40 tracking-widest">Manifest</th>
                  <th className="p-6 font-technical text-[8px] uppercase font-bold text-primary/40 tracking-widest">Category</th>
                  <th className="p-6 font-technical text-[8px] uppercase font-bold text-primary/40 tracking-widest">Status</th>
                  <th className="p-6 font-technical text-[8px] uppercase font-bold text-primary/40 tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-technical text-[10px] font-bold text-primary divide-y divide-primary/5">
                {destinations.map((dest) => (
                  <tr 
                    key={dest.id} 
                    onClick={() => selectDest(dest)}
                    className={`hover:bg-primary/[0.02] transition-colors group cursor-pointer ${selectedDest?.id === dest.id ? 'bg-primary/5' : ''}`}
                  >
                    <td className="p-6 opacity-30 group-hover:opacity-100 transition-opacity">{dest.id.slice(0, 8)}</td>
                    <td className="p-6">
                      <span className="block text-xs font-serif mb-0.5">{dest.title}</span>
                      <span className="text-[7px] text-primary/40 uppercase font-technical">{dest.location}</span>
                    </td>
                    <td className="p-6">
                      <span className="px-2 py-1 bg-primary/5 border border-primary/10 text-[7px] uppercase tracking-tighter">
                        {dest.category}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${statusDot(dest.status)}`} />
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleStatusCycle(dest); }}
                          className={`font-technical text-[8px] uppercase tracking-widest transition-colors ${statusColor(dest.status)}`}
                        >
                          {dest.status}
                        </button>
                      </div>
                    </td>
                    <td className="p-6 text-right space-x-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setConfirmDelete(dest.id); }}
                        className="text-primary/20 hover:text-tertiary transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Edit Sidebar */}
      <aside className="col-span-12 lg:col-span-4 space-y-8">
        <div className="p-8 technical-card relative">
          <h3 className="font-technical text-[10px] uppercase tracking-widest text-tertiary mb-8 font-bold">
            {selectedDest ? `Sector: ${selectedDest.title.slice(0, 20)}...` : 'Registry Edit'}
          </h3>
          {!selectedDest ? (
            <p className="font-technical text-[9px] text-primary/30 uppercase tracking-widest">Select sector to configure.</p>
          ) : (
            <div className="space-y-5">
              <div><label className={labelCls}>Title</label><input className={inputCls} value={editForm.title || ''} onChange={e => setEditForm(f => ({...f, title: e.target.value}))} /></div>
              <div><label className={labelCls}>Location</label><input className={inputCls} value={editForm.location || ''} onChange={e => setEditForm(f => ({...f, location: e.target.value}))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                   <label className={labelCls}>Lat</label>
                   <input type="number" step="0.000001" className={inputCls} value={editForm.latitude ?? 0} onChange={e => setEditForm(f => ({...f, latitude: parseFloat(e.target.value)}))} />
                </div>
                <div>
                   <label className={labelCls}>Long</label>
                   <input type="number" step="0.000001" className={inputCls} value={editForm.longitude ?? 0} onChange={e => setEditForm(f => ({...f, longitude: parseFloat(e.target.value)}))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Status</label>
                  <select className={inputCls} value={editForm.status || 'active'} onChange={e => setEditForm(f => ({...f, status: e.target.value as DestinationStatus}))}>
                    <option value="active">Active</option><option value="visited">Visited</option><option value="archive">Archive</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <select className={inputCls} value={editForm.category || ''} onChange={e => setEditForm(f => ({...f, category: e.target.value as DestinationCategory}))}>
                    {['EXPEDITION','RETREAT','CHRONICLE','ASTRO','WILDERNESS','CULTURE'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div><label className={labelCls}>Intel (Excerpt)</label><textarea className={inputCls} rows={3} value={editForm.excerpt || ''} onChange={e => setEditForm(f => ({...f, excerpt: e.target.value}))} /></div>
              <div><label className={labelCls}>Visual Manifest</label><input className={inputCls} value={editForm.imageUrl || ''} onChange={e => setEditForm(f => ({...f, imageUrl: e.target.value}))} /></div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="flex-1 bg-tertiary text-neutral py-3 font-technical text-[9px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <CloudUpload size={12} />}
                  Commit Delta
                </button>
                <button
                  onClick={() => { setSelectedDest(null); setEditForm({}); }}
                  className="px-4 border border-primary/10 text-primary/40 hover:text-primary transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Delete Confirmation Overlay */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[110] bg-neutral/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="technical-card p-10 max-w-sm w-full bg-neutral shadow-2xl border-2 border-tertiary">
            <h4 className="font-technical text-[10px] text-tertiary font-bold uppercase tracking-[0.3em] mb-4">Purge Protocol</h4>
            <p className="font-serif text-lg text-primary mb-8 leading-relaxed">Permanent deletion of mission sector data detected. Proceed?</p>
            <div className="flex gap-4">
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 bg-tertiary text-neutral py-3 font-technical text-[9px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">Confirm Purge</button>
              <button onClick={() => setConfirmDelete(null)} className="flex-1 border border-primary/20 text-primary/60 py-3 font-technical text-[9px] font-bold uppercase tracking-widest hover:bg-primary/[0.02]">Abort</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
const CommunicationHubView = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;
    const unsub = subscribeToMessages((data) => {
      setMessages(data);
      if (data.length > 0 && !selectedMsg) {
        setSelectedMsg(data[0]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [auth.currentUser?.uid]);

  const handleToggleRead = async (msg: Message) => {
    const nextStatus = msg.status === 'unread' ? 'read' : 'unread';
    await updateMessageStatus(msg.id, nextStatus);
    if (selectedMsg?.id === msg.id) {
       setSelectedMsg({...msg, status: nextStatus});
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Purge this transmission?")) {
      await deleteMessage(id);
      if (selectedMsg?.id === id) setSelectedMsg(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-12 gap-0 technical-card bg-neutral/50 overflow-hidden border border-primary/5">
      {/* Sidebar List */}
      <div className="col-span-4 border-r border-primary/5 h-[700px] flex flex-col bg-neutral/30">
        <div className="p-6 border-b border-primary/5 bg-primary/[0.02] flex justify-between items-center">
          <span className="font-technical text-[10px] uppercase font-bold text-primary tracking-widest flex items-center gap-2">
            Incoming Stream
            {loading && <Loader2 size={12} className="animate-spin opacity-20" />}
          </span>
          <span className="font-technical text-[8px] text-primary/40 uppercase font-bold">{messages.length} Units</span>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {messages.length === 0 && !loading ? (
            <div className="p-12 text-center">
              <p className="font-technical text-[8px] text-primary/20 uppercase font-bold tracking-widest leading-loose">Silence Protocol Active<br/>No Transmissions Detected</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                onClick={() => setSelectedMsg(msg)}
                className={`group p-6 border-b border-primary/5 cursor-pointer transition-all relative ${selectedMsg?.id === msg.id ? 'bg-primary/[0.05]' : 'hover:bg-primary/[0.02]'}`}
              >
                {msg.status === 'unread' && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary shadow-[0_0_10px_rgba(110,38,38,0.4)]" />
                )}
                <div className="flex justify-between items-start mb-2">
                  <span className="font-technical text-[8px] font-bold text-primary/30 uppercase tracking-tighter">TX_{msg.id.slice(0, 6)}</span>
                  <span className="font-technical text-[8px] text-primary/30 font-bold">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h4 className={`font-serif text-lg transition-colors ${msg.status === 'unread' ? 'text-primary' : 'text-primary/40'}`}>{msg.name}</h4>
                <p className="text-[10px] font-technical text-primary/60 truncate mt-1 uppercase tracking-widest font-bold">{msg.subject}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reading Pane */}
      <div className="col-span-8 flex flex-col h-[700px] bg-neutral">
        {!selectedMsg ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-4">
            <Mail size={40} className="text-primary/5" />
            <p className="font-technical text-[8px] text-primary/20 uppercase font-bold tracking-[0.4em]">Standby for Transmission Sync</p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-primary/5 flex justify-between items-center bg-primary/[0.01]">
              <div className="flex gap-6">
                <button 
                  onClick={() => handleToggleRead(selectedMsg)}
                  className="font-technical text-[9px] uppercase font-bold text-primary/40 hover:text-tertiary transition-colors"
                >
                  {selectedMsg.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                </button>
                <button 
                  onClick={() => handleDelete(selectedMsg.id)}
                  className="font-technical text-[9px] uppercase font-bold text-tertiary hover:opacity-80 transition-opacity"
                >
                  Purge Data
                </button>
              </div>
              <a 
                href={`mailto:${selectedMsg.email}`}
                className="bg-primary text-neutral px-6 py-2 font-technical text-[9px] uppercase font-bold tracking-widest hover:bg-tertiary transition-all"
              >
                Reply Protocol
              </a>
            </div>
            
            <div className="flex-1 p-12 bg-neutral relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-primary opacity-[0.03] font-technical text-[120px] font-bold select-none leading-none">INQUIRY</div>
              
              <div className="max-w-2xl mx-auto relative z-10">
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center bg-primary/[0.03]">
                      <span className="font-technical text-sm text-primary font-bold">{selectedMsg.name[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-serif text-3xl text-primary leading-none mb-1">{selectedMsg.name}</h3>
                      <p className="font-technical text-[8px] text-tertiary font-bold uppercase tracking-widest">{selectedMsg.email}</p>
                    </div>
                  </div>
                  <div className="inline-block px-3 py-1 bg-primary/5 border border-primary/10">
                    <span className="font-technical text-[8px] uppercase text-primary/60 font-bold tracking-widest">{selectedMsg.subject}</span>
                  </div>
                </div>

                <div className="space-y-6 font-serif text-lg leading-relaxed text-primary/80 selection:bg-tertiary selection:text-neutral">
                  {selectedMsg.content.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                <div className="mt-20 pt-8 border-t border-primary/5">
                  <p className="font-technical text-[8px] text-primary/30 uppercase font-bold tracking-widest">
                    Transmission ID: {selectedMsg.id} // Vector: {selectedMsg.subject} // Timestamp: {new Date(selectedMsg.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-primary text-neutral font-technical text-[8px] uppercase tracking-widest flex justify-between px-8">
              <span>Secure Matrix Active</span>
              <span className="text-tertiary animate-pulse">ENCRYPTION: AES-256</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

// Parses "lat, lon" or "-1.6065, 30.0814" strings into {lat, lon}
function parseCoordinates(raw?: string): { lat: number; lon: number } | null {
  if (!raw) return null;
  // Strip degree symbols and cardinal directions, split on comma
  const cleaned = raw.replace(/[°NSEW]/gi, '').trim();
  const parts = cleaned.split(',').map(s => parseFloat(s.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { lat: parts[0], lon: parts[1] };
  }
  return null;
}

const SystemAnalyticsView = () => {
  const mapRef = React.useRef<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeMarker, setActiveMarker] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;
    const unsubPosts = subscribeToPosts(setPosts);
    const unsubDest = subscribeToDestinations(setDestinations);
    const unsubMsg = subscribeToMessages((data) => {
      setMessages(data);
      setLoading(false);
    });
    return () => {
      unsubPosts?.();
      unsubDest?.();
      unsubMsg?.();
    };
  }, [auth.currentUser?.uid]);

  // Build live markers from posts that have parseable coordinates
  const liveMarkers = posts
    .map(post => ({ post, coords: parseCoordinates(post.coordinates) }))
    .filter((m): m is { post: Post; coords: { lat: number; lon: number } } => m.coords !== null);

  const handleFlyTo = (lon: number, lat: number) => {
    mapRef.current?.flyTo({ center: [lon, lat], zoom: 4, duration: 3000, essential: true });
  };

  const statusColor = (s: string) => s === 'live' ? '#16a34a' : s === 'draft' ? '#b3305b' : '#8b8b8b';

  // Category stats for simple bar chart
  const categories = Array.from(new Set(posts.map(p => p.category)));
  const catStats = categories.map(cat => ({
    label: cat,
    count: posts.filter(p => p.category === cat).length,
    percentage: (posts.filter(p => p.category === cat).length / posts.length) * 100
  })).sort((a, b) => b.count - a.count);

  return (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-20">
    {/* Real-time Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        { label: "Transmission Queue", val: messages.filter(m => m.status === 'unread').length, suffix: `/${messages.length}`, sub: "Unread Inquiries", icon: Inbox, theme: messages.some(m => m.status === 'unread') ? "tertiary" : "default" },
        { label: "Content Artifacts", val: posts.length, suffix: "", sub: "Total Published Stories", icon: Database },
        { label: "Mission Sectors", val: destinations.length, suffix: "", sub: "Total Geographic Nodes", icon: MapPin },
        { label: "System Uptime", val: 99.98, decimals: 2, suffix: "%", sub: "Cloud Infrastructure", icon: Shield },
      ].map((m, i) => (
        <div key={i} className="p-8 technical-card bg-neutral/50 group border border-primary/5">
          <div className="flex justify-between items-start mb-8">
            <span className="font-technical text-[8px] text-primary/40 uppercase font-bold tracking-widest group-hover:text-primary transition-colors">{m.label}</span>
            <m.icon size={16} className={`${m.theme === 'tertiary' ? 'text-tertiary animate-pulse' : 'text-primary/20'} group-hover:scale-110 transition-transform`} />
          </div>
          <p className={`font-technical text-3xl font-bold mb-1 ${m.theme === 'tertiary' ? 'text-tertiary' : 'text-primary'}`}>
             <AnimatedCounter value={m.val} decimals={m.decimals || 0} suffix={m.suffix} />
          </p>
          <p className="font-technical text-[7px] text-primary/40 uppercase font-bold">{m.sub}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-12 gap-8">
      {/* Category Chart */}
      <div className="col-span-12 lg:col-span-5 technical-card bg-neutral/50 p-10 border border-primary/5">
        <h3 className="font-serif text-2xl text-primary mb-2">Mission Diversity</h3>
        <p className="font-technical text-[8px] text-primary/40 uppercase font-bold mb-10 tracking-widest">Archive Categorization breakdown</p>
        
        <div className="space-y-8">
          {catStats.length === 0 ? (
            <p className="font-technical text-[8px] text-primary/20 uppercase font-bold text-center py-10">Initializing Data Matrix...</p>
          ) : (
            catStats.map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-technical text-[9px] uppercase font-bold text-primary/60">{stat.label}</span>
                  <span className="font-technical text-[9px] font-bold text-primary">{stat.count} <span className="opacity-30">Units</span></span>
                </div>
                <div className="h-1 bg-primary/5 w-full relative overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.percentage}%` }}
                    transition={{ duration: 1.5, ease: "circOut", delay: i * 0.1 }}
                    className="absolute inset-y-0 left-0 bg-tertiary"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-primary/5">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 border border-primary/10 flex items-center justify-center">
                 <Activity size={18} className="text-tertiary" />
              </div>
              <div>
                 <p className="font-technical text-[8px] uppercase text-primary/40 font-bold mb-0.5">Primary Vector</p>
                 <p className="font-technical text-[10px] uppercase font-bold text-primary">{catStats[0]?.label || 'Pending'} Exploration</p>
              </div>
           </div>
        </div>
      </div>

      {/* Mini Globe Map */}
      <div className="col-span-12 lg:col-span-7 technical-card bg-neutral/50 p-10 min-h-[500px] relative overflow-hidden group border border-primary/5">
        <h3 className="font-serif text-2xl text-primary mb-2">Live Coordinate Registry</h3>
        <p className="font-technical text-[8px] text-primary/40 uppercase font-bold mb-6 tracking-widest">
          Active geographic Plotting // {liveMarkers.length} Nodes Synchronized
        </p>

        <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply group-hover:opacity-60 transition-opacity duration-700">
          <Map
            ref={mapRef}
            initialViewState={{ longitude: 10, latitude: 20, zoom: 0.6 }}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
            style={{ width: '100%', height: '100%' }}
            projection={{ name: 'globe' }}
            dragPan={true}
            scrollZoom={false}
          >
            <style>{`
              .mapboxgl-canvas { filter: grayscale(1) invert(0.1) sepia(0.2) hue-rotate(150deg); }
              .mapboxgl-ctrl { display: none !important; }
            `}</style>

            {liveMarkers.map(({ post, coords }, i) => (
              <Marker key={post.id} longitude={coords.lon} latitude={coords.lat} anchor="center">
                <div className="relative group/marker cursor-pointer" onClick={() => handleFlyTo(coords.lon, coords.lat)}>
                  <div className="w-2 h-2 rounded-full relative z-20 shadow-lg" style={{ backgroundColor: statusColor(post.status) }} />
                  <div className="w-6 h-6 rounded-full absolute -top-2 -left-2 animate-ping opacity-20" style={{ backgroundColor: statusColor(post.status) }} />
                </div>
              </Marker>
            ))}
          </Map>
        </div>
        
        <div className="absolute bottom-8 left-8 z-10 flex gap-4">
           <button onClick={() => mapRef.current?.zoomIn()} className="w-8 h-8 glass-panel border border-primary/10 flex items-center justify-center text-primary/60 hover:text-primary transition-colors hover:border-primary/30">
              <Plus size={14} />
           </button>
           <button onClick={() => mapRef.current?.zoomOut()} className="w-8 h-8 glass-panel border border-primary/10 flex items-center justify-center text-primary/60 hover:text-primary transition-colors hover:border-primary/30">
              <Minus size={14} />
           </button>
        </div>

        <Scanline />
      </div>
    </div>
  </motion.div>
  );
};


const SystemSettingsView = () => {
  const [settings, setSettings] = useState({
    title: "Divine's Destinations",
    slug: "divine_dest_v4",
    manifest: "Precision tools for the global nomad. A curated inventory of hardware selected for reliability and aesthetic integrity.",
    theme: "Forest Dark",
    overlays: true,
    scanlines: true,
    maintenance: false,
    publicTransmissions: true,
    mapZoom: 4,
    mapStyle: "mapbox://styles/mapbox/dark-v11"
  });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  const inputCls = "w-full bg-primary/[0.03] border border-primary/10 px-4 py-3 font-serif text-sm text-primary focus:outline-none focus:border-tertiary transition-all";
  const labelCls = "block font-technical text-[8px] uppercase font-bold text-primary/40 mb-2 tracking-widest";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-16 pb-20">
      
      {/* 1. Core Engine */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <Cpu size={16} className="text-tertiary" />
          <h3 className="font-technical text-[10px] uppercase tracking-[0.4em] text-primary font-bold">Core Engine Identity</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className={labelCls}>Platform Title</label>
            <input className={inputCls} value={settings.title} onChange={e => setSettings({...settings, title: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className={labelCls}>Technical Slug</label>
            <input className={inputCls} value={settings.slug} onChange={e => setSettings({...settings, slug: e.target.value})} />
          </div>
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Global Manifest Description (SEO)</label>
          <textarea className={`${inputCls} min-h-[100px] italic`} value={settings.manifest} onChange={e => setSettings({...settings, manifest: e.target.value})} />
        </div>
      </section>

      {/* 2. Aesthetics & Interface */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <Palette size={16} className="text-tertiary" />
          <h3 className="font-technical text-[10px] uppercase tracking-[0.4em] text-primary font-bold">Aesthetic Protocols</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Forest Dark", "Sandstone Light", "Technical HUD"].map((t) => (
            <button 
              key={t}
              onClick={() => setSettings({...settings, theme: t})}
              className={`p-6 border text-left transition-all ${settings.theme === t ? 'border-tertiary bg-tertiary/[0.03]' : 'border-primary/5 hover:border-primary/10'}`}
            >
              <span className={`block font-technical text-[9px] font-bold uppercase tracking-widest ${settings.theme === t ? 'text-tertiary' : 'text-primary/40'}`}>{t}</span>
              <div className={`mt-4 h-1 w-full ${settings.theme === t ? 'bg-tertiary' : 'bg-primary/5'}`} />
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="flex justify-between items-center p-6 border border-primary/5 technical-card">
            <div>
              <span className="block font-technical text-[9px] font-bold uppercase text-primary">Technical Overlays</span>
              <span className="font-technical text-[7px] uppercase text-primary/30">Geometric HUD Grids</span>
            </div>
            <button 
              onClick={() => setSettings({...settings, overlays: !settings.overlays})}
              className={`w-12 h-6 rounded-full relative transition-colors ${settings.overlays ? 'bg-tertiary' : 'bg-primary/10'}`}
            >
              <motion.div animate={{ x: settings.overlays ? 26 : 2 }} className="absolute top-1 w-4 h-4 rounded-full bg-neutral shadow-sm" />
            </button>
          </div>
          <div className="flex justify-between items-center p-6 border border-primary/5 technical-card">
            <div>
              <span className="block font-technical text-[9px] font-bold uppercase text-primary">Scanline Matrix</span>
              <span className="font-technical text-[7px] uppercase text-primary/30">Cathode Ray Simulation</span>
            </div>
            <button 
              onClick={() => setSettings({...settings, scanlines: !settings.scanlines})}
              className={`w-12 h-6 rounded-full relative transition-colors ${settings.scanlines ? 'bg-tertiary' : 'bg-primary/10'}`}
            >
              <motion.div animate={{ x: settings.scanlines ? 26 : 2 }} className="absolute top-1 w-4 h-4 rounded-full bg-neutral shadow-sm" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Operational Modes */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <Activity size={16} className="text-tertiary" />
          <h3 className="font-technical text-[10px] uppercase tracking-[0.4em] text-primary font-bold">Operational Parameters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={`p-8 border-2 transition-all ${settings.maintenance ? 'border-tertiary bg-tertiary/5' : 'border-primary/5 bg-neutral/50'}`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className={`font-serif text-2xl ${settings.maintenance ? 'text-tertiary' : 'text-primary'}`}>Maintenance Mode</h4>
                <p className="font-technical text-[8px] uppercase text-primary/40 mt-1">Lock Public Access Registry</p>
              </div>
              <button 
                onClick={() => setSettings({...settings, maintenance: !settings.maintenance})}
                className={`px-4 py-2 font-technical text-[9px] font-bold uppercase border ${settings.maintenance ? 'bg-tertiary text-neutral border-tertiary' : 'border-primary/20 text-primary'}`}
              >
                {settings.maintenance ? "ACTIVE" : "INACTIVE"}
              </button>
            </div>
            <p className="font-serif text-sm italic text-primary/60">When active, all public routes will redirect to a secure standby screen.</p>
          </div>

          <div className="p-8 border border-primary/5 bg-neutral/50">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="font-serif text-2xl text-primary">Inquiry Gateway</h4>
                <p className="font-technical text-[8px] uppercase text-primary/40 mt-1">Contact Protocol Availability</p>
              </div>
              <button 
                onClick={() => setSettings({...settings, publicTransmissions: !settings.publicTransmissions})}
                className={`px-4 py-2 font-technical text-[9px] font-bold uppercase border ${settings.publicTransmissions ? 'bg-primary text-neutral border-primary' : 'border-primary/20 text-primary'}`}
              >
                {settings.publicTransmissions ? "OPEN" : "LOCKED"}
              </button>
            </div>
            <p className="font-serif text-sm italic text-primary/60">Toggle the visibility of the encrypted transmission matrix for visitors.</p>
          </div>
        </div>
      </section>

      <div className="pt-12 border-t border-primary/5 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className={`w-2 h-2 rounded-full ${saving ? 'bg-tertiary animate-pulse' : 'bg-green-500'}`} />
            <span className="font-technical text-[8px] uppercase font-bold text-primary/40 tracking-widest">
               {saving ? "Synchronizing Configuration..." : "System State: Optimal"}
            </span>
         </div>
         <button 
           onClick={handleSave}
           disabled={saving}
           className="bg-primary text-neutral px-16 py-5 font-technical text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-tertiary transition-all disabled:opacity-50 flex items-center gap-3"
         >
           {saving && <Loader2 size={14} className="animate-spin" />}
           Save System State
         </button>
      </div>
    </motion.div>
  );
};

const SecurityView = () => {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [securityState, setSecurityState] = useState({
    shieldLevel: 4,
    biometricHardening: true,
    nodeLockdown: false,
    keyRotationLoading: false,
  });

  useEffect(() => {
    const unsub = subscribeToSecurityLogs((data) => {
      setLogs(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleKeyRotation = () => {
    setSecurityState(prev => ({ ...prev, keyRotationLoading: true }));
    setTimeout(() => setSecurityState(prev => ({ ...prev, keyRotationLoading: false })), 2000);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "SYNCING...";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toISOString().replace('T', ' ').split('.')[0];
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-20">
      
      {/* 1. Threat Intel HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 technical-card relative overflow-hidden group border-2 border-tertiary/20">
          <Shield size={64} className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity group-hover:scale-110 duration-500 text-tertiary" />
          <p className="font-technical text-[8px] uppercase tracking-widest text-tertiary font-bold mb-4">Shield Protocol</p>
          <div className="flex items-baseline gap-4">
            <h4 className="font-serif text-5xl text-primary">Level {securityState.shieldLevel}</h4>
            <span className="font-technical text-[10px] text-green-500 animate-pulse">OPTIMAL</span>
          </div>
          <p className="font-technical text-[9px] uppercase text-primary/40 mt-4">Active Threat Mitigation</p>
        </div>

        <div className="p-8 technical-card bg-neutral/50 group border border-primary/5">
          <p className="font-technical text-[8px] uppercase tracking-widest text-primary/40 font-bold mb-4 group-hover:text-primary transition-colors">Encryption Matrix</p>
          <h4 className="font-serif text-4xl text-primary">AES-256-GCM</h4>
          <div className="mt-4 flex items-center gap-3">
             <div className="flex-1 h-1 bg-primary/5 rounded-full overflow-hidden">
                <motion.div animate={{ width: "100%" }} className="h-full bg-tertiary shadow-[0_0_8px_#b3305b]" />
             </div>
             <span className="font-technical text-[8px] text-primary/40 uppercase font-bold">VERIFIED</span>
          </div>
        </div>

        <div className="p-8 technical-card bg-neutral/50 group border border-primary/5">
          <p className="font-technical text-[8px] uppercase tracking-widest text-primary/40 font-bold mb-4 group-hover:text-primary transition-colors">Node Registry</p>
          <h4 className="font-serif text-4xl text-primary">Secure</h4>
          <p className="font-technical text-[10px] uppercase text-green-600 flex items-center gap-2 mt-4">
            <Activity size={12} />
            Live Monitoring Active
          </p>
        </div>
      </div>

      {/* 2. Defensive Hardening */}
      <section className="space-y-8">
        <h3 className="font-technical text-[10px] uppercase tracking-[0.4em] text-primary/40 font-bold">Defensive Hardening</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="flex justify-between items-center p-8 border border-primary/5 technical-card bg-neutral/50">
             <div>
               <h5 className="font-serif text-xl text-primary mb-1">Biometric Multi-Factor</h5>
               <p className="font-technical text-[9px] uppercase text-primary/30">Mandatory hardware key validation</p>
             </div>
             <button 
               onClick={() => setSecurityState(s => ({...s, biometricHardening: !s.biometricHardening}))}
               className={`w-14 h-7 rounded-full relative transition-colors ${securityState.biometricHardening ? 'bg-tertiary' : 'bg-primary/10'}`}
             >
               <motion.div animate={{ x: securityState.biometricHardening ? 30 : 2 }} className="absolute top-1 w-5 h-5 rounded-full bg-neutral shadow-lg" />
             </button>
           </div>

           <div className="flex justify-between items-center p-8 border border-primary/5 technical-card bg-neutral/50">
             <div>
               <h5 className="font-serif text-xl text-primary mb-1">Node Lockdown (Geofence)</h5>
               <p className="font-technical text-[9px] uppercase text-primary/30">Restrict access to verified coordinates</p>
             </div>
             <button 
               onClick={() => setSecurityState(s => ({...s, nodeLockdown: !s.nodeLockdown}))}
               className={`w-14 h-7 rounded-full relative transition-colors ${securityState.nodeLockdown ? 'bg-tertiary' : 'bg-primary/10'}`}
             >
               <motion.div animate={{ x: securityState.nodeLockdown ? 30 : 2 }} className="absolute top-1 w-5 h-5 rounded-full bg-neutral shadow-lg" />
             </button>
           </div>
        </div>
      </section>

      {/* 3. Master Key Control */}
      <div className="p-10 technical-card bg-neutral/50 border border-primary/5 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex gap-6 items-center">
            <div className="w-16 h-16 border border-primary/10 flex items-center justify-center text-primary/20">
               <Lock size={32} />
            </div>
            <div>
               <h4 className="font-serif text-2xl text-primary">Master Key Rotation</h4>
               <p className="font-technical text-[9px] uppercase text-primary/40 mt-1">Last rotated: 2026-04-28 // Next cycle in 12 days</p>
            </div>
         </div>
         <button 
           onClick={handleKeyRotation}
           disabled={securityState.keyRotationLoading}
           className="bg-primary text-neutral px-10 py-4 font-technical text-[10px] font-bold uppercase tracking-widest hover:bg-tertiary transition-all disabled:opacity-50 flex items-center gap-3"
         >
           {securityState.keyRotationLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
           {securityState.keyRotationLoading ? "Rotating Keys..." : "Initiate Key Rotation"}
         </button>
      </div>

      {/* 4. Audit Trail */}
      <section className="space-y-6">
        <h3 className="font-technical text-[10px] uppercase tracking-[0.4em] text-primary/40 font-bold">Global Access Registry</h3>
        <div className="technical-card bg-neutral/50 overflow-hidden border border-primary/5">
          <table className="w-full text-left">
             <thead>
                <tr className="border-b border-primary/5 bg-primary/[0.02]">
                   <th className="p-6 font-technical text-[8px] uppercase font-bold text-primary/40 tracking-widest">Temporal Signature</th>
                   <th className="p-6 font-technical text-[8px] uppercase font-bold text-primary/40 tracking-widest">Node Path</th>
                   <th className="p-6 font-technical text-[8px] uppercase font-bold text-primary/40 tracking-widest">Geo-Coordinate</th>
                   <th className="p-6 font-technical text-[8px] uppercase font-bold text-primary/40 tracking-widest text-right">Auth Status</th>
                </tr>
             </thead>
             <tbody className="font-technical text-[10px] font-bold text-primary/80 divide-y divide-primary/5">
                {loading ? (
                   <tr>
                      <td colSpan={4} className="p-12 text-center">
                         <Loader2 className="animate-spin mx-auto text-tertiary mb-4" />
                         <span className="font-technical text-[8px] uppercase tracking-[0.3em] text-primary/40">Synchronizing Global Registry...</span>
                      </td>
                   </tr>
                ) : logs.length === 0 ? (
                   <tr>
                      <td colSpan={4} className="p-12 text-center">
                         <span className="font-technical text-[8px] uppercase tracking-[0.3em] text-primary/40">No Temporal Signatures Recorded</span>
                      </td>
                   </tr>
                ) : logs.map((log) => (
                  <tr key={log.id} className="hover:bg-primary/[0.02] transition-colors group">
                     <td className="p-6 opacity-40 group-hover:opacity-100 transition-opacity font-mono">{formatDate(log.timestamp)}</td>
                     <td className="p-6">{log.nodePath}</td>
                     <td className="p-6 font-mono text-[9px] opacity-60">{log.location}</td>
                     <td className={`p-6 text-right ${log.alert ? 'text-tertiary' : 'text-green-600'}`}>
                       <span className={`inline-flex items-center gap-2 px-3 py-1 border ${log.alert ? 'border-tertiary/20 bg-tertiary/5' : 'border-green-500/10 bg-green-500/5'}`}>
                         {log.alert && <ShieldAlert size={10} />}
                         {log.status}
                       </span>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      </section>
    </motion.div>
  );
};

// --- Auth Portal ---

const AuthPortal = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError("Authorization Failed: Invalid Credentials or Unauthorized Access.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-neutral flex items-center justify-center p-6 overflow-hidden">
      <TechnicalOverlay className="opacity-10" />
      <Scanline />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="mb-12 text-center">
          <Link href="/" className="group inline-block">
            <h1 className="font-serif text-4xl text-primary mb-2 tracking-[0.1em] group-hover:text-tertiary transition-colors">Divine Registry</h1>
            <p className="font-technical text-[8px] text-tertiary font-bold uppercase tracking-[0.4em] group-hover:tracking-[0.6em] transition-all">Restricted Access Protocol // Login Only</p>
          </Link>
        </div>

        <div className="technical-card bg-neutral/80 backdrop-blur-2xl p-10 border border-primary/5 shadow-2xl">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-primary/5">
             <div className="flex items-center gap-2">
                <Shield size={12} className="text-tertiary" />
                <span className="font-technical text-[7px] uppercase font-bold text-primary/40 tracking-widest">Auth_Sync</span>
             </div>
             <Link href="/" className="font-technical text-[7px] uppercase font-bold text-primary/30 hover:text-primary transition-colors flex items-center gap-2 group">
                <ArrowRight size={10} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                Return to Base
             </Link>
          </div>
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="font-technical text-[7px] uppercase text-primary/40 font-bold">Encrypted Handle (Email)</label>
              <input 
                type="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-primary/5 border border-primary/10 p-4 font-technical text-xs text-primary focus:border-tertiary outline-none transition-colors"
                placeholder="admin@divine.engine"
              />
            </div>

            <div className="space-y-2">
              <label className="font-technical text-[7px] uppercase text-primary/40 font-bold">Access Cipher</label>
              <input 
                type="password" required
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-primary/5 border border-primary/10 p-4 font-technical text-xs text-primary focus:border-tertiary outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="p-4 bg-tertiary/10 border border-tertiary/20 text-tertiary font-technical text-[8px] uppercase font-bold"
              >
                {error}
              </motion.div>
            )}

            <button 
              type="submit" disabled={loading}
              className="w-full bg-primary text-neutral py-4 font-technical text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-tertiary transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
              Authorize Access
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-primary/5 text-center">
            <p className="font-technical text-[7px] text-primary/20 uppercase font-bold tracking-widest">
              Security Notice: Unauthorized access attempts are logged and monitored.
            </p>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-12 opacity-20">
           <div className="flex flex-col items-center gap-2">
              <Lock size={12} className="text-primary" />
              <span className="font-technical text-[6px] uppercase font-bold">AES-256</span>
           </div>
           <div className="flex flex-col items-center gap-2">
              <Shield size={12} className="text-primary" />
              <span className="font-technical text-[6px] uppercase font-bold">FIREBASE_SEC</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main Page ---

export default function AdminPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("control");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user && mounted) {
      logAccessAttempt("ADMIN_COMMAND_HUB", "EU-CENTRAL-1 (FRANKFURT)", "AUTHORIZED");
    }
  }, [user?.uid, mounted]);

  if (!mounted) return null;

  // Show global loader while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral flex items-center justify-center flex-col gap-4">
        <TechnicalOverlay className="opacity-10" />
        <Loader2 className="animate-spin text-tertiary" size={40} />
        <span className="font-technical text-[8px] uppercase tracking-[0.4em] text-primary/40">Synchronizing Biometrics...</span>
      </div>
    );
  }

  // If no user is logged in, show the Auth Portal
  if (!user) {
    return <AuthPortal />;
  }

  return (
    <main className="relative min-h-screen bg-neutral flex">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 h-screen w-64 border-r border-primary/5 bg-neutral/80 backdrop-blur-2xl flex flex-col py-8 px-4 z-50">
        <div className="mb-12 px-4 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-serif font-light tracking-[0.2em] text-primary uppercase">Mission</h1>
            <p className="font-technical text-[8px] font-bold text-tertiary tracking-[0.4em] uppercase">Control</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
            <span className="font-technical text-[10px] text-primary font-bold">{user.displayName?.[0] || user.email?.[0]?.toUpperCase()}</span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          {[
            { id: "control", label: "Mission Control", icon: Terminal },
            { id: "vault", label: "Content Vault", icon: Database },
            { id: "destinations", label: "Journey Registry", icon: MapPin },
            { id: "inbox", label: "Communication Hub", icon: Inbox },
            { id: "analytics", label: "System Analytics", icon: BarChart3 },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-300 group ${activeTab === item.id ? 'bg-primary/5 border-l-2 border-tertiary text-primary' : 'text-primary/40 hover:bg-primary/[0.02] hover:text-primary'}`}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <item.icon size={16} className={`${activeTab === item.id ? 'text-tertiary' : 'group-hover:text-tertiary'} transition-colors duration-500`} />
              </motion.div>
              <span className="font-technical text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-primary/5 space-y-4">
          <div className="px-4">
            <p className="font-technical text-[7px] text-primary/30 uppercase font-bold mb-1 tracking-widest">Active Operator</p>
            <p className="font-technical text-[9px] text-primary font-bold truncate">{user.displayName || user.email}</p>
          </div>
          <div className="space-y-1">
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left flex items-center gap-3 px-3 py-2 transition-colors ${activeTab === 'settings' ? 'text-tertiary' : 'text-primary/40 hover:text-primary'}`}
            >
              <Settings size={14} /> <span className="font-technical text-[8px] uppercase font-bold">System Settings</span>
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full text-left flex items-center gap-3 px-3 py-2 transition-colors ${activeTab === 'security' ? 'text-tertiary' : 'text-primary/40 hover:text-primary'}`}
            >
              <Shield size={14} /> <span className="font-technical text-[8px] uppercase font-bold">Security</span>
            </button>
          </div>
          <button 
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-tertiary hover:bg-tertiary/5 transition-colors group border-t border-primary/5"
          >
            <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
            <span className="font-technical text-[9px] uppercase font-bold tracking-widest">Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 ml-64 p-12 bg-neutral relative overflow-hidden">
        <TechnicalOverlay className="opacity-5" />
        
        <header className="flex justify-between items-end mb-16 relative z-10">
          <div className="max-w-2xl">
            <p className="font-technical text-tertiary text-[10px] font-bold uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-tertiary rounded-full animate-pulse"></span>
              Live System Pulse // Unit-04
            </p>
            <h2 className="font-serif text-5xl text-primary mb-4">
              {activeTab === 'control' && "Mission Control"}
              {activeTab === 'vault' && "Content Vault"}
              {activeTab === 'destinations' && "Journey Registry"}
              {activeTab === 'inbox' && "Communication Hub"}
              {activeTab === 'analytics' && "System Analytics"}
              {activeTab === 'settings' && "System Settings"}
              {activeTab === 'security' && "Security Hub"}
            </h2>
            <p className="font-serif text-lg italic text-primary/60 leading-relaxed">
              {activeTab === 'control' && "Overseeing global operations and real-time mission synchronization."}
              {activeTab === 'vault' && "Specialized environment for the management of cinematic storytelling artifacts."}
              {activeTab === 'destinations' && "Administrative oversight of global mission sectors and geographic registries."}
              {activeTab === 'inbox' && "Encrypted transmission matrix for secure expedition communications."}
              {activeTab === 'analytics' && "Geometric mapping of global traffic metrics and infrastructure health."}
              {activeTab === 'settings' && "Configure platform identity, aesthetic protocols, and core engine parameters."}
              {activeTab === 'security' && "Administrative oversight of encryption protocols and biometric access logs."}
            </p>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'control' && <MissionControlView />}
            {activeTab === 'vault' && <ContentVaultView />}
            {activeTab === 'destinations' && <DestinationsVaultView />}
            {activeTab === 'inbox' && <CommunicationHubView />}
            {activeTab === 'analytics' && <SystemAnalyticsView />}
            {activeTab === 'settings' && <SystemSettingsView />}
            {activeTab === 'security' && <SecurityView />}
          </motion.div>
        </AnimatePresence>

        <footer className="mt-20 pt-8 border-t border-primary/5 flex justify-between items-center relative z-10">
           <p className="font-technical text-[8px] text-primary/20 tracking-[0.4em] uppercase">© 2026 Divine&apos;s Destinations // Terminal V.0.4.2</p>
           <div className="flex gap-8">
              <span className="font-technical text-[8px] text-primary/40 uppercase font-bold">System Status: Operational</span>
              <span className="font-technical text-[8px] text-primary/40 uppercase font-bold">EU-CENTRAL-1 (Frankfurt)</span>
           </div>
        </footer>
      </section>
    </main>
  );
}
