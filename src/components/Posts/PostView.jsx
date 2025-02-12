"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  IconThumbUp,
  IconThumbDown,
  IconShare3,
  IconDots,
  IconUser,
  IconFlag,
  IconMessageCircle,
  IconBookmark,
  IconArrowLeft,
  IconMapPin,
  IconClock,
} from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import CommentSection from "./CommentSection"
import AIImageDescription from "./AIImageDescription"
import axiosInstance from "@/utils/axiosInstance"
import { toast } from "sonner"

export default function PostView({ post }) {
  const [votes, setVotes] = useState(post.upvotes_count - post.downvotes_count)
  const [userVote, setUserVote] = useState(post.has_user_voted)
  const [isSaved, setIsSaved] = useState(false)
  const [isMediaOpen, setIsMediaOpen] = useState(false)

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

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href,
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const renderMedia = () => {
    if (!post.media?.[0]?.file) return null;

    return (
      <div className="mt-4">
        <Dialog open={isMediaOpen} onOpenChange={setIsMediaOpen}>
          <DialogTrigger asChild>
            <div className="cursor-pointer relative rounded-lg overflow-hidden">
              {post.media[0].media_type === 'image' ? (
                <img
                  src={post.media[0].file}
                  alt={post.title}
                  className="w-full rounded-lg"
                />
              ) : (
                <video
                  src={post.media[0].file}
                  className="w-full rounded-lg"
                  controls
                />
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogTitle className="sr-only">Media View</DialogTitle>
            {post.media[0].media_type === 'image' ? (
              <img
                src={post.media[0].file}
                alt={post.title}
                className="w-full rounded-lg"
              />
            ) : (
              <video
                src={post.media[0].file}
                controls
                className="w-full rounded-lg"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  const severityColor = {
    low: "bg-green-500/10 text-green-500",
    medium: "bg-yellow-500/10 text-yellow-500",
    high: "bg-red-500/10 text-red-500",
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Post Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                <IconArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-lg font-semibold">Post</h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <IconDots className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-destructive">
                  <IconFlag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <ScrollArea className="flex-1">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                <IconUser className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{post.user.first_name} {post.user.last_name}</span>
                  {post.user.verified_status === "verified" && (
                    <Badge variant="secondary" className="text-primary">✓ Verified</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <IconMapPin className="w-3 h-3" />
                    <span>{post.fullAddress}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconClock className="w-3 h-3" />
                    <span>{post.time_ago}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Post Details */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={cn("font-medium", severityColor[post.severity])}>
                  {post.severity.charAt(0).toUpperCase() + post.severity.slice(1)}
                </Badge>
                <Badge variant="secondary">{post.category}</Badge>
              </div>
              <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
              <p className="text-foreground/90 whitespace-pre-wrap">{post.description}</p>
            </div>

            {/* Media */}
            {renderMedia()}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-9 w-9", userVote === "up" && "text-primary")}
                    onClick={() => handleVote("up")}
                  >
                    <IconThumbUp className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[20px] text-center">
                    {votes}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-9 w-9", userVote === "down" && "text-destructive")}
                    onClick={() => handleVote("down")}
                  >
                    <IconThumbDown className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <IconMessageCircle className="h-4 w-4" />
                  <span className="text-sm">{post.comments_count}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {post.media?.[0]?.media_type === 'image' && post.media[0].ai_description && (
                  <AIImageDescription 
                    imageUrl={post.media[0].file}
                    description={post.media[0].ai_description}
                  />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-9 w-9", isSaved && "text-primary")}
                  onClick={() => setIsSaved(!isSaved)}
                >
                  <IconBookmark className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={handleShare}
                >
                  <IconShare3 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Comments Section */}
            <CommentSection postId={post.id} comments={post.comments} />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
} 