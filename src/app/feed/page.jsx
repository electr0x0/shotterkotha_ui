"use client";
import { useState, useEffect } from "react";
import HotPosts from "@/components/Dashboard/HotPosts";
import PostCard from "@/components/Posts/PostCard";
import PostFilters from "@/components/Dashboard/PostFilters";
import AIChatMessage from "@/components/Dashboard/AIChatMessage";
import { motion } from "framer-motion";
import { IconAlertTriangle, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";
import Navbar from "@/components/Dashboard/Navbar";

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
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    division: "",
    district: "",
    searchTerm: ""
  });

  useEffect(() => {
    fetchPosts();
  }, [filters.division, filters.district]);

  useEffect(() => {
    filterPosts();
  }, [posts, filters.searchTerm]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (filters.division) queryParams.append('division', filters.division);
      if (filters.district) queryParams.append('district', filters.district);
      
      const url = `/reports/posts/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await axiosInstance.get(url);
      setPosts(response.data);
      setFilteredPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterPosts = () => {
    if (!filters.searchTerm) {
      setFilteredPosts(posts);
      return;
    }

    const searchTerm = filters.searchTerm.toLowerCase();
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.description.toLowerCase().includes(searchTerm) ||
      post.category.toLowerCase().includes(searchTerm) ||
      post.division?.toLowerCase().includes(searchTerm) ||
      post.district?.toLowerCase().includes(searchTerm) ||
      post.fullAddress?.toLowerCase().includes(searchTerm)
    );
    setFilteredPosts(filtered);
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <IconLoader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading posts...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <IconAlertTriangle className="w-12 h-12 text-destructive mb-4" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchPosts}>Try Again</Button>
        </div>
      );
    }

    if (filteredPosts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">
            {filters.searchTerm ? "No posts found matching your search" : "No posts found"}
          </p>
        </div>
      );
    }

    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6"
      >
        {filteredPosts.map((post) => (
          <motion.div key={post.id} variants={item}>
            <PostCard post={post} />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <div className="flex flex-col min-h-screen">
        {/* Hot Posts Section First */}
        <div className="p-6 pb-0">
          <HotPosts />
        </div>
        
        {/* Filters - Below Hot Posts */}
        <div className="px-6 mt-8">
          <PostFilters onFilterChange={handleFilterChange} />
        </div>
        
        {/* Posts Grid */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>

        {/* AI Chat Message Component */}
        <AIChatMessage />
      </div>
    </>
  );
}

export default FeedPage; 