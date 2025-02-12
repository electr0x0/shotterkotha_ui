"use client";
import { useState } from "react";
import HotPosts from "@/components/Dashboard/HotPosts";
import PostCard from "@/components/Posts/PostCard";
import PostFilters from "@/components/Dashboard/PostFilters";
import { motion } from "framer-motion";
import { IconAlertTriangle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { mockPosts } from "@/lib/mock/posts";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function FeedPage() {
  const posts = Object.values(mockPosts);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hot Posts Section First */}
      <div className="p-6 pb-0">
        <HotPosts />
      </div>
      
      {/* Filters - Below Hot Posts */}
      <div className="px-6 mt-8">
        <PostFilters />
      </div>
      
      {/* Posts Grid */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeedPage; 