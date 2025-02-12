"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  IconThumbUp,
  IconThumbDown,
  IconDots,
  IconMessageCircle,
  IconUser,
} from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export default function Comment({ 
  comment = {
    id: "1",
    user: {
      name: "John Doe",
      image: null,
    },
    content: "This is a comment",
    timeAgo: "2 hours ago",
    stats: {
      upvotes: 5,
      downvotes: 1,
    },
    isEditable: true,
    isDeleted: false,
    isEdited: false,
  }
}) {
  const [votes, setVotes] = useState(comment.stats.upvotes - comment.stats.downvotes)
  const [userVote, setUserVote] = useState(null)
  const [isReplying, setIsReplying] = useState(false)

  const handleVote = (type) => {
    if (userVote === type) {
      setUserVote(null)
      setVotes(comment.stats.upvotes - comment.stats.downvotes)
    } else {
      setUserVote(type)
      setVotes(
        type === "up"
          ? comment.stats.upvotes - comment.stats.downvotes + 1
          : comment.stats.upvotes - comment.stats.downvotes - 1
      )
    }
  }

  return (
    <div className="group relative flex gap-4 p-4 rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border">
      {/* User Avatar */}
      <div className="flex-shrink-0">
        {!comment.isDeleted && (
          comment.user.image ? (
            <img
              src={comment.user.image}
              alt={comment.user.name}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <IconUser className="w-4 h-4" />
            </div>
          )
        )}
      </div>

      {/* Comment Content */}
      <div className="flex-1 space-y-2">
        {/* Comment Header */}
        <div className="flex items-center gap-2">
          {comment.isDeleted ? (
            <span className="text-sm text-muted-foreground">[deleted]</span>
          ) : (
            <>
              <span className="font-medium">{comment.user.name}</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{comment.timeAgo}</span>
              {comment.isEdited && (
                <>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">edited</span>
                </>
              )}
            </>
          )}
        </div>

        {/* Comment Text */}
        <p className="text-sm text-foreground">
          {comment.isDeleted ? "[deleted]" : comment.content}
        </p>

        {/* Comment Actions - Only show if not deleted */}
        {!comment.isDeleted && (
          <div className="flex items-center gap-4">
            {/* Vote Buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 hover:bg-accent",
                  userVote === "up" && "text-primary"
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
                  "h-8 w-8 hover:bg-accent",
                  userVote === "down" && "text-destructive"
                )}
                onClick={() => handleVote("down")}
              >
                <IconThumbDown className="h-4 w-4" />
              </Button>
            </div>

            {/* Reply Button */}
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 h-8"
              onClick={() => setIsReplying(!isReplying)}
            >
              <IconMessageCircle className="h-4 w-4" />
              Reply
            </Button>

            {/* Options Menu */}
            {comment.isEditable && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-accent"
                  >
                    <IconDots className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}

        {/* Reply Input (Conditionally Rendered) */}
        {isReplying && !comment.isDeleted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <IconUser className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <textarea
                  className="w-full min-h-[100px] p-2 rounded-md bg-background border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Write your reply..."
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsReplying(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm">Reply</Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
