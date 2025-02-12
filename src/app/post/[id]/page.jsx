"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import PostView from "@/components/Posts/PostView"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import axiosInstance from "@/utils/axiosInstance"

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPost()
  }, [params.id])

  const fetchPost = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axiosInstance.get(`/reports/posts/${params.id}/`)
      setPost(response.data)
    } catch (err) {
      console.error('Error fetching post:', err)
      if (err.response?.status === 404) {
        setError("Post not found")
      } else {
        setError("Failed to load post. Please try again later.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background p-4">
        <div className="space-y-4">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-[200px] w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
          <Skeleton className="h-[100px] w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Error Loading Post</h1>
          <p className="text-muted-foreground">{error}</p>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
            <Button onClick={fetchPost}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!post) return null

  return <PostView post={post} />
} 