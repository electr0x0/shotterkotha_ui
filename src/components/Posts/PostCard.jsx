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
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";

export default function PostCard({ post, onVote }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [votes, setVotes] = useState(post.upvotes_count - post.downvotes_count);
  const [userVote, setUserVote] = useState(post.has_user_voted);
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

  const handleVote = async (type) => {
    try {
      const response = await axiosInstance.post(`/reports/posts/${post.id}/vote/`, {
        vote_type: type
      });

      if (response.status === 200) {
        if (userVote === type) {
          setUserVote(null);
          setVotes(votes => type === "up" ? votes - 1 : votes + 1);
        } else {
          // If changing vote from opposite type
          if (userVote) {
            setVotes(votes => type === "up" ? votes + 2 : votes - 2);
          } else {
            setVotes(votes => type === "up" ? votes + 1 : votes - 1);
          }
          setUserVote(type);
        }
      }
    } catch (error) {
      toast.error("Failed to register vote. Please try again.");
      console.error("Vote error:", error);
    }
  };

  const renderUserAvatar = () => {
    return (
      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
        <IconUser className="w-5 h-5" />
      </div>
    );
  };

  const renderMedia = () => {
    if (!post.media?.length) return null;

    // Get the first media item
    const firstMedia = post.media[0];
    
    return (
      <div
        className="relative aspect-video w-full cursor-pointer overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {firstMedia.media_type === "image" ? (
          <img
            src={firstMedia.file_url}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : firstMedia.media_type === "video" && (
          <>
            <video
              src={firstMedia.file_url}
              className="w-full h-full object-cover"
              preload="metadata"
            />
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
          </>
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
      <div className="relative bg-background rounded-lg border shadow-sm overflow-hidden">
        <div onClick={handlePostClick}>
          {/* User Info Section */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              {renderUserAvatar()}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{post.user.first_name} {post.user.last_name}</span>
                  {post.user.verified_status === "verified" && (
                    <Badge variant="secondary" className="text-primary">✓ Verified</Badge>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <IconMapPin className="w-3 h-3" />
                    <span className="line-clamp-1">{post.fullAddress}</span>
                  </div>
                  {(post.division || post.district) && (
                    <div className="flex items-center gap-2 text-xs">
                      {post.division && (
                        <Badge variant="outline" size="sm">
                          {post.division} Division
                        </Badge>
                      )}
                      {post.district && (
                        <Badge variant="outline" size="sm">
                          {post.district} District
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <IconClock className="w-3 h-3" />
                    <span>{post.time_ago}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
              <p className="text-muted-foreground text-sm line-clamp-3">{post.description}</p>
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
                        className={cn(userVote === "up" && "text-primary")}
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
                        className={cn(userVote === "down" && "text-destructive")}
                      >
                        <IconThumbDown className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Downvote</TooltipContent>
                  </Tooltip>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex items-center gap-2">
                      <IconMessageCircle className="w-4 h-4" />
                      <span className="text-sm">{post.comments_count}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Comments</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex items-center gap-2">
              {post.media?.length > 0 && 
                post.media[0].media_type === 'image' && 
                post.media[0].ai_description && (
                  <AIImageDescription 
                    imageUrl={post.media[0].file_url} 
                    description={post.media[0].ai_description}
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
