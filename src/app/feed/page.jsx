"use client";
import { useState } from "react";
import HotPosts from "@/components/Dashboard/HotPosts";
import PostCard from "@/components/Posts/PostCard";
import PostFilters from "@/components/Dashboard/PostFilters";
import { motion } from "framer-motion";
import { IconAlertTriangle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

// Sample data - replace with actual API calls
const samplePosts = [
  {
    id: 1,
    user: {
      name: "John Doe",
      avatar: "/avatars/default.png",
      badge: "Verified Reporter"
    },
    location: "Dhaka, Bangladesh",
    division: "Dhaka",
    district: "Dhaka",
    timeAgo: "2 hours ago",
    title: "Suspicious Activity Reported Near Gulshan 2",
    description: "Multiple residents have reported suspicious individuals lurking around...",
    category: "Suspicious Activity",
    severity: "medium", // low, medium, high
    media: {
      type: "image",
      url: "https://imgs.search.brave.com/6_YjelMFWT4iymjRAhhsUaSRUIRF6mwIZUvyionABUQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aHJ3Lm9yZy9zaXRl/cy9kZWZhdWx0L2Zp/bGVzL3N0eWxlcy8x/Nng5X2xhcmdlL3B1/YmxpYy9tZWRpYV8y/MDIwLzA5LzIwMjAw/OVVTX01vdHRfSGF2/ZW5fUHJvdGVzdHMu/anBnP2g9ZDQ1NzMw/YmQmaXRvaz12OEJ4/RkEzZQ",
    },
    stats: {
      upvotes: 1234,
      downvotes: 56,
      comments: 89,
      shares: 45
    },
  },
  // Add more sample posts...
];

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
  const [filters, setFilters] = useState({
    division: "",
    district: "",
    sortBy: "hot",
    category: "all"
  });
  const [selectedPost, setSelectedPost] = useState(null);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredPosts = samplePosts.filter(post => {
    if (filters.division && post.division !== filters.division) return false;
    if (filters.district && post.district !== filters.district) return false;
    if (filters.category !== "all" && post.category !== filters.category) return false;
    return true;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (filters.sortBy) {
      case "hot":
        return (b.stats.upvotes + b.stats.comments) - (a.stats.upvotes + a.stats.comments);
      case "top":
        return b.stats.upvotes - a.stats.upvotes;
      case "new":
        return new Date(b.timeAgo) - new Date(a.timeAgo);
      case "controversial":
        return (b.stats.upvotes * b.stats.downvotes) - (a.stats.upvotes * a.stats.downvotes);
      default:
        return 0;
    }
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hot Posts Section First */}
      <div className="p-6 pb-0">
        <HotPosts />
      </div>
      
      {/* Filters - Below Hot Posts */}
      <div className="px-6 mt-8">
        <PostFilters onFilterChange={handleFilterChange} />
      </div>
      
      {/* Posts Grid with Conditional Layout */}
      <div className="flex-1 p-6">
        {selectedPost ? (
          <div className="grid grid-cols-[1fr,400px] gap-6">
            <div>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedPost(null)}
                className="mb-4"
              >
                ← Back to Feed
              </Button>
              <PostCard {...selectedPost} />
            </div>
            <div className="border-l border-border pl-6">
              <h3 className="font-semibold mb-4">Comments</h3>
              <div className="space-y-4">
                {/* Replace with actual comments component */}
                <p className="text-muted-foreground text-sm">Comments section coming soon...</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {sortedPosts.map((post) => (
              <div key={post.id} onClick={() => setSelectedPost(post)} className="cursor-pointer">
                <PostCard {...post} />
              </div>
            ))}
          </div>
        )}

        {sortedPosts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <IconAlertTriangle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Reports Found</h3>
            <p className="text-muted-foreground">
              No incidents have been reported for the selected filters.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default FeedPage; 