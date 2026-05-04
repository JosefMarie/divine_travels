import React from "react";
import BlogClient from "./BlogClient";
import { getPosts } from "@/lib/db/posts";

// Next.js 16 requirements for static export with dynamic routes
export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    return posts.map((post) => ({
      id: post.id,
    }));
  } catch (error) {
    console.error("Error generating static params for blog:", error);
    return [];
  }
}

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  return <BlogClient id={id} />;
}
