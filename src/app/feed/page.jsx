"use client";
import { useState } from "react";
import HotPosts from "@/components/Dashboard/HotPosts";
import PostCard from "@/components/Posts/PostCard";
import PostFilters from "@/components/Dashboard/PostFilters";

// Sample data - replace with actual API calls
const samplePosts = [
  {
    id: 1,
    user: {
      name: "John Doe",
      avatar: "/avatars/default.png",
    },
    location: "Dhaka, Bangladesh",
    division: "Dhaka",
    district: "Dhaka",
    timeAgo: "2 hours ago",
    media: {
      type: "image",
      url: "https://imgs.search.brave.com/6_YjelMFWT4iymjRAhhsUaSRUIRF6mwIZUvyionABUQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aHJ3Lm9yZy9zaXRl/cy9kZWZhdWx0L2Zp/bGVzL3N0eWxlcy8x/Nng5X2xhcmdlL3B1/YmxpYy9tZWRpYV8y/MDIwLzA5LzIwMjAw/OVVTX01vdHRfSGF2/ZW5fUHJvdGVzdHMu/anBnP2g9ZDQ1NzMw/YmQmaXRvaz12OEJ4/RkEzZQ",
      thumbnail: "https://imgs.search.brave.com/6_YjelMFWT4iymjRAhhsUaSRUIRF6mwIZUvyionABUQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aHJ3Lm9yZy9zaXRl/cy9kZWZhdWx0L2Zp/bGVzL3N0eWxlcy8x/Nng5X2xhcmdlL3B1/YmxpYy9tZWRpYV8y/MDIwLzA5LzIwMjAw/OVVTX01vdHRfSGF2/ZW5fUHJvdGVzdHMu/anBnP2g9ZDQ1NzMw/YmQmaXRvaz12OEJ4/RkEzZQ",
    },
    stats: {
      upvotes: 1234,
      downvotes: 56,
      comments: 89,
    },
  },
  // Add more sample posts...
];

function FeedPage() {
  const [filters, setFilters] = useState({
    division: "",
    district: "",
    sortBy: "hot"
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Here you would typically fetch new data based on filters
  };

  const filteredPosts = samplePosts.filter(post => {
    if (filters.division && post.division !== filters.division) return false;
    if (filters.district && post.district !== filters.district) return false;
    return true;
  });

  // Sort posts based on the selected option
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
    <div className="min-h-screen pt-14">
      {/* Hot Posts Carousel */}
      <section className="mb-8">
        <HotPosts />
      </section>

      {/* Main Feed */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PostFilters onFilterChange={handleFilterChange} />
        
        <div className="space-y-6">
          {sortedPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>

        {sortedPosts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No posts found for the selected filters.
          </div>
        )}
      </main>
    </div>
  );
}

export default FeedPage; 