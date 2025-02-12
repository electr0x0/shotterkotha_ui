"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconChevronLeft, IconChevronRight, IconAlertTriangle, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";

function HotPosts() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchHotPosts();
  }, []);

  const fetchHotPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use the same endpoint as the feed
      const queryParams = new URLSearchParams();
      const url = `/reports/posts/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await axiosInstance.get(url);
      
      // Filter and take only the first 3 posts with images
      const postsWithImages = response.data
        .filter(post => post.media?.length > 0 && post.media[0].media_type === 'image')
        .slice(0, 3);
      
      setPosts(postsWithImages);
    } catch (err) {
      console.error('Error fetching hot posts:', err);
      setError('Failed to load recent posts');
    } finally {
      setIsLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  useEffect(() => {
    if (!isHovered && posts.length > 0) {
      timeoutRef.current = setTimeout(nextSlide, 5000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, isHovered, posts.length]);

  if (isLoading) {
    return (
      <div className="relative h-[400px] rounded-xl overflow-hidden bg-background/95">
        <div className="absolute inset-0 flex items-center justify-center">
          <IconLoader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading posts...</span>
        </div>
      </div>
    );
  }

  if (error || posts.length === 0) {
    return null;
  }

  const severityColor = {
    low: "bg-green-500/10 text-green-500",
    medium: "bg-yellow-500/10 text-yellow-500",
    high: "bg-red-500/10 text-red-500",
  };

  const currentPost = posts[currentIndex];

  return (
    <div className="relative overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Reports</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full"
            >
              <IconChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full"
            >
              <IconChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div 
          className="relative h-[400px] rounded-xl overflow-hidden cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => router.push(`/post/${currentPost.id}`)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative h-full"
            >
              {currentPost.media[0] && (
                <img
                  src={currentPost.media[0].file}
                  alt={currentPost.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-0 left-0 right-0 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Badge 
                    className={cn(
                      "font-medium",
                      severityColor[currentPost.severity]
                    )}
                  >
                    {currentPost.severity.charAt(0).toUpperCase() + 
                     currentPost.severity.slice(1)} Severity
                  </Badge>
                  <Badge variant="secondary">
                    {currentPost.category.charAt(0).toUpperCase() + 
                     currentPost.category.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <IconAlertTriangle className="w-3 h-3" />
                    {currentPost.comments_count} Reports
                  </Badge>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  {currentPost.title}
                </h3>
                <p className="text-gray-200 max-w-2xl line-clamp-2">
                  {currentPost.description}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Slide indicators */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {posts.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentIndex 
                    ? "bg-white w-6" 
                    : "bg-white/50 hover:bg-white/75"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotPosts;