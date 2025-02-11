"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  IconThumbUp,
  IconThumbDown,
  IconMessageCircle,
  IconShare3,
  IconPlayerPlay,
  IconMapPin,
  IconClock
} from "@tabler/icons-react";
import Image from "next/image";

function PostCard({
  user = {
    name: "John Doe",
    avatar: "/avatars/default.png",
  },
  location = "Dhaka, Bangladesh",
  timeAgo = "2 hours ago",
  media = {
    type: "image", // or "video"
    url: "https://images.unsplash.com/photo-1476842634003-7dcca8f832de",
    thumbnail: "https://images.unsplash.com/photo-1476842634003-7dcca8f832de",
  },
  stats = {
    upvotes: 1234,
    downvotes: 56,
    comments: 89,
  },
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [votes, setVotes] = useState(stats.upvotes - stats.downvotes);
  const [userVote, setUserVote] = useState(null);

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

  return (
    <div className="max-w-xl w-full mx-auto">
      <div className="bg-card rounded-lg shadow-lg border border-border overflow-hidden">
        {/* User Info Header */}
        <div className="p-4 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-sm">{user.name}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
        </div>

        {/* Media Content */}
        <div
          className="relative aspect-video w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {media.type === "video" ? (
            <>
              <Image
                src={media.thumbnail}
                alt="Video thumbnail"
                fill
                className="object-cover"
              />
              {isHovered && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center animate-in zoom-in-50 duration-300">
                      <IconPlayerPlay className="w-8 h-8 text-primary-foreground ml-1" />
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Image
              src={media.url}
              alt="Post image"
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* Interaction Bar */}
        <div className="p-4 flex items-center justify-between border-t border-border">
          <div className="flex items-center gap-6">
            {/* Votes */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVote("up")}
                className={cn(
                  "p-1 rounded hover:bg-accent transition-colors",
                  userVote === "up" && "text-primary"
                )}
              >
                <IconThumbUp className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium">{votes}</span>
              <button
                onClick={() => handleVote("down")}
                className={cn(
                  "p-1 rounded hover:bg-accent transition-colors",
                  userVote === "down" && "text-destructive"
                )}
              >
                <IconThumbDown className="w-5 h-5" />
              </button>
            </div>

            {/* Comments */}
            <button className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
              <IconMessageCircle className="w-5 h-5" />
              <span>{stats.comments}</span>
            </button>
          </div>

          {/* Share */}
          <button className="p-1 rounded hover:bg-accent transition-colors">
            <IconShare3 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
