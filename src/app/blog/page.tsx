"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TechnicalOverlay, Scanline } from "@/components/ui/TechnicalOverlay";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowUpRight, Clock, MessageSquare, Award, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { subscribeToPosts, incrementRecommendations, incrementLikes } from "@/lib/db/posts";
import { Post } from "@/types";

// Skeleton loading card
const SkeletonCard = () => (
  <div className="group flex flex-col technical-card p-4 animate-pulse">
    <div className="relative aspect-[16/9] mb-8 bg-primary/10" />
    <div className="flex-1 flex flex-col gap-4">
      <div className="h-3 w-24 bg-primary/10 rounded" />
      <div className="h-8 w-full bg-primary/10 rounded" />
      <div className="h-4 w-3/4 bg-primary/10 rounded" />
      <div className="h-4 w-1/2 bg-primary/10 rounded" />
    </div>
  </div>
);

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [interacted, setInteracted] = useState<Record<string, { liked: boolean, recommended: boolean }>>({});

  useEffect(() => {
    // Real-time listener — updates instantly when Admin publishes a new post
    const unsub = subscribeToPosts((allPosts) => {
      setPosts(allPosts.filter((p) => p.status === "live"));
      setLoading(false);
      
      // Load interactions from localStorage
      const interactions: Record<string, { liked: boolean, recommended: boolean }> = {};
      allPosts.forEach(post => {
        interactions[post.id] = {
          liked: !!localStorage.getItem(`like_${post.id}`),
          recommended: !!localStorage.getItem(`rec_${post.id}`)
        };
      });
      setInteracted(interactions);
    });
    return () => unsub();
  }, []);

  const toggleInteraction = (id: string, type: 'like' | 'rec') => {
    const key = `${type === 'like' ? 'like' : 'rec'}_${id}`;
    if (localStorage.getItem(key)) return;
    
    if (type === 'like') {
      incrementLikes(id);
    } else {
      incrementRecommendations(id);
    }
    
    localStorage.setItem(key, 'true');
    setInteracted(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type === 'like' ? 'liked' : 'recommended']: true
      }
    }));
  };

  return (
    <main className="relative min-h-screen bg-transparent">
      <Navbar />
      <TechnicalOverlay className="opacity-10" />

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-primary/5">
        <div className="max-w-3xl">
          <p className="font-technical text-[10px] text-tertiary font-bold tracking-[0.4em] uppercase mb-4">
            Cinematic Chronicles
          </p>
          <h1 className="font-heading text-6xl md:text-8xl text-primary mb-8">
            The Blog.
          </h1>
          <p className="font-body text-xl text-primary/60 italic leading-relaxed">
            In-depth narratives from the edge of the world. Each entry is a
            meticulous study of light, location, and the technical journey
            behind the capture.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-technical text-[10px] text-primary/30 uppercase tracking-widest">
              No chronicles published yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.map((post, idx) => (
              <div key={post.id} className="group flex flex-col technical-card p-4">
                <div className="relative aspect-[16/9] mb-8 overflow-hidden border border-primary/5 bg-primary/[0.02]">
                  {post.imageUrl && (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                    />
                  )}
                  <Scanline />
                  <div className="absolute top-4 left-4 font-technical text-[8px] bg-primary text-neutral px-2 py-1 font-bold">
                    CHRON_{String(idx + 1).padStart(2, "0")}
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-technical text-[9px] text-tertiary font-bold uppercase tracking-widest">
                      {post.category}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-primary/20" />
                    <span className="font-technical text-[9px] text-primary/40 font-bold uppercase">
                      {post.date}
                    </span>
                  </div>

                  <h3 className="font-heading text-primary mb-4 group-hover:text-tertiary transition-colors">
                    {post.title}
                  </h3>
                  <p className="font-body text-primary/60 italic mb-8 flex-1 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="pt-6 border-t border-primary/5 flex justify-between items-center">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5 text-primary/30">
                        <Clock size={12} />
                        <span className="font-technical text-[8px] font-bold uppercase">
                          {post.readTime}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleInteraction(post.id, 'rec');
                        }}
                        className={`flex items-center gap-1.5 transition-colors ${interacted[post.id]?.recommended ? 'text-tertiary' : 'text-primary/30 hover:text-tertiary'}`}
                      >
                        <Award size={12} className={interacted[post.id]?.recommended ? 'fill-tertiary/20' : ''} />
                        <span className="font-technical text-[8px] font-bold uppercase">
                          {post.recommendations || 0}
                        </span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleInteraction(post.id, 'like');
                        }}
                        className={`flex items-center gap-1.5 transition-colors ${interacted[post.id]?.liked ? 'text-tertiary' : 'text-primary/30 hover:text-tertiary'}`}
                      >
                        <Heart size={12} className={interacted[post.id]?.liked ? 'fill-tertiary/20' : ''} />
                        <span className="font-technical text-[8px] font-bold uppercase">
                          {post.likes || 0}
                        </span>
                      </button>
                    </div>
                    <Link href={`/blog/${post.id}`}>
                      <MagneticButton className="flex items-center gap-2 text-tertiary">
                        <span className="font-technical text-[9px] font-bold uppercase tracking-widest">
                          Read Article
                        </span>
                        <ArrowUpRight size={14} />
                      </MagneticButton>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
