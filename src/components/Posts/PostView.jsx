"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  IconThumbUp,
  IconThumbDown,
  IconShare,
  IconDots,
  IconUser,
  IconFlag,
  IconMessageCircle,
  IconBookmark,
  IconArrowLeft,
  IconPhoto,
  IconVideo,
  IconCheck,
} from "@tabler/icons-react"
import { Lens } from "@/components/ui/lens"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import CommentSection from "./CommentSection"
import AIImageDescription from "./AIImageDescription"

export default function PostView({ post }) {
  const [votes, setVotes] = useState(post.stats.upvotes - post.stats.downvotes)
  const [userVote, setUserVote] = useState(null)
  const [isSaved, setIsSaved] = useState(false)
  const [isMediaOpen, setIsMediaOpen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const handleVote = (type) => {
    if (userVote === type) {
      setUserVote(null)
      setVotes(post.stats.upvotes - post.stats.downvotes)
    } else {
      setUserVote(type)
      setVotes(
        type === "up"
          ? post.stats.upvotes - post.stats.downvotes + 1
          : post.stats.upvotes - post.stats.downvotes - 1
      )
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.href,
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const renderMedia = () => {
    if (!post.media?.url) return null;

    return (
      <div className="mt-4">
        <Dialog open={isMediaOpen} onOpenChange={setIsMediaOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 w-full justify-start"
            >
              {post.media.type === 'photo' ? (
                <>
                  <IconPhoto className="h-4 w-4" />
                  View Photo
                </>
              ) : (
                <>
                  <IconVideo className="h-4 w-4" />
                  View Video
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            {post.media.type === 'photo' ? (
              <div className="relative">
                <Lens
                  zoomFactor={2}
                  lensSize={200}
                  hovering={isHovering}
                  setHovering={setIsHovering}
                >
                  <img
                    src={post.media.url}
                    alt="Post media"
                    className="w-full rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = null;
                      console.error("Failed to load image");
                    }}
                  />
                </Lens>
              </div>
            ) : post.media.type === 'video' && post.media.url ? (
              <video
                src={post.media.url}
                controls
                className="w-full rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = null;
                  console.error("Failed to load video");
                }}
              />
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    );
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
            {/* User Info with Verified Badge */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                <IconUser className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{post.user.name}</span>
                  {post.user.isVerified && (
                    <div className="rounded-full bg-primary/10 p-0.5">
                      <IconCheck className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{post.timeAgo}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>{post.location}</span>
                  {post.division && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span>{post.division}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Post Title & Content */}
            <div>
              <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
              <p className="text-foreground/90 whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Post Media */}
            {renderMedia()}

            {/* Post Stats & Actions */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-4">
                {/* Vote Buttons */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-9 w-9",
                      userVote === "up" && "text-green-500 hover:text-green-500"
                    )}
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
                    className={cn(
                      "h-9 w-9",
                      userVote === "down" && "text-red-500 hover:text-red-500"
                    )}
                    onClick={() => handleVote("down")}
                  >
                    <IconThumbDown className="h-4 w-4" />
                  </Button>
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
                  <IconShare className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Comments Section */}
            <CommentSection postId={post.id} />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
} 