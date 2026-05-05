"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TechnicalOverlay, Scanline } from "@/components/ui/TechnicalOverlay";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowLeft, MapPin, Camera, Award, MessageSquare, Send, User as UserIcon, Loader2, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPost, incrementRecommendations, addComment, subscribeToComments, incrementLikes, incrementCommentLikes, addReply, subscribeToReplies } from "@/lib/db/posts";
import { Post, PostComment } from "@/types";

// Individual Comment Component to handle nested replies and interaction
const CommentItem = ({ comment, postId }: { comment: PostComment, postId: string }) => {
  const [replies, setReplies] = useState<any[]>([]);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyName, setReplyName] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const unsub = subscribeToReplies(postId, comment.id, setReplies);
    // Local persistence check
    if (localStorage.getItem(`comment_like_${comment.id}`)) setLiked(true);
    return () => unsub();
  }, [postId, comment.id]);

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    localStorage.setItem(`comment_like_${comment.id}`, 'true');
    await incrementCommentLikes(postId, comment.id);
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyName || !replyBody) return;
    setSubmittingReply(true);
    await addReply(postId, comment.id, replyName, replyBody);
    setReplyName("");
    setReplyBody("");
    setShowReplyForm(false);
    setSubmittingReply(false);
  };

  return (
    <div className="relative pl-8 border-l border-primary/5 space-y-6">
      <div className="absolute left-[-1px] top-0 w-[1px] h-4 bg-tertiary" />
      
      {/* Main Comment */}
      <div>
        <div className="flex items-center gap-4 mb-3">
          <UserIcon size={12} className="text-primary/20" />
          <span className="font-technical text-[10px] text-primary font-bold uppercase tracking-widest">{comment.userName}</span>
          <span className="font-technical text-[8px] text-primary/20 uppercase">{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="font-body text-sm text-primary/70 leading-relaxed max-w-2xl mb-4">
          {comment.content}
        </p>
        
        {/* Interaction Bar */}
        <div className="flex items-center gap-6">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors ${liked ? 'text-tertiary' : 'text-primary/30 hover:text-tertiary'}`}
          >
            <Heart size={10} className={liked ? 'fill-tertiary/20' : ''} />
            <span className="font-technical text-[8px] font-bold uppercase">{comment.likes || 0}</span>
          </button>
          <button 
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="font-technical text-[8px] font-bold uppercase text-primary/30 hover:text-primary transition-colors tracking-widest"
          >
            {showReplyForm ? '[ CANCEL ]' : '[ TRANSMIT_REPLY ]'}
          </button>
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <form onSubmit={handleSubmitReply} className="glass-panel p-6 space-y-4 max-w-xl">
          <div className="grid grid-cols-2 gap-4">
            <input 
              value={replyName}
              onChange={e => setReplyName(e.target.value)}
              placeholder="OPERATOR_HANDLE"
              className="bg-primary/[0.03] border border-primary/10 px-3 py-2 font-technical text-[8px] text-primary focus:border-tertiary outline-none"
            />
          </div>
          <textarea 
            value={replyBody}
            onChange={e => setReplyBody(e.target.value)}
            placeholder="REPLY_DISPATCH..."
            rows={2}
            className="w-full bg-primary/[0.03] border border-primary/10 px-3 py-2 font-body text-xs text-primary focus:border-tertiary outline-none"
          />
          <button 
            type="submit"
            disabled={submittingReply || !replyName || !replyBody}
            className="flex items-center gap-2 bg-primary text-neutral px-4 py-2 font-technical text-[8px] font-bold uppercase tracking-widest hover:bg-tertiary transition-all"
          >
            {submittingReply ? <Loader2 size={10} className="animate-spin" /> : <Send size={10} />}
            Push Reply
          </button>
        </form>
      )}

      {/* Nested Replies */}
      {replies.length > 0 && (
        <div className="space-y-6 pt-4">
          {replies.map((reply) => (
            <div key={reply.id} className="relative pl-6 border-l border-primary/10 py-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-technical text-[9px] text-primary font-bold uppercase tracking-widest">{reply.userName}</span>
                <span className="font-technical text-[7px] text-primary/20 uppercase">REPLY // {new Date(reply.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="font-body text-xs text-primary/60 leading-relaxed">
                {reply.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function BlogClient({ id }: { id: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentName, setCommentName] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [recommended, setRecommended] = useState(false);

  useEffect(() => {
    if (!id) return;
    getPost(id).then((data) => {
      setPost(data);
      setLoading(false);
    });

    // Check device persistence
    if (localStorage.getItem(`rec_${id}`)) setRecommended(true);
    if (localStorage.getItem(`like_${id}`)) setLiked(true);

    const unsub = subscribeToComments(id, (data) => {
      setComments(data as PostComment[]);
    });

    return () => unsub();
  }, [id]);

  const handleRecommend = async () => {
    if (recommended) return;
    setRecommended(true);
    localStorage.setItem(`rec_${id}`, 'true');
    await incrementRecommendations(id);
    setPost(p => p ? { ...p, recommendations: (p.recommendations || 0) + 1 } : null);
  };

  const [liked, setLiked] = useState(false);
  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    localStorage.setItem(`like_${id}`, 'true');
    await incrementLikes(id);
    setPost(p => p ? { ...p, likes: (p.likes || 0) + 1 } : null);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName || !commentBody) return;
    setSubmittingComment(true);
    await addComment(id, commentName, commentBody);
    setCommentName("");
    setCommentBody("");
    setSubmittingComment(false);
  };

  if (loading) {
    return (
      <main className="relative min-h-screen bg-transparent">
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
      <main className="relative min-h-screen bg-transparent flex items-center justify-center">
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
    <main className="relative min-h-screen bg-transparent">
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
          <button 
            onClick={handleRecommend}
            disabled={recommended}
            className={`flex items-center gap-2 transition-all ${recommended ? 'text-tertiary' : 'text-primary/40 hover:text-tertiary'}`}
          >
            <Award size={14} className={recommended ? 'fill-tertiary/20' : ''} />
            <span className="font-technical text-[9px] font-bold uppercase tracking-widest">
              {post.recommendations || 0} Recommendations
            </span>
          </button>
          <button 
            onClick={handleLike}
            disabled={liked}
            className={`flex items-center gap-2 transition-all ${liked ? 'text-tertiary' : 'text-primary/40 hover:text-tertiary'}`}
          >
            <Heart size={14} className={liked ? 'fill-tertiary/20' : ''} />
            <span className="font-technical text-[9px] font-bold uppercase tracking-widest">
              {post.likes || 0} Likes
            </span>
          </button>
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
      <article className="px-6 md:px-12 max-w-3xl mx-auto pb-20">
        <div className="font-body text-primary/80 leading-relaxed space-y-6 whitespace-pre-wrap">
          {post.content}
        </div>
      </article>

      {/* Supplemental Mission Sectors */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto pb-32 space-y-24">
        
        {/* Gastronomy Sector */}
        {post.gastronomy && post.gastronomy.length > 0 && (
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <h3 className="font-technical text-[10px] uppercase tracking-[0.4em] text-tertiary font-bold">Gastronomy Archive</h3>
              <div className="h-[1px] flex-1 bg-primary/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {post.gastronomy.map((dish, i) => (
                <div key={i} className="group relative">
                  <div className="relative aspect-[4/3] mb-6 overflow-hidden technical-card grayscale hover:grayscale-0 transition-all duration-700">
                    {dish.image && <Image src={dish.image} alt={dish.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />}
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="font-heading text-lg text-primary mb-2">{dish.name}</h4>
                  <p className="font-body text-xs text-primary/40 leading-relaxed italic">{dish.ingredients}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          {/* Tactical Guidance (Tips) */}
          {post.tips && post.tips.length > 0 && (
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <h3 className="font-technical text-[10px] uppercase tracking-[0.4em] text-tertiary font-bold">Tactical Guidance</h3>
                <div className="h-[1px] flex-1 bg-primary/10" />
              </div>
              <ul className="space-y-6">
                {post.tips.map((tip, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="text-tertiary font-technical text-[10px] font-bold mt-1">0{i + 1}</span>
                    <p className="font-body text-sm text-primary/60 leading-relaxed">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Expedition Gear Manifest */}
          {post.expeditionGear && post.expeditionGear.length > 0 && (
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <h3 className="font-technical text-[10px] uppercase tracking-[0.4em] text-tertiary font-bold">Gear Manifest</h3>
                <div className="h-[1px] flex-1 bg-primary/10" />
              </div>
              <div className="grid grid-cols-1 gap-3">
                {post.expeditionGear.map((gear, i) => (
                  <div key={i} className="flex justify-between items-center px-4 py-3 bg-primary/[0.02] border border-primary/5 hover:border-tertiary/20 transition-colors group">
                    <span className="font-technical text-[9px] text-primary font-bold uppercase tracking-[0.2em]">{gear}</span>
                    <div className="w-1 h-1 bg-primary/20 group-hover:bg-tertiary transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* User Interaction Sector (Comments) */}
      <section className="px-6 md:px-12 max-w-3xl mx-auto pb-48 space-y-16">
        <div className="flex items-center gap-4">
          <MessageSquare size={16} className="text-tertiary" />
          <h3 className="font-technical text-[10px] uppercase tracking-[0.4em] text-primary font-bold">Encrypted Mission Guidance</h3>
          <div className="h-[1px] flex-1 bg-primary/10" />
          <span className="font-technical text-[8px] text-primary/30 uppercase">{comments.length} Transmissions</span>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="glass-panel p-8 space-y-6 relative overflow-hidden">
          <Scanline className="opacity-5" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-technical text-[8px] text-primary/40 uppercase font-bold">Operator Handle</label>
              <input 
                value={commentName}
                onChange={e => setCommentName(e.target.value)}
                placeholder="UNIDENTIFIED_USER"
                className="w-full bg-primary/[0.03] border border-primary/10 px-4 py-3 font-technical text-[10px] text-primary uppercase focus:border-tertiary outline-none transition-colors"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-technical text-[8px] text-primary/40 uppercase font-bold">Mission Feedback / Observations</label>
            <textarea 
              value={commentBody}
              onChange={e => setCommentBody(e.target.value)}
              placeholder="ENCRYPTED_MESSAGE..."
              rows={4}
              className="w-full bg-primary/[0.03] border border-primary/10 px-4 py-3 font-body text-sm text-primary focus:border-tertiary outline-none transition-colors"
            />
          </div>
          <button 
            type="submit"
            disabled={submittingComment || !commentName || !commentBody}
            className="group flex items-center gap-3 bg-primary text-neutral px-8 py-3 font-technical text-[9px] font-bold uppercase tracking-widest hover:bg-tertiary transition-all disabled:opacity-30"
          >
            {submittingComment ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
            Transmit Observation
          </button>
        </form>

        {/* Comment List */}
        <div className="space-y-12">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} postId={id} />
          ))}
          {comments.length === 0 && (
            <div className="py-12 text-center border border-dashed border-primary/10 bg-primary/[0.01]">
              <p className="font-technical text-[8px] text-primary/20 uppercase tracking-[0.4em]">No active transmissions in this sector.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
