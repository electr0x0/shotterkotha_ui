"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import PostView from "@/components/Posts/PostView"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { getMockPost } from "@/lib/mock/posts"

export default function PostPage() {
  const params = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      const foundPost = getMockPost(params.id)
      if (foundPost) {
        setPost(foundPost)
      } else {
        setError("Post not found")
      }
      setLoading(false)
    }, 1000) // 1 second delay to simulate network request

    return () => clearTimeout(timer)
  }, [params.id])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background p-4">
        <div className="space-y-4">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-[200px] w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 flex-1" />
          </div>
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
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  if (!post) return null

  return <PostView post={post} />
} 