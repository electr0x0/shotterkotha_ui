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

function PostCard({
  user,
  location,
  timeAgo,
  title,
  description,
  media,
  stats,
  severity,
  category,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [votes, setVotes] = useState(stats.upvotes - stats.downvotes);
  const [userVote, setUserVote] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleVote = (type) => {
    if (userVote === type) {
      setUserVote(null);
      setVotes(stats.upvotes - stats.downvotes);
    } else {
      setUserVote(type);
      setVotes(
        type === "up"
          ? stats.upvotes - stats.downvotes + 1
          : stats.upvotes - stats.downvotes - 1
      );
    }
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
      <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden transition-all duration-200 hover:shadow-xl">
        {/* Header */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="relative w-10 h-10"
              >
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="rounded-full object-cover border-2 border-primary"
                />
                {user.badge && (
                  <div className="absolute -bottom-1 -right-1">
                    <Badge variant="secondary" className="h-5 text-xs">
                      {user.badge}
                    </Badge>
                  </div>
                )}
              </motion.div>
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <IconMapPin className="w-3 h-3" />
                    <span>{location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconClock className="w-3 h-3" />
                    <span>{timeAgo}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn("font-medium", severityColor[severity])}>
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </Badge>
              <Badge variant="secondary">{category}</Badge>
            </div>
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </div>

        {/* Media */}
        <div
          className="relative aspect-video w-full cursor-pointer overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={media.url}
            alt="Post media"
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          {media.type === "video" && (
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
                      onClick={() => handleVote("up")}
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
                      onClick={() => handleVote("down")}
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
                    <span className="text-sm">{stats.comments}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Comments</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSaved(!isSaved)}
                    className={cn(isSaved && "text-primary")}
                  >
                    <IconBookmark className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isSaved ? "Saved" : "Save"}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <IconShare3 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default PostCard;
