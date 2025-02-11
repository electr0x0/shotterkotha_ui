"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconChevronLeft, IconChevronRight, IconAlertTriangle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";

const hotPosts = [
  {
    id: 1,
    category: "High Alert",
    title: "Suspicious Activity in Gulshan-2",
    description: "Multiple reports of suspicious individuals near residential areas",
    image: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28",
    severity: "high",
    location: "Dhaka",
    reportCount: 15,
  },
  {
    id: 2,
    category: "Traffic Alert",
    title: "Major Road Blockage on Mirpur Road",
    description: "Heavy traffic due to ongoing construction work",
    image: "https://images.unsplash.com/photo-1566288623394-377af472d81b",
    severity: "medium",
    location: "Dhaka",
    reportCount: 8,
  },
  // Add more items...
];

function HotPosts() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % hotPosts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + hotPosts.length) % hotPosts.length);
  };

  useEffect(() => {
    if (!isHovered) {
      timeoutRef.current = setTimeout(nextSlide, 5000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, isHovered]);

  const severityColor = {
    low: "bg-green-500/10 text-green-500",
    medium: "bg-yellow-500/10 text-yellow-500",
    high: "bg-red-500/10 text-red-500",
  };

  return (
    <div className="relative overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending Alerts</h2>
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
          className="relative h-[400px] rounded-xl overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
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
              <Image
                src={hotPosts[currentIndex].image}
                alt={hotPosts[currentIndex].title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-0 left-0 right-0 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Badge 
                    variant="outline" 
                    className={cn("font-medium", severityColor[hotPosts[currentIndex].severity])}
                  >
                    {hotPosts[currentIndex].severity.toUpperCase()}
                  </Badge>
                  <Badge variant="secondary">{hotPosts[currentIndex].category}</Badge>
                  <Badge variant="outline" className="gap-1">
                    <IconAlertTriangle className="w-3 h-3" />
                    {hotPosts[currentIndex].reportCount} Reports
                  </Badge>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  {hotPosts[currentIndex].title}
                </h3>
                <p className="text-gray-200 max-w-2xl">
                  {hotPosts[currentIndex].description}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Slide indicators */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {hotPosts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
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