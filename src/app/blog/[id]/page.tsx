import React from "react";
import BlogClient from "./BlogClient";

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  return <BlogClient id={id} />;
}
