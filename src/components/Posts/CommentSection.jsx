"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import Comment from "./Comment"
import { Button } from "@/components/ui/button"
import { IconMessageCircle } from "@tabler/icons-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import WriteComment from "./WriteComment"

// Recursive component for nested comments
const CommentThread = ({ comment, level = 0, maxLevel = 6 }) => {
  const [showReplies, setShowReplies] = useState(true)
  const [loadingReplies, setLoadingReplies] = useState(false)
  const [replies, setReplies] = useState(comment.replies || [])
  const [hasMoreReplies, setHasMoreReplies] = useState(comment.hasMoreReplies)
  const [page, setPage] = useState(1)

  const loadMoreReplies = async () => {
    try {
      setLoadingReplies(true)
      // TODO: Implement API call
      const response = await axios.get(`/api/comments/${comment.id}/replies`, {
        params: { page: page + 1 }
      })
      setReplies([...replies, ...response.data.replies])
      setHasMoreReplies(response.data.hasMore)
      setPage(page + 1)
    } catch (error) {
      console.error("Failed to load replies:", error)
    } finally {
      setLoadingReplies(false)
    }
  }

  return (
    <div className="comment-thread">
      <Comment comment={comment} />
      
      {replies.length > 0 && (
        <div className="flex items-center gap-2 mt-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? "Hide" : "Show"} {replies.length} replies
          </Button>
        </div>
      )}

      <AnimatePresence>
        {showReplies && replies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`ml-${Math.min(level + 1, maxLevel) * 8} pl-4 border-l mt-4`}
          >
            {replies.map((reply) => (
              <div key={reply.id} className="mb-4">
                <CommentThread
                  comment={reply}
                  level={level + 1}
                  maxLevel={maxLevel}
                />
              </div>
            ))}

            {hasMoreReplies && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-4 mb-4"
                onClick={loadMoreReplies}
                disabled={loadingReplies}
              >
                {loadingReplies ? "Loading..." : "Load more replies"}
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [totalComments, setTotalComments] = useState(0)
  const [isWriting, setIsWriting] = useState(false)

  // Fetch initial comments
  const fetchComments = async () => {
    try {
      setLoading(true)
      // TODO: Implement API call
      const response = await axios.get(`/api/posts/${postId}/comments`, {
        params: { page }
      })
      setComments(page === 1 ? response.data.comments : [...comments, ...response.data.comments])
      setHasMore(response.data.hasMore)
      setTotalComments(response.data.total)
    } catch (error) {
      console.error("Failed to fetch comments:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  const loadMoreComments = () => {
    setPage(page + 1)
    fetchComments()
  }

  const handleAddComment = async (commentData) => {
    try {
      // TODO: Implement API call with media upload
      const formData = new FormData()
      formData.append('content', commentData.content)
      formData.append('media', commentData.media.file)
      
      // Mock response for now
      const newComment = {
        id: Date.now().toString(),
        user: {
          name: "You",
          image: null,
        },
        content: commentData.content,
        media: {
          type: commentData.media.type,
          url: commentData.media.url,
        },
        timeAgo: "Just now",
        stats: {
          upvotes: 0,
          downvotes: 0,
          comments: 0,
        },
        isEditable: true,
      }

      setComments([newComment, ...comments])
      setTotalComments(totalComments + 1)
      setIsWriting(false)
    } catch (error) {
      console.error("Failed to add comment:", error)
    }
  }

  return (
    <div className="bg-background rounded-lg p-4">
      {/* Comments Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <IconMessageCircle className="h-5 w-5" />
          Comments ({totalComments})
        </h2>
        <Button
          variant="outline"
          onClick={() => setIsWriting(!isWriting)}
        >
          Write a comment
        </Button>
      </div>

      {/* Write Comment Section */}
      <AnimatePresence>
        {isWriting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <WriteComment
              onSubmit={handleAddComment}
              onCancel={() => setIsWriting(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments List */}
      <ScrollArea className="h-[600px] pr-4">
        {comments.map((comment) => (
          <div key={comment.id} className="mb-4">
            <CommentThread comment={comment} />
          </div>
        ))}

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              onClick={loadMoreComments}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load more comments"}
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && comments.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No comments yet. Be the first to comment!
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
