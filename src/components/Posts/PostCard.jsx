"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconThumbUp,
  IconThumbDown,
  IconMessageCircle,
  IconShare3,
  IconPlayerPlay,
  IconMapPin,
  IconClock,
  IconAlertTriangle,
  IconBookmark,
  IconUser,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AIImageDescription from "./AIImageDescription";

export default function PostCard({ post }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [votes, setVotes] = useState(post.stats.upvotes - post.stats.downvotes);
  const [userVote, setUserVote] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const handlePostClick = (e) => {
    if (
      e.target.tagName === 'BUTTON' || 
      e.target.closest('button') ||
      e.target.tagName === 'A' ||
      e.target.closest('a')
    ) {
      return;
    }
    router.push(`/post/${post.id}`);
  };

  const handleVote = (type) => {
    if (userVote === type) {
      setUserVote(null);
      setVotes(post.stats.upvotes - post.stats.downvotes);
    } else {
      setUserVote(type);
      setVotes(
        type === "up"
          ? post.stats.upvotes - post.stats.downvotes + 1
          : post.stats.upvotes - post.stats.downvotes - 1
      );
    }
  };

  const renderUserAvatar = () => {
    if (!post.user.image) {
      return (
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <IconUser className="w-5 h-5" />
        </div>
      );
    }

    return (
      <motion.div 
        whileHover={{ scale: 1.1 }}
        className="relative w-10 h-10"
      >
        <Image
          src={post.user.image}
          alt={post.user.name}
          fill
          className="rounded-full object-cover border-2 border-primary"
        />
      </motion.div>
    );
  };

  const renderMedia = () => {
    if (!post.media?.url) return null;

    return (
      <div
        className="relative aspect-video w-full cursor-pointer overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={post.media.url}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        {post.media.type === "video" && (
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  className="rounded-full bg-white/20 p-4 backdrop-blur-sm"
                >
                  <IconPlayerPlay className="w-8 h-8 text-white" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  };

  const severityColor = {
    low: "bg-green-500/10 text-green-500",
    medium: "bg-yellow-500/10 text-yellow-500",
    high: "bg-red-500/10 text-red-500",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div 
        onClick={handlePostClick}
        className="relative flex flex-col gap-4 p-4 rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border hover:border-accent cursor-pointer"
      >
        <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden transition-all duration-200 hover:shadow-xl">
          {/* Header */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {renderUserAvatar()}
                <div>
                  <h3 className="font-semibold">{post.user.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <IconMapPin className="w-3 h-3" />
                      <span>{post.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IconClock className="w-3 h-3" />
                      <span>{post.timeAgo}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("font-medium", severityColor[post.severity])}>
                  {post.severity.charAt(0).toUpperCase() + post.severity.slice(1)}
                </Badge>
                <Badge variant="secondary">{post.category}</Badge>
              </div>
            </div>
            
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
              <p className="text-muted-foreground text-sm">{post.description}</p>
            </div>
          </div>

          {/* Media */}
          {renderMedia()}

          {/* Actions */}
          <div className="p-4 flex items-center justify-between border-t border-border">
            <div className="flex items-center gap-4">
              <TooltipProvider>
                <div className="flex items-center gap-1.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); handleVote("up"); }}
                        className={cn(
                          userVote === "up" && "text-green-500 hover:text-green-500"
                        )}
                      >
                        <IconThumbUp className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Upvote</TooltipContent>
                  </Tooltip>
                  <span className="text-sm font-medium min-w-[2ch] text-center">{votes}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); handleVote("down"); }}
                        className={cn(userVote === "down" && "text-red-500 hover:text-red-500")}
                      >
                        <IconThumbDown className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Downvote</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
              {/* Comments Count */}
              <div className="flex items-center gap-1 p-2 rounded-md text-foreground hover:bg-gray-800/15">
                    <IconMessageCircle className="h-4 w-4" />
                    <span className="text-sm">{post.stats.comments}</span>
                  </div>
              </div>

            <div className="flex items-center gap-2">
              {post.media?.type === 'photo' && post.media.aiDescription && (
                <AIImageDescription 
                  imageUrl={post.media.url} 
                  description={post.media.aiDescription}
                />
              )}
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-9 w-9", isSaved && "text-primary")}
                onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
              >
                <IconBookmark className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={(e) => { e.stopPropagation(); }}
              >
                <IconShare3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
