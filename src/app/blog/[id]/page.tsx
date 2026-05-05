import React from "react";
import BlogClient from "./BlogClient";
import { Metadata } from "next";


type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    // Use the REST API for server-side metadata to avoid 'offline' GRPC errors in Node.js
    const url = `https://firestore.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/databases/(default)/documents/posts/${id}?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`;
    
    const response = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!response.ok) {
      return { title: "Chronicle | Divine Destinations" };
    }

    const data = await response.json();
    const fields = data.fields;

    const title = fields.title?.stringValue || "Chronicle";
    const excerpt = fields.excerpt?.stringValue || "Explore the divine.";
    const imageUrl = fields.imageUrl?.stringValue;

    const fullTitle = `${title} | Divine Destinations`;

    return {
      title: fullTitle,
      description: excerpt,
      openGraph: {
        title: fullTitle,
        description: excerpt,
        images: imageUrl ? [{ url: imageUrl }] : [],
        type: "article",
      },
    };
  } catch (error) {
    console.error("Metadata REST fetch failed:", error);
    return {
      title: "Chronicle | Divine Destinations",
      description: "Mission Guidance Archive"
    };
  }
}

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  return <BlogClient id={id} />;
}
