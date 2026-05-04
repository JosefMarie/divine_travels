import React from "react";
import BlogClient from "./BlogClient";
import { getPosts } from "@/lib/db/posts";

// Force static generation for 100% free hosting
export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    // Attempt to fetch real posts from Firestore
    const posts = await getPosts();
    
    if (!posts || posts.length === 0) {
      console.warn("No posts found during static generation. Deployment may be empty.");
      // Provide a fallback ID if registry is empty to prevent build failure
      return [{ id: 'manifest_init' }];
    }

    return posts.map((post) => ({
      id: post.id,
    }));
  } catch (error) {
    console.error("Critical failure during static generation:", error);
    // Return a dummy path to allow the build to finish
    return [{ id: 'manifest_error' }];
  }
}

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  return <BlogClient id={id} />;
}
