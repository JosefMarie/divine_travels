"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TechnicalOverlay, Scanline } from "@/components/ui/TechnicalOverlay";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowLeft, MapPin, Camera } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPost } from "@/lib/db/posts";
import { Post } from "@/types";

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 16: params is a Promise — must be unwrapped with React.use()
  const { id } = React.use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getPost(id).then((data) => {
      setPost(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <main className="relative min-h-screen bg-neutral">
        <Navbar />
        <div className="pt-40 pb-24 px-6 md:px-12 max-w-4xl mx-auto animate-pulse space-y-8">
          <div className="h-4 w-24 bg-primary/10 rounded" />
          <div className="h-16 w-3/4 bg-primary/10 rounded" />
          <div className="h-[500px] w-full bg-primary/10 rounded" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 bg-primary/10 rounded" style={{ width: `${85 - i * 5}%` }} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="relative min-h-screen bg-neutral flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <p className="font-technical text-[10px] text-tertiary uppercase tracking-widest mb-4">
            Chronicle Not Found
          </p>
          <Link href="/blog">
            <MagneticButton className="flex items-center gap-2 text-primary">
              <ArrowLeft size={14} />
              <span className="font-technical text-[9px] font-bold uppercase tracking-widest">
                Return to Archive
              </span>
            </MagneticButton>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-neutral">
      <Navbar />
      <TechnicalOverlay className="opacity-5" />

      {/* Hero */}
      <section className="pt-40 pb-16 px-6 md:px-12 max-w-4xl mx-auto">
        <Link href="/blog">
          <MagneticButton className="flex items-center gap-2 text-primary/40 hover:text-primary mb-12 transition-colors">
            <ArrowLeft size={14} />
            <span className="font-technical text-[9px] font-bold uppercase tracking-widest">
              Back to Chronicles
            </span>
          </MagneticButton>
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <span className="font-technical text-[9px] text-tertiary font-bold uppercase tracking-widest">
            {post.category}
          </span>
          <div className="w-1 h-1 rounded-full bg-primary/20" />
          <span className="font-technical text-[9px] text-primary/40 font-bold uppercase">
            {post.date}
          </span>
          <div className="w-1 h-1 rounded-full bg-primary/20" />
          <span className="font-technical text-[9px] text-primary/40 font-bold uppercase">
            {post.readTime} read
          </span>
        </div>

        <h1 className="font-heading text-primary mb-8 leading-tight">
          {post.title}
        </h1>

        <p className="font-body text-primary/60 italic leading-relaxed mb-12">
          {post.excerpt}
        </p>

        {/* Metadata bar */}
        <div className="flex flex-wrap gap-8 border-y border-primary/5 py-6 mb-12">
          {post.coordinates && (
            <div className="flex items-center gap-2 text-primary/40">
              <MapPin size={12} />
              <span className="font-technical text-[9px] font-bold uppercase tracking-widest">
                {post.coordinates}
              </span>
            </div>
          )}
          {post.gear && (
            <div className="flex items-center gap-2 text-primary/40">
              <Camera size={12} />
              <span className="font-technical text-[9px] font-bold uppercase tracking-widest">
                {post.gear}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Hero Image */}
      {post.imageUrl && (
        <div className="relative w-full aspect-[21/9] max-h-[600px] mb-16 overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover grayscale"
          />
          <Scanline />
        </div>
      )}

      {/* Article Body */}
      <article className="px-6 md:px-12 max-w-3xl mx-auto pb-32">
        <div className="font-body text-primary/80 leading-relaxed space-y-6 whitespace-pre-wrap">
          {post.content}
        </div>
      </article>

      <Footer />
    </main>
  );
}
