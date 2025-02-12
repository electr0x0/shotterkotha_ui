"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import Comment from "./Comment"
import { Button } from "@/components/ui/button"
import { IconMessageCircle, IconUser, IconSend } from "@tabler/icons-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import WriteComment from "./WriteComment"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import axiosInstance from "@/utils/axiosInstance"
import { Textarea } from "@/components/ui/textarea"

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

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(500, "Comment is too long")
})

export default function CommentSection({ postId, comments: initialComments }) {
  const [comments, setComments] = useState(initialComments || [])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [totalComments, setTotalComments] = useState(0)
  const [isWriting, setIsWriting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: ""
    }
  })

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

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      const response = await axiosInstance.post(`/reports/posts/${postId}/comment/`, {
        content: data.content
      })

      if (response.status === 201) {
        setComments(prev => [...prev, response.data])
        form.reset()
        toast.success("Comment posted successfully")
      }
    } catch (error) {
      toast.error("Failed to post comment. Please try again.")
      console.error("Comment error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Textarea
          placeholder="Write a comment..."
          {...form.register("content")}
          className="min-h-[100px] resize-none"
        />
        {form.formState.errors.content && (
          <p className="text-sm text-destructive">
            {form.formState.errors.content.message}
          </p>
        )}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <IconSend className="w-4 h-4" />
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>

      <div className="space-y-4 mt-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <IconUser className="w-4 h-4" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {comment.user.first_name} {comment.user.last_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm mt-1">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
